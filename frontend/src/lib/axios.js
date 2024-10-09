import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.mode === "development" ? "${import.meta.env.VITE_BACKEND_BASE_URL}/api" : "/api",
    withCredentials: true, // send cookies to the server
});

export default axiosInstance;
