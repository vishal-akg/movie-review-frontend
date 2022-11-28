import {
  Avatar,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Rating,
  Stack,
  Typography,
} from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { postReview, updateReview } from '../../api/movie'
import { FeedbackContext, UserContext } from '../../contexts'
import { setSnackbar } from '../../contexts/actions/feedback-actions'
import Fields from '../inputs/Fields'

export default function ReviewDialog({
  id,
  title,
  open,
  setOpen,
  onSuccess,
  review,
}) {
  const { user, dispatchUser } = useContext(UserContext)
  const { feedback, dispatchFeedback } = useContext(FeedbackContext)
  const [values, setValues] = useState({
    rating: 0.0,
    content: '',
  })
  const [errors, setErrors] = useState({ content: false })
  const [hover, setHover] = useState(-1.0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!!review) {
      const { rating, content } = review
      setValues({ rating, content })
      setErrors({ rating: !(rating > 0 && rating <= 10), content: false })
    }
  }, [review])

  const disabled =
    Object.keys(errors).some((error) => errors[error] === true) ||
    Object.keys(errors).length !== Object.keys(values).length

  const handleSubmit = async () => {
    try {
      if (!!review?.id) {
        const res = await updateReview(id, review.id, values)
        if (res.status === 200) {
          dispatchFeedback(
            setSnackbar({
              status: 'success',
              message: 'Review updated successfully.',
            }),
          )
          setValues({ rating: 0, content: '' })
          setErrors({ content: false })
          setOpen(false)
          if (typeof onSuccess === 'function') {
            onSuccess(res.data)
          }
        }
      } else {
        const res = await postReview(id, values)
        if (res.status === 201) {
          dispatchFeedback(
            setSnackbar({
              status: 'success',
              message: 'Review posted successfully.',
            }),
          )
          setValues({ rating: 0, content: '' })
          setErrors({ content: false })
          setOpen(false)
          if (typeof onSuccess === 'function') {
            onSuccess(res.data)
          }
        }
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

  return (
    <Dialog open={open} fullWidth maxWidth={'md'} keepMounted={false}>
      <DialogTitle color="primary">{title}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item>
            <Avatar alt={user.name || 'P'} src={'broken-imag.jpg'} />
          </Grid>
          <Grid item xs>
            <Stack spacing={5}>
              <Grid container justifyContent={'flex-start'} spacing={2}>
                <Grid item>
                  <Rating
                    size="large"
                    precision={0.5}
                    value={values.rating / 2}
                    onChange={(event, newValue) => {
                      setValues({
                        ...values,
                        rating: parseInt(newValue * 2),
                      })
                      setErrors({
                        ...errors,
                        rating: !(newValue > 0 && newValue <= 10),
                      })
                    }}
                    onChangeActive={(event, newValue) => {
                      setHover(parseInt(newValue * 2))
                    }}
                  />
                </Grid>
                <Grid item>
                  <Typography variant="h6" color="primary">
                    {hover > 0
                      ? hover
                      : values.rating !== 0
                      ? values.rating
                      : null}
                  </Typography>
                </Grid>
              </Grid>

              <Fields
                fields={{
                  content: {
                    multiline: true,
                    minRows: 3,
                    maxRows: 15,
                    placeholder: 'What you think about this movie...',
                    label: 'Your opinion',
                    variant: 'outlined',
                    fullWidth: true,
                  },
                }}
                errors={errors}
                setErrors={setErrors}
                values={values}
                setValues={setValues}
              />
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
        <Button
          disabled={disabled || loading}
          onClick={handleSubmit}
          startIcon={loading ? <CircularProgress size={16} /> : undefined}
        >
          {!!review?.id ? 'Update Review' : 'Add Review'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
