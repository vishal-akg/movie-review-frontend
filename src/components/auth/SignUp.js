import {
  AlternateEmail,
  Password,
  PersonAdd,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material'
import {
  Badge,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Link,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { signup } from '../../api/auth'
import { setSnackbar } from '../../contexts/actions/feedback-actions'
import { setUser } from '../../contexts/actions/user-actions'
import Fields from '../inputs/Fields'

export default function SignUp({
  steps,
  setSelectedStep,
  dispatchUser,
  dispatchFeedback,
}) {
  const [values, setValues] = useState({
    email: '',
    password: '',
    name: '',
  })
  const [errors, setErrors] = useState({})
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  const fields = {
    name: {
      helperText: 'you must enter a name',
      placeholder: 'Name',
      fullWidth: true,
      startAdornment: <Badge />,
    },
    email: {
      helperText: 'Email is not valid',
      placeholder: 'Email',
      type: 'text',
      fullWidth: true,
      startAdornment: <AlternateEmail />,
    },
    password: {
      helperText:
        'your password must be at least eight characters and include one uppercase letter, one number, and one special character',
      placeholder: 'Password',
      type: visible ? 'text' : 'password',
      fullWidth: true,
      startAdornment: <Password />,
      endAdornment: (
        <IconButton onClick={() => setVisible(!visible)}>
          {visible ? <Visibility /> : <VisibilityOff />}
        </IconButton>
      ),
    },
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      const { name, email, password } = values
      const res = await signup(name, email, password)
      if (res.status === 201) {
        dispatchUser(
          setUser({
            ...res.data.user,
          }),
        )
        setSelectedStep(
          steps.findIndex((step) => step.label === 'Email Verification'),
        )
      }
    } catch (error) {
      const { message } = error.response.data
      dispatchFeedback(setSnackbar({ status: 'error', message }))
    } finally {
      setLoading(false)
    }
  }

  const disabled =
    Object.keys(errors).some((error) => errors[error] === true) ||
    Object.keys(errors).length !== Object.keys(values).length

  return (
    <>
      <Grid item>
        <Typography variant="button" gutterBottom>
          Signup
        </Typography>
        <Typography variant="h4">Create an account</Typography>
        <Typography
          variant="body1"
          sx={(theme) => ({ color: theme.palette.grey[600] })}
        >
          Fill out the form, to have your say.
        </Typography>
      </Grid>
      <Grid item>
        <form onSubmit={handleSubmit}>
          <Grid container direction="column" spacing={5}>
            <Fields
              fields={fields}
              errors={errors}
              setErrors={setErrors}
              values={values}
              setValues={setValues}
            />

            <Grid item container justifyContent={'space-between'}>
              <Grid item>
                <Link
                  underline="none"
                  onClick={(e) => {
                    const index = steps.findIndex(
                      (step) => step.label === 'Login',
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
                    Already have an account?
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
                    Login
                  </Typography>
                </Link>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  type="submit"
                  disabled={disabled || loading}
                  color="primary"
                  startIcon={
                    loading ? <CircularProgress size={16} /> : undefined
                  }
                  disableElevation
                >
                  sign up
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Grid>
    </>
  )
}
