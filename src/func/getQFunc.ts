import { formatQ } from './formatQ.ts'

type GetQFuncParam = {
  url: string
  header: string
  QHeader: string
  format: { [key: string]: (param: any) => any }
} 

export default ({ url, header, QHeader, format }: GetQFuncParam) =>
  new Promise((res, rej) =>
    fetch(url, {
      headers: {
        'Content-Type':
          !!header && header.toLowerCase() === 'json'
            ? 'application/json'
            : QHeader.toLowerCase() === 'json'
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
          const info = formatQ(format, json)
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
