import type { format } from '../../Types.js'

type GetQFuncParam = {
  url: string
  header: string
  QHeader: string
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
          rej(new Error("Something went wrong :'("))
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
