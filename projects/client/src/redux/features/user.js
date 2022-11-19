const userActionTypes = {
  SET_CURRENT_USER: "user",
}

const selecCurrentUser = (state) => state.user.currentUser

const USER_INITIAL_STATE = {
  currentUser: null,
}

const userReducer = (state = USER_INITIAL_STATE, action = {}) => {
  const { type, payload } = action

  switch (type) {
    case userActionTypes.SET_CURRENT_USER:
      return { ...state, currentUser: payload }
    default:
      return state
  }
}
const createAction = (type, payload) => ({ type, payload })

export const setCurrentUser = (user) =>
  createAction(userActionTypes.SET_CURRENT_USER, user)
