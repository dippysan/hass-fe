<template>
    <div class="row justify-center">

        <div class="custom-caption q-headline col-10">
            <div style="background: rgba(64,64,64,.6);" class="q-display-2">
                <q-icon name="home" v-if="isHome"/> {{hagroup.name}}
            </div>
            <q-popup-edit v-model="hagroup.name" title="Update Title" buttons v-if="configEnabled">
                <q-field count>
                    <q-input v-model="hagroup.name" />
                </q-field>
            </q-popup-edit>
        </div>
        <div class="row col-10 wrap content-start">
            <div v-for="entity_id in hagroup.children" :key="entity_id" v-touch-hold="obj => {handlerEntity(obj,entity_id)}" v-if="getEntity(entity_id) !== undefined">
                <switch-view v-if="getType(entity_id) === 'switch'" class="col-3 q-ma-sm" :entityId="entity_id" />
                <light-view v-if="getType(entity_id) === 'light'" class="col-3 q-ma-sm" :entityId="entity_id" />
                <switch-view v-if="getType(entity_id) === 'group'" class="col-3 q-ma-sm" :entityId="entity_id" :isGroup="true" />
                <climate-view v-if="getType(entity_id) === 'climate'" class="col-3 q-ma-sm" :entityId="entity_id" />
                <cover-view v-if="getType(entity_id) === 'cover'" class="col-3 q-ma-sm" :entityId="entity_id" />
                <camera-view v-if="getType(entity_id) === 'camera'" class="col-3 q-ma-sm" :entityId="entity_id" />
                <vacuum-view v-if="getType(entity_id) === 'vacuum'" class="col-3 q-ma-sm" :entityId="entity_id" />
            </div>
        </div>
        <q-btn icon="add" :style="bgs" @click="clicked" color="secondary" style="font-size: 25px" v-if="configEnabled" />
        <q-modal v-model="opened" :content-css="{minWidth: '40vw', minHeight: '20vh'}" @hide="modalClosed" v-close-overlay>
            <q-search ref="searchinput" class="q-ma-lg" v-model="filtered" :autofocus="true" placeholder="Start typing an entity name" :clearable="true" @focus="$event.target.select()" lower-case>
                <q-autocomplete separator @search="search" />
            </q-search>

            <q-btn color="primary" @click="opened = false" label="Close" />

        </q-modal>
    </div>
</template>

<script>
import light from 'components/halight.vue'
import haswitch from 'components/haswitch.vue'
import haclimate from 'components/haclimate.vue'
import hacover from 'components/hacover.vue'
import hacamera from 'components/hacamera.vue'
import havacuum from 'components/havacuum.vue'

export default {
  name: 'Group',
  props: {
    hagroup: {
      type: Object,
      default: null
    },
    isHome: {
      type: Boolean,
      default: false
    }
  },
  components: {
    'light-view': light,
    'switch-view': haswitch,
    'climate-view': haclimate,
    'cover-view': hacover,
    'camera-view': hacamera,
    'vacuum-view': havacuum
  },
  data () {
    return {
      bgs: '',
      existing: false,
      opened: false,
      filtered: '',
      validEntities: []
    }
  },
  computed: {
    buttonWidth: {
      get () {
        return this.$store.state.config.buttonWidth
      },
      set (val) {
        this.$store.commit('config/buttonWidth', val)
      }
    },
    buttonHeight: {
      get () {
        return this.$store.state.config.buttonHeight
      },
      set (val) {
        this.$store.commit('config/buttonHeight', val)
      }
    },
    configEnabled: {
      get () {
        return this.$store.state.config.configEnabled
      },
      set (val) {
        this.$store.commit('config/configEnabled', val)
      }
    },
    entities: {
      get () {
        return this.$store.state.haws.entities
      },
      set (val) {

      }
    }

  },
  //   watch: {
  //     hagroup: async function (result, oldResult) {
  //       await this.saveGroup()
  //     }

  //   },
  //   beforeDestroy: async function () {
  //     console.log('b4 destroy')
  //     await this.saveGroup()
  //   },
  mounted () {
    this.bgs = {
      'height': this.buttonHeight + 'px',
      'width': this.buttonWidth + 'px'
    }
  },
  methods: {
    // handler (obj) {
    //   console.log('Debug ' + !this.$store.state.config.configEnabled)
    //   this.$store.commit('config/configEnabled', !this.$store.state.config.configEnabled)
    // },
    handlerEntity (obj, entityId) {
      if (this.$store.state.config.configEnabled) {
      //  console.log(entityId)
        this.$q.dialog({
          title: 'Confirm',
          message: 'Delete ' + entityId,
          ok: 'Yes',
          cancel: 'No'
        }).then(async () => {
          this.$q.notify('Removed ' + entityId)

          var objIndex = this.hagroup.children.findIndex(a => a === entityId)
          this.hagroup.children.splice(objIndex, 1)
          console.log('handler')
          await this.saveGroup()
        }).catch(() => {

        })
      }
    },
    clicked () {
      this.opened = !this.opened
      this.$refs.searchinput.focus()
    },
    getType (entityid) {
      let type = entityid.substring(0, entityid.indexOf('.'))
      return type
    },
    getEntity (entityid) {
      let type = entityid.substring(0, entityid.indexOf('.'))
      try {
        var obj = this.$store.state.haws.entities[type].filter(ent => ent.entity_id === entityid)[0]
        return obj
      } catch (exception) {

      }
    },
    modalClosed: async function () {
      if (this.filtered && this.filtered === '') {
        this.filtered = ''
        return
      }
      if (!this.validEntities.includes(this.filtered)) {
        this.filtered = ''
        return
      }

      if (!this.hagroup.children[this.filtered]) {
        this.hagroup.children.push(this.filtered)
        console.log('modal closed')
        await this.saveGroup()
      }
      this.filtered = ''
    },

    search (filtered, done) {
      var ret = []
      this.validEntities = []
      for (var index in this.$store.state.config.componentsToDisplay) {
        var found = this.$store.state.haws.entities[this.$store.state.config.componentsToDisplay[index]].filter(function (entity) {
          return entity.entity_id.toLowerCase().includes(filtered)
        }

        )
        for (var f in found) {
          if (!this.hagroup.children.includes(found[f].entity_id)) {
            this.validEntities.push(found[f].entity_id)
            ret.push({value: found[f].entity_id, label: found[f].entity_id + ' | ' + found[f].attributes.friendly_name})
          }
        }
      }

      done(this.$labelSort(ret))
    },
    saveGroup: async function () {
      console.log('screens saving')

      await this.$configSave()
    }

  }
}

</script>

<style>
.custom-caption {
	color: white;
	text-align: center;
	mix-blend-mode: difference;
}
</style>
