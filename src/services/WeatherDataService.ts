import apiClient from "@/api-client";
import WeatherByCoordinates from "@/types/WeatherByCoordinates";
import WeatherByCity from "@/types/WeatherByCity";
import {AxiosResponse} from "axios";

class WeatherDataService {
    getCurrentByCoordinates(lat: number, lon: number): Promise<AxiosResponse> {
        const params: WeatherByCoordinates = {
            lat: lat,
            lon: lon,
            appid: 'fc00e982048703135b7aafdbda583f06'
        }
        return apiClient.get(`/weather`, {params})
    }

    getCurrentByCityName(city: string): Promise<AxiosResponse> {
        const params: WeatherByCity = {
            q: city,
            appid: 'fc00e982048703135b7aafdbda583f06'
        }
        return apiClient.get(`/weather`, {params})
    }

}
export default new WeatherDataService()
