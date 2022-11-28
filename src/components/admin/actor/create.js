import { useTheme } from '@emotion/react'
import { BadgeSharp, EmojiEvents, Photo, Wc } from '@mui/icons-material'
import {
  Badge,
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  Grid,
  Stack,
  Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import { useEffect, useState } from 'react'
import { create, getSignedUrl, update, uploadAvatar } from '../../../api/actor'
import { setSnackbar } from '../../../contexts/actions/feedback-actions'
import Fields from '../../inputs/Fields'
import validate from '../../inputs/validate'

export default function CreateActor({
  actor,
  dispatchFeedback,
  setActorDialogOpen,
}) {
  const theme = useTheme()
  const [values, setValues] = useState({
    avatar: null,
    gender: null,
    birth: new Date(new Date().setFullYear(new Date().getFullYear() - 30)),
    biography: '',
    name: '',
    awards: 0,
    nominations: 0,
    nationality: null,
  })
  useEffect(() => {
    if (!!actor) {
      const savedValues = {
        avatar: actor.avatar,
        gender: actor.gender,
        birth: new Date(actor.birth),
        name: actor.name,
        awards: actor.awards,
        nominations: actor.nominations,
        nationality: actor.nationality,
        biography: actor.biography,
      }
      setValues(savedValues)

      const valid = validate({
        ...savedValues,
      })
      setErrors(
        Object.keys(valid).reduce(
          (attrs, key) => ({
            ...attrs,
            [key]: !valid[key],
          }),
          {},
        ),
      )
    }
  }, [actor])
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const fields = {
    leftFields: {
      avatar: {
        type: 'file_upload',
        fileType: 'image',
        preview: true,
        getSignedUrl,
        children: (
          <Box
            sx={{
              aspectRatio: '1',
              border: `2px dashed ${theme.palette.grey[300]}`,
            }}
          >
            <Stack
              sx={{ height: '100%' }}
              justifyContent="center"
              alignItems="center"
            >
              <Photo />
              <Typography variant="caption">Avatar</Typography>
            </Stack>
          </Box>
        ),
      },
    },
    rightFields: {
      name: {
        type: 'text',
        placeholder: 'Name',
        helperText: 'Name is required',
        fullWidth: true,
        size: 'small',
      },
      nationality: {
        type: 'country',
        fullWidth: true,
        placeholder: 'Nationality',
        size: 'small',
      },
      birth: {
        type: 'date',
        placeholder: 'Date of Birth',
        fullWidth: false,
        size: 'small',
      },
      gender: {
        type: 'autocomplete',
        fullWidth: true,
        label: 'Gender',
        placeholder: '---Select gender--',
        size: 'small',
        startAdornment: <Wc />,
        getOptionLabel: (option) => option.title,
        options: [
          { id: 1, title: 'Male' },
          { id: 2, title: 'Female' },
          { id: 3, title: 'Others' },
        ],
      },
      nominations: {
        type: 'number',
        placeholder: 'Nominations',
        helperText: 'nominations if any',
        size: 'small',
        fullWidth: false,
      },
      awards: {
        type: 'number',
        placeholder: 'Awards',
        helperText: 'awards if any',
        size: 'small',
        fullWidth: false,
        startAdornment: <EmojiEvents />,
      },
    },
    bottomFields: {
      biography: {
        type: 'text',
        placeholder: 'Write bio data of actor...',
        label: 'Biography',
        fullWidth: true,
        helperText: 'Biography is required',
        multiline: true,
        minRows: 5,
        maxRows: 10,
      },
    },
  }

  const {
    name,
    nationality,
    gender,
    birth,
    awards,
    nominations,
  } = fields.rightFields

  const handleSubmit = async () => {
    try {
      setLoading(true)
      let avatarRes = null
      if (!!actor) {
        if (values.avatar.file instanceof File) {
          avatarRes = await uploadAvatar({ ...values.avatar })
        }

        const { birth, awards, nominations, ...rest } = values

        const res = await update(actor.id, {
          ...rest,
          birth: birth.toLocaleDateString(['af-ZA']),
          awards: parseInt(awards),
          nominations: parseInt(nominations),
          avatar: avatarRes?.data || values.avatar,
        })

        if (res.status === 200) {
          setActorDialogOpen(false)
          setErrors({})
          setValues({
            avatar: null,
            gender: null,
            birth: new Date(
              new Date().setFullYear(new Date().getFullYear() - 30),
            ),
            biography: '',
            name: '',
            awards: 0,
            nominations: 0,
            nationality: null,
          })
          dispatchFeedback(
            setSnackbar({
              status: 'success',
              message: 'actor updated successfully.',
            }),
          )
        }
      } else {
        avatarRes = await uploadAvatar({ ...values.avatar })
        if (avatarRes.status === 200) {
          const { birth, awards, nominations, ...rest } = values

          const res = await create({
            ...rest,
            birth: birth.toLocaleDateString(['af-ZA']),
            awards: parseInt(awards),
            nominations: parseInt(nominations),
            avatar: avatarRes.data,
          })
          if (res.status === 201) {
            setActorDialogOpen(false)
            setErrors({})
            setValues({
              avatar: null,
              gender: null,
              birth: new Date(
                new Date().setFullYear(new Date().getFullYear() - 30),
              ),
              biography: '',
              name: '',
              awards: 0,
              nominations: 0,
              nationality: null,
            })
            dispatchFeedback(
              setSnackbar({
                status: 'success',
                message: 'actor created successfully.',
              }),
            )
          }
        }
      }
    } catch (error) {
      const { message } = error.response.data
      dispatchFeedback(setSnackbar({ status: 'error', message }))
    } finally {
      setLoading(false)
    }
  }

  const disabled =
    Object.keys(errors).some((error) => errors[error] === true) ||
    Object.keys(errors).length !== Object.keys(values).length

  return (
    <>
      <DialogContent>
        <Stack spacing={2}>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Fields
                fields={fields.leftFields}
                errors={errors}
                setErrors={setErrors}
                values={values}
                setValues={setValues}
              />
            </Grid>
            <Grid item xs={8}>
              <Grid container direction="column" spacing={2}>
                <Fields
                  fields={{ name, nationality }}
                  errors={errors}
                  setErrors={setErrors}
                  values={values}
                  setValues={setValues}
                />
                <Grid item>
                  <Grid container spacing={2}>
                    <Grid item xs>
                      <Fields
                        fields={{ birth }}
                        errors={errors}
                        setErrors={setErrors}
                        values={values}
                        setValues={setValues}
                      />
                    </Grid>
                    <Grid item xs>
                      <Fields
                        fields={{ gender }}
                        errors={errors}
                        setErrors={setErrors}
                        values={values}
                        setValues={setValues}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <Grid container spacing={2}>
                    <Grid item xs>
                      <Fields
                        fields={{ nominations }}
                        errors={errors}
                        setErrors={setErrors}
                        values={values}
                        setValues={setValues}
                      />
                    </Grid>
                    <Grid item xs>
                      <Fields
                        fields={{ awards }}
                        errors={errors}
                        setErrors={setErrors}
                        values={values}
                        setValues={setValues}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid container direction="column">
            <Fields
              fields={fields.bottomFields}
              errors={errors}
              setErrors={setErrors}
              values={values}
              setValues={setValues}
            />
          </Grid>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          disableElevation
          disabled={disabled || loading}
          startIcon={loading ? <CircularProgress size={16} /> : undefined}
          onClick={handleSubmit}
        >
          {!!actor ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </>
  )
}
