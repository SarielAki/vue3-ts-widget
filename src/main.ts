import { defineCustomElement } from './defineCustomElementWithStyles'

import App from './WeatherWidget.vue'


const WidgetElement = defineCustomElement(App)

customElements.define('weather-widget', WidgetElement)
