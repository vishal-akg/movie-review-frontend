import { Avatar, CardActionArea, Grid, Stack, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

export default function TopCast({ cast }) {
  return (
    <Grid container>
      {cast.map((cast) => (
        <Grid item xs={6} key={cast.actor.id}>
          <Grid container spacing={2}>
            <Grid item>
              <Link to={`/actors/${cast.actor.id}`}>
                <Avatar
                  src={cast.actor.avatar.secure_url}
                  sx={{ width: 60, height: 60 }}
                />
              </Link>
            </Grid>
            <Grid item xs>
              <Stack>
                <Link to={`/actors/${cast.actor.id}`}>
                  <Typography
                    variant="body1"
                    textTransform={'capitalize'}
                    color="primary"
                    sx={{ fontWeight: 500 }}
                  >
                    {cast.actor.name}
                  </Typography>
                </Link>
                <Typography
                  variant="subtitle1"
                  textTransform={'capitalize'}
                  color="textSecondary"
                  sx={{ fontSize: '0.9rem' }}
                >
                  {cast.role}
                </Typography>
              </Stack>
            </Grid>
            <Grid item></Grid>
          </Grid>
        </Grid>
      ))}
    </Grid>
  )
}
