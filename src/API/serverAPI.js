import axios from 'axios'

const baseURL = process.env.REACT_APP_BASE_URL

const serverAuthAPI = axios.create({
  baseURL: baseURL,
})

export default serverAuthAPI
