import zodUrlValidation from './src/zod/url.ts'
import getQFunc from './src/func/getQFunc.ts'
import getQsFunc from './src/func/getQsFunc.ts'
import type { format } from './global.d.ts'

interface QObjectParams {
  URL?: string
  header?: string
}

interface GetQParams {
  path: string
  header?: string
  format?: format
}

interface GetQsParams {
  paths?: string[]
  header?: string
  createPathsFn?: () => string[]
  format?: format
}

export class Q {
  URL?: string
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
  getQ<DataType>({ path = '', header = '', format }: GetQParams) {
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

    // if (this.urlSuccess) {
    // }
    let data = getQFunc<DataType>({
      url: url,
      header: header,
      QHeader: this.header,
      format: format
    })
    return {
      data,
      refetch: ({ rHeader, rFormat }: { rHeader?: string; rFormat?: format }) =>
        getQFunc({
          url: url,
          header: rHeader ? rHeader : header,
          QHeader: this.header,
          format: rFormat ? rFormat : format
        })
    }
  }
  getQs<DataType>({
    paths = [],
    header = '',
    format,
    createPathsFn
  }: GetQsParams) {
    // CREATE A VALIDATION IF THE DEV TYPE AN URL IN path PARAM
    // AND THE URL ON THE Q OBJECT ALREADY EXIST
    //
    //  TO-DO

    try {
      if (Array.isArray(paths) && paths.length > 0) {
        let URLS_PROTOTYPE = Array.from({ length: paths.length }, (_, i) => {
          return this.URL
            ? this.URL[this.URL.length - 1] !== '/' && paths[i][0] !== '/'
              ? `${this.URL}/${paths[i]}`
              : this.URL[this.URL.length - 1] === '/' && paths[i][0] === '/'
              ? `${this.URL.slice(0, -1)}/${paths[i].slice(1)}`
              : this.URL + paths[i]
            : paths[i]
        })
        let urls = Array.from({ length: URLS_PROTOTYPE.length }, (_, i) => {
          const {
            data: url,
            success: urlSuccess,
            error: urlError
          } = zodUrlValidation(URLS_PROTOTYPE[i])
          if (urlSuccess) {
            return url
          } else if (urlError) {
            throw new Error('You must to create an array with URLs')
          }
        })

        if (!urls.some((url: string | undefined) => url === undefined)) {
          let data = getQsFunc<DataType>({
            urls: urls,
            header: header,
            QHeader: this.header,
            format: format
          })
          return {
            data,
            refetch: ({
              rHeader,
              rFormat
            }: {
              rHeader?: string
              rFormat?: format
            }) =>
              getQsFunc({
                urls: urls,
                header: rHeader ? rHeader : header,
                QHeader: this.header,
                format: rFormat ? rFormat : format
              })
          }
        }
      } else {
        throw new Error('Something went wrong :(')
      }
    } catch (e) {
      console.error(e)
    }
    try {
      if (createPathsFn !== undefined) {
        let urls = createPathsFn()
      }
    } catch (e) {
      console.error(e)
    }
  }
  mutateQ<DataType>({
    path = '',
    method = 'POST',
    body = {},
    header = '',
    format
  }) {
    let data = undefined

    // const { data, success, error } = zodUrlValidation(path)

    const fetchingDataPost = ({ body, format }) => {}

    return {
      data,
      refetch: ({ rBody, rFormat }: { rBody?: object; rFormat?: format }) =>
        fetchingDataPost({
          body: rBody ? rBody : body,
          format: rFormat ? rFormat : format
        })
    }
  }
}












const q = new Q({ URL: 'https://pokeapi.co/api/v2/' })

const { data: datas, refetch: reGet } = q.getQs<{ name: string; id: number }>({
  paths: ['/pokemon/1', '/pokemon/4', '/pokemon/7'],
  format: (param: { name: string }) => {
    return { name: param.name }
  }
})
const { data, refetch: reGets } = q.getQ<{ name: string; id: number }>({
  path: '/pokemon/151',
  format: (param) => {
    return { name: param.name }
  }
})

const rdata = reGet({
  rFormat: (param) => {
    return {
      name: param.name,
      id: param.id
    }
  }
})

const rdatas = reGets({
  rFormat: (param) => {
    return {
      name: param.name,
      id: param.id
    }
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
