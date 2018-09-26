export const auth = (state, toAdd) => {
  state.auth = toAdd
}
export const gistToken = (state, toAdd) => {
  state.config.gistToken = toAdd
}

export const saveToGist = (state, toAdd) => {
  state.config.saveToGist = toAdd
}
export const gistUser = (state, toAdd) => {
  state.config.gistUser = toAdd
}

export const gistPassword = (state, toAdd) => {
  state.config.gistPassword = toAdd
}
