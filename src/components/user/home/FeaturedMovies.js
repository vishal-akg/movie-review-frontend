import { useEffect, useRef, useState } from 'react'
import SlickSlider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { Scrollbars } from 'react-custom-scrollbars-2'
import { getLatestMovies } from '../../../api/movie'
import { Box, alpha } from '@mui/system'
import { useTheme } from '@emotion/react'
import {
  Card,
  CardActionArea,
  CardMedia,
  Divider,
  Fade,
  Grid,
  IconButton,
  Stack,
  Typography,
} from '@mui/material'
import {
  ArrowBack,
  ArrowBackIos,
  ArrowForward,
  ArrowForwardIos,
  Pause,
  PlayArrow,
  Star,
  VolumeOff,
  VolumeUp,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

function NextButton(props) {
  const { onClick, mouseIn } = props
  const theme = useTheme()

  return (
    <Fade in={mouseIn} timeout={500}>
      <CardActionArea
        onClick={onClick}
        sx={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: 153,
          backgroundColor: alpha(theme.palette.background.paper, 0.8),
        }}
      >
        <Stack alignItems={'center'}>
          <ArrowForwardIos color="action" sx={{ fontSize: '3.5rem' }} />
        </Stack>
      </CardActionArea>
    </Fade>
  )
}

function PrevButton(props) {
  const { onClick, mouseIn } = props
  const theme = useTheme()

  return (
    <Fade in={mouseIn} timeout={500}>
      <CardActionArea
        onClick={onClick}
        sx={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 153,
          zIndex: 2,
          backgroundColor: alpha(theme.palette.background.paper, 0.8),
        }}
      >
        <Stack alignItems={'center'}>
          <ArrowBackIos color="action" sx={{ fontSize: '3.5rem' }} />
        </Stack>
      </CardActionArea>
    </Fade>
  )
}

export default function FeaturedMovies({ dispatchFeedback }) {
  const initialSlide = 0
  const [movies, setMovies] = useState([])
  const [mouseIn, setMouseIn] = useState(false)
  const [activeSlide, setActiveSlide] = useState(initialSlide)
  const navigate = useNavigate()
  const theme = useTheme()

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await getLatestMovies()
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
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    autoplay: true,
    pauseOnHover: true,
    ease: theme.transitions.easing.easeInOut,
    speed: 1000,
    initialSlide,
    centerPadding: '160px',
    prevArrow: <PrevButton mouseIn={mouseIn} />,
    nextArrow: <NextButton mouseIn={mouseIn} />,
    afterChange: (next) => setActiveSlide(next),
  }

  const nextSlides =
    activeSlide == movies.length - 1 ? movies : movies.slice(activeSlide + 1)

  return (
    <Stack spacing={5}>
      <Box
        container
        onMouseEnter={() => setMouseIn(true)}
        onMouseLeave={() => setMouseIn(false)}
      >
        <SlickSlider {...slickSettings}>
          {movies.map((movie, index) => (
            <Slide movie={movie} key={movie.id} />
          ))}
        </SlickSlider>
      </Box>
    </Stack>
  )
}

function Slide({ movie }) {
  const theme = useTheme()
  const [mouseIn, setMouseIn] = useState(false)
  const [muted, setMuted] = useState(true)
  const [playing, setPlaying] = useState(true)
  const [trailer, setTrailer] = useState(false)
  const videoRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!!mouseIn) {
      const timer = setTimeout(() => {
        setTrailer(true)
      }, 1000)

      return () => {
        clearTimeout(timer)
      }
    } else {
      setTrailer(false)
    }
  }, [mouseIn])

  return (
    <Box
      sx={{ px: 1 }}
      onMouseEnter={() => setMouseIn(true)}
      onMouseLeave={() => setMouseIn(false)}
    >
      <Grid container sx={{ backgroundColor: theme.palette.grey[900] }}>
        <Grid item xs={4}>
          <CardActionArea
            onClick={() => navigate(`/movies/${movie.id}`)}
            sx={{ height: '100%' }}
          >
            <Stack justifyContent={'center'} sx={{ height: '100%', p: 3 }}>
              <Typography
                variant="h5"
                color="lightsteelblue"
                sx={{ fontWeight: 700 }}
                gutterBottom
              >
                {movie.title}
              </Typography>
              <Stack
                direction="row"
                spacing={1}
                divider={<Box color="lightslategray"> &#9679; </Box>}
                alignItems="center"
              >
                <Typography variant="body2" color="lightslategray">
                  {movie.language.language}
                </Typography>
                <Typography variant="body2" color="lightslategray">
                  {movie.genres[0]}
                </Typography>
                <Typography variant="body2" color="lightslategray">
                  {new Date(movie.releaseDate).getFullYear()}
                </Typography>
              </Stack>
              <Box height={20} />
              <Typography variant="body2" color="lightsteelblue">
                Directed by - {movie.director.name}
              </Typography>
            </Stack>
          </CardActionArea>
        </Grid>
        <Grid item xs={8} sx={{ position: 'relative' }}>
          {!trailer ? (
            <Box
              sx={{
                position: 'absolute',
                left: '-2rem',
                top: 0,
                bottom: 0,
                width: '20rem',
                backgroundImage: `linear-gradient(to right, ${theme.palette.grey[900]} 20%, transparent)`,
              }}
            />
          ) : null}
          <Stack>
            {trailer ? (
              <Stack sx={{ position: 'relative' }}>
                <Box
                  component={'video'}
                  src={movie.trailer.secure_url}
                  autoPlay
                  muted={muted}
                  ref={videoRef}
                  sx={{ width: '100%', aspectRatio: '16/9' }}
                />
                <Grid
                  container
                  direction="column"
                  sx={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    right: 0,
                    bottom: 0,
                  }}
                  justifyContent="flex-end"
                >
                  <Grid item xs={1}></Grid>
                  <Grid item xs>
                    <Stack
                      justifyContent={'center'}
                      alignItems="center"
                      sx={{ height: '100%' }}
                    ></Stack>
                  </Grid>
                  <Grid item xs={1}>
                    <Grid container justifyContent={'space-between'}>
                      <Grid item>
                        <IconButton
                          size="large"
                          onClick={() =>
                            setPlaying((prevPlaying) => {
                              if (prevPlaying) {
                                videoRef.current.pause()
                              } else {
                                videoRef.current.play()
                              }
                              return !prevPlaying
                            })
                          }
                        >
                          {playing ? (
                            <Pause fontSize="large" />
                          ) : (
                            <PlayArrow fontSize="large" />
                          )}
                        </IconButton>
                      </Grid>
                      <Grid item>
                        <IconButton
                          size="large"
                          onClick={() => setMuted((prevMuted) => !prevMuted)}
                        >
                          {muted ? (
                            <VolumeOff fontSize="large" />
                          ) : (
                            <VolumeUp fontSize="large" />
                          )}
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Stack>
            ) : (
              <Box
                component={'img'}
                src={movie.poster.secure_url}
                sx={{ width: '100%', aspectRatio: '16/9' }}
              />
            )}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  )
}
