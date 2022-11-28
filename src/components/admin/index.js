import {
  Add,
  ArrowBack,
  DarkMode,
  FileUpload,
  Home,
  Inbox,
  LightMode,
  Logout,
  Mail,
  MenuBook,
  Movie,
  MovieFilter,
  PersonAdd,
  SearchSharp,
  SettingsAccessibility,
} from '@mui/icons-material'
import {
  alpha,
  AppBar,
  Box,
  Button,
  CssBaseline,
  Divider,
  Drawer,
  Grid,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
  Toolbar,
  Typography,
  useTheme,
  Menu,
  MenuItem,
  Modal,
  Dialog,
  DialogContent,
  LinearProgress,
} from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { useMatch, useNavigate } from 'react-router-dom'
import { FileUploader } from 'react-drag-drop-files'
import { FeedbackContext, ThemeModeContext } from '../../contexts'
import { setThemeMode } from '../../contexts/actions/theme-actions'
import { logout } from '../../contexts/actions/user-actions'
import { uploadTrailer } from '../../api/movie'
import MovieUpload from './movie/upload'
import CreateActor from './actor/create'

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  maxWidth: '30rem',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(
    theme.palette.mode === 'light'
      ? theme.palette.common.black
      : theme.palette.common.white,
    0.05,
  ),
  '&:hover': {
    backgroundColor: alpha(
      theme.palette.mode === 'light'
        ? theme.palette.common.black
        : theme.palette.common.white,
      0.1,
    ),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  display: 'flex',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}))

const StyledMenu = styled((props) => (
  <Menu
    elevation={1}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 3,
    minWidth: 200,
    color:
      theme.palette.mode === 'light'
        ? 'rgb(55, 65, 81)'
        : theme.palette.grey[300],
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}))

export default function Admin({
  user,
  dispatchUser,
  feedback,
  dispatchFeedback,
  children,
  editingActor,
  editingMovie,
}) {
  const navigate = useNavigate()
  const { mode, dispatchThemeMode } = useContext(ThemeModeContext)

  const [anchorEl, setAnchorEl] = useState(null)
  const [movieDialogOpen, setMovieDialogOpen] = useState(false)
  const [actorDialogOpen, setActorDialogOpen] = useState(false)
  const match = useMatch({ path: '/:slug', caseSensitive: true, end: true })

  const drawerWidth = 260
  const drawerOptions = [
    { icon: <Home />, label: 'Home', to: '/' },
    { icon: <Movie />, label: 'Movies', to: '/movies' },
    { icon: <SettingsAccessibility />, label: 'Actors', to: '/actors' },
  ]
  const open = Boolean(anchorEl)
  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  useEffect(() => {
    if (!!editingActor) {
      setActorDialogOpen(true)
    } else {
      setActorDialogOpen(false)
    }
  }, [editingActor])

  useEffect(() => {
    if (!!editingMovie) {
      setMovieDialogOpen(true)
    } else {
      setMovieDialogOpen(false)
    }
  }, [editingMovie])

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        color="inherit"
        elevation={0}
        position="fixed"
        sx={(theme) => ({ zIndex: theme.zIndex.drawer + 1 })}
      >
        <Toolbar>
          <MovieFilter color="primary" fontSize="large" />
          <Typography
            variant="h6"
            sx={{
              mr: 2,
              fontFamily: 'monospace',
              letterSpacing: '.1rem',
              fontWeight: 700,
            }}
          >
            PARKER
          </Typography>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container justifyContent={'center'}>
              <Grid item xs={8}>
                <Search>
                  <SearchIconWrapper>
                    <SearchSharp />
                  </SearchIconWrapper>
                  <StyledInputBase
                    placeholder="Search…"
                    inputProps={{ 'aria-label': 'search' }}
                  />
                </Search>
              </Grid>
            </Grid>
          </Box>
          <Box sx={{ mr: 3 }}>
            <Button
              startIcon={<Add />}
              variant="contained"
              disableElevation
              onClick={handleOpen}
            >
              Create
            </Button>
            <StyledMenu anchorEl={anchorEl} open={open} onClose={handleClose}>
              <MenuItem onClick={() => setActorDialogOpen(true)}>
                <PersonAdd fontSize="small" />
                Actor
              </MenuItem>
              <MenuItem onClick={() => setMovieDialogOpen(true)}>
                <Movie fontSize="small" /> Movie
              </MenuItem>
            </StyledMenu>
          </Box>
          <Box
            sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}
          >
            <IconButton
              onClick={(e) => {
                dispatchThemeMode(
                  setThemeMode(mode === 'light' ? 'dark' : 'light'),
                )
              }}
            >
              {mode === 'light' ? <LightMode /> : <DarkMode />}
            </IconButton>
          </Box>
        </Toolbar>
        <Divider />
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <Grid
          container
          direction="column"
          justifyContent={'space-between'}
          sx={{ height: '100%' }}
        >
          <Grid item>
            <List component="nav">
              {drawerOptions.map((option, index) => (
                <ListItem disablePadding>
                  <ListItemButton
                    selected={
                      match ? match.pathname === option.to : '/' === option.to
                    }
                    onClick={() => navigate(option.to)}
                  >
                    <ListItemIcon>{option.icon}</ListItemIcon>
                    <ListItemText primary={option.label} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Grid>
          <Grid item>
            <Divider />
            <Grid container direction="column" sx={{ p: 2 }}>
              <Grid item>
                <Button
                  variant={user.jwt ? 'text' : 'contained'}
                  disableElevation
                  size="small"
                  startIcon={<Logout />}
                  onClick={(e) => {
                    if (user.jwt) {
                      dispatchUser(logout())
                    } else {
                      navigate('/auth')
                    }
                  }}
                >
                  {user.jwt ? 'Logout' : 'Login'}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Drawer>
      <Box>
        <Toolbar />
        {children}
      </Box>
      <Dialog
        open={movieDialogOpen}
        onClose={() => setMovieDialogOpen(false)}
        fullWidth
        maxWidth="md"
        keepMounted
      >
        <MovieUpload
          movie={editingMovie}
          dispatchFeedback={dispatchFeedback}
          setMovieDialogOpen={setMovieDialogOpen}
        />
      </Dialog>
      <Dialog
        keepMounted
        open={actorDialogOpen}
        onClose={() => setActorDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <CreateActor
          actor={editingActor}
          dispatchFeedback={dispatchFeedback}
          setActorDialogOpen={setActorDialogOpen}
        />
      </Dialog>
    </Box>
  )
}
