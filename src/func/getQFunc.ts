import { format } from '../../global.js'
import { formatQ } from './formatQ.ts'

type GetQFuncParam = {
  url: string
  header: string
  QHeader: string | undefined
  format?: format
} 

export default <DataType>({ url, header, QHeader, format }: GetQFuncParam) =>
  new Promise<DataType>((res, rej) =>
    fetch(url, {
      headers: {
        'Content-Type':
          !!header && header.toLowerCase() === 'json'
            ? 'application/json'
            : typeof QHeader === 'string' && QHeader.toLowerCase() === 'json'
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
          const info: DataType = format(json)
          if (info) {
            res(info)
          }
        } else {
          res(json)
        }
      })
      .catch((e) => {
        rej(new Error(e))
      })
  )
