<template>

    <q-card inline class="bg-white q-ma-sm shadow-10" style="width: 200px">
        <div class="text-center q-headline" v-if="!small"> {{dateDay}}</div>
        <q-card-media class="q-headline">
            <skycon :condition="icon" width="64" height="64"></skycon>
            {{highTemp}}/{{lowTemp}}
        </q-card-media>
        <q-card-main class="q-subheading" v-if="!small">
            <div>
                <q-icon :name="precipProbIcon" />Percipitation: {{precipProb}}</div>
            <div>
                <q-icon :name="humidityIcon" />Humidity: {{humidity}}</div>
            <div>
                <q-icon :name="windSpeedIcon" />Wind: {{windSpeed}}</div>
        </q-card-main>
    </q-card>

</template>

<script >

export default {
  // name: 'ComponentName',
  props: {
    // Icon size
    width: {
      type: Number,
      default: 64
    },

    height: {
      type: Number,
      default: 64
    },

    color: {
      type: String,
      default: 'black'
    },

    // Weather condition
    day: {
      type: String,
      default: '1'
    },
    small: {
      type: Boolean,
      default: false
    }

  },
  data () {
    return {
      condition: null,
      icon: '',
      highTemp: 0,
      highTempIcon: null,
      lowTemp: 0,
      lowTempIcon: null,
      humidity: 0,
      humidityIcon: null,
      precipProb: 0,
      precipProbIcon: null,
      windSpeed: 0,
      windSpeedIcon: null,
      dateDay: ''
    }
  },
  created () {

  },
  mounted () {
    var weekday = new Array(7)
    weekday[0] = 'Sunday'
    weekday[1] = 'Monday'
    weekday[2] = 'Tuesday'
    weekday[3] = 'Wednesday'
    weekday[4] = 'Thursday'
    weekday[5] = 'Friday'
    weekday[6] = 'Saturday'

    var date = this.addDays(this.day)
    this.dateDay = weekday[date.getDay()]
    var test = this.$getState('sensor.dark_sky_icon_' + this.day)
    this.icon = test

    var entity = this.$getEntity('sensor.dark_sky_precip_probability_' + this.day)
    if (!entity) {
      return
    }
    this.precipProb = entity.state + '' + entity.attributes.unit_of_measurement
    this.precipProbIcon = entity.attributes.icon.replace(/:/, '-')

    entity = this.$getEntity('sensor.dark_sky_wind_speed_' + this.day)
    this.windSpeed = entity.state + '' + entity.attributes.unit_of_measurement
    this.windSpeedIcon = entity.attributes.icon.replace(/:/, '-')

    entity = this.$getEntity('sensor.dark_sky_daytime_high_temperature_' + this.day)
    this.highTemp = Math.round(entity.state) + '' + entity.attributes.unit_of_measurement
    this.highTempIcon = entity.attributes.icon.replace(/:/, '-')

    entity = this.$getEntity('sensor.dark_sky_overnight_low_temperature_' + this.day)
    this.lowTemp = Math.round(entity.state) + '' + entity.attributes.unit_of_measurement
    this.lowTempIcon = entity.attributes.icon.replace(/:/, '-')

    entity = this.$getEntity('sensor.dark_sky_humidity_' + this.day)
    this.humidity = entity.state + '' + entity.attributes.unit_of_measurement
    this.humidityIcon = entity.attributes.icon.replace(/:/, '-')
  },
  methods: {
    addDays (days) {
      var date = new Date()

      date.setDate(date.getDate() + parseInt(days))

      return date
    }
  }

}
</script>

<style>
</style>
