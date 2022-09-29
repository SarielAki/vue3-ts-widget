<template>
  <div class="settings">
    <div class="settings__location-list">

      <draggable
          v-model="injectedLocationStorage.locations.value"
          group="id"
          @start="drag=true"
          @end="drag=false"
          item-key="id"
      >
        <template #item="{element}">
          <div class="settings__location-item">
            <div  class="settings__drag">
              <div></div>
              <div></div>
              <div></div>
            </div>
            <div class="settings__location-name"><span>{{ element.city }}, {{ element.country }}</span></div>
            <div @click="injectedLocationStorage.removeLocation(element.id)" class="settings__location-remove">
              <img class="trash-icon" src="https://specials-f378ef5.servicecdn.ru/RegardQuest/images/weather/trash-can.svg" alt="remove">
            </div>
          </div>

        </template>
      </draggable>
    </div>
    <div class="add-location">
      <div class="add-location__title">
        <span>
          Add Location:
        </span>

      </div>
      <div class="add-location__form">
        <input v-model="city"  class="add-location__field">
        <button @click="emit('addLocationByCity', city)" class="add-location__button">Add</button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {inject, defineEmits, ref} from "vue";
import Draggable from "vuedraggable";
import { LocationStorage, LocationStorageKey } from "@/types/LocationStorage";

const city = ref('')
const drag = ref(false)
let injectedLocationStorage: LocationStorage | undefined

injectedLocationStorage = inject(LocationStorageKey)

const emit = defineEmits<{
  (e: 'addLocationByCity', city: string): void
}>()



</script>
<style scoped lang="scss">
.settings {
  display: grid;
  grid-template-rows: 3.7fr 1fr;

  &__location-list {
    max-height: 180px;
    overflow-y: scroll;
  }

  &__location-item {
    background-color: #edebe9;
    grid-template-columns: 0.5fr 4fr 1fr;
    display: grid;
    margin: 13px 0 0 0;
    padding: 5px;
  }

  &__location-remove {
    cursor: pointer;
    justify-self: flex-end;
  }

  &__drag {
    cursor: pointer;
  }

  &__drag div {
    width: 15px;
    height: 1px;
    background-color: black;
    margin: 4px 0;
  }


}

.trash-icon {
  width: 20px;
  height: 20px;
}

.add-location {
  display: flex;
  flex-direction: column;
  margin-top: 3px;

  &__field {
    width: 170px;
    padding: 2px 6px;
  }

  &__title {
    margin-bottom: 2px;
  }

  &__button {
    cursor: pointer;
    background-color: #edebe9;
    color: black;
    border: 1px solid transparent;
    border-radius: 6px;
    text-transform: uppercase;
  }

  &__button:hover {
    background-color: #04aa6d;
    color: white;
  }

  &__form {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

  }
}



</style>
