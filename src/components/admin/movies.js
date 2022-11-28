import { Delete, Edit, OpenInNew } from '@mui/icons-material'
import {
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  Grow,
  IconButton,
  Paper,
  Rating,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import { useEffect, useState } from 'react'
import { allMovies, deleteMovie } from '../../api/movie'
import { setSnackbar } from '../../contexts/actions/feedback-actions'

export default function Movies({
  setEditingMovie,
  feedback,
  dispatchFeedback,
}) {
  const [loading, setLoading] = useState(false)
  const [movies, setMovies] = useState([])
  const [count, setCount] = useState(0)

  const fetchMovies = async (skip, limit) => {
    try {
      setLoading(true)
      const res = await allMovies(skip, limit)
      if (res.status === 200) {
        const { movies: resMovies, count } = res.data
        setMovies(resMovies)
        setCount(count)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMovies()
  }, [])

  return (
    <Box sx={{ p: 6 }}>
      <Stack spacing={3}>
        <Grid container spacing={5}>
          {movies.map((movie) => (
            <Grid item key={movie.id} xs={12} md={6}>
              <MovieCard
                movie={movie}
                setEditingMovie={setEditingMovie}
                dispatchFeedback={dispatchFeedback}
              />
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Box>
  )
}

function MovieCard({ movie, setEditingMovie, dispatchFeedback }) {
  const [mouseIn, setMouseIn] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState({ open: false, input: '' })

  const confirmDisabled = deleteDialog.input !== 'delete permanently'
  const handleDeleteSubmit = async () => {
    try {
      const res = await deleteMovie(movie.id)
      if (res.status === 200) {
        setDeleteDialog({ open: false, input: '' })
        dispatchFeedback(
          setSnackbar({
            status: 'success',
            message: 'movie deleted successfully',
          }),
        )
      }
    } catch (error) {
      const { message } = error.response.data
      dispatchFeedback(setSnackbar({ status: 'error', message }))
    }
  }

  return (
    <>
      <Card
        variant="outlined"
        onMouseEnter={() => setMouseIn(true)}
        onMouseLeave={() => setMouseIn(false)}
      >
        <Grid container alignItems={'flex-start'}>
          <Grid
            item
            xs={5}
            sx={{
              aspectRatio: '16/9',
              overflow: 'hidden',
              backgroundColor: 'black',
            }}
          >
            <Box
              component="img"
              src={movie.poster.secure_url}
              sx={{ width: '100%' }}
            />
          </Grid>
          <Grid item xs sx={{ p: 2 }}>
            <Stack>
              <Typography
                variant="body1"
                sx={{ fontSize: '1.1rem', fontWeight: 500 }}
              >
                {movie.title}
              </Typography>
              <Stack>
                <Typography variant="body2">
                  <Stack
                    direction="row"
                    spacing={0.5}
                    divider={<Divider orientation="vertical" flexItem />}
                  >
                    {movie.genres.map((g) => (
                      <Typography variant="body2">{g}</Typography>
                    ))}
                  </Stack>
                </Typography>
              </Stack>
              <Rating
                defaultValue={3.5}
                precision={0.5}
                readOnly
                size="small"
              />
              <Stack
                direction="row"
                justifyContent={'space-between'}
                alignItems={'flex-end'}
              >
                <Typography variant="body2">{movie.status}</Typography>
                <Grow
                  in={mouseIn}
                  timeout={500}
                  style={{ transformOrigin: 'right' }}
                >
                  <Stack direction={'row'} justifyContent="flex-end">
                    <IconButton onClick={() => setEditingMovie(movie)}>
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() =>
                        setDeleteDialog({ ...deleteDialog, open: true })
                      }
                    >
                      <Delete />
                    </IconButton>
                    <IconButton>
                      <OpenInNew />
                    </IconButton>
                  </Stack>
                </Grow>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Card>
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ input: '', open: false })}
      >
        <DialogTitle>Delete comfirmation !</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {`Are you sure, you want to delete movie ${movie.title} from the database. Type delete permanently and then comfirm to delete the movie permanently.`}
          </DialogContentText>
          <TextField
            fullWidth
            variant="standard"
            placeholder="delete permanently"
            margin="dense"
            label="Text confirmation"
            autoFocus
            value={deleteDialog.input}
            onChange={(e) =>
              setDeleteDialog({ ...deleteDialog, input: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={() => setDeleteDialog({ input: '', open: false })}
            size="small"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            disableElevation
            disabled={confirmDisabled}
            size="small"
            onClick={handleDeleteSubmit}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
