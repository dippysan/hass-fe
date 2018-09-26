
import SkyconComponent from 'components/Skycon'

export default ({ app, router, Vue }) => {
  Vue.component('skycon', SkyconComponent)
  Vue.use(SkyconComponent)
}
