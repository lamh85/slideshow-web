interface CallType {
  path: string
  method?: string
}

export const profiles: { [key: string]: CallType } = {
  GET_LOCATION: {
    path: '',
    method: '',
  },
}
