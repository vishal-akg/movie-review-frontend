import { createTheme } from '@mui/material/styles'

export default function (mode) {
  return createTheme({
    palette: {
      primary: {
        main: '#f57c00',
      },
      mode,
    },
  })
}
