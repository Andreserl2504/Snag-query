import { zodUrlValidation, zodUrlValidationRequiered } from './src/zod/url.ts'
import getQFunc from './src/func/getQFunc.ts'
import mutateQ from './src/func/mutateQ.ts'
import getQsFunc from './src/func/getQsFunc.ts'
import formatURL from './src/func/formatURL.ts'
import type { BodyType, fetchMethod, format } from './global.d.ts'

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

interface MutateQParams {
  path: string
  header?: string
  method: fetchMethod
  format: format
  body: BodyType
}

export class Q {
  URL?: string
  header: string
  constructor({ URL, header = 'JSON' }: QObjectParams) {
    if (URL) {
      const { data: url, success: urlSuccess } = zodUrlValidation(URL)
      if (urlSuccess) {
        this.URL = url
      } else {
        console.log(new Error('You must to type a base URL'))
      }
    }
    this.header = header
  }
  getQ<DataType>({ path = '', header = '', format }: GetQParams) {
    const { data: urlValidation, success } = zodUrlValidationRequiered(path)
    if (success) {
      const data = getQFunc<DataType>({
        url: urlValidation,
        header: header,
        QHeader: this.header,
        format: format
      })
      return {
        data,
        refetch: <refetchData>({ rFormat }: { rFormat?: format }) =>
          getQFunc<refetchData | DataType>({
            url: urlValidation,
            header: header,
            QHeader: this.header,
            format: rFormat ? rFormat : format
          })
      }
    } else {
      const url = formatURL(this.URL, path)
      let data = getQFunc<DataType>({
        url: url,
        header: header,
        QHeader: this.header,
        format: format
      })
      return {
        data,
        refetch: <refetchData>({ rFormat }: { rFormat?: format }) =>
          getQFunc<refetchData | DataType>({
            url: url,
            header: header,
            QHeader: this.header,
            format: rFormat ? rFormat : format
          })
      }
    }
  }
  getQs<DataType>({
    paths = [],
    header = '',
    format,
    createPathsFn
  }: GetQsParams) {
    try {
      const urlValidation = Array.from({ length: paths.length }, (_, i) => {
        const { success } = zodUrlValidationRequiered(paths[i])
        return success
      })

      if (!urlValidation.some((isUrl) => isUrl === false)) {
        let data = getQsFunc<DataType>({
          urls: paths,
          header: header,
          QHeader: this.header,
          format: format
        })
        return {
          data,
          refetch: <refetchData>({ rFormat }: { rFormat?: format }) =>
            getQsFunc<refetchData | DataType>({
              urls: paths,
              header: header,
              QHeader: this.header,
              format: rFormat ? rFormat : format
            })
        }
      } else if (
        urlValidation.some((isUrl) => isUrl === true) &&
        urlValidation.some((isUrl) => isUrl === false)
      ) {
        throw new Error('You must to type URls or paths in array, no both')
      }

      if (
        Array.isArray(paths) &&
        paths.length > 0 &&
        !paths.some((url) => url === undefined)
      ) {
        let URLS_PROTOTYPE = Array.from({ length: paths.length }, (_, i) => {
          return formatURL(this.URL, paths[i])
        })
        if (!URLS_PROTOTYPE.some((url) => url === undefined)) {
          const urls = Array.from({ length: URLS_PROTOTYPE.length }, (_, i) => {
            const { data: url, success: urlSuccess } =
              zodUrlValidationRequiered(URLS_PROTOTYPE[i])
            if (urlSuccess) {
              return url
            } else {
              throw new Error('You must to create an array with URLs')
            }
          })
          if (!urls.some((url) => url === undefined)) {
            let data = getQsFunc<DataType>({
              urls: urls,
              header: header,
              QHeader: this.header,
              format: format
            })
            return {
              data,
              refetch: <refetchData>({ rFormat }: { rFormat?: format }) =>
                getQsFunc<refetchData | DataType>({
                  urls: urls,
                  header: header,
                  QHeader: this.header,
                  format: rFormat ? rFormat : format
                })
            }
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

    return {
      data: [],
      refetch: () =>
        console.error(
          'You must to create a URL array in getQs method to get a response'
        )
    }
  }
  mutateQ<DataType>({
    path = '',
    method = 'POST',
    header = ''
  }: MutateQParams) {
    try {
      const { data: urlValidation, success } = zodUrlValidationRequiered(path)
      if (success) {
        return {
          mutate: ({ body, format }: { body: object; format?: format }) =>
            mutateQ<DataType>({
              url: urlValidation,
              header: header,
              QHeader: this.header,
              method: method,
              body: body,
              format: format
            })
        }
      } else {
        const url = formatURL(this.URL, path)
        const { data: urlValidation, success } = zodUrlValidationRequiered(url)
        if (success) {
          return {
            mutate: ({ body, format }: { body: object; format?: format }) =>
              mutateQ<DataType>({
                url: urlValidation,
                header: header,
                QHeader: this.header,
                method: method,
                body: body,
                format: format
              })
          }
        }
      }
    } catch (e) {
      throw new Error('')
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

const rdata = reGet<{ name: string; id: number }>({
  rFormat: (param: { name: string; id: number }) => {
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
