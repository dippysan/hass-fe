<template>
    <q-layout view="lHh Lpr lFf">
        <div :style="bgs">
            <q-layout-header>
                <div class="text-white full-text" :style="headerBGS" v-touch-hold="handler">
                    <div>{{ date }}</div>
                    <div>{{ time }}</div>
                    <div class="absolute-center" @click="weather">
                        <skycon class="weatherImage" :condition="weatherImage" />
                    </div>
                    <div class="absolute-center" @click="weather" v-if="configEnabled">
                        <div>{{configName}}</div>
                    </div>
                    <div class="absolute-right text-right" @click="weather">
                        <q-icon :name="currentConditionsStateIcon" /> {{ tempSensorState }}°F
                        <div>{{ currentConditionsState }}</div>
                    </div>
                </div>
            </q-layout-header>
            <q-layout-drawer class="items-center justify-center center" content-class="bg-grey-3" :content-style="{padding: '20px'}" v-model="leftDrawerOpen" side="left" :overlay="true">
                <div class="bg-primary text-white flex row items-center justify-around">
                    <div class='col-6'>Button Width</div>
                    <div class='col-6'>
                        <vue-numeric-input class="q-ma-xs" v-model="buttonWidth" inline center :min="40" :max="200" :step="10" style="width:100px" />
                    </div>
                    <div class='col-6'>Button Height</div>
                    <div class='col-6'>
                        <vue-numeric-input class="q-ma-xs" v-model="buttonHeight" inline center :min="40" :max="200" :step="10" style="width:100px" />
                    </div>
                    <div class='col-6'>Return To Home Screen Delay</div>
                    <div class='col-6'>
                        <vue-numeric-input class="q-ma-xs" v-model="homeScreenDelay" inline center :min="5" :max="120" :step="1" style="width:100px" />
                    </div>
                    <div class='col-6'>Rotate Background Delay</div>
                    <div class='col-6'>
                        <vue-numeric-input class="q-ma-xs" v-model="rotateBackgroundDelay" inline center :min="10" :max="1200" :step="10" style="width:100px" />
                    </div>
                    <div class='col-6'>Rotate Background</div>
                    <div class='col-6'>
                        <q-toggle class="cursor-pointer col-12 q-ma-xs" color='secondary' v-model="rotateBackground" left-label />
                    </div>
                </div>

                <q-select class="col-4 q-ma-xs" inverted :options="availabEntities" v-model="tempSensor" color="primary" float-label="Temperaure component" />
                <q-select class="col-4 q-ma-xs" inverted :options="availabEntities" v-model="currentConditions" color="primary" float-label="Current Conditions component" />
                <q-select class="col-4 q-ma-xs" inverted :options="availabComponents" v-model="multipleSelect" color="primary" float-label="Components to Display" multiple/>

                <q-carousel ref="carouselDrawer" color="white" height="200px" class="col-xs-12 col-md-6 q-mt-md" v-model="backgroundImageNum" infinite :handle-arrow-keys="true">
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
                    <q-carousel-slide img-src="statics/bg-15.jpg" />
                    <q-carousel-slide img-src="statics/bg-16.jpg" />
                    <q-carousel-slide img-src="statics/bg-17.jpg" />
                    <q-carousel-slide img-src="statics/bg-18.jpg" />
                    <q-carousel-control slot="control-nav" slot-scope="carousel" position="top-right" :offset="[10, 10]">
                        <q-btn @click="addToRotate(carousel.slide)"  color="amber" text-color="black" icon="star" round dense class="q-mr-small" v-if="!rotateBackGroundImages.includes(carousel.slide)">
                             <q-tooltip anchor="center left" self="center right" :offset="[20, 0]">Add to Rotation</q-tooltip>
                             </q-btn>
                        <q-btn @click="removeFromRotate(carousel.slide)"  color="amber" text-color="black" icon="check" round dense class="q-mr-small" v-else>
                            <q-tooltip anchor="center left" self="center right" :offset="[20, 0]">Remove From Rotation</q-tooltip>
                             </q-btn>
                        <q-btn @click="carousel.previous" :disable="!carousel.canGoToPrevious" color="amber" text-color="black" icon="keyboard_arrow_left" round dense class="q-mr-small" />
                        <q-btn @click="carousel.next" :disable="!carousel.canGoToNext" color="amber" text-color="black" icon="keyboard_arrow_right" round dense />
                    </q-carousel-control>
                </q-carousel>

                <q-input class="col-4 q-ma-xs" inverted v-model="configName" stack-label="Configuration Name" :clearable="true" placeholder="Default" type="url" />
                <q-select class="col-4 q-ma-xs" inverted :options="configNames" v-model="configName" color="primary" float-label="Existing Configuration Names" />

                <q-toggle class="cursor-pointer col-12 q-ma-xs" v-model="configEnabled" label="Edit Mode" left-label />
                <div>
                    <q-btn label="Save" v-if="configName === oldconfigName || configNames.filter(a => a.label === configName).length > 0" @click="drawerClose" color="secondary" class="col-12 q-ma-xs" />
                    <q-btn label="Load" v-if="configName !== oldconfigName || configNames.filter(a => a.label === configName).length > 0" @click="drawerClose" color="primary" class="col-12 q-ma-xs" />
                </div>
            </q-layout-drawer>
            <q-page-container>

                <router-view />

            </q-page-container>
        </div>
        <q-fab class="fixed" v-if="configEnabled && path === '/'" style="right: 18px; bottom: 18px" color="primary" icon="add_circle_outline" direction="up">
            <q-tooltip slot="tooltip" anchor="center left" self="center right" :offset="[20, 0]">
                Utility Bar
            </q-tooltip>

            <q-fab-action color="purple" @click="addScreen" icon="add_to_home_screen">
                <q-tooltip anchor="center left" self="center right" :offset="[20, 0]">Add Screen</q-tooltip>
            </q-fab-action>
            <q-fab-action color="secondary" @click="deleteScreen" icon="delete">
                <q-tooltip anchor="center left" self="center right" :offset="[20, 0]">Delete Screen</q-tooltip>
            </q-fab-action>
            <q-fab-action color="secondary" @click="setHomeScreen" icon="home">
                <q-tooltip anchor="center left" self="center right" :offset="[20, 0]">Home Screen</q-tooltip>
            </q-fab-action>
            <q-fab-action color="tertiary" @click="refreshEntities" icon="refresh">
                <q-tooltip anchor="center left" self="center right" :offset="[20, 0]">Refresh Entities</q-tooltip>
            </q-fab-action>
        </q-fab>
    </q-layout>

</template>

<script>
import { openURL, debounce, uid } from 'quasar'
import weatherday from 'components/weatherday.vue'
export default {
  name: 'MyLayout',
  components: {
    'weatherday-view': weatherday
  },
  data () {
    return {
      leftDrawerOpen: false,
      date: '',
      time: '',
      bgs: '',
      configNames: [],
      configName: '',
      oldconfigName: '',
      multipleSelect: [],
      debouncedPush: null,
      interval: null,
      homeScreenInterval: 10,
      rotateBackgroundInterval: null,
      homeScreen: 0,
      headerBGS: 'background: -moz-linear-gradient(top, rgba(128,128,128,1) 0%, rgba(128,128,128,.6) 100%); background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(128,128,128,1)), color-stop(100%,rgba(128,128,128,.6))); background: -webkit-linear-gradient(top, rgba(128,128,128,1) 0%,rgba(128,128,128,.6) 100%); background: -o-linear-gradient(top, rgba(128,128,128,1) 0%,rgba(128,128,128,.6) 100%); background: -ms-linear-gradient(top, rgba(128,128,128,1) 0%,rgba(128,128,128,.6) 100%); background: linear-gradient(to bottom, rgba(128,128,128,1) 0%,rgba(128,128,128,.6) 100%);' }
  },
  computed: {
    weatherImage: {
      get () {
        var entity = this.$getEntity(this.currentConditions)
        if (entity) {
          if (entity.attributes.entity_picture) {
            return this.$GetWeatherCondition(entity.attributes.entity_picture)
          }
          console.error('weather no entitiy picture')
          return ''
        }
      }
    },
    homeScreenDelay: {
      get () {
        return this.$store.state.config.homeScreenDelay
      },
      set (val) {
        this.$configCommit('config/homeScreenDelay', val)
      }
    },
    rotateBackGroundImages: {
      get () {
        return this.$store.state.config.rotateBackGroundImages
      },
      set (val) {
        //        console.log('set rotateBackGroundImages', val)
        this.$configCommit('config/rotateBackGroundImages', val)
        this.enableRotateBackground()
      }
    },

    rotateBackground: {
      get () {
        return this.$store.state.config.rotateBackground
      },
      set (val) {
        //      console.log('set rotateBackground', val)
        this.$configCommit('config/rotateBackground', val)
      }
    },
    rotateBackgroundDelay: {
      get () {
        return this.$store.state.config.rotateBackgroundDelay
      },
      set (val) {
        this.$configCommit('config/rotateBackgroundDelay', val)
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
        var imgNum = this.$store.state.config.backgroundImage + 1
        return 'statics/bg-' + imgNum + '.jpg'
      },
      set (val) {}
    },
    backgroundImageNum: {
      get () {
        return this.$store.state.config.backgroundImage
      },
      set (val) {
        this.$configCommit('config/backgroundImage', val)
      }
    },
    hassUrl: {
      get () {
        return this.$store.state.config.hassUrl
      },
      set (val) {}
    },
    tempSensorState: {
      get () {
        return this.$getState(this.$store.state.config.tempSensor)
      },
      set (val) {}
    },
    currentConditionsState: {
      get () {
        return this.$getState(this.$store.state.config.currentConditions)
      },
      set (val) {}
    },
    currentConditionsStateIcon: {
      get () {
        var entity = this.$getEntity(this.$store.state.config.tempSensor)
        if (entity && entity.attributes.icon) {
          entity.attributes.icon.replace(/:/, '-')
          return entity.attributes.icon.replace(/:/, '-')
        }
        return ''
      },
      set (val) {}
    },
    currentCarouselSlide: {
      get () {
        return this.$store.state.haws.currentCarouselSlide
      },
      set (val) {}
    },
    tempSensor: {
      get () {
        return this.$store.state.config.tempSensor
      },
      set (val) {
        this.$configCommit('config/tempSensor', val)
      }
    },
    currentConditions: {
      get () {
        return this.$store.state.config.currentConditions
      },
      set (val) {
        this.$configCommit('config/currentConditions', val)
      }
    },
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
    },
    configEnabled: {
      get () {
        return this.$store.state.config.configEnabled
      },
      set (val) {
        this.$store.commit('config/configEnabled', val)
      }
    },
    path: {
      get () {
        return this.$router.currentRoute.path
      }
    }

  },
  created () {
    this.$checkLogin().then(() => {
      this.checkStore()
    })
    this.debouncedPush = debounce(function (keycode) {
      switch (keycode) {
        case 'Ü':
          switch (this.$router.currentRoute.path) {
            case '/':
              console.log('push to entities')
              this.$router.push('entities')
              break
            case '/entities':
              console.log('push to root')
              this.$router.push('/')
              break
          }
          break
      }
    }, 1000)

    window.addEventListener('keyup', e => {
      this.debouncedPush(String.fromCharCode(e.keyCode))
    }, 'once')

    this.interval = setInterval(this.updateTime, 1000)
    this.homeScreenInterval = setInterval(this.homeScreenChecker, this.homeScreenDelay * 1000)
    this.enableRotateBackground()
  },
  updated () {
  //  this.$checkLogin()
  },
  mounted: async function () {
    await this.getConfigNames()
    this.$refs.carouselDrawer.goToSlide(this.backgroundImageNum)
    //  console.log(this.$store.state.haws)
    this.updateBackground()

    this.updateTime()

    this.multipleSelect = this.$store.state.config.componentsToDisplay ? this.$store.state.config.componentsToDisplay : []
    this.configName = this.$config.configName
    this.oldconfigName = this.configName
  },

  watch: {
    currentCarouselSlide (result, oldResult) {
      this.homeScreenReset()
    },
    backgroundImage (result, oldResult) {
      this.updateBackground()
    },
    multipleSelect: async function (result, oldResult) {
      await this.$configCommit('config/componentsToDisplay', result)
    },
    homeScreenDelay (result, oldResult) {
      this.homeScreenInterval = setInterval(this.homeScreenChecker, this.homeScreenDelay * 1000)
    }
  },
  beforeDestroy () {
    if (this.homeScreenInterval) {
      clearInterval(this.homeScreenInterval)
    }
    if (this.interval) {
      clearInterval(this.interval)
    }
    if (this.rotateBackgroundInterval) {
      clearInterval(this.rotateBackgroundInterval)
    }
  },
  methods: {
    enableRotateBackground () {
      if (this.rotateBackgroundInterval) {
        clearInterval(this.rotateBackgroundInterval)
      }
      if (!this.rotateBackgroundDelay) {
        return
      }
      //   console.log('enableRotateBackground ' + this.rotateBackgroundDelay)
      this.rotateBackgroundInterval = setInterval(this.doRotateBackground, this.rotateBackgroundDelay * 1000)
    },
    doRotateBackground () {
      if (this.leftDrawerOpen) {
        return
      }
      var objIndex = this.rotateBackGroundImages.findIndex(a => a === parseInt(this.backgroundImageNum))

      ++objIndex
      if (objIndex === this.rotateBackGroundImages.length) {
        objIndex = 0
      }

      this.backgroundImageNum = this.rotateBackGroundImages[objIndex]
    },
    removeFromRotate (slide) {
      if (!this.rotateBackGroundImages.includes(slide)) {
        return
      }

      var temp = this.rotateBackGroundImages.filter(e => e !== slide)
    },
    addToRotate (slide) {
      if (this.rotateBackGroundImages.includes(slide)) {
        return
      }

      var tmp = this.rotateBackGroundImages
      tmp.push(slide)

      this.rotateBackGroundImages = tmp.sort(function (a, b) { return a - b })
    },
    checkStore: async function () {
      var changed = false

      if (!this.homeScreenDelay || this.homeScreenDelay < 5) {
        console.log('Fixing up homeScreenDelay')
        this.homeScreenDelay = 10
        this.$configCommit('config/homeScreenDelay', this.homeScreenDelay)
        changed = true
      }

      if (!this.$hasHomeScreen()) {
        console.log('Fixing up hasHomeScreen')

        this.$store.state.config.screens[0].isHome = true
        this.$configCommit('config/screens', this.screens)
        changed = true

        this.$root.$emit('screensChanged')
      }

      if (!this.rotateBackgroundDelay || this.rotateBackgroundDelay < 5) {
        console.log('Fixing up rotateBackgroundDelay')
        this.rotateBackgroundDelay = 10
        this.$configCommit('config/rotateBackgroundDelay', this.rotateBackgroundDelay)
        changed = true
      }

      if (this.rotateBackground === undefined) {
        console.log('Fixing up rotateBackground')
        this.rotateBackground = false
        this.$configCommit('config/rotateBackground', this.rotateBackground)
        changed = true
      }

      if (this.rotateBackGroundImages === undefined || this.rotateBackGroundImages.length === 0) {
        console.log('Fixing up rotateBackGroundImages')
        this.rotateBackGroundImages = [0]
        this.$configCommit('config/rotateBackGroundImages', this.rotateBackGroundImages)
        changed = true
      }

      if (changed) {
        await this.$configSave()
      }
    },
    getConfigNames: async function () {
      var ret = []
      var names = await this.$configNames()
      for (var index in names) {
        var name = names[index].replace(/\.json$/, '')
        ret.push({label: name, value: name})
      }
      this.configNames = await this.$labelSort(ret)
    },
    weather () {
      switch (this.$router.currentRoute.path) {
        case '/':
          this.homeScreenReset()
          this.$router.push('weather')
          break
        case '/weather':
          this.$router.push('/')
          break
      }
    },

    refreshEntities: async function () {
      await this.$hawsGetStates()
    },
    addScreen: async function () {
      this.$store.state.config.screens.push(
        {
          screenId: uid(),
          screenName: 'Screen 1',
          isHome: false,
          hagroups: [{
            id: uid(),
            name: 'Empty',
            children: []
          }]
        }
      )
      this.$configCommit('config/screens', this.$store.state.config.screens)
      await this.$configSave()
    },
    setHomeScreen: async function () {
      var vm = this
      vm.$q.dialog({
        title: 'Confirm',
        message: 'Make this your home Screen (' + this.currentCarouselSlide + ')',
        ok: 'Yes',
        cancel: 'No'
      }).then(async () => {
        for (var index in vm.$store.state.config.screens) {
          vm.$store.state.config.screens[index].isHome = parseInt(index) === parseInt(this.currentCarouselSlide)
          // console.log(index, this.currentCarouselSlide, vm.$store.state.config.screens[index].isHome)
        }

        this.$configCommit('config/screens', this.$store.state.config.screens)
        await this.$configSave()
        vm.$root.$emit('screensChanged')
      }).catch(() => {

      })
    },
    deleteScreen: async function () {
      var vm = this
      vm.$q.dialog({
        title: 'Confirm',
        message: 'Delete Screen #' + this.currentCarouselSlide,
        ok: 'Yes',
        cancel: 'No'
      }).then(async () => {
        vm.$store.state.config.screens.splice(this.currentCarouselSlide, 1)
        vm.$q.notify('Removed Screen #' + this.currentCarouselSlide)
        vm.$configCommit('config/screens', vm.$store.state.config.screens)
        await vm.$configSave()
        vm.$root.$emit('screensChanged')
      }).catch(() => {

      })
    },
    openURL,
    modalClosed: async function () {

    },
    updateBackground () {
      this.bgs = {
        'background-image': "url('" + this.backgroundImage + "')",
        'background-size': 'cover',
        'background-repeat': 'no-repeat',
        'background-position': 'center',
        'height': '100%',
        'transition': 'all 1s ease-in'
      }
    },
    homeScreenReset () {
      if (this.homeScreenInterval) {
        clearInterval(this.homeScreenInterval)
      }
      this.homeScreenInterval = setInterval(this.homeScreenChecker, this.homeScreenDelay * 1000)
    },
    homeScreenChecker () {
      if (this.leftDrawerOpen || this.configEnabled || this.$store.state.haws.dialogOpen) {
        return
      }

      if (this.$router.currentRoute.path !== '/' && this.$router.currentRoute.path !== '/login' && this.$router.currentRoute.path !== '/entities') {
        this.$router.push('/')
      }

      if (this.$homeScreen() !== parseInt(this.currentCarouselSlide)) {
        this.$root.$emit('screensChanged')
      }
    },
    bg () {

    },
    handler (obj) {
      this.leftDrawerOpen = true
    },
    updateTime () {
      var week = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
      var cd = new Date()
      this.time = this.zeroPadding(cd.getHours(), 2) + ':' + this.zeroPadding(cd.getMinutes(), 2) + ':' + this.zeroPadding(cd.getSeconds(), 2)
      this.date = this.zeroPadding(cd.getFullYear(), 4) + '/' + this.zeroPadding(cd.getMonth() + 1, 2) + '/' + this.zeroPadding(cd.getDate(), 2) + ' ' + week[cd.getDay()]
    },
    zeroPadding (num, digit) {
      var zero = ''
      for (var i = 0; i < digit; i++) {
        zero += '0'
      }
      return (zero + num).slice(-digit)
    },
    drawerClose: async function () {
      this.$q.loading.show({
        delay: 400, // ms,
        message: 'Loading configuration names',
        messageColor: 'blue',
        spinnerSize: 250, // in pixel
        customClass: 'bg-primary'

      })
      if (this.configName === this.$config.configName) {
        await this.$configSave()
      } else {
        this.$configCommit('config/configName', this.configName)
        await this.$configLoad()
      }
      this.leftDrawerOpen = false
      this.$q.loading.hide()
    }
  }
}
</script>
<style lang="stylus">
@import '~variables';
</style>
<style>
.full-text {
	font-size: 2em;
}
.weatherImage {
	width: 64px;
}
.bk {
  transition: all 0.1s ease-out;
}
@media (max-width: 900px) {
	.short-text {
		display: inline-block;
	}
	.full-text {
		font-size: 1.5em;
	}

	.weatherImage {
		width: 32px;
	}
}
</style>
