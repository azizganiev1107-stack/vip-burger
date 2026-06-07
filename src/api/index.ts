import axios from "axios"

const API_URL = import.meta.env.VITE_API_KEY

export const $host = axios.create({
  baseURL: API_URL,
})

export const $authHost = axios.create({
  baseURL: API_URL, 
})

$authHost.interceptors.request.use((config) => {
	// 1. Пытаемся взять токен напрямую
	let token = localStorage.getItem("token")

	// 2. Если нет напрямую, пытаемся вытащить из хранилища Zustand (persist)
	if (!token) {
		const authData = localStorage.getItem("auth")
		if (authData) {
			try {
				const parsed = JSON.parse(authData)
				token = parsed.state?.user?.data?.token
			} catch (e) {
				console.error("Error parsing auth data", e)
			}
		}
	}

	if (token && config.headers) {
		config.headers["Authorization"] = `Bearer ${token}`
	}

	return config
})

const handle401Error = (error: any) => {
	if (error.response?.status === 401) {
		localStorage.removeItem("token")
		localStorage.removeItem("auth")
		if (window.location.pathname !== "/login") {
			window.location.href = "/login"
		}
	}
	return Promise.reject(error)
}

$authHost.interceptors.response.use(
	(response) => response,
	handle401Error
)

$host.interceptors.response.use(
	(response) => response,
	handle401Error
)