<template>
    <div>
        <q-card class="bg-white shadow-10 text-center justify-center" :disabled="IsDisabled" :style="bgs">
            <q-card-media>
                <q-icon  :name="icon" />
            </q-card-media>
            <q-card-title>
                <div class="q-headline"> {{entity.attributes.friendly_name}}</div>
                <q-slider v-if="this.entity.attributes.away_mode !== 'on'" :min=68 :max=80 style="font-size: 1.5rem" label color="blue" :label-value="`Set ${setTemp}ºF`" v-model="setTemp" :label-always="true" readonly/>
                <div v-else>Away Mode</div>
                <div class="text-center">Current {{currentTemp}}ºF | {{state}}</div>
                <q-popup-edit title='Set Temp' v-model="setTemp" @hide="save(setTemp)" :validate="validate" @show='show' >
                    <vue-numeric-input v-model="setTemp" :min="68" :max="80" :step="1" />
                </q-popup-edit>
            </q-card-title>
        </q-card>
    </div>

</template>

<script>
import { debounce } from 'quasar'
export default {
  name: 'ClimateComponent',
  props: {
    entityId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      bgs: {},
      currentTemp: 0,
      setTemp: 0,
      debouncedFunction: null,
      oldSet: 0,
      icon: '',
      IsDisabled: false,
      state: ''
    }
  },

  mounted () {
    this.bgs = {
      'height': this.buttonHeight + 'px',
      'width': this.buttonWidth * 1.2 + 'px'
    }

    this.debouncedFunction = debounce(async function (newVal) {
      if (this.oldSet === this.setTemp) {
        return
      }
      this.oldSet = this.setTemp

      let message = {
        'type': 'call_service',
        'domain': 'climate',
        'service': 'set_temperature',
        'service_data': {
          'entity_id': this.entity.entity_id,
          'temperature': newVal
        }
      }
      await this.$hawsSend(message)
    }, 500)

    this.currentTemp = this.entity.attributes.current_temperature
    this.setTemp = this.entity.attributes.temperature
    this.oldSet = this.setTemp
    this.state = this.sensor.state
    this.doUpdate()
  },
  watch: {
    entity (result, oldResult) {
      this.currentTemp = this.entity.attributes.current_temperature
      this.setTemp = this.entity.attributes.temperature
      this.doUpdate()
    },
    sensor (result, oldResult) {
      this.state = this.sensor.state
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
    sensor: {
      get () {
        var sensorName = this.entity.entity_id.replace(/^climate/, 'sensor') + '_thermostat_hvac_state'
        var sensor = this.$store.state.haws.sensors.filter(ent => ent.entity_id === sensorName)[0]// this.$getEntity(sensorName)
        return sensor
      },
      set (val) {

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
  methods: {
    show () {
      this.$configCommit('haws/dialogOpen', true)
    },
    validate (assa) {
      return true
    },
    doUpdate () {
      switch (this.state) {
        case 'cooling':
          this.icon = 'mdi-snowflake'
          break
        case 'heating':
          this.icon = 'mdi-radiator'
          break
      }
    },
    save (val, initialValue) {
      this.$configCommit('haws/dialogOpen', false)
      if (this.oldSet === this.setTemp) {
        return
      }
      this.oldSet = this.setTemp

      let message = {
        'type': 'call_service',
        'domain': 'climate',
        'service': 'set_temperature',
        'service_data': {
          'entity_id': this.entity.entity_id,
          'temperature': val
        }
      }
      this.$hawsSend(message)
    }

  }
}
</script>

<style>
</style>
