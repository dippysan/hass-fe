import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'

import haws from './haws'
import auth from './auth'
import config from './config'

Vue.use(Vuex)

const vuexLocalStorage = new VuexPersist({
  key: 'hass-quasar',
  storage: window.localStorage,
  reducer: state => ({
    auth: state.auth,
    config: state.config
  })
})

export default function () {
  const Store = new Vuex.Store({
    plugins: [vuexLocalStorage.plugin],
    modules: {
      haws,
      auth,
      config
    }
  })

  if (process.env.DEV && module.hot) {
    module.hot.accept(['./config'], () => {
      const newconfig = require('./config').default
      Store.hotUpdate({
        modules: {
          config: newconfig
        }
      })
    })

    module.hot.accept(['./haws'], () => {
      const newhaws = require('./haws').default
      Store.hotUpdate({
        modules: {
          haws: newhaws
        }
      })
    })

    module.hot.accept(['./auth'], () => {
      const newauth = require('./auth').default
      Store.hotUpdate({
        modules: {
          auth: newauth
        }
      })
    })
  }

  return Store
}
