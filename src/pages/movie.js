import { Divider, Grid, Stack, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useContext, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getMovieDetails } from '../api/movie'
import Meta from '../components/movie/Meta'
import Player from '../components/movie/Player'
import RelatedMovies from '../components/movie/RelatedMovies'
import TopCast from '../components/movie/TopCast'
import Header from '../components/ui/header'
import { UserContext } from '../contexts'

export default function MoviePage({ user, dispatchUser }) {
  const [movie, setMovie] = useState(null)
  const [reviewOpen, setReviewOpen] = useState(false)
  const reviewContainerRef = useRef(null)
  const params = useParams()

  useEffect(() => {
    const fetchMovie = async (id) => {
      try {
        const res = await getMovieDetails(id)
        if (res.status === 200) {
          setMovie(res.data)
        }
      } catch (error) {}
    }
    if (params.id) {
      fetchMovie(params.id)
    }
  }, [params.id])

  useEffect(() => {
    if (!!reviewOpen) {
      reviewContainerRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }, [reviewOpen])

  return (
    <>
      <Header user={user} dispatchUser={dispatchUser} />
      <Grid container justifyContent={'space-evenly'}>
        <Grid item md={8}>
          {movie ? (
            <>
              <Stack spacing={2}>
                <Player movie={movie} />
                <Meta movie={movie} setReviewOpen={setReviewOpen} />
                <Box mt={2} />
                <Stack spacing={2}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 500 }}
                    color="primary"
                  >
                    Top Cast
                  </Typography>

                  <Divider light />
                  <TopCast cast={movie.cast} />
                </Stack>
              </Stack>
            </>
          ) : null}
        </Grid>
        <Grid item md={2}>
          <Stack spacing={2} sx={{ position: 'sticky', top: 86 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 500, fontSize: '1.1rem' }}
              color="textSecondary"
            >
              Related Movies
            </Typography>
            <RelatedMovies movieId={params.id} />
          </Stack>
        </Grid>
      </Grid>
      <Box height={60} />
    </>
  )
}
