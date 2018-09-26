export default ({
  Vue,
  store
}) => {
  Vue.prototype.$labelSort = function (data) {
    return data.sort(labelCompare)
  }

  Vue.prototype.$getState = function (entityId) {
    if (!entityId || entityId === '') {
      return ''
    }

    let type = entityId.substring(0, entityId.indexOf('.'))

    for (var index in store.state.haws.entities[type]) {
      var entity = store.state.haws.entities[type][index]
      if (entity.entity_id === entityId) {
        //   console.log(entityId)
        return entity.state
      }
    }

    return ''
  }

  Vue.prototype.$getType = function (entityId) {
    let type = entityId.substring(0, entityId.indexOf('.'))

    return type
  }

  Vue.prototype.$getEntity = function (entityId) {
    let type = entityId.substring(0, entityId.indexOf('.'))
    // console.log('type', type)
    // console.log('entities', store.state.haws.entities)
    for (var index in store.state.haws.entities[type]) {
      var entity = store.state.haws.entities[type][index]
      if (entity.entity_id === entityId) {
        return entity
      }
    }

    return ''
  }

  Vue.prototype.$sun = function () {
    var entityId = 'sun.sun'
    let type = entityId.substring(0, entityId.indexOf('.'))

    for (var index in store.state.haws.entities[type]) {
      var entity = store.state.haws.entities[type][index]
      if (entity.entity_id === entityId) {
        return entity
      }
    }

    return ''
  }

  Vue.prototype.$IsDay = function () {
    return Vue.prototype.$sun().state === 'above_horizon'
  }

  Vue.prototype.$homeScreen = function () {
    for (var index in store.state.config.screens) {
      // console.log(index)
      if (store.state.config.screens[index].isHome) {
        return parseInt(index)
      }
    }
    return 0
  }

  Vue.prototype.$hasHomeScreen = function () {
    for (var index in store.state.config.screens) {
      if (store.state.config.screens[index].isHome) {
        return true
      }
    }
    return false
  }

  Vue.prototype.$getStateInfo = function (entity) {
    if (entity.entity_id.endsWith('lock')) {
      if (entity.state === 'on') {
        return 'locked'
      }
      return 'unlocked'
    }
    return entity.state
  }

  Vue.prototype.$GetWeatherCondition = function (pictureName) {
    var reg = /.*-(.*).svg/
    var res = reg.exec(pictureName)

    // console.log(this.$IsDay())

    switch (res[1]) {
      case 'partlycloudy':
        return this.$IsDay() ? 'partly-cloudy-day' : 'partly-cloudy-night'
      case 'cloudy':
        return 'cloudy'
      case 'sunny':
        return this.$IsDay() ? 'clear-day' : 'clear-night'
      case 'hail':
        return 'sleet'
      case 'snowy':
        return 'snow'
      case 'windy':
        return 'wind'
      case 'fog':
        return 'fog'
    }

    if (res[1] === 'pouring' || res[1] === 'rainy') {
      return 'rain'
    }

    console.error('weather needs match :' + res[1])
    return this.$IsDay() ? 'clear-day' : 'clear-night'
  }

  function labelCompare (a, b) {
    if (a.label < b.label) {
      return -1
    }
    if (a.label > b.label) {
      return 1
    }
    return 0
  }
  Vue.prototype.$sleep = async function (ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  function componentToHex (c) {
    var hex = c.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }

  Vue.prototype.$rgbToHex = function (rgbColor) {
    var color = '#FFFFFF'
    if (rgbColor) {
      color = '#' + componentToHex(rgbColor[0]) + componentToHex(rgbColor[1]) + componentToHex(rgbColor[2])
    }

    return color
  }
}
