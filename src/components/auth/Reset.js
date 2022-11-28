import {
  AccountCircle,
  Password,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material'
import {
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { resetPassword } from '../../api/auth'
import { setSnackbar } from '../../contexts/actions/feedback-actions'
import { setUser } from '../../contexts/actions/user-actions'
import Fields from '../inputs/Fields'

export default function Reset({
  steps,
  setSelectedStep,
  dispatchUser,
  dispatchFeedback,
}) {
  const [values, setValues] = useState({
    password: '',
    confirmation: '',
  })
  const [errors, setErrors] = useState({})
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const password = {
    helperText:
      'your password must be at least eight characters and include one uppercase letter, one number, and one special character',
    placeholder: 'Password',
    type: visible ? 'text' : 'password',
    startAdornment: <Password />,
    fullWidth: true,
    endAdornment: (
      <IconButton onClick={() => setVisible(!visible)}>
        {visible ? <Visibility /> : <VisibilityOff />}
      </IconButton>
    ),
  }
  const navigator = useNavigate()

  const fields = {
    password,
    confirmation: { ...password, placeholder: 'Confirm Password' },
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    const userId = params.get('id')

    try {
      const res = await resetPassword(token, userId, values.password)
      if (res.status === 200) {
        setSuccess(true)
        dispatchFeedback(
          setSnackbar({
            status: 'success',
            message: 'Password reset successfully.',
          }),
        )
      }
    } catch (error) {
      const { message } = error.response.data
      dispatchFeedback(
        setSnackbar({
          status: 'error',
          message,
        }),
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!success) return

    const timer = setTimeout(() => {
      navigator(window.location.pathname, { replace: true })
      console.log(window.location.pathname)
      setSelectedStep(steps.findIndex((step) => step.label === 'Login'))
    }, 6000)

    return () => clearInterval(timer)
  }, [success])

  const disabled =
    Object.keys(errors).some((error) => errors[error] === true) ||
    Object.keys(errors).length !== Object.keys(values).length ||
    values.password !== values.confirmation

  return (
    <>
      <Grid item>
        <Typography variant="button" gutterBottom>
          Account Recovery
        </Typography>
        <Typography variant="h4">Create new password</Typography>
        <Typography
          variant="body1"
          sx={(theme) => ({ color: theme.palette.grey[600] })}
        >
          Enter new password and you are back on track.
        </Typography>
      </Grid>
      <Grid item>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={5} direction="column">
            <Fields
              fields={fields}
              errors={errors}
              setErrors={setErrors}
              values={values}
              setValues={setValues}
            />
            <Grid item container justifyContent={'flex-end'}>
              <Button
                type="submit"
                variant="contained"
                disableElevation
                color="primary"
                disabled={loading || disabled}
                startIcon={loading ? <CircularProgress size={16} /> : undefined}
              >
                reset password
              </Button>
            </Grid>
          </Grid>
        </form>
      </Grid>
    </>
  )
}
