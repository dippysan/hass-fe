
export async function someAction ({ commit, state }, entities) {
  // console.log('action', entities)
//   setTimeout((entities) => {
//     commit('setEntities', entities)
//   })

  commit('setEntities', entities)
}
