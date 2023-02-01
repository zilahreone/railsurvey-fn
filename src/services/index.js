let baseURL = 'http://localhost:3000'

export default {

  get (endpoint, token = null) {
    let headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    return fetch(baseURL + endpoint, { method: 'GET', headers })
  },
  post (endpoint, body = {}, token = null) {
    let headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
    if (token) {
      headers['Authorization'] = 'Bearer ' + token
    }
    return fetch(baseURL + endpoint, { method: 'POST', headers, body: JSON.stringify(body) })
  },
  put (endpoint, body = {}, token = null) {
    let headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
    if (token) {
      headers['Authorization'] = 'Bearer ' + token
    }
    return fetch(baseURL + endpoint, { method: 'PUT', headers, body: JSON.stringify(body) })
  },
  delete (endpoint, token = null) {
    let headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
    if (token) {
      headers['Authorization'] = 'Bearer ' + token
    }
    return fetch(baseURL + endpoint, { method: 'DELETE', headers })
  }
}