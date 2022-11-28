import { SET_THEME_MODE } from './action-types'

export const setThemeMode = (mode) => ({
  type: SET_THEME_MODE,
  payload: { mode },
})
