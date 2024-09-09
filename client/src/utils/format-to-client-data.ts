export const formatToClientData = (date?: Date) => {
  if (!date) {
    return ""
  }

  return new Date(date).toLocaleDateString()
}
