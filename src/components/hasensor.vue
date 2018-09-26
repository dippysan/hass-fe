<template>
    <q-card class="shadow-10 text-center" inline @click.native="clicked"  :disabled="IsDisabled" :style="bgs">
        <q-card-media>
            <q-icon class="big-icon" :name="icon" />
        </q-card-media>
        <q-card-title>
            <div class="q-headline"> {{entity.attributes.friendly_name}}</div>
        </q-card-title>
           <q-card-separator/>
        <div class="q-headline">
            {{state}}
        </div>
    </q-card>
</template>

<script>

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
        return this.$store.state.haws.sensors.filter(ent => ent.entity_id === this.entityId)[0]
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
      this.bgs = {
        'height': this.buttonHeight + 'px',
        'width': this.buttonWidth + 'px'
      }
      this.bgs.backgroundColor = 'white'
    },
    clicked: async function (e) {
    }
  }
}
</script>

<style>
</style>
