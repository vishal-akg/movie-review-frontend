import { SET_SNACKBAR } from '../actions/action-types'

export default function feedbackReducer(state, action) {
  const { status, message, open } = action.payload

  switch (action.type) {
    case SET_SNACKBAR:
      return { open: true, status, message }
    default:
      return state
  }
}
