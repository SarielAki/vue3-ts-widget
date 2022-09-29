import type {InjectionKey, Ref} from 'vue'
import WeatherLocations from "@/types/WeatherLocations";

export interface LocationStorage{
    locations: Ref<WeatherLocations[]>,
    removeLocation: (id: number) => void
}

export const LocationStorageKey = Symbol() as InjectionKey<LocationStorage>
