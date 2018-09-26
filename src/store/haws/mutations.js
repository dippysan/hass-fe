export const setEvent = (state, event) => {
  if (event.event_type === 'state_changed') {
    let type = event.data.entity_id.substring(0, event.data.entity_id.indexOf('.'))
    console.log('state_changed')
    console.log('event.data.new_state.state ' + event.data.entity_id, event.data.new_state.state)
    switch (type) {
      case 'light':
        var objIndex = state.lights.findIndex(a => a.entity_id === event.data.entity_id)
        if (objIndex !== -1) {
          state.lights[objIndex].state = event.data.new_state.state
          state.lights[objIndex].attributes = event.data.new_state.attributes
          state.lights.splice(objIndex, 1, state.lights[objIndex])
        //  console.log('updating light ' + event.data.entity_id + ' to ' + event.data.new_state.state)
        }
        break
      case 'switch':
        objIndex = state.switches.findIndex(a => a.entity_id === event.data.entity_id)
        if (objIndex !== -1) {
          state.switches[objIndex].state = event.data.new_state.state
          state.switches[objIndex].attributes = event.data.new_state.attributes
          state.switches.splice(objIndex, 1, state.switches[objIndex])
          //    console.log('updating switches ' + event.data.entity_id + ' to ' + event.data.new_state.state)
        }
        break
      case 'group':
        objIndex = state.groups.findIndex(a => a.entity_id === event.data.entity_id)
        if (objIndex !== -1) {
          state.groups[objIndex].state = event.data.new_state.state
          state.groups[objIndex].attributes = event.data.new_state.attributes
          state.groups.splice(objIndex, 1, state.groups[objIndex])
        //  console.log('updating groups ' + event.data.entity_id + ' to ' + event.data.new_state.state)
        }
        break
      case 'climate':
        objIndex = state.climates.findIndex(a => a.entity_id === event.data.entity_id)
        if (objIndex !== -1) {
          state.climates[objIndex].state = event.data.new_state.state
          state.climates[objIndex].attributes = event.data.new_state.attributes
          state.climates.splice(objIndex, 1, state.climates[objIndex])
        //  console.log('updating groups ' + event.data.entity_id + ' to ' + event.data.new_state.state)
        }
        break
      case 'cover':
        objIndex = state.covers.findIndex(a => a.entity_id === event.data.entity_id)
        if (objIndex !== -1) {
          state.covers[objIndex].state = event.data.new_state.state
          state.covers[objIndex].attributes = event.data.new_state.attributes
          state.covers.splice(objIndex, 1, state.covers[objIndex])
        //  console.log('updating groups ' + event.data.entity_id + ' to ' + event.data.new_state.state)
        }
        break
      case 'camera':
        objIndex = state.cameras.findIndex(a => a.entity_id === event.data.entity_id)
        if (objIndex !== -1) {
          state.cameras[objIndex].state = event.data.new_state.state
          state.cameras[objIndex].attributes = event.data.new_state.attributes
          state.cameras.splice(objIndex, 1, state.cameras[objIndex])
        //  console.log('updating groups ' + event.data.entity_id + ' to ' + event.data.new_state.state)
        }
        break

      case 'vacuum':
        objIndex = state.vacuums.findIndex(a => a.entity_id === event.data.entity_id)
        if (objIndex !== -1) {
          state.vacuums[objIndex].state = event.data.new_state.state
          state.vacuums[objIndex].attributes = event.data.new_state.attributes
          state.vacuums.splice(objIndex, 1, state.vacuums[objIndex])
        //  console.log('updating groups ' + event.data.entity_id + ' to ' + event.data.new_state.state)
        }
        break

      case 'sensor':
        objIndex = state.sensors.findIndex(a => a.entity_id === event.data.entity_id)
        if (objIndex !== -1) {
          state.sensors[objIndex].state = event.data.new_state.state
          state.sensors[objIndex].attributes = event.data.new_state.attributes
          state.sensors.splice(objIndex, 1, state.sensors[objIndex])
        //  console.log('updating groups ' + event.data.entity_id + ' to ' + event.data.new_state.state)
        }
        break
    }
  }
}

export const setEntities = (state, entities) => {
  state.entities = {}
  for (var index in entities) {
    var entity = entities[index]

    let type = entity.entity_id.substring(0, entity.entity_id.indexOf('.'))
    if (state.entities[type] === undefined) {
      state.entities[type] = []
    }
    state.entities[type].push(entity)
    switch (type) {
      case 'switch':
        if (state.switches && state.switches.findIndex(a => a.entity_id === entity.entity_id) !== -1) {
          let objIndex = state.switches.findIndex(a => a.entity_id === entity.entity_id)
          if (JSON.stringify(state.switches[objIndex]) !== JSON.stringify(entity)) {
            state.switches.splice(objIndex, 1, entity)
          //  console.log('updating ' + type + ' ' + entity.entity_id + ' to ' + entity.state)
          }
        } else {
          state.switches.push(entity)
        }
        break
      case 'light':
        if (state.lights && state.lights.findIndex(a => a.entity_id === entity.entity_id) !== -1) {
          let objIndex = state.lights.findIndex(a => a.entity_id === entity.entity_id)
          if (JSON.stringify(state.lights[objIndex]) !== JSON.stringify(entity)) {
            state.lights.splice(objIndex, 1, entity)
            //   console.log('updating lights ' + entity.entity_id + ' to ' + entity.state)
          }
        } else {
          state.lights.push(entity)
        }
        break

      case 'group':
        if (state.groups && state.groups.findIndex(a => a.entity_id === entity.entity_id) !== -1) {
          let objIndex = state.groups.findIndex(a => a.entity_id === entity.entity_id)
          if (JSON.stringify(state.groups[objIndex]) !== JSON.stringify(entity)) {
            state.groups.splice(objIndex, 1, entity)
            //   console.log('updating lights ' + entity.entity_id + ' to ' + entity.state)
          }
        } else {
          state.groups.push(entity)
        }
        break
      case 'hassfe_config':
        if (state.configs && state.configs.findIndex(a => a.entity_id === entity.entity_id) !== -1) {
          let objIndex = state.configs.findIndex(a => a.entity_id === entity.entity_id)
          if (JSON.stringify(state.configs[objIndex]) !== JSON.stringify(entity)) {
            state.configs.splice(objIndex, 1, entity)
          //  console.log('updating lights ' + entity.entity_id + ' to ' + entity.state)
          }
        } else {
          state.configs.push(entity)
        }
        break
      case 'climate':
        if (state.climates && state.climates.findIndex(a => a.entity_id === entity.entity_id) !== -1) {
          let objIndex = state.climates.findIndex(a => a.entity_id === entity.entity_id)
          if (JSON.stringify(state.climates[objIndex]) !== JSON.stringify(entity)) {
            state.climates.splice(objIndex, 1, entity)
          //  console.log('updating lights ' + entity.entity_id + ' to ' + entity.state)
          }
        } else {
          state.climates.push(entity)
        }
        break
      case 'cover':
        if (state.covers && state.covers.findIndex(a => a.entity_id === entity.entity_id) !== -1) {
          let objIndex = state.covers.findIndex(a => a.entity_id === entity.entity_id)
          if (JSON.stringify(state.covers[objIndex]) !== JSON.stringify(entity)) {
            state.covers.splice(objIndex, 1, entity)
            //   console.log('updating lights ' + entity.entity_id + ' to ' + entity.state)
          }
        } else {
          state.covers.push(entity)
        }
        break
      case 'camera':
        if (state.cameras && state.cameras.findIndex(a => a.entity_id === entity.entity_id) !== -1) {
          let objIndex = state.cameras.findIndex(a => a.entity_id === entity.entity_id)
          if (JSON.stringify(state.cameras[objIndex]) !== JSON.stringify(entity)) {
            state.cameras.splice(objIndex, 1, entity)
            // console.log('updating lights ' + entity.entity_id + ' to ' + entity.state)
          }
        } else {
          state.cameras.push(entity)
        }
        break
      case 'vacuum':
        if (state.vacuums && state.vacuums.findIndex(a => a.entity_id === entity.entity_id) !== -1) {
          let objIndex = state.vacuums.findIndex(a => a.entity_id === entity.entity_id)
          if (JSON.stringify(state.vacuums[objIndex]) !== JSON.stringify(entity)) {
            state.vacuums.splice(objIndex, 1, entity)
            // console.log('updating lights ' + entity.entity_id + ' to ' + entity.state)
          }
        } else {
          state.vacuums.push(entity)
        }
        break
      case 'sensor':
        if (state.sensors && state.sensors.findIndex(a => a.entity_id === entity.entity_id) !== -1) {
          let objIndex = state.sensors.findIndex(a => a.entity_id === entity.entity_id)
          if (JSON.stringify(state.sensors[objIndex]) !== JSON.stringify(entity)) {
            state.sensors.splice(objIndex, 1, entity)
            // console.log('updating lights ' + entity.entity_id + ' to ' + entity.state)
          }
        } else {
          state.sensors.push(entity)
        }
        break
    }
  }
}

export const configLoaded = (state, toAdd) => {
  state.configLoaded = toAdd
}
export const loggedIn = (state, toAdd) => {
  state.loggedIn = toAdd
}

export const loggingIn = (state, toAdd) => {
  state.loggingIn = toAdd
}

export const currentCarouselSlide = (state, toAdd) => {
  state.currentCarouselSlide = toAdd
}
export const dialogOpen = (state, toAdd) => {
  state.dialogOpen = toAdd
}
