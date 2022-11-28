import {
  Button,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import { useEffect, useRef, useState } from 'react'
import { resendEmailVerificationToken, verifyEmail } from '../../api/auth'
import { setSnackbar } from '../../contexts/actions/feedback-actions'
import { setUser } from '../../contexts/actions/user-actions'
import Fields from '../inputs/Fields'

export default function EmailVerification({
  user,
  dispatchUser,
  dispatchFeedback,
}) {
  const [values, setValues] = useState({
    otp: '',
  })
  const [loading, setLoading] = useState(false)
  const [fields, setFields] = useState({
    otp: {
      type: 'otp',
      maxLength: 6,
    },
  })
  const [resendTimer, setResendTimer] = useState(0)
  const timer = useRef(null)

  const handleResendOTP = async () => {
    try {
      setLoading(true)
      setValues({ otp: '' })
      const res = await resendEmailVerificationToken()
      if (res.status === 200) {
        dispatchFeedback(
          setSnackbar({
            status: 'success',
            message: 'Email verification OTP has been sent successfully',
          }),
        )
        setResendTimer(30)
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
    if (resendTimer > 0 && !timer.current) {
      const interval = 0.5
      timer.current = setInterval(() => {
        setResendTimer((prevTimer) => {
          if (prevTimer - interval === 0) clearInterval(timer.current)
          return prevTimer - interval
        })
      }, interval * 1000)
    }
  }, [resendTimer])

  useEffect(() => {
    const handleSubmit = async () => {
      try {
        setLoading(true)
        setFields({
          ...fields,
          otp: {
            ...fields.otp,
            disabled: true,
          },
        })

        const res = await verifyEmail(values.otp, user.id)
        if (res.status === 200) {
          dispatchUser(
            setUser({
              ...res.data.user,
              jwt: res.data.jwt,
            }),
          )
        }
        dispatchFeedback(
          setSnackbar({
            status: 'success',
            message: 'Email has been verified successfully.',
          }),
        )
      } catch (error) {
        const { message } = error.response.data
        setFields({
          ...fields,
          otp: {
            ...fields.otp,
            disabled: false,
          },
        })
        dispatchFeedback(setSnackbar({ status: 'error', message }))
      } finally {
        setLoading(false)
      }
    }

    if (values.otp.length === fields.otp.maxLength) {
      handleSubmit()
    }
  }, [values])

  return (
    <>
      <Grid item>
        <Typography variant="button" gutterBottom>
          verification
        </Typography>
        <Typography variant="h4">Verify your email address</Typography>
        <Typography
          variant="body1"
          sx={(theme) => ({ color: theme.palette.grey[600] })}
        >
          Just one step away from completing sign up process.
        </Typography>
      </Grid>
      <Grid item>
        <Fields values={values} setValues={setValues} fields={fields} />
      </Grid>
      <Box height={10} />
      <Grid item container justifyContent={loading ? 'center' : 'flex-start'}>
        {loading ? (
          <CircularProgress size={30} />
        ) : (
          <Stack
            direction={'row'}
            alignItems="center"
            spacing={1}
            sx={{ height: 30 }}
          >
            <Button
              size="small"
              disabled={resendTimer > 0}
              onClick={handleResendOTP}
            >
              Resend verification OTP
            </Button>
            <CircularProgress
              size={20}
              value={(resendTimer / 30) * 100}
              variant="determinate"
            />
          </Stack>
        )}
      </Grid>
    </>
  )
}
