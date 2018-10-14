<template>
    <div  @click.native="opened=!opened">
        <q-card inline :style="bgs" class="shadow-10" :disabled="IsDisabled" @click.native="opened=!opened">
            <q-card-media>
                <img :src="image">
                <q-card-title slot="overlay">
                    {{entity.attributes.friendly_name}}
                </q-card-title>
            </q-card-media>

        </q-card>
        <q-modal v-model="opened" maximized @click="opened = false" class="q-ma-lg absolute-center justify-center" style="width: 90%; height: 90%">
            <q-card inline class="shadow-10 absolute-center" style="width: 100%; height: 100%" @click.native="opened=false">
                <q-card-media style="width: 100%; height: 100%">
                    <q-video v-if="opened && entity.attributes.video_url && entity.attributes.video_url !== ''" :src="entity.attributes.video_url" style="width: 100%; height: 100%" />
                    <img v-else :src="image" style='width:100%'>
                    <q-card-title slot="overlay">
                        <q-btn label="Close" dark @click="opened = false" />
                    </q-card-title>
                </q-card-media>
            </q-card>

        </q-modal>
    </div>
</template>

<script>
export default {
  name: 'HACamera',
  props: {
    entityId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      bgs: {},
      image: null,
      IsDisabled: false,
      opened: false
    }
  },
  watch: {
    entity (result, oldResult) {

    }
  },
  created () {

  },
  mounted () {
    // console.log(this.entity.attributes)
    this.bgs = {
      'width': this.buttonWidth * 2 + 'px'
    }
    this.getImage().then(function (e) { }).catch(function (error) {
      console.log(error)
    })
  },
  beforeDestroy () {
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
        return this.$store.state.haws.cameras.filter(ent => ent.entity_id === this.entityId)[0]
      },
      set (val) {

      }
    }
  },
  methods: {
    getImage: async function () {
      var imageData = await this.$hawsGetCameraThumbnail(this.entity.entity_id)
      this.image = 'data:' + imageData.content_type + ';base64,' + imageData.content
      var vm = this
      setTimeout(() => { vm.getImage() }, 5000)
    },
    sleep (ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    }
  }
}
</script>

<style>
</style>
