import { useEffect, useState } from 'react'
import SlickSlider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { getMostRatedMovies } from '../../../api/movie'
import {
  Card,
  CardActionArea,
  CardMedia,
  Fab,
  Grid,
  IconButton,
  Rating,
  Stack,
  Typography,
} from '@mui/material'
import { Box, alpha } from '@mui/system'
import { useNavigate } from 'react-router-dom'
import { ArrowBackIos, ArrowForwardIos, Star } from '@mui/icons-material'
import { useTheme } from '@emotion/react'

function NextButton(props) {
  const { onClick } = props
  const theme = useTheme()

  return (
    <Stack
      sx={{
        position: 'absolute',
        right: '-1rem',
        top: 0,
        bottom: 0,
      }}
      justifyContent={'center'}
    >
      <Card
        elevation={10}
        sx={{
          zIndex: theme.zIndex.fab,
          borderRadius: '50%',
        }}
      >
        <CardActionArea
          onClick={onClick}
          sx={{
            width: '3rem',
            height: '3rem',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <ArrowForwardIos color="primary" fontSize={'medium'} />
        </CardActionArea>
      </Card>
    </Stack>
  )
}

function PrevButton(props) {
  const { onClick } = props
  const theme = useTheme()

  return (
    <Stack
      sx={{
        position: 'absolute',
        left: '-1rem',
        top: 0,
        bottom: 0,
      }}
      justifyContent={'center'}
    >
      <Card
        elevation={10}
        sx={{
          zIndex: theme.zIndex.fab,
          borderRadius: '50%',
        }}
      >
        <CardActionArea
          onClick={onClick}
          sx={{
            width: '3rem',
            height: '3rem',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <ArrowBackIos color="primary" fontSize={'medium'} />
        </CardActionArea>
      </Card>
    </Stack>
  )
}

export default function MostRatedMovies({ dispatchFeedback, type }) {
  const [movies, setMovies] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await getMostRatedMovies()
        if (res.status === 200) {
          setMovies(res.data)
        }
      } catch (error) {
        console.log(error)
      }
    }

    fetchMovies()
  }, [])

  const slickSettings = {
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    prevArrow: <PrevButton />,
    nextArrow: <NextButton />,
  }

  return (
    <SlickSlider {...slickSettings}>
      {[...movies, ...movies].map((movie) => (
        <Box p={1} key={movie.id}>
          <Card square variant={'outlined'}>
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
                        {parseFloat(movie?.rating.figure || 8.1).toFixed(1) ||
                          8.1}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Stack>
            </CardActionArea>
          </Card>
        </Box>
      ))}
    </SlickSlider>
  )
}
