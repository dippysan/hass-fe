<template>
    <q-page padding >
        <div class="flex flex-center row justify-center" :style="headerBGS">
            <weatherday-view day="1" class="q-mt-lg"/>
            <weatherday-view day="2" class="q-mt-lg"/>
            <weatherday-view day="3" class="q-mt-lg"/>
            <weatherday-view day="4" class="q-mt-lg"/>
            <weatherday-view day="5" class="q-mt-lg"/>
            <weatherday-view day="6" class="q-mt-lg"/>
            <weatherday-view day="7" class="q-mt-lg"/>
            <div class="q-headline q-col-12 shadow-10 text-center text-white q-ma-lg" style='border-radius: 5px;'>{{summary}}</div>
        </div>
    </q-page>
</template>

<script>
import weatherday from 'components/weatherday.vue'
export default {
  // name: 'PageName',
  components: {
    'weatherday-view': weatherday
  },
  data () {
    return {
      summary: '',
      headerBGS: 'border-radius: 25px; background: -moz-linear-gradient(top, rgba(128,128,128,1) 0%, rgba(128,128,128,.6) 100%); background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(128,128,128,1)), color-stop(100%,rgba(128,128,128,.6))); background: -webkit-linear-gradient(top, rgba(128,128,128,1) 0%,rgba(128,128,128,.6) 100%); background: -o-linear-gradient(top, rgba(128,128,128,1) 0%,rgba(128,128,128,.6) 100%); background: -ms-linear-gradient(top, rgba(128,128,128,1) 0%,rgba(128,128,128,.6) 100%); background: linear-gradient(to bottom, rgba(128,128,128,1) 0%,rgba(128,128,128,.6) 100%);'
    }
  },
  mounted () {
    this.summary = this.$getState('sensor.dark_sky_daily_summary')
  },
  methods: {
    doSky () {

    }
  }
}
</script>

<style>
</style>
