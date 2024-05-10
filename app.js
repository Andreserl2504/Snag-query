import zodUrlValidation from './zod/url.js'
import { formatQ } from './func/formatQ.js'
export class Q {
  constructor({ URL, header = 'JSON' }) {
    const {
      data: url,
      success: urlSuccess,
      error: urlError
    } = zodUrlValidation(URL)
    this.header = header
    if (urlSuccess) {
      this.URL = url
      this.urlSuccess = urlSuccess
    } else if (urlError) {
      console.log(new Error('You must to type a base URL'))
    }
  }
  getQ({ path = '', header = '', format }) {
    let [data, isSuccess, isError, isLoading] = [undefined, false, false, false]

    // CREATE A VALIDATION IF THE DEV TYPE AN URL EN path PARAM
    // AND THE URL ON THE Q OBJECT ALREADY EXIST
    //
    //  TO-DO

    const url = this.URL
      ? this.URL[this.URL.length - 1] !== '/' && path[0] !== '/'
        ? `${this.URL}/${path}`
        : this.URL[this.URL.length - 1] === '/' && path[0] === '/'
        ? `${this.URL.slice(0, -1)}/${path.slice(1)}`
        : this.URL + path
      : path

    if (this.urlSuccess) {
      data = new Promise((res, rej) =>
        fetch(url, {
          headers: {
            'Content-Type':
              header.toLowerCase() === 'json'
                ? 'application/json'
                : this.header.toLowerCase() === 'json'
                ? 'application/json'
                : ''
          }
        })
          .then((response) => {
            if (response.ok) {
              return response.json()
            } else {
              throw new Error("Something went wrong :'(")
            }
          })
          .then((json) => {
            if (format) {
              let info = formatQ(format, json)
              if (info) {
                res(info)
              }
            } else {
              res(json)
            }
          })
          .catch((e) => {
            isError = true
            rej(new Error(e))
          })
      )
    }
    return {
      data,
      isSuccess,
      isError,
      isLoading
    }
  }
  getQs({ paths = [], header = '', format }) {
    let [data, isSuccess, isError, isLoading] = [undefined, false, false, false]
    let urls = []

    // CREATE A VALIDATION IF THE DEV TYPE AN URL EN path PARAM
    // AND THE URL ON THE Q OBJECT ALREADY EXIST
    //
    //  TO-DO

    try {
      if (typeof paths === 'object') {
        let URLS_PROTOTYPE = Array.from({ length: paths.length }, (_, i) => {
          return this.URL
            ? this.URL[this.URL.length - 1] !== '/' && paths[i][0] !== '/'
              ? `${this.URL}/${paths[i]}`
              : this.URL[this.URL.length - 1] === '/' && paths[i][0] === '/'
              ? `${this.URL.slice(0, -1)}/${paths[i].slice(1)}`
              : this.URL + paths[i]
            : paths[i]
        })
        urls = Array.from({ length: URLS_PROTOTYPE.length }, (_, i) => {
          const {
            data: url,
            success: urlSuccess,
            error: urlError
          } = zodUrlValidation(URLS_PROTOTYPE[i])
          if (urlSuccess) {
            return url
          } else if (urlError) {
            console.log(new Error('You must to add urls to array'))
          }
        })
      }
    } catch (e) {}
    data = Promise.all(
      Array.from({ length: urls.length }, (_, i) => {
        return fetch(urls[i], {
          headers: {
            'Content-Type':
              header.toLowerCase() === 'json'
                ? 'application/json'
                : this.header.toLowerCase() === 'json'
                ? 'application/json'
                : ''
          }
        })
          .then((response) => {
            if (response.ok) {
              return response.json()
            } else {
              isError = true
              throw new Error("Something went wrong :'(")
            }
          })
          .then((json) => {
            if (format) {
              let info = formatQ(format, json)
              if (info) {
                return info
              }
            } else {
              return json
            }
          })
          .catch((e) => {
            console.log(e)
          })
      })
    )

    return {
      data,
      isSuccess,
      isError,
      isLoading
    }
  }
  postQ({ path = '', body = {}, header = '', format }) {}
}

const q = new Q({ URL: 'https://pokeapi.co/api/v2/' })
const { data } = q.getQs({
  paths: ['/pokemon/1', '/pokemon/4', '/pokemon/7'],
  format: { name: (param) => param.name }
})
data
  .then((info) => {
    console.log(info)
  })
  .catch((e) => {
    console.log(e)
  })
