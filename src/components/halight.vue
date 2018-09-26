<template>
    <div>
        <q-card class="shadow-10 text-center" inline @click.native="clicked" :disabled="IsDisabled" :style="bgs" v-touch-hold="handler">
            <q-card-media>
                <q-icon class="big-icon" :name="icon" />
            </q-card-media>
            <q-card-title>
                <div class="q-headline"> {{entity.attributes.friendly_name}}</div>
            </q-card-title>
            <q-card-main class="q-headline">
                {{state}}
            </q-card-main>
            <q-modal v-model="opened" @hide="hide" class="absolute-center justify-center shadow-20" style="width: 80%; height: 80%" v-close-overlay>
                <div class="row inline  justify-center" style="width: 100%; height: 80%">
                    <sketch-picker :value="color" class="q-ma-xs shadow-20 " style="width: 90%;" @input="updateColor" />
                    <q-slider class="col-8" v-model="brightness" label-always snap :min="1" :max="100" :label-value="`Brightness ${brightness}%`" />
                    <q-btn label="Ok" class="col-8 text-primary" @click="opened = false" />
                </div>

            </q-modal>
        </q-card>
    </div>
</template>

<script>
import { debounce } from 'quasar'

export default {
  name: 'HALight',
  props: {
    entityId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      bgs: '',
      brightness: 100,
      color: {'hex': '#2B52FF', 'rgba': {'r': 43, 'b': 255, 'g': 82, 'a': 1}},
      oldColor: '#2B52FF',
      showing: false,
      colorStyle: '',
      opened: false,
      attributes: '',
      changed: false,
      debouncedClick: null,
      clickVisible: false,
      IsDisabled: false,
      oldBrightness: 0,
      state: '',
      icon: 'mdi-lightbulb-on-outline',
      debounceBrightness: null,
      debounceColor: null
    }
  },
  created () {
    this.oldBrightness = this.getBright()
    this.brightness = this.oldBrightness
  },
  mounted () {
    this.doUpdate()
    this.colorStyle = {
      'height': this.buttonHeight + 'px',
      'width': this.buttonWidth + 'px'
    }

    this.oldColor = this.color

    this.debounceBrightness = debounce(async function (newVal) {
      if (this.oldBrightness === this.brightness) {
        return
      }
      this.oldBrightness = this.brightness
      this.changeBrigtness()
    }, 500)

    this.debounceColor = debounce(async function (newVal) {
      if (this.color.hex === this.oldColor) {
        return
      }
      this.changeColor()
    }, 500)
  },
  watch: {
    entity (result, oldResult) {
      this.updateEntity()
    },
    brightness (result, oldResult) {
      this.debounceBrightness()
    },
    color (result, oldResult) {
      if (this.entity.state === 'on') {
        this.debounceColor()
      } else {
        this.setOff()
      }
    }
  },
  computed: {

    buttonWidth: {
      get () {
        return this.$store.state.config.buttonWidth
      },
      set (val) {

      }
    },
    buttonHeight: {
      get () {
        return this.$store.state.config.buttonHeight
      },
      set (val) {

      }
    },
    entity: {
      get () {
        return this.$store.state.haws.lights.filter(ent => ent.entity_id === this.entityId)[0]
      },
      set (val) {

      }
    },
    configEnabled: {
      get () {
        return this.$store.state.config.configEnabled
      },
      set (val) {

      }
    }
  },
  beforeDestroy () {

  },
  methods: {
    hide () {
      this.$configCommit('haws/dialogOpen', false)
    },
    handler (obj) {
      this.$configCommit('haws/dialogOpen', true)
      this.opened = !this.configEnabled
    },
    getBright () {
      return Math.round(100 * (this.entity.attributes.brightness / 256))
    },
    updateColor (val) {
      this.color = val
    },
    doUpdate () {
      this.state = this.$getStateInfo(this.entity)
      switch (this.entity.state) {
        case 'off':
          this.setOff()
          this.icon = 'mdi-lightbulb-outline'
          break
        case 'on':
          this.bgs = {
            'height': this.buttonHeight + 'px',
            'width': this.buttonWidth + 'px'
          }

          if (this.entity.attributes.rgb_color) {
            this.bgs.backgroundColor = this.$rgbToHex(this.entity.attributes.rgb_color)
          } else {
            this.bgs.backgroundColor = 'white'
          }
          this.icon = 'mdi-lightbulb-on-outline'

          break
      }
    },

    updateEntity () {
      if (this.entity.attributes.rgb_color) {
        this.oldColor = this.$rgbToHex(this.entity.attributes.rgb_color)

        if (this.color.hex) {
          this.color = {'hex': this.oldColor, 'rgba': {'r': this.entity.attributes.rgb_color[0], 'g': this.entity.attributes.rgb_color[1], 'g': this.entity.attributes.rgb_color[2], 'a': 1}}
        } else {
          this.color = this.oldColor
        }
      }

      if (this.entity.attributes.brightness) {
        var newBright = this.getBright()
        if (newBright !== this.brightness) {
          this.oldBrightness = newBright
          this.brightness = newBright
        }
      }
      this.doUpdate()
    },

    changeBrigtness: async function () {
      let message = {
        'type': 'call_service',
        'domain': 'light',
        'service': 'turn_on',
        'service_data': {
          'entity_id': this.entity.entity_id,
          'brightness_pct': this.brightness
        }
      }

      await this.$hawsSend(message)
    },
    changeColor: async function () {
      let message = {
        'type': 'call_service',
        'domain': 'light',
        'service': 'turn_on',
        'service_data': {
          'entity_id': this.entity.entity_id,
          'rgb_color': [this.color.rgba['r'], this.color.rgba['g'], this.color.rgba['b']],
          'brightness_pct': this.brightness
        }
      }

      if (this.color.hex === this.oldColor) {
        message.service_data.rgb_color = undefined
      }
      if (isNaN(message.service_data.brightness_pct)) {
        message.service_data.brightness_pct = undefined
      }

      this.oldColor = this.color.hex

      await this.$hawsSend(message)
    },
    clicked: async function () {
      let message = ''

      if (this.entity.state === 'off') {
        await this.changeColor()
        return
      } else {
        message = {
          'type': 'call_service',
          'domain': 'light',
          'service': 'turn_off',
          'service_data': {
            'entity_id': this.entity.entity_id
          }
        }
      }

      await this.$hawsSend(message)
    },
    colorChanged: async function () {
      this.changeColor()
    },

    setOff () {
      this.bgs = {
        'backgroundColor': 'gray',
        'border-color': this.color.hex,
        'border-width': '2px',
        'border-style': 'solid',
        'height': this.buttonHeight + 'px',
        'width': this.buttonWidth + 'px'
      }
    }

  }
}

</script>

<style>
</style>
