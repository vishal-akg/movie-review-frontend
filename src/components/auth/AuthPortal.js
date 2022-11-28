import { Grid } from '@mui/material'
import { Navigate } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import { FeedbackContext, UserContext } from '../../contexts'
import EmailVerification from './EmailVerification'
import Login from './Login'
import Reset from './Reset'
import SignUp from './SignUp'

export default function AuthPortal() {
  const { user, dispatchUser } = useContext(UserContext)
  const { feedback, dispatchFeedback } = useContext(FeedbackContext)
  const [selectedStep, setSelectedStep] = useState(
    user.jwt && !user.isVerified ? 3 : 0,
  )

  const steps = [
    { component: Login, label: 'Login' },
    { component: SignUp, label: 'Sign Up' },
    { component: Reset, label: 'Reset' },
    { component: EmailVerification, label: 'Email Verification' },
  ]

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    const userId = params.get('id')

    if (token) {
      setSelectedStep(steps.findIndex((step) => step.label === 'Reset'))
    }
  }, [])

  return (
    <>
      {user.jwt && user.isVerified ? <Navigate to="/" replace={true} /> : null}
      <Grid container direction={'column'} spacing={5}>
        {steps.map((Step, i) =>
          selectedStep === i ? (
            <Step.component
              steps={steps}
              setSelectedStep={setSelectedStep}
              key={Step.label}
              user={user}
              dispatchUser={dispatchUser}
              feedback={feedback}
              dispatchFeedback={dispatchFeedback}
            />
          ) : null,
        )}
      </Grid>
    </>
  )
}
