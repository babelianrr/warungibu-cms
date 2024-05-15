import axios from 'axios'

const baseURL = process.env.REACT_APP_BASE_URL

function getToken() {
  return localStorage.getItem('token')
}

async function serverAuthAPI({url, payload, method = 'GET', ...rest}) {
  try {
    const {data} = await axios({
      baseURL: baseURL,
      url: url,
      method: method,
      data: payload,
      headers: {
        'x-auth-token': getToken(),
      },
      ...rest,
    })
    return data
  } catch (err) {
    throw err.response.data
  }
}

export default serverAuthAPI
