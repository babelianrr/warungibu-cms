import {useState, useEffect} from 'react'

function validateEmail(string) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(string).toLowerCase())
}

function validationPhone(string) {
  if (string[0] === '0') return false

  const re = /^\+[1-9]\d{9,13}$/g
  return re.test(String('+62' + string.toLowerCase()))
}

function validationNumber(string) {
  return !isNaN(Number(string))
}

export default function useInput(initialState, validation = {}) {
  const [state, setState] = useState(initialState)
  const [onFocus, setOnFocus] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (onFocus) {
      let isEmail
      let isPhone
      let isExists
      let isLengthMin
      let isNumber

      if (validation.required) {
        isExists = state !== ''
      }
      if (validation.emailValidation) {
        isEmail = validateEmail(state)
      }
      if (validation.phoneValidation) {
        isPhone = validationPhone(state)
      }
      if (validation.minLengthValidation) {
        isLengthMin = state.length >= validation.minLengthValidation.min
      }

      if (validation.number) {
        isNumber = validationNumber(state)
      }

      if (validation.required && !isExists) {
        setError(validation.required.message)
      } else {
        if (validation.emailValidation && !isEmail) {
          setError(validation.emailValidation.message)
        } else {
          if (validation.phoneValidation && !isPhone) {
            setError(validation.phoneValidation.message)
          } else {
            if (validation.minLengthValidation && !isLengthMin) {
              setError(validation.minLengthValidation.message)
            } else {
              if (validation.number && !isNumber) {
                setError(validation.number.message)
              } else {
                setError(null)
              }
            }
          }
        }
      }
    }
  }, [state, onFocus, validation])

  return [state, setState, setOnFocus, error]
}
