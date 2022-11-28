import {
  Delete,
  Edit,
  EmojiEvents,
  MoreHoriz,
  MoreVert,
} from '@mui/icons-material'
import {
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  ClickAwayListener,
  Grid,
  Grow,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Pagination,
  Paper,
  Popper,
  Stack,
  Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import { useEffect, useRef, useState } from 'react'
import TextTruncate from 'react-text-truncate'
import Moment from 'react-moment'
import { all } from '../../api/actor'

export default function Actors({ setEditingActor }) {
  const [loading, setLoading] = useState(false)
  const [actors, setActors] = useState([])
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(1)
  const pageSize = 6

  const fetchActors = async (skip, limit) => {
    try {
      setLoading(true)
      const res = await all(skip, limit)
      if (res.status === 200) {
        const { actors: resActors, count } = res.data
        setActors(resActors)
        setCount(count)
        console.log(res)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const skip = (page - 1) * pageSize
    fetchActors(skip, pageSize)
  }, [page])

  return (
    <Box sx={{ p: 6 }}>
      <Stack spacing={3}>
        <Grid container spacing={5}>
          {actors.map((actor) => (
            <Grid item key={actor.id} xs={4}>
              <ActorCard actor={actor} setEditingActor={setEditingActor} />
            </Grid>
          ))}
        </Grid>
        <Grid container justifyContent={'center'}>
          <Grid item>
            {count > 0 ? (
              <Pagination
                page={page}
                onChange={(e, newPage) => setPage(newPage)}
                count={Math.ceil(count / 6)}
                color="standard"
              />
            ) : null}
          </Grid>
        </Grid>
      </Stack>
    </Box>
  )
}

function ActorCard({ actor, setEditingActor }) {
  const [open, setOpen] = useState(false)
  const [mouseIn, setMouseIn] = useState(false)
  const anchorEl = useRef(null)

  return (
    <Card
      variant="outlined"
      sx={{ height: '13rem' }}
      onMouseEnter={() => setMouseIn(true)}
      onMouseLeave={() => setMouseIn(false)}
    >
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <Stack spacing={2}>
              <CardMedia component={'img'} src={actor.avatar.secure_url} />
              <Stack direction="row" spacing={1}>
                <EmojiEvents color="warning" />
                <Typography variant="body1">{actor.awards}</Typography>
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs>
            <CardHeader
              sx={{ p: 0 }}
              disableTypography
              title={
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {actor.name}
                </Typography>
              }
              subheader={
                <Grid container direction="row" spacing={1}>
                  <Grid item>
                    <Typography variant="caption">
                      {actor.nationality.name}
                    </Typography>
                  </Grid>
                  <Grid item>&#903;</Grid>
                  <Grid item>
                    <Typography variant="caption">
                      <Moment withTitle format="Do MMMM YYYY">
                        {actor.birth}
                      </Moment>
                    </Typography>
                  </Grid>
                </Grid>
              }
              action={
                mouseIn || open ? (
                  <>
                    <IconButton ref={anchorEl} onClick={() => setOpen(true)}>
                      <MoreHoriz />
                    </IconButton>
                    <Popper
                      open={open}
                      anchorEl={anchorEl?.current}
                      placement="bottom-end"
                      transition
                      disablePortal
                    >
                      {({ TransitionProps, placement }) => (
                        <Grow
                          {...TransitionProps}
                          style={{
                            transformOrigin:
                              placement === 'bottom-end'
                                ? 'right top'
                                : 'right bottom',
                          }}
                        >
                          <Paper variant="outlined" sx={{ minWidth: '10rem' }}>
                            <ClickAwayListener
                              onClickAway={() => setOpen(false)}
                            >
                              <MenuList>
                                <MenuItem
                                  onClick={() => setEditingActor(actor)}
                                >
                                  <ListItemIcon>
                                    <Edit />
                                  </ListItemIcon>
                                  <ListItemText>Edit</ListItemText>
                                </MenuItem>
                                <MenuItem>
                                  <ListItemIcon>
                                    <Delete />
                                  </ListItemIcon>
                                  <ListItemText>Delete</ListItemText>
                                </MenuItem>
                              </MenuList>
                            </ClickAwayListener>
                          </Paper>
                        </Grow>
                      )}
                    </Popper>
                  </>
                ) : null
              }
            />
            <Box sx={{ height: '0.5rem' }} />
            <Typography variant="body2" color="textSecondary">
              <TextTruncate line={5} text={actor.biography} element="span" />
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}
