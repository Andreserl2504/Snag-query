import { formatQ } from './formatQ.ts'

export default ({ urls = [], header = '', QHeader, format }) =>
  Promise.all(
    Array.from({ length: urls.length }, async (_, i) => {
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
            const info = formatQ(format, json)
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
