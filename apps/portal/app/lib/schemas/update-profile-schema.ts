import {
  DESCRIPTION_MAX_LENGTH,
  MAX_NAME_LENGTH,
  MAX_UPLOAD_SIZE,
} from 'app/consts'
import { z } from 'zod'

export function updateProfileSchema() {
  return z.object({
    display_name: z
      .string({ required_error: 'Please enter a display name.' })
      .max(MAX_NAME_LENGTH, {
        message: 'Identity name must not be longer than 100 characters.',
      }),
    description: z
      .string({
        required_error: 'Please enter a description.',
      })
      .min(2, {
        message: 'Description must be at least 2 characters.',
      })
      .max(DESCRIPTION_MAX_LENGTH, {
        message: 'Description must not be longer than 512 characters.',
      })
      .optional(),
    image_url: z
      .instanceof(File)
      .refine((file) => {
        return file.size <= MAX_UPLOAD_SIZE
      }, 'File size must be less than 5MB')
      .refine((file) => {
        return ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(
          file.type,
        )
      }, 'File must be a .png, .jpg, .jpeg, .gif, or .webp')
      .or(z.string())
      .optional(),
  })
}
