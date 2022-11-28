import validator from 'validator'

export default function validate(values) {
  const validators = {
    avatar: (val) => !!val.file || !!val.secure_url,
    poster: (val) => !!val.file || !!val.secure_url,
    trailer: (val) => !!val.file || !!val.secure_url,
    email: validator.isEmail,
    name: (val) => val.length > 3,
    password: (val) => val.length > 2,
    confirmation: (val) => val.length > 2,
    number: validator.isNumeric,
    title: (val) => val.length > 3,
    storyline: (val) => val.length > 20,
    tags: (val) => val.length > 1,
    date: (val) => validator.isDate(val),
    birth: (val) => validator.isDate(val),
    nominations: (val) =>
      typeof val === 'string' ? validator.isNumeric(val) && val > -1 : val > -1,
    awards: (val) =>
      typeof val === 'string' ? validator.isNumeric(val) && val > -1 : val > -1,
    biography: (val) => val.length > 100,
    gender: (val) => val.id === 1 || val.id === 2 || val.id === 3,
    nationality: (val) => validator.isISO31661Alpha2(val.code),
    director: (val) => validator.isMongoId(val.id),
    release_date: (val) => validator.isDate(val),
    status: (val) => val === 'Public' || val === 'Private',
    type: (val) => ['Film'].includes(val),
    genres: (val) => ['Drama', 'Comedy'].includes(val),
    cast_crew: (val) =>
      val.every(
        (cast) =>
          validator.isMongoId(cast.actor.id) && !validator.isEmpty(cast.role),
      ),
    writers: (val) => val.every((writer) => validator.isMongoId(writer.id)),
    language: (val) => validator.isAlpha(val.code),
    content: (val) => true,
  }

  const valid = {}

  Object.keys(values).forEach((field) => {
    console.log(field, validators[field])
    valid[field] = validators[field](values[field])
  })

  return valid
}
