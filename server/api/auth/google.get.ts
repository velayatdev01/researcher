export default defineEventHandler(() => {
  throw createError({
    statusCode: 501,
    statusMessage: 'Google OAuth is planned in phase 2.1 (provider integration)',
  })
})
