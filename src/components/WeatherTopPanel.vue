<template>
  <div class="top-panel">
    <div class="top-panel__title">
      <span v-if="!loading">{{ location }}</span>
    </div>
    <div class="top-panel__settings">
      <button class="top-panel__settings-button" @click="changeMode">
        <img class="top-panel__settings-icon" src="https://specials-f378ef5.servicecdn.ru/RegardQuest/images/weather/gear.svg" alt="gear" >
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import {computed, defineProps, inject} from "vue";

const loading = inject('loading', false)
const changeMode = inject('isSettingsMode')

const props = defineProps([
  'weatherData'
])

const location = computed<string>(() => {
  return `${props.weatherData.name}, ${props.weatherData.sys.country}`
})

</script>
<style scoped lang="scss">
.top-panel {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  &__settings-button {
    padding: 0;
    border: none;
    background: transparent;
    cursor: pointer;
  }

  &__settings-icon {
    cursor: pointer;
    width: 20px;
    height: 20px;
  }
}
</style>
