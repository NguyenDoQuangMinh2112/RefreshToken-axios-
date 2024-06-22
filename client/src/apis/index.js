import authorizedAxiosInstance from '~/axios'
import { API_ROOT } from '~/utils/constants'

export const handleLogoutAPI = async () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('userInfo')
  // Trường hợp 2: sử dụng HTTP only cookies -> Dùng api để xử lý remove Cookies
  return await authorizedAxiosInstance.delete(`${API_ROOT}/v1/users/logout`)
}

export const refreshTokenAPI = async (refreshToken) => {
  return await authorizedAxiosInstance.put(`${API_ROOT}/v1/users/refresh_token`, { refreshToken })
}
