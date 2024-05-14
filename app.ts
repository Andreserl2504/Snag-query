import zodUrlValidation from './src/zod/url.ts'
import getQFunc from './src/func/getQFunc.ts'
import getQsFunc from './src/func/getQsFunc.ts'

interface QObjectParams {
  URL?: string
  header?: string
}

interface GetQParams {
  path: string
  header: string
  format: { [key: string]: (param: any) => any }
}

interface GetQsParams {
  paths: string[]
  header: string
  format: { [key: string]: (param: any) => any }
}

export class Q {
  URL: string | undefined
  header: string
  urlSuccess: boolean | undefined
  constructor({ URL, header = 'JSON' }: QObjectParams) {
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
  getQ({ path = '', header = '', format }: GetQParams) {
    let data: undefined | Promise<unknown> = undefined
    // CREATE A VALIDATION IF THE DEV TYPE AN URL IN path PARAM
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
      data = getQFunc({
        url: url,
        header: header,
        QHeader: this.header,
        format: format
      })
    }
    return {
      data,
      refetch: ({ rHeader, rFormat }) =>
        getQFunc({
          url: url,
          header: rHeader ? rHeader : header,
          QHeader: this.header,
          format: rFormat ? rFormat : format
        })
    }
  }
  getQs({ paths = [], header = '', format }: GetQsParams) {
    let data: undefined | Promise<unknown> = undefined
    let urls: (string | undefined)[] = []

    // CREATE A VALIDATION IF THE DEV TYPE AN URL IN path PARAM
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
            throw new Error('Something went wrong :(')
          }
        })
      } else {
        throw new Error('You must to add urls to array')
      }
    } catch (e) {
      console.log(e)
    }

    data = getQsFunc({
      urls: urls,
      header: header,
      QHeader: this.header,
      format: format
    })
    return {
      data,
      refetch: ({ rHeader, rFormat }) =>
        getQsFunc({
          urls: urls,
          header: rHeader ? rHeader : header,
          QHeader: this.header,
          format: rFormat ? rFormat : format
        })
    }
  }
  mutateQ({ path = '', method = 'POST', body = {}, header = '', format }) {
    let data = undefined

    // const { data, success, error } = zodUrlValidation(path)

    const fetchingDataPost = ({ body }) => {}

    return {
      data,
      refetch: ({ rBody, rFormat }) =>
        fetchingDataPost({
          body: rBody ? rBody : body,
          format: rFormat ? rFormat : format
        })
    }
  }
}

const q = new Q({ URL: 'https://pokeapi.co/api/v2/' })

const { data: datas, refetch: reGet } = q.getQs({
  paths: ['/pokemon/1', '/pokemon/4', '/pokemon/7'],
  format: { name: (param) => param.name }
})
const { data, refetch: reGets } = q.getQ({
  path: '/pokemon/151',
  format: { "name": (param) => param.name }
})

const rdata = reGet({
  rFormat: {
    name: (param) => param.name,
    id: (param) => param.id
  }
})

const rdatas = reGets({
  rFormat: {
    name: (param) => param.name,
    id: (param) => param.id
  }
})

datas
  .then((info) => {
    console.log(info)
  })
  .catch((e) => {
    console.log(e)
  })

data.then((info) => {
  console.log(info)
})

rdata.then((info) => {
  console.log(info)
})

rdatas.then((info) => {
  console.log(info)
})
