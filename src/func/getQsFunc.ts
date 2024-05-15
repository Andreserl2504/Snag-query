import type { format } from '../../global.d.ts'

type getQsFuncParams = {
  urls: string[]
  header: string
  QHeader: string
  format?: format
}

export default <DataType>({ urls = [], header, QHeader, format }: getQsFuncParams) =>
  Promise.all<DataType>(
    Array.from({ length: urls.length }, async (_, i) => {
      if (typeof urls[i] === 'string') {
        return fetch(urls[i], {
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
              const info = format(json)
              if (info) {
                return info
              }
            } else {
              return json
            }
          })
          .catch((e) => {
            console.error(e)
          })
      }
    })
  )
