import { useTheme } from '@emotion/react'
import { Cancel, Close, CloudUpload, FileUpload } from '@mui/icons-material'
import {
  Button,
  CircularProgress,
  Grid,
  IconButton,
  LinearProgress,
  Stack,
  Step,
  StepButton,
  Stepper,
  styled,
  Typography,
} from '@mui/material'
import { amber, grey } from '@mui/material/colors'
import { Box } from '@mui/system'
import { useEffect, useState } from 'react'
import { FileUploader } from 'react-drag-drop-files'
import * as languageList from 'language-list'
import { create, getSignedUrl, update, uploadPoster } from '../../../api/movie'
import Fields from '../../inputs/Fields'
import { search } from '../../../api/actor'
import { setSnackbar } from '../../../contexts/actions/feedback-actions'
import validate from '../../inputs/validate'

export default function MovieUpload({
  movie,
  setMovieDialogOpen,
  dispatchFeedback,
}) {
  const [values, setValues] = useState({
    title: '',
    storyline: '',
    tags: [],
    director: null,
    writers: [],
    release_date: new Date(),
    genres: [],
    type: null,
    language: null,
    status: null,
    cast_crew: [{}],
    poster: null,
    trailer: false,
  })

  useEffect(() => {
    if (!!movie) {
      const { id, releaseDate, cast, createdAt, updatedAt, ...rest } = movie
      const savedValues = {
        ...rest,
        release_date: new Date(releaseDate),
        cast_crew: cast,
      }

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

      setValues({
        ...savedValues,
        cast_crew: [...savedValues.cast_crew, {}],
      })
    }
  }, [movie])

  const [errors, setErrors] = useState({})
  const [activeStep, setActiveStep] = useState(0)
  const [completed, setCompleted] = useState({})
  const theme = useTheme()

  const getAge = (dateString) => {
    var today = new Date()
    var birthDate = new Date(dateString)
    var age = today.getFullYear() - birthDate.getFullYear()
    var m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const steps = [
    {
      label: 'Fill movie information',
      leftWidth: 8,
      leftFields: {
        title: {
          type: 'textfield',
          label: 'Title',
          placeholder: 'Titanic',
          fullWidth: true,
          variant: 'outlined',
        },
        storyline: {
          type: 'textfield',
          label: 'Story line',
          placeholder: 'Moive storyline..',
          fullWidth: true,
          variant: 'outlined',
          multiline: true,
          minRows: 3,
          maxRows: 6,
        },
        tags: {
          type: 'autocomplete',
          label: 'Movie Tags',
          placeholder: 'Enter tags describing this movie',
          fullWidth: true,
          freeSolo: true,
          multiple: true,
          isOptionEqualToValue: (option, value) => {
            console.log(option, value)
            return false
          },
          getOptionLabel: (option) => option,
        },
        release_date: {
          type: 'date',
          label: 'Release date',
          placeholder: 'Movie release date',
          fullWidth: false,
        },
      },
      rightWidth: 4,
      rightFields: {
        poster: {
          type: 'file_upload',
          fileType: 'image',
          multiple: false,
          preview: true,
          getSignedUrl,
          children: (
            <Box
              sx={() => ({
                border: `3px dashed ${theme.palette.grey[400]}`,
                aspectRatio: `16 / 9`,
              })}
            >
              <Stack
                justifyContent={'center'}
                alignItems="center"
                sx={{ height: '100%' }}
              >
                <FileUpload />
                <Typography variant="body2">Select Poster</Typography>
              </Stack>
            </Box>
          ),
        },
      },
    },
    {
      label: 'Select Cast & Crew',
      leftWidth: 8,
      leftFields: {
        cast_crew: {
          label: 'Movie Cast & Role',
          type: 'cast_&_crew',
          lead: {
            label: 'Lead Actor',
          },
          actor: {
            label: 'Actor',
            fullWidth: true,
            getOptionLabel: (option) => option.name,
            renderOption: (props, option) => {
              return (
                <Grid container spacing={2} {...props} alignItems="flex-start">
                  <Grid item xs={3}>
                    <Box
                      component="img"
                      src={option.avatar.secure_url}
                      sx={{ width: '100%' }}
                    />
                  </Grid>
                  <Grid item xs>
                    <Stack>
                      <Typography variant="body1">{option.name}</Typography>
                      <Typography variant="caption">
                        {option.nationality.name} &#8226; {getAge(option.birth)}{' '}
                        years.
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>
              )
            },
            fetchOptions: async (value) => {
              const res = await search(value)
              if (res.status === 200) {
                return res.data
              }
            },
          },
          role: {
            label: 'Role',
            fullWidth: true,
          },
        },
      },
      rightWidth: 4,
      rightFields: {
        director: {
          type: 'autocomplete',
          label: 'Director',
          placeholder: 'Select Director of the movie',
          fullWidth: true,
          freeSolo: false,
          multiple: false,
          getOptionLabel: (option) => option.name,
          renderOption: (props, option) => {
            return (
              <Grid container spacing={2} {...props} alignItems="flex-start">
                <Grid item xs={3}>
                  <Box
                    component="img"
                    src={option.avatar.secure_url}
                    sx={{ width: '100%' }}
                  />
                </Grid>
                <Grid item xs>
                  <Stack>
                    <Typography variant="body1">{option.name}</Typography>
                    <Typography variant="caption">
                      {option.nationality.name} &#8226; {getAge(option.birth)}{' '}
                      years.
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
            )
          },
          fetchOptions: async (value) => {
            const res = await search(value)
            if (res.status === 200) {
              console.log(res)
              return res.data
            }
          },
        },
        writers: {
          type: 'autocomplete',
          label: 'Writers',
          placeholder: 'Movie story writers..',
          fullWidth: true,
          freeSolo: false,
          multiple: true,
          getOptionLabel: (option) => option.name,
          renderOption: (props, option) => {
            return (
              <Grid container spacing={2} {...props} alignItems="flex-start">
                <Grid item xs={3}>
                  <Box
                    component="img"
                    src={option.avatar.secure_url}
                    sx={{ width: '100%' }}
                  />
                </Grid>
                <Grid item xs>
                  <Stack>
                    <Typography variant="body1">{option.name}</Typography>
                    <Typography variant="caption">
                      {option.nationality.name} &#8226; {getAge(option.birth)}{' '}
                      years.
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
            )
          },
          fetchOptions: async (value) => {
            const res = await search(value)
            if (res.status === 200) {
              console.log(res)
              return res.data
            }
          },
        },
      },
    },
    {
      label: 'Select movie genre, language & visibility',
      fields: {
        genres: {
          type: 'autocomplete',
          label: 'Genre',
          placeholder: 'Select genre',
          fullWidth: true,
          freeSolo: false,
          multiple: true,
          getOptionLabel: (option) => option,
          isOptionEqualToValue: (option, value) => option === value,

          options: [
            'Comedy',
            'Fantasy',
            'Crime',
            'Drama',
            'Music',
            'Adventure',
            'History',
            'Thriller',
            'Animation',
            'Family',
            'Mystery',
            'Biography',
            'Action',
            'Film-Noir',
            'Romance',
            'Sci-Fi',
            'War',
            'Western',
            'Horror',
            'Musical',
            'Sport',
          ],
        },
        type: {
          type: 'autocomplete',
          label: 'Type',
          placeholder: 'Select type',
          fullWidth: true,
          freeSolo: false,
          multiple: false,
          getOptionLabel: (option) => option,
          isOptionEqualToValue: (option, value) => option === value,
          options: [
            'Film',
            'Short Film',
            'Documentary',
            'TV Series',
            'Web Series',
          ],
        },
        language: {
          type: 'autocomplete',
          label: 'Language',
          placeholder: 'Select language',
          fullWidth: true,
          freeSolo: false,
          multiple: false,
          options: languageList().getData(),
          getOptionLabel: (option) => option.language,
          isOptionEqualToValue: (option, value) => option.code === value.code,
        },
        status: {
          type: 'autocomplete',
          label: 'Status',
          placeholder: '--status--',
          fullWidth: true,
          freeSolo: false,
          multiple: false,
          getOptionLabel: (option) => option,
          isOptionEqualToValue: (option, value) => option === value,
          options: ['Private', 'Public'],
        },
      },
    },
  ]

  const handleNext = () => {
    const newActiveStep =
      activeStep === steps.length - 1 &&
      Object.keys(completed).length !== steps.length
        ? steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1

    if (allFieldsValid(activeStep)) {
      const newCompleted = completed
      newCompleted[activeStep] = true
      setCompleted(newCompleted)
    }
    setActiveStep(newActiveStep)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const allFieldsValid = (step) => {
    const fields = [
      ...Object.keys(steps[step].fields || {}),
      ...Object.keys(steps[step].leftFields || {}),
      ...Object.keys(steps[step].rightFields || {}),
    ]

    const allFieldsNotValid = fields.some(
      (field) => !(field in errors) || errors[field] === true,
    )

    return !allFieldsNotValid
  }

  const handleSubmit = async () => {
    try {
      let posterRes = null
      if (!!movie) {
        if (values.poster.file instanceof File) {
          posterRes = await uploadPoster({ ...values.poster })
        }
        const data = {
          ...values,
          releaseDate: values.release_date,
          director: values.director.id,
          status: values.status,
          writers: values.writers.map((writer) => writer.id),
          cast: values.cast_crew
            .slice(0, values.cast_crew.length - 1)
            .map((crew) => ({
              lead: crew.lead || false,
              role: crew.role,
              actor: crew.actor.id,
            })),
          language: values.language,
          poster: posterRes?.data || values.poster,
        }

        const res = await update(movie.id, data)
        if (res.status === 200) {
          setMovieDialogOpen(false)
          setErrors({})
          setValues({
            title: '',
            storyline: '',
            tags: [],
            director: null,
            writers: [],
            release_date: new Date(),
            genres: [],
            type: null,
            language: null,
            status: null,
            cast_crew: [{}],
            poster: null,
            trailer: false,
          })
          dispatchFeedback(
            setSnackbar({
              status: 'success',
              message: 'Movie updated successfully',
            }),
          )
        }
      } else {
        const posterRes = await uploadPoster({ ...values.poster })
        if (posterRes.status === 200) {
          const data = {
            ...values,
            poster: {
              ...posterRes.data,
            },
            director: values.director.id,
            status: values.status,
            writers: values.writers.map((writer) => writer.id),
            releaseDate: values.release_date,
            cast: values.cast_crew
              .slice(0, values.cast_crew.length - 1)
              .map((crew) => ({
                lead: crew.lead || false,
                role: crew.role,
                actor: crew.actor.id,
              })),
            language: values.language,
          }

          const res = await create(data)
          if (res.status === 201) {
            setMovieDialogOpen(false)
            setErrors({})
            setValues({
              title: '',
              storyline: '',
              tags: [],
              director: null,
              writers: [],
              release_date: new Date(),
              genres: [],
              type: null,
              language: null,
              status: null,
              cast_crew: [{}],
              poster: null,
              trailer: false,
            })
            dispatchFeedback(
              setSnackbar({
                status: 'success',
                message: 'Movie created successfully',
              }),
            )
          }
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  const disabled =
    Object.keys(errors).some((error) => errors[error] === true) ||
    Object.keys(errors).length !== Object.keys(values).length

  return (
    <Box>
      <Fields
        fields={{
          trailer: {
            type: 'file_upload',
            fileType: 'video',
            preview: true,
            getSignedUrl,
            children: !values.trailer ? (
              <Box
                sx={() => ({
                  border: `3px dashed ${theme.palette.grey[400]}`,
                  aspectRatio: `16 / 9`,
                  cursor: 'pointer',
                  m: 2,
                })}
              >
                <Stack
                  justifyContent={'center'}
                  alignItems="center"
                  sx={{ height: '100%' }}
                >
                  <CloudUpload fontSize="large" color="primary" />
                  <Typography variant="h6" color="secondary">
                    Movie trailer file minimum size 10MB, maximum size 100MB.
                  </Typography>
                </Stack>
              </Box>
            ) : (
              <LinearProgress
                variant="determinate"
                value={values.trailer.progress || 0}
                color="primary"
              />
            ),
          },
        }}
        errors={errors}
        setErrors={setErrors}
        values={values}
        setValues={setValues}
      />
      {values.trailer ? (
        <Stack spacing={5} sx={{ p: 2 }}>
          <Stepper nonLinear activeStep={activeStep} alternativeLabel>
            {steps.map((step, index) => (
              <Step key={step.label} completed={completed[index]}>
                <StepButton
                  color="inherit"
                  onClick={() => setActiveStep(index)}
                >
                  {step.label}
                </StepButton>
              </Step>
            ))}
          </Stepper>
          <Box>
            <Grid container direction="column" spacing={3}>
              {steps[activeStep].leftFields && steps[activeStep].rightFields ? (
                <Grid item>
                  <Grid container spacing={3}>
                    <Grid item xs={steps[activeStep].leftWidth}>
                      <Grid container direction="column" spacing={3}>
                        <Fields
                          fields={steps[activeStep].leftFields}
                          errors={errors}
                          setErrors={setErrors}
                          values={values}
                          setValues={setValues}
                        />
                      </Grid>
                    </Grid>
                    <Grid item xs={steps[activeStep].rightWidth}>
                      <Grid container direction="column" spacing={3}>
                        <Fields
                          fields={steps[activeStep].rightFields}
                          errors={errors}
                          setErrors={setErrors}
                          values={values}
                          setValues={setValues}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              ) : (
                <Grid item>
                  <Grid container spacing={3} direction="column">
                    <Fields
                      fields={
                        steps[activeStep].fields ||
                        steps[activeStep].leftFields ||
                        steps[activeStep].rightFields
                      }
                      errors={errors}
                      setErrors={setErrors}
                      values={values}
                      setValues={setValues}
                    />
                  </Grid>
                </Grid>
              )}
              <Grid item>
                <Grid container justifyContent={'space-between'}>
                  <Grid item>
                    {activeStep !== 0 ? (
                      <Button onClick={handleBack}>Previous</Button>
                    ) : null}
                  </Grid>
                  <Grid item>
                    {activeStep !== steps.length - 1 ? (
                      <Button onClick={handleNext}>Next</Button>
                    ) : (
                      <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disableElevation
                        disabled={false}
                      >
                        {!!movie ? 'Update Movie' : 'Create Movie'}
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Stack>
      ) : null}
    </Box>
  )
}
