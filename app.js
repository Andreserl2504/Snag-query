import zodUrlValidation from './zod/url.js'
import { formatQ } from './func/formatQ.js'
export class Q {
  constructor({ URL }) {
    const {
      data: url,
      success: urlSucces,
      error: urlError
    } = zodUrlValidation(URL)
    if (urlSucces) {
      this.URL = url
      this.urlSucces = urlSucces
    } else if (urlError) {
      console.log(new Error("You've to type a base URL"))
    }
  }
  getQuery({ path = '', header = 'JSON', format }) {
    let [data, isSucces, isError, isLoading] = [undefined, false, false, false]
    const url = this.URL
      ? this.URL[this.URL.length - 1] !== '/' && path[0] !== '/'
        ? `${this.URL}/${path}`
        : this.URL[this.URL.length - 1] === '/' && path[0] === '/'
        ? `${this.URL.slice(0, -1)}/${path.slice(1)}`
        : this.URL + path
      : path
    if (this.urlSucces) {
      let info = new Promise((res, rej) =>
        fetch(url, {
          headers: {
            'Content-Type':
              header.toLowerCase() === 'json' ? 'application/json' : ''
          }
        })
          .then((response) => {
            if (response.ok) {
              return response.json()
            } else {
              isError = true
            }
          })
          .then((json) => {
            if (format) {
              res(formatQ(format, json))
            } else {
              res(json)
            }
          })
      )
      info.then(info => {
        data = info
        console.log(info)
      })
    }
    return {
      data,
      isSucces,
      isError,
      isLoading
    }
  }
  getQueries({ paths = [], header = '' }) {
    let [data, isSucces, isError, isLoading] = [undefined, false, false, false]

    return {
      data,
      isSucces,
      isError,
      isLoading
    }
  }
}

const q = new Q({ URL: 'https://pokeapi.co/api/v2/' })
const { data } = q.getQuery({
  path: '/pokemon/ditto',
  format: { name: (param) => param.name }
})

console.log(data)

// data.then((data) => {
//   console.log(data)
// })
