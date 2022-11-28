import { useEffect, useState } from 'react'
import {
  AlternateEmail,
  Password,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material'
import {
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Link,
  Stack,
  Typography,
} from '@mui/material'
import Fields from '../inputs/Fields'
import { forgotPassword, login } from '../../api/auth'
import { setUser } from '../../contexts/actions/user-actions'
import { setSnackbar } from '../../contexts/actions/feedback-actions'

export default function Login({
  steps,
  setSelectedStep,
  user,
  dispatchUser,
  dispatchFeedback,
}) {
  const [values, setValues] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState({})
  const [visible, setVisible] = useState(false)
  const [forget, setForget] = useState(false)
  const [loading, setLoading] = useState(false)

  const fields = {
    email: {
      helperText: 'Email is not valid',
      placeholder: 'Email',
      type: 'text',
      startAdornment: <AlternateEmail />,
      fullWidth: true,
    },
    password: {
      helperText:
        'your password must be at least eight characters and include one uppercase letter, one number, and one special character',
      placeholder: 'Password',
      fullWidth: true,
      type: visible ? 'text' : 'password',
      startAdornment: <Password />,
      endAdornment: (
        <IconButton onClick={() => setVisible(!visible)}>
          {visible ? <Visibility /> : <VisibilityOff />}
        </IconButton>
      ),
    },
  }

  useEffect(() => {
    if (forget) {
      setValues({ email: '' })
    } else {
      setValues({ email: '', password: '' })
    }
  }, [forget])

  const disabled =
    Object.keys(errors).some((error) => errors[error] === true) ||
    Object.keys(errors).length !== Object.keys(values).length

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await login(values.email, values.password)
      if (res.status === 200) {
        dispatchUser(
          setUser({
            ...res.data.user,
            jwt: res.data.jwt,
          }),
        )
      }
    } catch (error) {
      const { message } = error.response.data
      dispatchFeedback(setSnackbar({ status: 'error', message }))
    } finally {
      setLoading(false)
    }
  }

  const handleForgot = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await forgotPassword(values.email)
      if (res.status === 201) {
        dispatchFeedback(
          setSnackbar({ status: 'success', message: res.data.message }),
        )
      }
    } catch (error) {
      const { message } = error.response.data
      dispatchFeedback(setSnackbar({ status: 'error', message }))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Grid item>
        <Typography variant="button" gutterBottom>
          {forget ? 'Recover Account' : 'Login'}
        </Typography>
        <Typography variant="h4">
          {forget ? 'Forgot you password?' : 'Welcome back'}
        </Typography>
        <Typography
          variant="body1"
          sx={(theme) => ({ color: theme.palette.grey[600] })}
        >
          {forget
            ? 'Enter your email address, we will get you back on track.'
            : 'Login to leave a movie rating and review.'}
        </Typography>
      </Grid>
      <Grid item>
        <form onSubmit={forget ? handleForgot : handleLogin}>
          <Stack spacing={5}>
            <Fields
              fields={forget ? { email: fields.email } : fields}
              errors={errors}
              setErrors={setErrors}
              values={values}
              setValues={setValues}
            />
            <Grid item>
              <Grid container justifyContent={'space-between'}>
                <Grid item>
                  {forget ? (
                    <Button
                      variant="outlined"
                      onClick={(e) => setForget(false)}
                    >
                      Login
                    </Button>
                  ) : (
                    <Link underline="none" onClick={(e) => setForget(true)}>
                      <Typography
                        sx={(theme) => ({
                          color: theme.palette.grey[800],
                        })}
                        variant={'body2'}
                      >
                        Forgot your password?
                      </Typography>
                    </Link>
                  )}
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disableElevation
                    startIcon={
                      loading ? <CircularProgress size={16} /> : undefined
                    }
                    disabled={loading || disabled}
                  >
                    {forget ? 'send reset link' : 'login'}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Stack>
        </form>
      </Grid>
      {!forget ? (
        <Grid item container justifyContent={`center`}>
          <Grid item>
            <Link
              underline="none"
              onClick={(e) => {
                const index = steps.findIndex(
                  (step) => step.label === 'Sign Up',
                )
                setSelectedStep(index)
              }}
            >
              <Typography
                sx={(theme) => ({
                  textTransform: 'none',
                  color: theme.palette.grey[800],
                })}
                display={'inline'}
                variant={'body2'}
              >
                Don't have an account?
              </Typography>
              &nbsp;
              <Typography
                sx={(theme) => ({
                  textTransform: 'none',
                  color: theme.palette.primary.main,
                })}
                display={'inline'}
                variant={'body2'}
              >
                Sign up
              </Typography>
            </Link>
          </Grid>
        </Grid>
      ) : null}
    </>
  )
}
