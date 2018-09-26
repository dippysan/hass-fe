const Gists = require('gists')
import axios from 'axios'

export default ({
  app,
  router,
  store,
  Vue
}) => {
  const description = 'hass-quasar.configs'

  Vue.prototype.$config = store.state.config
  Vue.prototype.$authConfig = store.state.auth.config

  Vue.prototype.$configCommit = function (path, val) {
    // console.log(path + ' ' + val)
    store.commit(path, val)
  }

  Vue.prototype.$authConfig.commit = function (path, val) {
    store.commit(path, val)
  }
  Vue.prototype.$configNames = async function () {
    var auth = await gistAuth()
    return gistGetConfigNames(auth)
  }

  Vue.prototype.$configSave = async function () {
    // console.log('Save')
    if (store.state.config.configName === undefined || store.state.config.configName === '') {
      return
    }
    var filename = store.state.config.configName + '.json'

    console.log('Saving to ' + filename)

    var auth = await gistAuth(store.state.haws.entities)
    const gist = new Gists(auth)

    var url = await gistGetConfigUrl(auth)
    if (url === undefined) {
      console.log('creating gist config')

      var g = {
        'description': description,
        'public': false,
        'files': {}
      }
      g.files[filename] = {
        'filename': filename,
        'content': JSON.stringify(store.state.config)
      }

      gist.create(g)
    } else {
      var array = url.split('/')
      console.log('updating gist config: ' + array[4])
      g = {
        'description': description,
        'files': {}
      }
      g.files[filename] = {
        'filename': filename,
        'content': JSON.stringify(store.state.config)
      }

      gist.edit(array[4], g)
    }

    return true
  }
  Vue.prototype.$configLoad = async function () {
  //  console.log('loading')
  //  console.log(store)
    var auth = await gistAuth(store.state.haws.entities)
    var url = await gistGetConfigUrl(auth)
    if (url === undefined) {
      // console.warn('Cannot find gist save')
      return
    }
    axios({
      url: url,
      method: 'GET'
    }).then((response) => {
      // console.log('loaded config ' + store.state.config.configName)
      store.state.config = response.data
    })

    return true
  }

  async function getGistConfig () {
    var timeout = 5000
    var count = 0
    var tosleep = 500

    while (count <= timeout) {
      count += tosleep

      if (store.state.haws.configs && store.state.haws.configs.length > 0) {
        var entity = store.state.haws.configs[0]
        var gistConfig = JSON.parse(entity.state)
        return gistConfig
      }
      await sleep(tosleep)
    }
  }

  async function gistGetConfigNames (auth) {
    const gist = new Gists(auth)

    var gists = await gist.all()
    var ret = []

    if (gists.pages && gists.pages[0] && gists.pages[0].body && gists.pages[0].body[0]) {
      for (var bodyIndex in gists.pages[0].body) {
        if (gists.pages[0].body[bodyIndex].description && gists.pages[0].body[bodyIndex].description === description) {
          if (gists.pages[0].body[bodyIndex].files) {
            for (var index in gists.pages[0].body[bodyIndex].files) {
              ret.push(index)
            }
          }
        }
      }

      return ret
    }
    return []
  }

  async function gistGetConfigUrl (auth) {
    const gist = new Gists(auth)

    var gists = await gist.all()
    var filename = store.state.config.configName + '.json'

    if (gists.pages && gists.pages[0] && gists.pages[0].body && gists.pages[0].body[0]) {
      for (var bodyIndex in gists.pages[0].body) {
        if (gists.pages[0].body[bodyIndex].description && gists.pages[0].body[bodyIndex].description === description) {
          if (gists.pages[0].body[bodyIndex].files) {
            for (var index in gists.pages[0].body[bodyIndex].files) {
              if (index === filename) {
                return gists.pages[0].body[bodyIndex].files[index].raw_url
              }
            }
          }
        }
      }
    }

    console.log('not found')
    return undefined
  }

  async function gistAuth () {
    var gistConfig = await getGistConfig(store.state.haws.entities)

    if ((!gistConfig.gistUser || !gistConfig.gistPassword) && !gistConfig.gistToken) {
      console.error('bad gistconfig')
      return
    }
    var auth = {}

    if (gistConfig.gistUser) {
      auth.username = gistConfig.gistUser
    }
    if (gistConfig.gistPassword) {
      auth.password = gistConfig.gistPassword
    }
    if (gistConfig.gistToken) {
      auth.token = gistConfig.gistToken
    }

    return auth
  }

  function sleep (ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
