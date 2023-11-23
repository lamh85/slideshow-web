import { useState } from 'react'
import env from 'react-dotenv'

type HttpMethod = 'get' | 'post' | 'patch' | 'delete'

interface InitializeArgs {
  path: string
  body?: object
  headers?: object
  method: HttpMethod
}

// Principles:
//  Make it easy to use for the client. EG: easy arguments.
//  Preserve data from responses.
//  Black box: minimal arguments to initialize, minimal return values

// TODO: A module that simplifies these arguments even more
export function useApiCall({ path, body, method, headers }: InitializeArgs) {
  const [isRequesting, setIsRequesting] = useState(false)
  const [response, setResponse] = useState(null)

  const getCache = () => {
    return null
  }

  const setCache = (response) => {
    return null
  }

  const callApi = () => {}

  const start = async () => {
    setIsRequesting(true)
    const cachedResponse = getCache()

    if (cachedResponse) {
      return cachedResponse
    }

    const url = `${env.API_URL}/${path}`

    const fetchOptions = {
      method: method.toUpperCase(),
      body: JSON.stringify(body),
      headers: new Headers(headers as HeadersInit),
    }

    const fetchRes = await fetch(url, fetchOptions)
    setIsRequesting(false)
    setResponse(fetchRes)
    setCache(fetchRes)
  }

  return {
    start,
    isRequesting,
    response,
  }
}
