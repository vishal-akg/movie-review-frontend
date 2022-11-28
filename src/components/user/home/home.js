import { Grid, Link, Paper, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { Box } from '@mui/system'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../../../contexts'
import Header from '../../ui/header'
import FeaturedMovies from './FeaturedMovies'
import MostRatedMovies from './MostRatedMovies'

export default function Index() {
  const { user, dispatchUser } = useContext(UserContext)
  const navigate = useNavigate()

  return (
    <Paper sx={{ minHeight: '100vh' }} square>
      <Header user={user} dispatchUser={dispatchUser} />
      {user.username !== 'Guest' && !user.isVerified ? (
        <Typography
          variant="body2"
          align="center"
          sx={(theme) => ({
            backgroundColor: alpha(theme.palette.info.light, 0.15),
            padding: 1,
          })}
        >
          It looks like you haven't verified your account,{' '}
          <Link
            variant="body2"
            color="inherit"
            underline="hover"
            onClick={() => {
              navigate('/auth')
            }}
          >
            click here to verify your email {user.email}.
          </Link>
        </Typography>
      ) : null}
      <FeaturedMovies />
      <Box sx={{ pt: 5, px: 6 }}>
        <Grid container>
          <Grid item md={9}>
            <Stack>
              <Typography variant="h6" sx={{ fontWeight: 500, ml: 1, mb: 1 }}>
                Most Rated Movies
              </Typography>
              <MostRatedMovies />
            </Stack>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ pt: 5, px: 6 }}>
        <Grid container>
          <Grid item md={9}>
            <Stack>
              <Typography variant="h6" sx={{ fontWeight: 500, ml: 1, mb: 1 }}>
                Highest Rated Web Series
              </Typography>
              <MostRatedMovies type="Web Series" />
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  )
}
