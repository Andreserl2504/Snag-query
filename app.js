import zodUrlValidation from './zod/url.js'

class Q {
  constructor({ URL }) {
    const {
      data: url,
      success: urlSucces,
      error: urlError
    } = zodUrlValidation(URL)
    if (urlSucces) {
      this.URL = url
    } else if (urlError) {
      console.log(new Error("You've to type a base URL"))
    }
  }
  getQuery({ path = '', header = '' }) {
    let [data, isSucces, isError, isLoading] = [undefined, false, false, false]

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

const q = new Q({ URL: 'akljslkaj' })

const { data } = q.getQuery({})
console.log(q)
