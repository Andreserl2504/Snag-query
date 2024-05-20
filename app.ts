import { zodUrlValidation, zodUrlValidationRequiered } from './src/zod/url.ts'
import getSnagFunc from './src/func/getSnagFunc.ts'
import mutateSnag from './src/func/mutateSnag.ts'
import getSnagsFunc from './src/func/getSnagsFunc.ts'
import formatURL from './src/func/formatURL.ts'
import type {
  BodyType,
  GetSnagsParams,
  GetSnagParams,
  MutateSnagParams,
  SnagObjectParams,
  format
} from './Types.js'

export class Snag {
  URL?: string
  header: string
  constructor({ URL, header = 'JSON' }: SnagObjectParams) {
    try {
      if (header.toLowerCase() === 'json') {
        this.header = header
      } else {
        throw new Error("Something went wrong :'(")
      }
      if (URL) {
        const { data: url, success: urlSuccess } = zodUrlValidation(URL)
        if (urlSuccess) {
          this.URL = url
        } else {
          throw new Error('You must to type a base URL')
        }
      }
    } catch (e) {
      console.error(e)
    }
  }
  getSnag<DataType>({ path = '', header = '', format }: GetSnagParams) {
    const { data: urlValidation, success } = zodUrlValidationRequiered(path)
    if (success) {
      const data = getSnagFunc<DataType>({
        url: urlValidation,
        header: header,
        QHeader: this.header,
        format: format
      })
      return {
        data,
        refetch: <refetchData>({ rFormat }: { rFormat?: format }) =>
          getSnagFunc<refetchData | DataType>({
            url: urlValidation,
            header: header,
            QHeader: this.header,
            format: rFormat ? rFormat : format
          })
      }
    } else {
      const url = formatURL(this.URL, path)
      const { data: urlValidation, success } = zodUrlValidationRequiered(url)
      if (success) {
        const data = getSnagFunc<DataType>({
          url: urlValidation,
          header: header,
          QHeader: this.header,
          format: format
        })
        return {
          data,
          refetch: <refetchData>({ rFormat }: { rFormat?: format }) =>
            getSnagFunc<refetchData | DataType>({
              url: url,
              header: header,
              QHeader: this.header,
              format: rFormat ? rFormat : format
            })
        }
      } else {
        throw new Error("Something went wrong :'(")
      }
    }
  }
  getSnags<DataType>({
    paths = [],
    header = '',
    format,
    createPathsFn
  }: GetSnagsParams) {
    try {
      const urlValidation = Array.from({ length: paths.length }, (_, i) => {
        const { success } = zodUrlValidationRequiered(paths[i])
        return success
      })

      if (!urlValidation.some((isUrl) => isUrl === false)) {
        let data = getSnagsFunc<DataType>({
          urls: paths,
          header: header,
          QHeader: this.header,
          format: format
        })
        return {
          data,
          refetch: <refetchData>({ rFormat }: { rFormat?: format }) =>
            getSnagsFunc<refetchData | DataType>({
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

      if (paths) {
        if (
          Array.isArray(paths) &&
          paths.length > 0 &&
          !paths.some((url) => url === undefined)
        ) {
          let URLS_PROTOTYPE = Array.from({ length: paths.length }, (_, i) => {
            return formatURL(this.URL, paths[i])
          })
          if (!URLS_PROTOTYPE.some((url) => url === undefined)) {
            const urls = Array.from(
              { length: URLS_PROTOTYPE.length },
              (_, i) => {
                const { data: url, success: urlSuccess } =
                  zodUrlValidationRequiered(URLS_PROTOTYPE[i])
                if (urlSuccess) {
                  return url
                } else {
                  throw new Error('You must to create an array with URLs')
                }
              }
            )
            const data = getSnagsFunc<DataType>({
              urls: urls,
              header: header,
              QHeader: this.header,
              format: format
            })
            return {
              data,
              refetch: <refetchData>({ rFormat }: { rFormat?: format }) =>
                getSnagsFunc<refetchData | DataType>({
                  urls: urls,
                  header: header,
                  QHeader: this.header,
                  format: rFormat ? rFormat : format
                })
            }
          }
        } else {
          throw new Error('Something went wrong :(')
        }
      }

      if (createPathsFn !== undefined) {
        let urls = createPathsFn()

        const urlsValidation = Array.from({ length: urls.length }, (_, i) => {
          const { data, success } = zodUrlValidationRequiered(urls[i])
          if (success) {
            return data
          } else {
            throw new Error('Create a function to make an array')
          }
        })
        const data = getSnagsFunc<DataType>({
          urls: urlsValidation,
          header: header,
          QHeader: this.header,
          format: format
        })
        return {
          data,
          refetch: <refetchData>({ rFormat }: { rFormat?: format }) =>
            getSnagsFunc<refetchData | DataType>({
              urls: urls,
              header: header,
              QHeader: this.header,
              format: rFormat ? rFormat : format
            })
        }
      } else {
        throw new Error('Create a function to make an array')
      }
    } catch (e) {
      console.error(e)
    }
    throw new Error('Create URLs within the array')
  }

  mutateSnag<DataType>({
    path = '',
    method = 'POST',
    header = ''
  }: MutateSnagParams) {
    try {
      const { data: urlValidation, success } = zodUrlValidationRequiered(path)
      if (success) {
        return {
          mutate: ({ body, format }: { body?: BodyType; format?: format }) =>
            mutateSnag<DataType>({
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
            mutate: ({ body, format }: { body?: BodyType; format?: format }) =>
              mutateSnag<DataType>({
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
