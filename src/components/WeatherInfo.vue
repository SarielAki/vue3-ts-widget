<template>
  <div class="weather-info" v-if="!loading">
    <div @click="emit('cycleCities')" class="general-info">
      <span class="general-info__temperature">{{ temperature }}</span>
      <img class="general-info__icon" :src="conditionIcon" alt="weather" />
    </div>

    <div class="description">
      <p class="description__text">
        Feels like {{ feelsLike }}. {{ weatherDescription }}</p>
    </div>

    <div class="details">
      <div class="details__item details__wind">
        <img class="weather-info__icon details__wind-icon" src="https://specials-f378ef5.servicecdn.ru/RegardQuest/images/weather/wind.svg" alt="wind">
        <span>{{ weatherData.wind.speed }}m/s {{ degToCardinal(weatherData.wind.deg) }}</span>
      </div>
      <div class="details__item details__pressure">
        <img class="weather-info__icon details__pressure-icon" src="https://specials-f378ef5.servicecdn.ru/RegardQuest/images/weather/pressure.svg" alt="pressure">
        <span>{{ weatherData.main.pressure }}hPa</span>
      </div>
      <div class="details__item details__humidity">
        <span>Humidity: {{ weatherData.main.humidity }}%</span>
      </div>
      <div class="details__item details__dew-point">
        <span>Dew point: {{ dewPoint }}</span>
      </div>
      <div class="details__item details__visibility">
        <span>Visibility: {{ visibility }}</span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {computed, defineEmits, defineProps, inject} from "vue"

const loading = inject('loading', false)


const props = defineProps([
    'weatherData'
])

let isCelsiusAndMetric = true

function convertTemperature(temp: number, isCelsius = true): number {
  return isCelsius? Math.round(temp - 273.1) :
      Math.round(temp - 273.1) * 9/5 + 32
}


const temperature = computed<string>(() => {
    return isCelsiusAndMetric? `${convertTemperature(props.weatherData.main.temp)}°C`:
        `${convertTemperature(props.weatherData.main.temp, isCelsiusAndMetric)}°F`
})

const feelsLike = computed<string>(() => {
    return isCelsiusAndMetric? `${convertTemperature(props.weatherData.main.feels_like)}°C`:
        `${convertTemperature(props.weatherData.main.feels_like, isCelsiusAndMetric)}°F`
})

const conditionIcon = computed<string>(() => {
  return `https://openweathermap.org/img/wn/${props.weatherData.weather[0].icon}@2x.png`
})

function findDewPoint(isCelsius = true): number {
  const Tdp = Math.round(convertTemperature(props.weatherData.main.temp)
      - ((100 - props.weatherData.main.humidity) / 5))
  return isCelsius? Tdp: Tdp * 9/5 + 32
}

const dewPoint = computed<string>(() => {
  return isCelsiusAndMetric? `${findDewPoint()}°C`: `${findDewPoint(isCelsiusAndMetric)}°F`
})


function windSpeedToBeaufortDescription(ms: number): string {
  const beaufortDescriptions = [
    'Calm',
    'Light air',
    'Light breeze',
    'Gentle breeze',
    'Moderate breeze',
    'Fresh breeze',
    'Strong breeze',
    'Near Gale',
    'Fresh Gale',
    'Strong Gale',
    'Whole Gale',
    'Violent storm',
    'Hurricane-force'
  ]
  return beaufortDescriptions[Math.ceil(Math.cbrt(Math.pow(ms/0.836, 2))) - 1]
}



function degToCardinal(deg: number): string {
  const cardinals = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"]
  const val = Math.round((deg / 22.5) + 0.5)
  return cardinals[(val % 16)]
}


const weatherDescription = computed<string>(() => {
  return `${props.weatherData.weather[0].description[0].toUpperCase()
      + props.weatherData.weather[0].description.substring(1)}.
      ${windSpeedToBeaufortDescription(props.weatherData.wind.speed)}`
})

const visibility = computed<string>(() => {
  return props.weatherData.visibility / 1000 + "km"
})

const emit = defineEmits<{
  (e: 'cycleCities'): void
}>()


</script>
<style scoped lang="scss">
.weather-info {
  display: flex;
  flex-direction: column;

  &__icon {
    padding-right: 5px;
    width: 20px;
    height: 20px;
  }
}
.general-info {
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  &__temperature {
    font-size: 1.8em;
    text-align: center;

  }
}
.description {
  &__text {
    font-size: .9em;
    text-align: center;
  }
}

.details {
  display: grid;
  font-size: .9em;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(3, 1fr);
  align-items: center;
  justify-content: center;

  &__item {
    margin: 0 0 5px 0;
  }

}
</style>
