<template>
    <q-card class="shadow-10 text-center" inline @click.native="clicked"  :disabled="IsDisabled" :style="bgs">
        <q-card-media>
            <q-icon class="big-icon" :name="icon" />
        </q-card-media>
        <q-card-title>
            <div class="q-headline"> {{entity.attributes.friendly_name}}</div>
        </q-card-title>
        <q-card-main class="q-headline">
            {{state}}
        </q-card-main>
    </q-card>
</template>

<script>
import { debounce } from 'quasar'
export default {
  // name: 'ComponentName',
  props: {
    entityId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      bgs: {},
      debouncedClick: null,
      clickVisible: false,
      IsDisabled: false,
      state: '',
      icon: ''
    }
  },
  watch: {
    entity (result, oldResult) {
      this.doUpdate()
    }
  },
  computed: {
    buttonWidth: {
      get () {
        return this.$store.state.config.buttonWidth
      },
      set (val) {
        this.$configCommit('config/buttonWidth', val)
      }
    },
    buttonHeight: {
      get () {
        return this.$store.state.config.buttonHeight
      },
      set (val) {
        this.$configCommit('config/buttonHeight', val)
      }
    },
    entity: {
      get () {
        return this.$store.state.haws.climates.filter(ent => ent.entity_id === this.entityId)[0]
      },
      set (val) {

      }
    }
  },
  mounted () {
    this.bgs = {
      'height': this.buttonHeight + 'px',
      'width': this.buttonWidth + 'px'
    }

    this.doUpdate()
  },
  methods: {
    doUpdate () {
      this.state = this.$getStateInfo(this.entity)
      this.clickVisible = false
      this.IsDisabled = false
      switch (this.entity.state) {
        case 'off':
          this.bgs = {
            'backgroundColor': 'gray',
            'border-width': '2px',
            'border-style': 'solid',
            'border-color': 'black',
            'height': this.buttonHeight + 'px',
            'width': this.buttonWidth + 'px'
          }
          break
        case 'on':
          this.bgs = {
            'height': this.buttonHeight + 'px',
            'width': this.buttonWidth + 'px'
          }
          this.bgs.backgroundColor = 'white'

          break
      }
    },
    clicked: async function (e) {
      let message = ''

      message = {
        'type': 'call_service',
        'domain': 'vacuum',
        'service': this.entity.state === 'off' ? 'turn_on' : 'turn_off',
        'service_data': {
          'entity_id': this.entity.entity_id
        }
      }

      this.debouncedClick = debounce(async function () {
        this.clickVisible = true
        await this.$hawsSend(message)
      }, 1000)
      await this.debouncedClick()
    }
  }
}
</script>

<style>
</style>
