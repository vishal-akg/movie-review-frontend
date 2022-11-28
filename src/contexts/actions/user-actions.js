import { SET_USER } from './action-types'

export const setUser = (user) => ({
  type: SET_USER,
  payload: { user },
})

export const logout = () => setUser({ username: 'Guest' })
