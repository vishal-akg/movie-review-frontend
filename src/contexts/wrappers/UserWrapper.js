import { createContext, useEffect, useReducer } from 'react'
import userReducer from '../reducers/user-reducer'
import axios from '../../api/axios-instance'
import { setUser } from '../actions/user-actions'

export const UserContext = createContext()

export function UserWrapper({ children }) {
  const defaultUser = { username: 'Guest' }
  const storedUser = JSON.parse(localStorage.getItem('user'))
  const [user, dispatchUser] = useReducer(
    userReducer,
    storedUser || defaultUser,
  )

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await axios.get('/users/me', {
          headers: { Authorization: `Bearer ${storedUser.jwt}` },
        })

        if (res.status === 200) {
          axios.interceptors.request.use((config) => {
            config.headers['Authorization'] = `Bearer ${storedUser.jwt}`
            return config
          })
          dispatchUser(
            setUser({
              ...res.data,
              jwt: storedUser.jwt,
            }),
          )
        }
      } catch (error) {
        if (error.response.status === 401) {
          dispatchUser(setUser(defaultUser))
        }
      }
    }

    if (storedUser) {
      fetchMe()
    }
  }, [])

  return (
    <UserContext.Provider value={{ user, dispatchUser, defaultUser }}>
      {children}
    </UserContext.Provider>
  )
}
