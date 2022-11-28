import { SET_THEME_MODE } from '../actions/action-types'

export default function themeReducer(state, action) {
  const { mode } = action.payload

  switch (action.type) {
    case SET_THEME_MODE:
      localStorage.setItem('theme_mode', mode)
      return mode
    default:
      return state
  }
}
