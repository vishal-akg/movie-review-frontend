import { Box } from '@mui/system'

export default function Player({ movie }) {
  return (
    <Box
      component="video"
      sx={{ aspectRatio: '16/9', backgroundColor: 'black' }}
      poster={movie.poster.secure_url}
      src={movie.trailer.secure_url}
      controls
    />
  )
}
