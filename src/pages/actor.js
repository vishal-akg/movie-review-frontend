import { useTheme } from '@emotion/react'
import {
  EmojiEvents,
  FeaturedPlayList,
  Leaderboard,
  Star,
} from '@mui/icons-material'
import {
  CardActionArea,
  Divider,
  Grid,
  Rating,
  Stack,
  Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Moment from 'react-moment'
import { getActorDetails } from '../api/actor'
import Header from '../components/ui/header'
import { setSnackbar } from '../contexts/actions/feedback-actions'

export default function ActorPage({
  user,
  dispatchUser,
  feedback,
  dispatchFeedback,
}) {
  const { id } = useParams()
  const [actor, setActor] = useState(null)
  const [loading, setLoading] = useState(false)
  const theme = useTheme()

  useEffect(() => {
    const fetchActor = async (id) => {
      setLoading(true)
      try {
        const res = await getActorDetails(id)
        if (res.status === 200) {
          setActor(res.data)
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

    if (!!id) {
      fetchActor(id)
    }
  }, [id])
  return (
    <>
      <Header user={user} dispatchUser={dispatchUser} />
      {!loading ? (
        !!actor ? (
          <Grid container justifyContent={'space-around'}>
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
                  <Grid container spacing={2}>
                    <Grid item>
                      <Box
                        component={'img'}
                        sx={{ width: '6rem' }}
                        src={actor.avatar.secure_url}
                      />
                    </Grid>
                    <Grid item xs>
                      <Stack
                        justifyContent={'space-between'}
                        sx={{ height: '100%' }}
                      >
                        <Box>
                          <Typography
                            variant="h5"
                            color="primary"
                            sx={{ fontWeight: 700 }}
                            gutterBottom
                          >
                            {actor.name}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            <Moment withTitle format={'Do MMMM YYYY'}>
                              {actor.birth}
                            </Moment>
                          </Typography>
                        </Box>
                        <Box>
                          <Grid
                            container
                            justifyContent={'space-between'}
                            alignItems="center"
                          >
                            <Grid item>
                              <Grid container spacing={3}>
                                <Grid item>
                                  <Grid
                                    container
                                    alignItems={'center'}
                                    spacing={0.5}
                                  >
                                    <Grid item>
                                      <Leaderboard fontSize="small" />
                                    </Grid>
                                    <Grid item>
                                      <Typography
                                        variant="body2"
                                        color="textSecondary"
                                      >
                                        Nominations:-
                                      </Typography>
                                    </Grid>
                                    <Grid item>
                                      <Typography
                                        variant="body1"
                                        color="primary"
                                        sx={{
                                          fontSize: '1.2rem',
                                          fontWeight: 600,
                                        }}
                                      >
                                        {actor.nominations}
                                      </Typography>
                                    </Grid>
                                  </Grid>
                                </Grid>
                                <Grid item>
                                  <Grid
                                    container
                                    alignItems={'center'}
                                    spacing={0.5}
                                  >
                                    <Grid item>
                                      <EmojiEvents fontSize="small" />
                                    </Grid>
                                    <Grid item>
                                      <Typography
                                        variant="body2"
                                        color="textSecondary"
                                      >
                                        Awards:-
                                      </Typography>
                                    </Grid>
                                    <Grid item>
                                      <Typography
                                        variant="body1"
                                        color="primary"
                                        sx={{
                                          fontSize: '1.2rem',
                                          fontWeight: 600,
                                        }}
                                      >
                                        {actor.awards}
                                      </Typography>
                                    </Grid>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>

                            <Grid item>
                              <Grid container spacing={1} alignItems={'center'}>
                                <Grid item>
                                  <Typography
                                    color="textSecondary"
                                    variant="body2"
                                  >
                                    Overall Rating:-
                                  </Typography>
                                </Grid>
                                <Grid item sx={{ display: 'flex' }}>
                                  <Rating
                                    value={8.1 / 2}
                                    readOnly
                                    size="small"
                                    precision={0.5}
                                  />
                                </Grid>
                                <Grid item>
                                  <Typography
                                    color="primary"
                                    sx={{
                                      fontSize: '1.2rem',
                                      fontWeight: 600,
                                    }}
                                  >
                                    8.1
                                  </Typography>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Box>
                      </Stack>
                    </Grid>
                  </Grid>
                  <Box height={20} />
                  <Divider light />
                </Stack>
                <Typography
                  variant={'body2'}
                  sx={{ lineHeight: '1.5rem' }}
                  color="textSecondary"
                >
                  {actor.biography}
                </Typography>
                <Stack spacing={2}>
                  <Typography variant="h6">Filmography</Typography>
                  <Divider light />
                  {actor.acted_in.length > 0 ? (
                    <Stack>
                      <Typography
                        variant="body1"
                        gutterBottom
                        sx={{ fontSize: '1.1rem', fontWeight: 500 }}
                      >
                        Actor
                      </Typography>
                      <Grid container direction="column">
                        {actor.acted_in.map((movie) => (
                          <Grid item key={movie.id} sx={{ mb: 2 }}>
                            <MovieCard movie={movie} actor={actor} />
                          </Grid>
                        ))}
                      </Grid>
                    </Stack>
                  ) : null}
                  {actor.directed.length > 0 ? (
                    <Stack>
                      <Typography
                        variant="body1"
                        gutterBottom
                        sx={{ fontSize: '1.1rem', fontWeight: 500 }}
                      >
                        Director
                      </Typography>
                      <Grid container direction="column">
                        {actor.directed.map((movie) => (
                          <Grid item key={movie.id} sx={{ mb: 2 }}>
                            <MovieCard movie={movie} actor={actor} noRole />
                          </Grid>
                        ))}
                      </Grid>
                    </Stack>
                  ) : null}
                  {actor.written.length > 0 ? (
                    <Stack>
                      <Typography
                        variant="body1"
                        gutterBottom
                        sx={{ fontSize: '1.1rem', fontWeight: 500 }}
                      >
                        Writer
                      </Typography>
                      <Grid container direction="column">
                        {actor.written.map((movie) => (
                          <Grid item key={movie.id} sx={{ mb: 2 }}>
                            <MovieCard movie={movie} actor={actor} noRole />
                          </Grid>
                        ))}
                      </Grid>
                    </Stack>
                  ) : null}
                </Stack>
              </Stack>
            </Grid>
            <Grid item md={2}></Grid>
          </Grid>
        ) : null
      ) : null}
    </>
  )
}

function MovieCard({ movie, actor, noRole }) {
  const theme = useTheme()
  return (
    <Link to={`/movies/${movie.id}`}>
      <Grid container spacing={2}>
        <Grid item sm={2}>
          <Box
            component="img"
            sx={{ width: '100%' }}
            src={movie.poster.secure_url}
          />
        </Grid>
        <Grid item>
          <Stack>
            <Box>
              <Grid container spacing={1}>
                <Grid item>
                  <Typography variant="body1" color="textPrimary" gutterBottom>
                    {movie.title}
                  </Typography>
                </Grid>
                {noRole ? null : (
                  <Grid item>
                    <Typography color="textSecondary" variant="body2">
                      ( Role as{' '}
                      <Typography
                        component="span"
                        sx={{ textTransform: 'capitalize' }}
                      >
                        {
                          movie.cast.find((cast) => cast.actor === actor.id)
                            ?.role
                        }
                      </Typography>{' '}
                      )
                    </Typography>
                  </Grid>
                )}
              </Grid>

              <Grid container spacing={1}>
                <Grid item>
                  <Typography variant="body2" color="textSecondary">
                    Released on:-
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="body2" color="textSecondary">
                    <Moment withTitle format={'Do MMMM YYYY'}>
                      {movie.releaseDate}
                    </Moment>
                  </Typography>
                </Grid>
              </Grid>
            </Box>
            <Box>
              <Grid container>
                <Grid item>
                  <Grid container spacing={0.5}>
                    <Grid item>
                      <Star fontSize="small" color="warning" />
                    </Grid>
                    <Grid item>
                      <Typography
                        variant="body2"
                        sx={{ color: theme.palette.warning.main }}
                      >
                        8.1
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item></Grid>
              </Grid>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </Link>
  )
}
