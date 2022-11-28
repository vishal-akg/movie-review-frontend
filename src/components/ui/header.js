import styled from '@emotion/styled'
import {
  AppBar,
  Button,
  Divider,
  Grid,
  IconButton,
  InputBase,
  Toolbar,
  Typography,
} from '@mui/material'
import {
  MovieFilter,
  Menu,
  SearchSharp,
  LightMode,
  DarkMode,
} from '@mui/icons-material'
import { alpha } from '@mui/material/styles'
import { Box } from '@mui/system'
import { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ThemeModeContext } from '../../contexts'
import { logout } from '../../contexts/actions/user-actions'
import { setThemeMode } from '../../contexts/actions/theme-actions'

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

export default function Header({ user, dispatchUser }) {
  const { mode, dispatchThemeMode } = useContext(ThemeModeContext)

  const navigate = useNavigate()

  return (
    <AppBar position="sticky" color="inherit" elevation={0}>
      <Toolbar variant="regular">
        <Button
          startIcon={<MovieFilter sx={{ fontSize: '1.8rem !important' }} />}
          onClick={() => navigate('/')}
          sx={{
            mr: 2,
            fontFamily: 'monospace',
            letterSpacing: '.1rem',
            fontWeight: 700,
            fontSize: '1.3rem',
          }}
        >
          PARKER
        </Button>
        <Box sx={{ ml: 5, mr: 2 }}>
          <Button
            color="inherit"
            startIcon={<Menu fontSize="small" />}
            disableRipple
          >
            Menu
          </Button>
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Search>
            <SearchIconWrapper>
              <SearchSharp />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
        </Box>
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
          <IconButton
            onClick={(e) => {
              dispatchThemeMode(
                setThemeMode(mode === 'light' ? 'dark' : 'light'),
              )
            }}
          >
            {mode === 'light' ? <LightMode /> : <DarkMode />}
          </IconButton>
          <Button
            variant={user.jwt ? 'outlined' : 'contained'}
            disableElevation
            size="small"
            onClick={(e) => {
              if (user.jwt) {
                dispatchUser(logout())
              } else {
                navigate('/auth')
              }
            }}
            sx={{ ml: 2, padding: '0 1.2rem', height: 32, borderRadius: 20 }}
          >
            {user.jwt ? 'Logout' : 'Login'}
          </Button>
        </Box>
      </Toolbar>
      <Divider />
    </AppBar>
  )
}
