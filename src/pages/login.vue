<template>
    <q-page class="flex flex-center">
        <div>
            <q-field class="text-white text-weight-bold q-headline" icon="home" inverted label="Home Assistant" :error="$v.hassUrl.$error" error-label="We need a valid URL">
                <q-input class="q-subheadline " v-model="hassUrl" inverted placeholder="http://localhost:8123" type='url' :autofocus="true" @blur="submit" @keyup.enter="submit" />
            </q-field>
            <q-field v-if="configNames && configNames.length>0" class="text-white text-weight-bold q-headline" icon="edit" inverted label="Config Names">
                <q-select :disable="!hassUrl || hassUrl === ''" class="row q-ma-xs" inverted :options="configNames" v-model="configName" color="primary" float-label="Existing Configuration Names" />
            </q-field>
            <q-field v-if="configNames && configNames.length>0 || noConfigs" class="text-white text-weight-bold q-headline" icon="edit" inverted label="Config Name" :error="$v.configTextName.$error" error-label="We need config name">
                <q-input class="q-subheadline" v-model="configTextName" inverted placeholder="" @blur="$v.configTextName.$touch" @keyup.enter="configNameSubmit" />
            </q-field>
            <q-field v-if="configName && configName !== ''" class="text-white text-weight-bold q-headline" icon="star" inverted label="Load">
                <q-btn label="Load" inverted dark color="primary" @click="load" v-if="configName && configName !== ''" />
            </q-field>
        </div>
    </q-page>
</template>

<script>
import { required, url } from 'vuelidate/lib/validators'
export default {
  name: 'LoginPage',
  data () {
    return {
      hassUrl: '',
      configNames: [],
      configName: '',
      configTextName: '',
      noConfigs: false
    }
  },
  validations: {
    hassUrl: { required, url },
    configTextName: { required }
  },
  watch: {
    configName: async function (result, oldResult) {
      this.$configCommit('config/configName', result)
      this.configTextName = result
    }
  },
  created: function () {
    this.$configCommit('haws/loggedIn', false)
  },
  mounted: async function () {
    this.hassUrl = this.$store.state.config.hassUrl
    this.configName = this.$store.state.config.configName
    if (this.$store.state.config.hassUrl && this.$store.state.config.hassUrl !== '') {
      await this.submit()
    }
  },
  beforedestoryed () {
    // this.$configCommit('haws/loggedIn', true)
  },
  methods: {
    load: async function () {
      var configExists = this.configNames.filter(a => a.label === this.configTextName).length > 0
      if (await this.$configChanged(!configExists)) {
        this.$store.commit('haws/loggingIn', false)
        this.$router.go(-1)
      }
    },
    process: async function () {
      this.$q.loading.show({
        delay: 400, // ms,
        message: 'Loading configuration names',
        messageColor: 'blue',
        spinnerSize: 250, // in pixel
        customClass: 'bg-primary'

      })
      await this.$hawsConnect()

      var ret = []
      var names = await this.$configNames()
      for (var index in names) {
        var name = names[index].replace(/\.json$/, '')
        ret.push({label: name, value: name})
      }
      this.configNames = await this.$labelSort(ret)
      if (this.configNames.length === 0) {
        this.noConfigs = true
      }
      this.$q.loading.hide()
    },

    configNameSubmit: async function () {
      this.$v.configTextName.$touch()

      if (this.$v.configTextName.$error) {
        this.$q.notify('Please review fields again.')
      } else {
        console.log('configName ' + this.configTextName)
        this.$configCommit('config/configName', this.configTextName)
        this.configName = this.configTextName
      }
    },
    submit: async function () {
      this.$v.hassUrl.$touch()

      if (this.$v.hassUrl.$error) {
        this.$q.notify('Please review fields again.')
      } else {
        console.log('submitted ' + this.hassUrl)
        this.$configCommit('config/hassUrl', this.hassUrl)

        await this.process()
      }
    }
  }

}
</script>

<style>
</style>
