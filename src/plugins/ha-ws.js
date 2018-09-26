import {
  getAuth,
  createConnection,
  subscribeEntities,

  ERR_HASS_HOST_REQUIRED
} from '../haws.es.js'
import { SSL_OP_EPHEMERAL_RSA } from 'constants'
export default ({
  Vue,
  router,
  store
}) => {
  var unsubscribeEntities = null
  var unsubscribeEvents = null
  var connection = null
  var connecting = false
  var connected = false

  Vue.prototype.$checkLogin = async function () {
    if (store.state.haws.loggingIn) {
      return
    }

    store.commit('haws/loggingIn', true)
    if (
      !store.state.config.hassUrl || store.state.config.hassUrl === '' || !store.state.config.configName || store.state.config.configName === '') {
      if (router.currentRoute.path === '/login') {
        return
      }
      store.commit('haws/configLoaded', false)
      store.commit('haws/loggedIn', false)
      console.log('push to login')
      router.push('login')
      return
    }
    // console.log('continue')
    if (store.state.haws.loggedIn) {
      return
    }

    // console.log('hawsConnect')
    // console.log(store.state.config.hassUrl)
    // console.log(store.state.config.configName)
    // console.log(store.state.haws.loggedIn)

    await this.$hawsConnect()

    if (store.state.config.configName && store.state.config.configName !== '') {
      await Vue.prototype.$configChanged()
    }
    store.commit('haws/loggingIn', false)
  }

  Vue.prototype.$IsLoggedIn = function () {
    return store.state.haws.loggedIn
  }

  Vue.prototype.$configChanged = async function (newConfig) {
    store.commit('haws/configLoaded', false)
    var ret = await load(newConfig)
    return ret
  }

  async function load (newConfig) {
    if (newConfig) {
      // console.log('newConfig load save')
      if (await Vue.prototype.$configSave()) {
        //   console.log('all good')
        store.commit('haws/configLoaded', true)
        store.commit('haws/loggedIn', true)
        return true
      }
    } else {
      //   console.log('load load config')
      if (await Vue.prototype.$configLoad()) {
        //     console.log('all good')
        store.commit('haws/configLoaded', true)
        store.commit('haws/loggedIn', true)
        return true
      }
    }
    return false
  }

  Vue.prototype.$hawsDisConnect = async function () {
    if (connection !== undefined && unsubscribeEntities !== undefined) {
      if (unsubscribeEntities !== undefined && unsubscribeEntities != null) {
        unsubscribeEntities()
      }
      if (unsubscribeEvents !== undefined && unsubscribeEvents != null) {
        unsubscribeEvents()
      }
    }
  }
  Vue.prototype.$hawsConnect = async function () {
    var hassUrl = this.$config.hassUrl

    if (hassUrl === undefined || hassUrl === null || hassUrl === '') {
      console.log('push to login 2')
      router.push('login')
    }
    await connect(this.$config.hassUrl, store)
  }

  Vue.prototype.$hawsGetStates = async function () {
    await getStates(connection, store)
  }
  Vue.prototype.$hawsSend = async function (message) {
    if (!connection) {
      console.log('connection is not connected!')
    }
    console.log('send ' + JSON.stringify(message))
    await connection.sendMessagePromise(message)
    console.log('send done ' + message)
    return true
  }

  Vue.prototype.$hawsGetCameraThumbnail = async function (entityId) {
    if (!connection) {
      console.log('connection is not connected!')
    }

    let message = {
      'type': 'camera_thumbnail',
      'entity_id': entityId

    }
    var ret = await connection.sendMessagePromise(message)
    return ret
  }

  async function connect (hassUrl, store) {
    let auth

    if (connection || connecting || connected) {
      if (connection || connected) {
        return
      }
      while (connecting) {
        await sleep(250)
      }
      return
    }

    connecting = true

    try {
      // console.log('Connecting to: ' + hassUrl)
    //  console.log('store: ', store)
      auth = await getAuth({
        hassUrl,
        saveTokens: e => store.commit('auth/auth', e),
        loadTokens: () => loadTokens(store)
      })
    } catch (err) {
      if (err === ERR_HASS_HOST_REQUIRED) {
        hassUrl = prompt(
          'What host to connect to?',
          hassUrl
        )
        // Redirect user to log in on their instance
        auth = await getAuth({
          hassUrl,
          saveTokens: e => store.commit('auth/auth', e),
          loadTokens: () => loadTokens(store)
        })
      } else {
        alert(`Unknown error: ${err}`)
        return
      }
    }

    connection = await createConnection({
      auth
    })

    // console.log('connected')
    // unsubscribeEntities = subscribeEntities(connection, ent => store.commit('haws/setEntities', ent))
    // unsubscribeEntities = subscribeEntities(connection, ent => store.dispatch('haws/someAction', ent))

    // await getStates(connection, this.$store)
    // const subscribeUpdates = connection.subscribeEvents(event => ProcessState(event, this.$store.state.haws.entities), 'state_changed')
    const unsubscribeEvents = connection.subscribeEvents(event => store.commit('haws/setEvent', event), 'state_changed')
    await getStates()
    // this.$store.commit('haws/testEntities', this.$store.state.haws.entities)

    connected = true
    connecting = false
  }

  async function checkConnection () {
    if (connection === undefined || connection === null) {
      console.log('Connecting')
      await connect()
    }
  }

  async function getStates () {
    await checkConnection()

    const entities = await connection.sendMessagePromise({ type: 'get_states' })
    store.commit('haws/setEntities', entities)
  }
  async function loadTokens (store) {
    var auth = store.state.auth.auth
    if (auth === null || !auth.clientId) {
      return undefined
    }

    return auth
  }

  function sleep (ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
