import { Divider, Grid, Paper, Toolbar } from '@mui/material'
import AuthPortal from '../components/auth/AuthPortal'
import IndexImage from '../assets/images/index_image.jpeg'
import { Box } from '@mui/system'

export default function Auth() {
  return (
    <Paper sx={{ height: '100vh' }}>
      <Toolbar />
      <Grid
        container
        sx={(theme) => ({
          height: `calc(100vh - ${theme.mixins.toolbar.height}px)`,
        })}
        alignItems="stretch"
      >
        <Grid item md={5} xs={12}>
          <Grid
            container
            sx={{ height: '100%', p: 5 }}
            justifyContent="flex-end"
            alignItems={'center'}
          >
            <Grid item xs={12} md={10}>
              <AuthPortal />
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={7} xs={12}>
          <Grid container sx={{ height: '100%' }}>
            <Grid item sx={{ overflow: 'hidden' }}>
              <Box
                component={'img'}
                sx={{
                  height: '100%',
                  clipPath: 'polygon(0 0, 100% 0, 100% 100%, 10% 100%)',
                }}
                src={IndexImage}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Divider variant="fullWidth" />
    </Paper>
  )
}
