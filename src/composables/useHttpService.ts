import axios, { AxiosError } from "axios"

const useHttpService = {
  get: async (url: string, params: { [key: string]: string | number } = {}) => {
    try {
      const response = await axios.get(url, { params })
      return response.data
    } catch (error: any) {
      return false
    }
  },
}

export default useHttpService
