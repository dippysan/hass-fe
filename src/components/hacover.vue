<template>

    <q-card class="shadow-10 text-center justify-center" @click.native="clicked" :disabled="IsDisabled" :style="bgs">
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
  name: 'HACover',
  props: {
    entityId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      bgs: '',
      debouncedClick: null,
      IsDisabled: false,
      state: '',
      icon: ''
    }
  },
  created () {

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
        return this.$store.state.haws.covers.filter(ent => ent.entity_id === this.entityId)[0]
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
  mounted () {
    this.bgs = {
      'height': this.buttonHeight + 'px',
      'width': this.buttonWidth + 'px'
    }
    this.bgs.backgroundColor = 'white'
    this.doUpdate()
  },
  watch: {
    entity (result, oldResult) {
      this.doUpdate()
    }
  },
  methods: {

    clicked: async function () {
      this.IsDisabled = true
      let message = ''

      message = {
        'type': 'call_service',
        'domain': 'cover',
        'service': this.entity.state === 'closed' ? 'open_cover' : 'close_cover',
        'service_data': {
          'entity_id': this.entity.entity_id
        }
      }
      this.icon = 'mdi-garage-alert'
      this.debouncedClick = debounce(async function () {
        await this.$hawsSend(message)
      }, 1000)
      await this.debouncedClick()
    },
    doUpdate () {
      this.state = this.$getStateInfo(this.entity)

      this.IsDisabled = false
      switch (this.entity.state) {
        case 'open':
        //   this.bgs = {
        //     'backgroundColor': 'gray',
        //     'border-width': '2px',
        //     'border-style': 'solid',
        //     'border-color': 'black',
        //     'height': this.buttonHeight + 'px',
        //     'width': this.buttonWidth + 'px'
        //   }
          this.icon = 'mdi-garage-open'
          break
        case 'closed':
        //   this.bgs = {
        //     'height': this.buttonHeight + 'px',
        //     'width': this.buttonWidth + 'px'
        //   }
        //   this.bgs.backgroundColor = 'white'
          this.icon = 'mdi-garage'
          break
      }
    }
  }
}
</script>

<style>
</style>
