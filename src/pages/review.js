import { useTheme } from '@emotion/react'
import { Delete, Edit, KeyboardArrowUp, MovieSharp } from '@mui/icons-material'
import {
  Button,
  CardActionArea,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Fab,
  Fade,
  Grid,
  IconButton,
  Rating,
  Stack,
  TextField,
  Typography,
  useScrollTrigger,
} from '@mui/material'
import { Box } from '@mui/system'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import TextTruncate from 'react-text-truncate'
import { deleteReview, getMovieReviews } from '../api/movie'
import ReviewDialog from '../components/movie/ReviewDialog'
import Header from '../components/ui/header'
import { FeedbackContext } from '../contexts'
import { setSnackbar } from '../contexts/actions/feedback-actions'

function ScrollTop({ children, window }) {
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100,
  })

  const handleClick = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector(
      '#back-to-top-anchor',
    )

    if (anchor) {
      anchor.scrollIntoView({ block: 'start', behavior: 'smooth' })
    }
  }

  return (
    <Fade in={trigger}>
      <Box onClick={handleClick} sx={{ position: 'sticky', bottom: 30 }}>
        {children}
      </Box>
    </Fade>
  )
}

export default function ReviewPage({ user, dispatchUser }) {
  const [movie, setMovie] = useState()
  const [loading, setLoading] = useState(true)
  const [myReview, setMyReview] = useState({
    rating: 0,
    content: '',
  })
  const myReviewRef = useRef(null)
  const { id } = useParams()

  useEffect(() => {
    const fetchReviews = async (id) => {
      setLoading(true)
      try {
        const res = await getMovieReviews(id)
        if (res.status === 200) {
          setMovie(res.data)
        }
      } catch (error) {
      } finally {
        setLoading(false)
      }
    }

    if (!!id) {
      fetchReviews(id)
    }
  }, [id])

  useEffect(() => {
    if (!!movie?.reviews) {
      if (user.username !== 'Guest') {
        const review = movie.reviews.find(
          (review) => review.owner.id === user.id,
        )
        if (!!review) {
          const { rating, content } = review
          setMyReview({ rating, content })
        } else {
          setMyReview({ rating: 0, content: '' })
        }
      }
    }
  }, [movie])

  return (
    <>
      <Header user={user} dispatchUser={dispatchUser} />
      {!loading ? (
        <Grid container justifyContent={'space-around'} id="back-to-top-anchor">
          <Grid item md={7}>
            <Stack spacing={3}>
              <Stack
                sx={{
                  position: 'sticky',
                  top: (theme) => theme.mixins.toolbar.minHeight,
                  backgroundColor: (theme) => theme.palette.background.paper,
                  zIndex: (theme) => theme.zIndex.appBar - 1,
                }}
              >
                <Box height={30} />
                <Grid container spacing={5}>
                  <Grid item>
                    <Stack>
                      <Typography
                        variant="h6"
                        color="textSecondary"
                        sx={{ fontWeight: 400 }}
                      >
                        Reviews for :
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        color={'textSecondary'}
                        sx={{ fontSize: '0.86rem' }}
                      >
                        Total : {movie.reviews.length}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid item>
                    <Stack direction="row" spacing={2}>
                      <Box
                        component={'img'}
                        sx={{ width: '10rem' }}
                        src={movie.poster.secure_url}
                      />
                      <Stack>
                        <Typography
                          variant="h5"
                          color="primary"
                          sx={{ fontWeight: 700 }}
                        >
                          {movie.title}
                        </Typography>
                        <Typography variant="body1" color="textSecondary">
                          {new Date(movie.releaseDate).getFullYear()}
                        </Typography>
                        {myReview.rating !== 0 ? (
                          <CardActionArea
                            onClick={() => {
                              if (!!myReviewRef.current) {
                                myReviewRef.current.scrollIntoView({
                                  behavior: 'smooth',
                                  block: 'start',
                                })
                              }
                            }}
                          >
                            <Grid container alignItems={'center'} spacing={1}>
                              <Grid item>
                                <Typography
                                  variant="subtitle1"
                                  color={(theme) =>
                                    theme.palette.action.disabled
                                  }
                                >
                                  Your rating
                                </Typography>
                              </Grid>
                              <Grid item sx={{ height: 26 }}>
                                <Rating
                                  value={myReview.rating / 2}
                                  precision={0.5}
                                  readOnly
                                  size="small"
                                />
                              </Grid>
                              <Grid item>
                                <Typography variant="body2" color="primary">
                                  {myReview.rating} / 10
                                </Typography>
                              </Grid>
                            </Grid>
                          </CardActionArea>
                        ) : (
                          <LeaveAReview
                            movie={movie}
                            user={user}
                            setMovie={setMovie}
                          />
                        )}
                      </Stack>
                    </Stack>
                  </Grid>
                </Grid>
                <Box height={20} />
                <Divider light />
              </Stack>
              <Stack spacing={3} divider={<Divider light />}>
                {movie.reviews.map((review) => (
                  <Review
                    key={review.id}
                    review={review}
                    user={user}
                    movie={movie}
                    setMovie={setMovie}
                    ref={review.owner.id === user.id ? myReviewRef : undefined}
                  />
                ))}
              </Stack>
              <Box height={30} />
            </Stack>
            <ScrollTop>
              <Grid container justifyContent={'flex-end'}>
                <Grid item>
                  <Fab size="small">
                    <KeyboardArrowUp />
                  </Fab>
                </Grid>
              </Grid>
            </ScrollTop>
          </Grid>
          <Grid item md={2}></Grid>
        </Grid>
      ) : null}
    </>
  )
}

function LeaveAReview({ movie, setMovie, user }) {
  const [rating, setRating] = useState({
    hover: -1,
    active: 0,
  })

  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)

  return (
    <>
      <Grid container alignItems={'center'} spacing={1}>
        <Grid item>
          <Typography
            variant="subtitle1"
            sx={{ fontSize: '0.88rem' }}
            color={(theme) => theme.palette.text.secondary}
          >
            Leave a review
          </Typography>
        </Grid>
        <Grid item sx={{ height: 26 }}>
          <Rating
            value={rating.active / 2}
            onChange={(event, newValue) => {
              setRating({ ...rating, active: newValue * 2 })
              if (!reviewDialogOpen) {
                setReviewDialogOpen(true)
              }
            }}
            onChangeActive={(event, newValue) => {
              setRating({ ...rating, hover: newValue * 2 })
            }}
            precision={0.5}
            size="small"
          />
        </Grid>
        <Grid item>
          <Typography variant="body2" color="primary">
            {rating.hover > 0
              ? `${rating.hover} / 10`
              : rating.active !== 0
              ? `${rating.active} / 10`
              : null}
          </Typography>
        </Grid>
      </Grid>
      <ReviewDialog
        id={movie.id}
        title={movie.title}
        user={user}
        setOpen={setReviewDialogOpen}
        open={reviewDialogOpen}
        review={{
          rating: rating.active,
          content: '',
        }}
        onSuccess={(data) => {
          setMovie({ ...movie, reviews: [...movie.reviews, data] })
        }}
      />
    </>
  )
}

const Review = React.forwardRef(({ movie, setMovie, review, user }, ref) => {
  const theme = useTheme()
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  return (
    <Stack spacing={1} ref={ref}>
      <Grid container alignItems={'center'} spacing={5}>
        <Grid item>
          <Grid container spacing={2}>
            <Grid item>
              <Rating value={review.rating / 2} precision={0.5} readOnly />
            </Grid>
            <Grid item>
              <Grid container alignItems={'center'} spacing={0.5}>
                <Grid item>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 500, fontSize: '1.2rem' }}
                  >
                    {parseInt(review.rating)}
                  </Typography>
                </Grid>
                <Grid item>/</Grid>
                <Grid item>
                  <Typography color="textSecondary">10</Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {review.owner.id === user.id ? (
          <>
            <Grid item>
              <Grid container spacing={2}>
                <Grid item>
                  <IconButton
                    sx={{
                      border: `1px solid ${theme.palette.action.selected}`,
                    }}
                    onClick={() => setReviewDialogOpen(true)}
                  >
                    <Edit />
                  </IconButton>
                </Grid>
                <Grid item>
                  <IconButton
                    sx={{
                      border: `1px solid ${theme.palette.action.selected}`,
                    }}
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    <Delete />
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
            <ReviewDialog
              id={movie.id}
              title={movie.title}
              user={user}
              setOpen={setReviewDialogOpen}
              open={reviewDialogOpen}
              review={review}
              onSuccess={(data) => {
                const mReview = movie.reviews.map((r) =>
                  r.id === data.id ? data : r,
                )
                setMovie({ ...movie, reviews: mReview })
              }}
            />
            <ReviewDeleteDialog
              movie={movie}
              review={review}
              open={deleteDialogOpen}
              setOpen={setDeleteDialogOpen}
              onSuccess={(data) => {
                const mReview = movie.reviews.filter((r) => r.id !== data.id)
                setMovie({ ...movie, reviews: mReview })
              }}
            />
          </>
        ) : null}
      </Grid>
      <Grid container>
        <Grid item>
          <Typography variant="body1" color={theme.palette.info.main}>
            {review.owner.name}
          </Typography>
        </Grid>
        <Grid item sx={{ mx: 1 }}>
          <Typography color={theme.palette.info.light}>&#8226;</Typography>
        </Grid>
        <Grid item>
          <Typography variant="caption" color="textSecondary">
            {new Date(review.createdAt).toLocaleDateString()}
          </Typography>
        </Grid>
      </Grid>
      <TrancatedText text={review.content} />
    </Stack>
  )
})

function ReviewDeleteDialog({ movie, review, open, setOpen, onSuccess }) {
  const [value, setValue] = useState('')
  const { feedback, dispatchFeedback } = useContext(FeedbackContext)

  const handleSubmit = async () => {
    try {
      const res = await deleteReview(movie.id, review.id)
      if (res.status === 200) {
        dispatchFeedback(
          setSnackbar({
            status: 'success',
            message: 'Review deleted successfully',
          }),
        )
        setOpen(false)
        if (typeof onSuccess === 'function') {
          onSuccess(res.data)
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
    }
  }

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Delete comfirmation !</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {`Are you sure, you want to delete the review. Type delete and then comfirm to delete the review permanently.`}
        </DialogContentText>
        <TextField
          fullWidth
          variant="standard"
          placeholder="delete"
          margin="dense"
          label="Text confirmation"
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={() => setOpen(false)} size="small">
          Cancel
        </Button>
        <Button
          variant="contained"
          disableElevation
          disabled={value !== 'delete'}
          size="small"
          onClick={handleSubmit}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  )
}

function TrancatedText({ text }) {
  const [open, setOpen] = useState(false)

  return (
    <Stack alignItems={'flex-start'} spacing={1}>
      <Typography
        variant="body1"
        sx={{
          lineHeight: '2rem',
          fontSize: '1rem',
          fontWeight: 300,
        }}
      >
        <TextTruncate
          line={open ? false : 5}
          element={'span'}
          text={text}
          textTruncateChild={
            <Button size="small" color="info" onClick={() => setOpen(true)}>
              Read more
            </Button>
          }
        />
      </Typography>
      {open ? (
        <Button size="small" color="info" onClick={() => setOpen(false)}>
          Read less
        </Button>
      ) : null}
    </Stack>
  )
}
