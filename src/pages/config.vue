<template>
    <q-page padding>
        <div class="flex flex-center row">
            <div class="col-6 flex-center">

            <q-input class="q-ma-xs" inverted v-model="hassUrl" stack-label="HASS URL" :clearable="true" placeholder="http://localhost:8123" type="url" />

            <q-input :disable="!hassUrl || hassUrl === ''" class="col-4 q-ma-xs" inverted v-model="configName" stack-label="Configuration Name" :clearable="true" placeholder="Default" type="url" />
            <q-select :disable="!hassUrl || hassUrl === ''" class="col-4 q-ma-xs" inverted :options="configNames" v-model="configName"  color="primary" float-label="Existing Configuration Names"/>

            <q-input  class="col-4 q-ma-xs" inverted v-model="buttonWidth" stack-label="Button Width" :clearable="true" placeholder="180" type="number" />
            <q-input class="col-4 q-ma-xs" inverted v-model="buttonHeight" stack-label="Button Height" :clearable="true" placeholder="180" type="number" />

            <q-select :disable="!hassUrl || hassUrl === ''" class="col-4 q-ma-xs" inverted :options="availabComponents" v-model="multipleSelect"  color="primary" float-label="Components to Display"  multiple/>

            <q-select :disable="!hassUrl || hassUrl === ''" class="col-4 q-ma-xs" inverted :options="availabEntities" v-model="tempSensor"  color="primary" float-label="Temperaure component"  />

            <q-select :disable="!hassUrl || hassUrl === ''" class="col-4 q-ma-xs" inverted :options="availabEntities" v-model="currentConditions"  color="primary" float-label="Current Conditions component"  />

            <!-- <div :disable="!hassUrl || hassUrl === ''" class="row col-8">
                <q-toggle class="col-1 q-ma-xs" v-model="saveToGist" color="primary" />
                <q-input class="col-10 q-ma-xs" inverted v-model="gistToken" stack-label="Personal access tokens" :clearable="true" placeholder="Gist personal access tokens" :disable="!saveToGist" />
                <q-input class="col-10 q-ma-xs" inverted v-model="gistUser" stack-label="Github Username" :clearable="true" placeholder="Github Username" :disable="!saveToGist" />
                <q-input class="col-10 q-ma-xs" inverted v-model="gistPassword" stack-label="Github Password" :clearable="true" placeholder="Github Password" type="password" :disable="!saveToGist" />
            </div> -->
            <q-carousel color="white" arrows quick-nav height="200px" class="col-xs-12 col-md-6 q-mt-md" v-model="backgroundImage" infinite :handle-arrow-keys="true" :style="cstyle" :goToSlide="backgroundImage">
                <q-carousel-slide img-src="statics/bg-1.jpg" />
                <q-carousel-slide img-src="statics/bg-2.jpg" />
                <q-carousel-slide img-src="statics/bg-3.jpg" />
                <q-carousel-slide img-src="statics/bg-4.jpg" />
                <q-carousel-slide img-src="statics/bg-5.jpg" />
                <q-carousel-slide img-src="statics/bg-6.jpg" />
                <q-carousel-slide img-src="statics/bg-7.jpg" />
                <q-carousel-slide img-src="statics/bg-8.jpg" />
                <q-carousel-slide img-src="statics/bg-9.jpg" />
                <q-carousel-slide img-src="statics/bg-10.jpg" />
                <q-carousel-slide img-src="statics/bg-11.jpg" />
                <q-carousel-slide img-src="statics/bg-12.jpg" />
                <q-carousel-slide img-src="statics/bg-13.jpg" />
                <q-carousel-slide img-src="statics/bg-14.jpg" />
            </q-carousel>

        <div class="row justify-center">
            <q-btn color=primary class='col-3 q-ma-md' label="Reset Screens" @click="resetScreens()" />
            <q-toggle v-model="configEnabled" color="teal-8" label="Edit Mode"/>
            <q-btn color=primary class='col-3 q-ma-md' label="Save" @click="goBack()" />
             </div>

        </div>
        </div>
    </q-page>
</template>

<script>
export default {
  name: 'Config',
  data () {
    return {
      cstyle: {
        'border-color': 'white',
        'border-width': '4px',
        'border-style': 'solid'
      },
      configNames: [],
      configName: '',
      multipleSelect: []

    }
  },
  mounted: async function () {
    console.log('mounted')
    this.configName = this.$config.configName
    console.log(this.$store.state.config.componentsToDisplay)
    this.multipleSelect = this.$store.state.config.componentsToDisplay ? this.$store.state.config.componentsToDisplay : []

    var ret = []
    var names = await this.$configNames()
    for (var index in names) {
      var name = names[index].replace(/\.json$/, '')
      ret.push({label: name, value: name})
    }
    this.configNames = await this.$labelSort(ret)
  },

  computed: {

    hassUrl: {
      get () {
        return this.$store.state.config.hassUrl
      },
      set (val) {
        this.$configCommit('config/hassUrl', val)
      }
    },
    configEnabled: {
      get () {
        return this.$store.state.config.configEnabled
      },
      set (val) {
        this.$configCommit('config/configEnabled', val)
      }
    },
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
    backgroundImage: {
      get () {
        console.log('backgroundImage', this.$store.state.config.backgroundImage)
        return this.$store.state.config.backgroundImage
      },
      set (val) {
        this.$configCommit('config/backgroundImage', val)
      }
    },

    tempSensor: {
      get () {
        console.log('tempSensor', this.$store.state.config.tempSensor)

        return this.$store.state.config.tempSensor
      },
      set (val) {
        this.$configCommit('config/tempSensor', val)
      }
    },
    currentConditions: {
      get () {
        console.log('currentConditions', this.$store.state.config.currentConditions)
        return this.$store.state.config.currentConditions
      },
      set (val) {
        this.$configCommit('config/currentConditions', val)
      }
    },

    // saveToGist: {
    //   get () {
    //     return this.$authConfig.saveToGist
    //   },
    //   set (val) {
    //     this.$authConfig.commit('auth/saveToGist', val)
    //   }
    // },
    // gistToken: {
    //   get () {
    //     return this.$authConfig.gistToken
    //   },
    //   set (val) {
    //     this.$authConfig.commit('auth/gistToken', val)
    //   }
    // },
    // gistUser: {
    //   get () {
    //     return this.$authConfig.gistUser
    //   },
    //   set (val) {
    //     this.$authConfig.commit('auth/gistUser', val)
    //   }
    // },
    // gistPassword: {
    //   get () {
    //     return this.$authConfig.gistPassword
    //   },
    //   set (val) {
    //     this.$authConfig.commit('auth/gistPassword', val)
    //   }
    // },
    availabComponents: {
      get () {
        var ret = []
        for (var index in this.$store.state.haws.entities) {
          ret.push({label: index, value: index})
        }

        return this.$labelSort(ret)
      },
      set (val) {

      }
    },
    availabEntities: {
      get () {
        var ret = []
        for (var index in this.$store.state.haws.entities) {
          for (var ent in this.$store.state.haws.entities[index]) {
            ret.push({label: this.$store.state.haws.entities[index][ent].entity_id, value: this.$store.state.haws.entities[index][ent].entity_id})
          }
        }

        return this.$labelSort(ret)
      },
      set (val) {

      }
    }

  },

  watch: {
    configName: async function (result, oldResult) {
      this.$configCommit('config/configName', result)
      await this.$configLoad()
    },
    multipleSelect: async function (result, oldResult) {
      console.log('multipleSelect', result)
      this.$configCommit('config/componentsToDisplay', result)
    },
    gistToken: async function (result, oldResult) {
      await this.checkAuth()
    }

  },
  methods: {
    resetScreens () {
      this.$store.commit('config/screens', [{
        screenId: 'deb10b55-13f4-44ca-ab6d-ff2667456eb3',
        screenName: 'Screen 1',
        hagroups: [{
          id: '9ceb827f-2cf6-8c05-fc4a-10b88ba6c8bc',
          name: 'Empty',
          children: []
        }]
      }])
    },
    checkAuth: async function () {
      if ((!this.gistUser || !this.gistPassword) && !this.gistToken) {
        return
      }
      await this.updateConfigNames()
    },

    goBack: async function () {
    //   this.$q.loading.show({
    //     delay: 400 // ms
    //   })
      console.log('goBack save')
      this.$configCommit('config/configName', this.configName)
      await this.$configSave()

      // this.$q.loading.hide()
      this.$router.go(-1)
    }
  }
}
</script>

<style>
.box {
        width: 500px;
        display: flex;
        flex-wrap: wrap;
      }
      .box>* {
          flex: 0 0 33.3333%;
      }
</style>
