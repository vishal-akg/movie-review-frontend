import { useTheme } from '@emotion/react'
import { Star } from '@mui/icons-material'
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Paper,
  Rating,
  Stack,
  Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getRelatedMovies } from '../../api/movie'

export default function RelatedMovies({ movieId }) {
  const [movies, setMovies] = useState([])
  const navigate = useNavigate()
  const theme = useTheme()

  useEffect(() => {
    const fetchMovies = async (id) => {
      try {
        const res = await getRelatedMovies(id)
        if (res.status === 200) {
          setMovies(res.data)
        }
      } catch (error) {}
    }

    if (!!movieId) {
      fetchMovies(movieId)
    }
  }, [movieId])

  return (
    <Stack spacing={3}>
      {movies.map((movie) => {
        return (
          <Card key={movie._id} square variant={'outlined'}>
            <CardActionArea onClick={() => navigate(`/movies/${movie.id}`)}>
              <Stack>
                <CardMedia src={movie.poster.secure_url} component="img" />
                <Box sx={{ p: 1 }}>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ fontWeight: 500 }}
                  >
                    {movie.title}
                  </Typography>
                  <Grid container alignItems="center" spacing={1}>
                    <Grid item sx={{ display: 'inline-flex' }}>
                      <Star fontSize="small" color="primary" />
                    </Grid>
                    <Grid item>
                      <Typography
                        variant="body1"
                        color="textSecondary"
                        sx={{ fontWeight: 500, fontSize: '0.8rem' }}
                      >
                        {parseFloat(movie.rating.figure).toFixed(1) || 0.0}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Stack>
            </CardActionArea>
          </Card>
        )
      })}
    </Stack>
  )
}
