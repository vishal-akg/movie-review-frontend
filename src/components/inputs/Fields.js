import {
  Autocomplete,
  Box,
  Button,
  Card,
  Checkbox,
  Chip,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Pagination,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DesktopDatePicker } from '@mui/x-date-pickers'
import { useEffect, useRef, useState } from 'react'
import { getData } from 'country-list'
import * as Flags from 'country-flag-icons/react/3x2'
import validate from './validate'
import { Delete, Edit, Flag } from '@mui/icons-material'
import { FileUploader } from 'react-drag-drop-files'
import { useDebouncedCallback } from 'use-debounce'
import { getSignedUrl, uploadTrailer } from '../../api/movie'

const countryList = getData()

export default function Fields({
  fields,
  errors,
  setErrors,
  values,
  setValues,
}) {
  const validateHelper = (field, event) => {
    return validate({ [field]: event.target.value })
  }

  return Object.keys(fields).map((field) => {
    switch (fields[field].type) {
      case 'file_upload': {
        return fields[field].fileType === 'image' ? (
          <ImageUpload
            fields={fields}
            field={field}
            errors={errors}
            setErrors={setErrors}
            values={values}
            setValues={setValues}
          />
        ) : (
          <MovieTrailerUpload
            fields={fields}
            field={field}
            errors={errors}
            setErrors={setErrors}
            values={values}
            setValues={setValues}
          />
        )
      }
      case 'date': {
        return (
          <Grid item key={field}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DesktopDatePicker
                label={fields[field].label}
                inputFormat={fields[field].format || 'MM/dd/yyyy'}
                value={values[field]}
                onChange={(e) => {
                  const valid = validate({ date: e })
                  if (errors[field] || valid.date === true) {
                    setErrors({ ...errors, [field]: !valid.date })
                  }

                  setValues({
                    ...values,
                    [field]: e,
                  })
                }}
                renderInput={(params) => (
                  <TextField
                    fullWidth={fields[field].fullWidth}
                    size={fields[field].size || 'medium'}
                    {...params}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
        )
      }
      case 'cast_&_crew': {
        return (
          <CastAndCrew
            fields={fields}
            field={field}
            errors={errors}
            setErrors={setErrors}
            values={values}
            setValues={setValues}
          />
        )
      }
      case 'country': {
        return (
          <Grid item key={field}>
            <Autocomplete
              id="country-input"
              options={countryList}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) =>
                option.code === value.code
              }
              value={values[field]}
              onChange={(event, newValue) => {
                if (errors[field] || !!newValue) {
                  setErrors({ ...errors, [field]: false })
                }

                setValues({ ...values, [field]: newValue })
              }}
              onBlur={(e) => {
                if (fields[field].multiple && values[field].length === 0) {
                  setErrors({ ...errors, [field]: true })
                } else if (values[field] === '') {
                  setErrors({ ...errors, [field]: true })
                }
              }}
              renderOption={(props, option) => {
                const Flag = Flags[option.code]
                return (
                  <Box component="li" {...props}>
                    <Box sx={{ width: 30, mr: 2 }}>
                      <Flag />
                    </Box>
                    {option.name} ({option.code})
                  </Box>
                )
              }}
              renderInput={(params) => {
                const CountryFlag = values[field]?.code
                  ? Flags[values[field].code]
                  : Flag
                return (
                  <TextField
                    {...params}
                    variant={fields[field].variant || 'outlined'}
                    label={fields[field].label || fields[field].placeholder}
                    placeholder={fields[field].placeholder}
                    size={fields[field].size}
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start" sx={{ width: 20 }}>
                          <CountryFlag />
                        </InputAdornment>
                      ),
                    }}
                  />
                )
              }}
            />
          </Grid>
        )
      }
      case 'autocomplete': {
        return (
          <AutocompleteWithState
            fields={fields}
            field={field}
            errors={errors}
            setErrors={setErrors}
            values={values}
            setValues={setValues}
          />
        )
      }
      case 'otp': {
        return (
          <OtpField
            key={field}
            field={field}
            fields={fields}
            values={values}
            setValues={setValues}
          />
        )
      }
      default: {
        return !fields[field].hidden ? (
          <Grid item key={field}>
            <TextField
              size={fields[field].size || 'medium'}
              value={values[field]}
              onChange={(e) => {
                const valid = validateHelper(field, e)

                if (errors[field] || valid[field] === true) {
                  setErrors({ ...errors, [field]: !valid[field] })
                }

                setValues({ ...values, [field]: e.target.value })
              }}
              onBlur={(e) => {
                const valid = validateHelper(field, e)
                setErrors({ ...errors, [field]: !valid[field] })
              }}
              error={errors[field]}
              helperText={errors[field] && fields[field].helperText}
              placeholder={fields[field].placeholder || fields[field].label}
              label={
                fields[field].label
                  ? fields[field].label
                  : fields[field].placeholder
              }
              type={fields[field].type}
              fullWidth={fields[field].fullWidth}
              variant={fields[field].variant || 'outlined'}
              multiline={fields[field].multiline || false}
              minRows={fields[field].minRows}
              maxRows={fields[field].maxRows}
              InputProps={{
                startAdornment: fields[field].startAdornment ? (
                  <InputAdornment position="start">
                    {fields[field].startAdornment}
                  </InputAdornment>
                ) : undefined,
                endAdornment: fields[field].endAdorment ? (
                  <InputAdornment position="end">
                    {fields[field].endAdorment}
                  </InputAdornment>
                ) : undefined,
              }}
            />
          </Grid>
        ) : null
      }
    }
  })
}

function OtpField({ fields, field, values, setValues }) {
  const [active, setActive] = useState(values[field].length)
  return (
    <Grid item>
      <Stack container direction={'row'} spacing={2}>
        {[...new Array(fields[field].maxLength)].map((_, index) => {
          return (
            <Grid item key={index}>
              <SingleInput
                value={
                  index < values[field].length
                    ? values[field].split('')[index]
                    : ''
                }
                setValue={(v) => {
                  setValues({
                    ...values,
                    [field]:
                      values[field].substring(0, index) +
                      v +
                      values[field].substring(index + 1),
                  })
                }}
                setActive={setActive}
                active={active}
                index={index}
                maxLength={fields[field].maxLength}
                disabled={fields[field].disabled}
              />
            </Grid>
          )
        })}
      </Stack>
    </Grid>
  )
}

const SingleInput = ({
  value,
  setValue,
  active,
  index,
  setActive,
  maxLength,
  disabled,
}) => {
  const inputRef = useRef(null)

  useEffect(() => {
    if (active === index) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [active, index])

  return (
    <TextField
      value={value}
      onKeyDown={(e) => {
        if (e.key === 'Backspace') {
          setValue('')
          setActive(Math.max(active - 1, 0))
        } else if (e.key === 'Delete') {
          setValue('')
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault()
          setActive(Math.max(active - 1, 0))
        } else if (e.key === 'ArrowRight') {
          e.preventDefault()
          setActive(Math.min(active + 1, maxLength - 1))
        } else if (!isNaN(parseInt(e.key, 10))) {
          setValue(e.key)
          setActive(active + 1)
        }
      }}
      onFocus={(e) => {
        setActive(index)
      }}
      disabled={disabled}
      inputRef={inputRef}
      variant={'standard'}
      color="primary"
      sx={{
        width: 56,
        height: 56,
        minWidth: 0,
      }}
      inputProps={{
        max: 1,
        style: {
          width: '2rem',
          textAlign: 'center',
          fontSize: '2rem',
          padding: '0.5rem 1rem',
          color: 'inherit',
        },
      }}
    />
  )
}

function MovieTrailerUpload({
  fields,
  field,
  errors,
  setErrors,
  values,
  setValues,
}) {
  useEffect(() => {
    const updateSignature = async (file) => {
      const { name, type, size } = file
      const res = await fields[field].getSignedUrl(name, size, type)
      if (res.status === 201) {
        const callbacks = {
          progress: (progressEvent) => {
            setValues({
              ...values,
              [field]: {
                ...values[field],
                progress: Math.round(
                  (progressEvent.loaded / progressEvent.total) * 100,
                ),
              },
            })
          },
        }

        const response = await uploadTrailer({ ...res.data, file, callbacks })
        setValues({
          ...values,
          [field]: {
            ...values[field],
            ...response.data,
            progress: 100,
          },
        })
      }
    }

    if (values[field]?.file) {
      const file = values[field].file
      updateSignature(file)
    }
  }, [values[field]?.file])

  return (
    <FileUploader
      key={field}
      types={['mkv', 'mp4', 'avi']}
      handleChange={(file) => {
        setErrors({ ...errors, [field]: false })
        setValues({ ...values, [field]: { file } })
      }}
      onTypeError={(err) => {
        setErrors({ ...errors, [field]: true })
      }}
    >
      {fields[field].children}
    </FileUploader>
  )
}

function ImageUpload({ fields, field, errors, setErrors, values, setValues }) {
  const [objectURL, setObjectURL] = useState(null)
  useEffect(() => {
    const updateSignature = async (file) => {
      const { name, type, size } = file
      const res = await fields[field].getSignedUrl(name, size, type)
      setValues({
        ...values,
        [field]: {
          ...values[field],
          ...res.data,
        },
      })
    }

    if (values[field]?.file) {
      const file = values[field].file
      const objectUrl = URL.createObjectURL(file)
      setObjectURL(objectUrl)
      updateSignature(file)

      return () => URL.revokeObjectURL(objectUrl)
    }
  }, [values[field]?.file])

  useEffect(() => {
    if (values[field]?.secure_url) {
      setObjectURL(values[field].secure_url)
    }
  }, [values[field]?.secure_url])

  return (
    <Grid item key={field}>
      {values[field] && fields[field].preview ? (
        <Stack>
          <Box
            component={'img'}
            src={objectURL}
            sx={{ width: '100%', height: 'auto' }}
          />
          <Stack direction="row" justifyContent={'flex-end'}>
            <FileUploader
              types={['gif', 'jpg', 'jpeg', 'png']}
              handleChange={(file) => {
                setValues({ ...values, [field]: { file } })
                setErrors({ ...errors, [field]: false })
              }}
            >
              <IconButton>
                <Edit />
              </IconButton>
            </FileUploader>
            <IconButton
              onClick={() => {
                setValues({ ...values, [field]: null })
                setErrors({ ...errors, [field]: true })
              }}
            >
              <Delete />
            </IconButton>
          </Stack>
        </Stack>
      ) : (
        <FileUploader
          types={['gif', 'jpg', 'jpeg', 'png']}
          handleChange={async (file) => {
            const { name, size, type } = file
            if (fields[field].getSignedUrl) {
              const res = await fields[field].getSignedUrl(name, size, type)
            }
            setErrors({ ...errors, [field]: false })
            setValues({ ...values, [field]: { file } })
          }}
          onTypeError={(err) => {
            setErrors({ ...errors, [field]: true })
          }}
        >
          {fields[field].children}
        </FileUploader>
      )}
    </Grid>
  )
}

function CastAndCrew({ fields, field, errors, setErrors, values, setValues }) {
  const [page, setPage] = useState(1)
  const pageSize = 3
  const inputIndex = values[field].length - 1
  const disabled =
    !values[field][inputIndex].actor || !values[field][inputIndex].role

  const [inputValue, setInputValue] = useState('')
  const [options, setOptions] = useState(fields[field].actor.options || [])

  const debounced = useDebouncedCallback(async (value) => {
    const res = await fields[field].actor.fetchOptions(value)
    setOptions(res)
  }, 1000)

  return (
    <Grid item>
      <Grid container direction="column">
        <Grid item>
          <Typography variant="body1" gutterBottom>
            {fields[field].label}
          </Typography>
        </Grid>
        {values[field].length > 1 ? (
          <Grid item>
            <Divider />
            <Grid container direction="column">
              <Grid item>
                <Grid
                  container
                  sx={(theme) => ({ p: theme.spacing(2) })}
                  alignItems="center"
                >
                  <Grid item xs={3}>
                    <Typography variant="subtitle2">Leading</Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="subtitle2">Actor</Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="subtitle2">Role</Typography>
                  </Grid>
                  <Grid item xs={3} container justifyContent={'flex-end'}>
                    <Typography variant="subtitle2">Actions</Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Divider />
              {values[field]
                .slice(0, values[field].length - 1)
                .slice((page - 1) * pageSize, page * pageSize)
                .map((crew, index) => {
                  return (
                    <Grid item key={index}>
                      <Grid
                        container
                        alignItems="center"
                        sx={(theme) => ({ p: theme.spacing(1, 2) })}
                      >
                        <Grid item xs={2}>
                          <Typography variant="body1">
                            {crew.lead ? 'Yes' : 'No'}
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                          >
                            <Box
                              component={'img'}
                              src={crew.actor.avatar.secure_url}
                              sx={{ width: '2rem' }}
                            />
                            <Typography variant="body1">
                              {crew.actor.name}
                            </Typography>
                          </Stack>
                        </Grid>
                        <Grid item xs={3}>
                          <Typography variant="body1">{crew.role}</Typography>
                        </Grid>
                        <Grid item xs={3} container justifyContent={'flex-end'}>
                          <IconButton
                            onClick={() => {
                              const fieldValue = [...values[field]]
                              fieldValue.splice(index, 1)

                              setValues({
                                ...values,
                                [field]: fieldValue,
                              })

                              setErrors({
                                ...errors,
                                [field]: values[field].length === 0,
                              })
                            }}
                          >
                            <Delete />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Grid>
                  )
                })}
              {values[field].length > pageSize ? (
                <>
                  <Divider />
                  <Grid item>
                    <Grid
                      container
                      justifyContent={'flex-end'}
                      sx={(theme) => ({ p: theme.spacing(2) })}
                    >
                      <Grid item>
                        <Pagination
                          count={Math.ceil(
                            (values[field].length - 1) / pageSize,
                          )}
                          page={page}
                          onChange={(e, value) => setPage(value)}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </>
              ) : null}
            </Grid>
            <Divider />
          </Grid>
        ) : null}
        <Grid item>
          <FormControlLabel
            control={<Checkbox />}
            label={fields[field].lead.label}
            checked={values[field][inputIndex].lead}
            onChange={(e) => {
              const fieldValue = [...values[field]]
              fieldValue[inputIndex] = {
                ...fieldValue[inputIndex],
                lead: e.target.checked,
              }
              setValues({
                ...values,
                [field]: fieldValue,
              })
            }}
          />
        </Grid>
        <Grid item>
          <Grid container alignItems={'center'} spacing={2}>
            <Grid item xs>
              <Autocomplete
                options={options}
                getOptionLabel={
                  fields[field].actor.getOptionLabel
                    ? fields[field].actor.getOptionLabel
                    : (option) => option.label
                }
                isOptionEqualToValue={
                  fields[field].actor.isOptionEqualToValue
                    ? fields[field].actor.isOptionEqualToValue
                    : (option, value) => option.id === value.id
                }
                value={values[field][inputIndex].actor || null}
                onChange={(event, newValue) => {
                  const fieldValue = [...values[field]]
                  fieldValue[inputIndex] = {
                    ...fieldValue[inputIndex],
                    actor: newValue,
                  }
                  setValues({
                    ...values,
                    [field]: fieldValue,
                  })
                }}
                inputValue={inputValue}
                onInputChange={(event, newInputValue) => {
                  setInputValue(newInputValue)
                  if (fields[field].actor.fetchOptions && inputValue !== '') {
                    debounced(newInputValue)
                  }
                }}
                renderOption={(props, option) => {
                  if (fields[field].actor.renderOption) {
                    return fields[field].actor.renderOption(props, option)
                  } else {
                    return (
                      <Box component="li" {...props}>
                        {fields[field].actor.getOptionLabel
                          ? fields[field].actor.getOptionLabel(option)
                          : option.label}
                      </Box>
                    )
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={fields[field].actor.label}
                    placeholder={fields[field].actor.label}
                    fullWidth={fields[field].actor.fullWidth}
                    size={fields[field].actor.size || 'medium'}
                  />
                )}
              />
            </Grid>
            <Grid item>
              <Typography variant="body2">as</Typography>
            </Grid>
            <Grid item xs>
              <Autocomplete
                freeSolo
                getOptionLabel={(option) => option}
                options={[]}
                value={values[field][inputIndex].role || null}
                isOptionEqualToValue={(option, value) => option === value}
                onChange={(event, newValue) => {
                  const fieldValue = [...values[field]]
                  fieldValue[inputIndex] = {
                    ...fieldValue[inputIndex],
                    role: newValue,
                  }
                  setValues({
                    ...values,
                    [field]: fieldValue,
                  })
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={fields[field].role.label}
                    placeholder={fields[field].role.label}
                    fullWidth={fields[field].role.fullWidth}
                    size={fields[field].role.size || 'medium'}
                  />
                )}
              />
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                disableElevation
                disabled={disabled}
                onClick={() => {
                  setValues({
                    ...values,
                    [field]: [...values[field], {}],
                  })

                  setErrors({ ...errors, [field]: values[field].length === 0 })
                }}
              >
                Add
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

function AutocompleteWithState({
  fields,
  field,
  errors,
  setErrors,
  values,
  setValues,
}) {
  const [inputValue, setInputValue] = useState('')
  const [options, setOptions] = useState(fields[field].options || [])

  const debounced = useDebouncedCallback(async (value) => {
    const res = await fields[field].fetchOptions(value)
    setOptions(res)
  }, 1000)

  return (
    <Grid item key={field}>
      <Autocomplete
        multiple={fields[field].multiple}
        freeSolo={fields[field].freeSolo}
        options={options}
        getOptionLabel={
          fields[field].getOptionLabel
            ? fields[field].getOptionLabel
            : (option) => option.label
        }
        isOptionEqualToValue={
          fields[field].isOptionEqualToValue
            ? fields[field].isOptionEqualToValue
            : (option, value) => option.id === value.id
        }
        value={values[field]}
        onChange={(event, newValue) => {
          console.log(newValue)
          if (errors[field] || !!newValue) {
            setErrors({ ...errors, [field]: false })
          }

          setValues({ ...values, [field]: newValue })
        }}
        onBlur={(e) => {
          if (fields[field].multiple && values[field].length === 0) {
            setErrors({ ...errors, [field]: true })
          } else if (values[field] === '') {
            setErrors({ ...errors, [field]: true })
          }
        }}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue)
          if (fields[field].fetchOptions && inputValue !== '') {
            debounced(newInputValue)
          }
        }}
        renderTags={(value, getTagProps) => {
          return value.map((option, index) => (
            <Chip
              variant="outlined"
              label={
                fields[field].getOptionLabel
                  ? fields[field].getOptionLabel(option)
                  : option.label
              }
              {...getTagProps({ index })}
            />
          ))
        }}
        renderOption={(props, option) => {
          if (fields[field].renderOption) {
            return fields[field].renderOption(props, option)
          } else {
            return (
              <Box component="li" {...props}>
                {fields[field].getOptionLabel
                  ? fields[field].getOptionLabel(option)
                  : option.label}
              </Box>
            )
          }
        }}
        renderInput={(params) => {
          return (
            <TextField
              {...params}
              label={fields[field].label}
              placeholder={fields[field].label}
              fullWidth={fields[field].fullWidth}
              size={fields[field].size || 'medium'}
              InputProps={{
                ...params.InputProps,
                startAdornment: fields[field].startAdornment ? (
                  <InputAdornment position="start">
                    {fields[field].startAdornment}
                  </InputAdornment>
                ) : (
                  params.InputProps.startAdornment
                ),
              }}
              inputProps={{ ...params.inputProps }}
            />
          )
        }}
      />
    </Grid>
  )
}
