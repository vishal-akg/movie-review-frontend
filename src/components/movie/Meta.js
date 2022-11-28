import { Button, Grid, Rating, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ReviewDialog from './ReviewDialog'

export default function Meta({ movie }) {
  const [reviewOpen, setReviewOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <>
      <Stack>
        <Grid
          container
          alignItems={'flex-start'}
          justifyContent="space-between"
        >
          <Grid item xs>
            <Stack spacing={1}>
              <Typography variant="h5" sx={{ fontWeight: 700 }} color="primary">
                {movie.title}
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{
                  lineHeight: '1.6rem',
                  fontSize: '0.9rem',
                  fontWeight: 400,
                }}
              >
                {movie.storyline}
              </Typography>
              <Stack>
                <Grid container alignItems={'center'}>
                  <Grid item>
                    <Typography variant="body2" color="textSecondary">
                      Director :-
                    </Typography>
                  </Grid>
                  &nbsp;
                  <Grid item>
                    <Link to={`/actors/${movie.director.id}`}>
                      <Typography
                        variant="button"
                        color="primary"
                        sx={{ fontSize: '0.8rem' }}
                      >
                        {movie.director.name}
                      </Typography>
                    </Link>
                  </Grid>
                </Grid>
                <Grid container alignItems={'center'}>
                  <Grid item>
                    <Typography variant="body2" color="textSecondary">
                      Writers :-
                    </Typography>
                  </Grid>
                  &nbsp;
                  <Grid item>
                    <Stack
                      direction="row"
                      divider={<>,&nbsp;</>}
                      alignItems="center"
                    >
                      {movie.writers.map((writer) => (
                        <Link to={`/actors/${writer.id}`} key={writer.id}>
                          <Typography
                            variant="button"
                            color="primary"
                            sx={{ fontSize: '0.8rem' }}
                          >
                            {writer.name}
                          </Typography>
                        </Link>
                      ))}
                    </Stack>
                  </Grid>
                </Grid>
                <Grid container alignItems={'center'}>
                  <Grid item>
                    <Typography variant="body2" color="textSecondary">
                      Star Cast :-
                    </Typography>
                  </Grid>
                  &nbsp;
                  <Grid item>
                    <Stack
                      direction="row"
                      divider={<>,&nbsp;</>}
                      alignItems="center"
                    >
                      {movie.cast
                        .filter((cast) => cast.lead)
                        .map((cast) => (
                          <Link
                            to={`/actors/${cast.actor.id}`}
                            key={cast.actor.id}
                          >
                            <Typography
                              variant="button"
                              color="primary"
                              sx={{ fontSize: '0.8rem' }}
                            >
                              {cast.actor.name}
                            </Typography>
                          </Link>
                        ))}
                    </Stack>
                  </Grid>
                </Grid>
                <Grid container alignItems={'center'}>
                  <Grid item>
                    <Typography variant="body2" color="textSecondary">
                      Language :-
                    </Typography>
                  </Grid>
                  &nbsp;
                  <Grid item>
                    <Typography
                      variant="button"
                      color="primary"
                      sx={{ fontSize: '0.8rem' }}
                    >
                      {movie.language.language}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container alignItems={'center'}>
                  <Grid item>
                    <Typography variant="body2" color="textSecondary">
                      Release Date :-
                    </Typography>
                  </Grid>
                  &nbsp;
                  <Grid item>
                    <Typography
                      variant="button"
                      color="primary"
                      sx={{ fontSize: '0.8rem' }}
                    >
                      {new Date(movie.releaseDate).toLocaleDateString()}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container alignItems={'center'}>
                  <Grid item>
                    <Typography variant="body2" color="textSecondary">
                      Genres :-
                    </Typography>
                  </Grid>
                  &nbsp;
                  <Grid item>
                    <Stack
                      direction="row"
                      divider={<>,&nbsp;</>}
                      alignItems="center"
                    >
                      {movie.genres.map((genre) => (
                        <Typography
                          variant="button"
                          color="primary"
                          key={genre}
                          sx={{ fontSize: '0.8rem' }}
                        >
                          {genre}
                        </Typography>
                      ))}
                    </Stack>
                  </Grid>
                </Grid>
                <Grid container alignItems={'center'}>
                  <Grid item>
                    <Typography variant="body2" color="textSecondary">
                      Type :-
                    </Typography>
                  </Grid>
                  &nbsp;
                  <Grid item>
                    <Typography
                      variant="button"
                      color="primary"
                      sx={{ fontSize: '0.8rem' }}
                    >
                      {movie.type}
                    </Typography>
                  </Grid>
                </Grid>
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={3}>
            <Stack alignItems={'flex-end'} spacing={0.5}>
              <Grid
                container
                alignItems="center"
                justifyContent={'flex-end'}
                spacing={1}
              >
                <Grid item sx={{ display: 'inline-flex' }}>
                  <Rating
                    value={movie.rating.figure / 2 || 0}
                    precision={0.1}
                    readOnly
                    size="small"
                  />
                </Grid>
                <Grid item>
                  <Typography
                    variant="body1"
                    color="primary"
                    sx={{ fontWeight: 700, fontSize: '1.0rem' }}
                  >
                    {parseFloat(movie.rating.figure).toFixed(1) || 8.1} / 10
                  </Typography>
                </Grid>
              </Grid>
              <Button
                size="small"
                sx={{ fontSize: '0.7rem', p: 0 }}
                onClick={() => {
                  navigate(`/movies/${movie.id}/reviews`, { state: { movie } })
                }}
              >
                {movie.rating.total || 0} Reviews
              </Button>
              <Button
                size="small"
                sx={{ fontSize: '0.7rem', p: 0 }}
                onClick={() => setReviewOpen(true)}
              >
                Leave a rating
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Stack>
      <ReviewDialog
        id={movie.id}
        title={movie.title}
        open={reviewOpen}
        setOpen={setReviewOpen}
      />
    </>
  )
}
