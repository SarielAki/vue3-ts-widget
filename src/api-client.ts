import axios, { AxiosInstance } from "axios";
const apiClient: AxiosInstance = axios.create({
    baseURL: "https://api.openweathermap.org/data/2.5",
    headers: {
        "Content-type": "application/json",
    },
});
export default apiClient;
