export const basicEmailValid = (email: string) => {
  return /(.+)@(.+){2,}\.(.+){2,}/.test(email)
}