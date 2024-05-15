import { string } from 'zod'

const schema = string().url().optional()

const requieredSchema = string().url()

export const zodUrlValidation = (url: string | undefined) => {
  return schema.safeParse(url)
}

export const zodUrlValidationRequiered = (url: string) => {
  return requieredSchema.safeParse(url)
}