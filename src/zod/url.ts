import { string } from 'zod'

const schema = string().url().optional()

export default (url) => {
  return schema.safeParse(url)
}
