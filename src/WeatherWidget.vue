<template>
  <div class="widget-wrapper">
    <weather-top-panel
        :weather-data="weather"
    >
    </weather-top-panel>
    <weather-info
        @cycle-cities="cycleCities"
        v-if="isWeatherDisplayMode"
        :weather-data="weather"
    ></weather-info>
    <img class="loading-animation" v-if="isLoadingAnimation" src="https://specials-f378ef5.servicecdn.ru/RegardQuest/images/weather/loading.svg" alt="Loading...">
    <weather-settings
        v-if="isSettingsMode"
        @add-location-by-city="addLocation"
    >
    </weather-settings>
    <span class="error-message">{{ addLocationErrorMessage }}</span>
  </div>

</template>

<script setup lang="ts">
import {computed, onMounted, provide, readonly, ref, watch, watchEffect} from "vue";
import WeatherDataService from "@/services/WeatherDataService";
import WeatherLocations from "@/types/WeatherLocations";
import WeatherSettings from "@/components/WeatherSettings.vue";
import WeatherInfo from "./components/WeatherInfo.vue"
import WeatherTopPanel from "./components/WeatherTopPanel.vue"
import {AxiosResponse} from "axios";
import { LocationStorageKey } from "@/types/LocationStorage";

const weather = ref({})
const loading = ref(true)
const isSettingsMode = ref(false)
const locations = ref<WeatherLocations[]>([])

watchEffect(() => {
  if (locations.value?.length) {
    localStorage.setItem('locations', JSON.stringify(locations.value))
  }
})

watch(locations.value, (value, oldValue) => {
  getWeatherOfSavedCity(locations.value[currentCityToDisplay.value].city)
  if (value.length < oldValue.length) {
    currentCityToDisplay.value = 0
  }
})

watch(locations, () => {
  getWeatherOfSavedCity(locations.value[currentCityToDisplay.value].city)

})

onMounted(() => {
  getSavedLocation()
})


function getWeatherByCoords(lat: number, lon: number) {
  loading.value = true
  WeatherDataService.getCurrentByCoordinates(lat, lon)
      .then((response: AxiosResponse) => {
        saveLocationFromResponse(response)
        weather.value = response.data
        loading.value = false
      })
      .catch((e: Error) => {
        console.log(e)
      })
}



function changeMode() {
  isSettingsMode.value = !isSettingsMode.value
}

function removeLocation(id: number) {
  locations.value = locations.value.filter((item) => {
    return item.id !== id
  })
  if (locations.value.length) {
    getWeatherOfSavedCity(locations.value[0].city)
  } else {
    getWeatherOfUserLocation()
  }
}


function saveLocationFromResponse(response: AxiosResponse) {
  if (response.data) {
    locations.value?.push({
      id: locations.value?.length? Math.max(...locations.value.map(item => item.id)) + 1: 1,
      city: response.data.name,
      country: response.data.sys.country
    })
    locations.value = [...new Map(locations.value?.map(item =>
        [item.city, item])).values()]
  }
}

const addLocationErrorMessage = ref('')

function addLocation(city: string) {
  addLocationErrorMessage.value = ''
  WeatherDataService.getCurrentByCityName(city)
      .then((response: AxiosResponse) => {
        saveLocationFromResponse(response)
      })
      .catch((e: Error) => {
        console.log(e)
      })
}

function getWeatherOfSavedCity(city: string) {
  loading.value = true
  WeatherDataService.getCurrentByCityName(city)
      .then((response: AxiosResponse) => {
        weather.value = response.data
        loading.value = false
      })
      .catch((e) => {
        console.log(e)
      })
}

function getSavedLocation() {
  if (localStorage.getItem('locations')) {
    try {
      locations.value = JSON.parse(localStorage.getItem('locations') || '{}')
      if (locations.value.length) {
        getWeatherOfSavedCity(locations.value[0].city)
      }
    } catch (e) {
      localStorage.removeItem('locations')
    }
  } else {
    getWeatherOfUserLocation()
  }
}

function getWeatherOfUserLocation() {
  navigator.geolocation.getCurrentPosition((position) => {
    getWeatherByCoords(position.coords.latitude, position.coords.longitude)
  }, () => {
    console.log('The current location cannot be determined')
  })
}



const currentCityToDisplay = ref(0)

function cycleCities() {
  if (locations.value.length > 1) {
    currentCityToDisplay.value = (currentCityToDisplay.value + 1) % locations.value.length
    getWeatherOfSavedCity(locations.value[currentCityToDisplay.value].city)
  }
}

const isWeatherDisplayMode = computed<boolean>(() => {
  return (!isSettingsMode.value && !loading.value)
})

const isLoadingAnimation = computed<boolean>(() => {
  return (loading.value && !isSettingsMode.value)
})


provide('loading', readonly(loading))
provide('isSettingsMode',  changeMode)
provide(LocationStorageKey, {locations, removeLocation})
</script>

<style lang="scss">

.widget-wrapper {
  width: 240px;
  height: 280px;
  padding: 3px;
  display: flex;
  flex-direction: column;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.loading-animation {
  width: 200px;
  height: 200px;
}

span, img {
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  pointer-events: none;
}

.error-message {
  color: red;
  margin-top: 2px;
  font-size: .7em;
}

::-webkit-scrollbar {
  width: 2px;
}

::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5);
}


</style>
