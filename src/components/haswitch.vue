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

export default {
  name: 'HASwitch',
  props: {
    entityId: {
      type: String,
      default: ''
    },
    isGroup: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      bgs: '',
      state: '',
      icon: 'mdi-lightbulb-on-outline',
      IsDisabled: false
    }
  },
  mounted () {
    this.doUpdate()
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
        if (this.isGroup) {
          return this.$store.state.haws.groups.filter(ent => ent.entity_id === this.entityId)[0]
        }
        return this.$store.state.haws.switches.filter(ent => ent.entity_id === this.entityId)[0]
      },
      set (val) {

      }
    }
  },
  methods: {
    doUpdate () {
      this.state = this.$getStateInfo(this.entity)
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
          if (this.entityId.endsWith('lock')) {
            this.icon = 'mdi-lock-open'
          } else {
            this.icon = 'mdi-lightbulb-outline'
          }

          break
        case 'on':
          this.bgs = {
            'height': this.buttonHeight + 'px',
            'width': this.buttonWidth + 'px'
          }
          this.bgs.backgroundColor = 'white'

          if (this.entityId.endsWith('lock')) {
            this.icon = 'mdi-lock'
          } else {
            this.icon = 'mdi-lightbulb-on-outline'
          }
          break
      }
    },

    clicked: async function (e) {
      let message = ''

      message = {
        'type': 'call_service',
        'domain': this.isGroup ? 'homeassistant' : 'switch',
        'service': this.entity.state === 'off' ? 'turn_on' : 'turn_off',
        'service_data': {
          'entity_id': this.entity.entity_id
        }
      }

      await this.$hawsSend(message)
    }

  }
}

</script>

<style>
.big-icon {
 font-size: 3rem;
}
</style>
