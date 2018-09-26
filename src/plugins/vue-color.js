import {Slider, Sketch} from 'vue-color'

export default ({ app, router, Vue }) => {
  Vue.component('slider-picker', Slider)
  Vue.component('sketch-picker', Sketch)

  Vue.use(Slider)
  Vue.use(Sketch)
}
