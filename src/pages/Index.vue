<template>
    <div>
        <q-carousel ref="carousel1" color="white" quick-nav height="92vh" class="col-8" arrows no-swipe  @input="currentCarouselSlide">
            <q-carousel-slide class="flex items-center justify-center" v-for="screen in screens" :key="screen.id">
                <screen-view class="col-12 col-md-auto q-ma-sm" v-for="hagroup in screen.hagroups" :key="hagroup.id" :hagroup="hagroup" :isHome="screen.isHome" />
            </q-carousel-slide>
        </q-carousel>
    </div>
</template>

<style>
</style>

<script>
import screen from 'components/screens.vue'
export default {
  name: 'PageIndex',
  components: {
    'screen-view': screen
  },
  data () {
    return {

    }
  },
  created () {

  },
  mounted () {
    this.$root.$on('screensChanged', () => {
      if (this.$refs.carousel1 && this.$refs.carousel1.goToSlide) {
        this.$refs.carousel1.goToSlide(this.$homeScreen())
      }
    })
  },
  computed: {
    screens: {
      get () {
        return this.$store.state.config.screens
      },
      set (val) {

      }

    }
  },
  methods: {
    currentCarouselSlide (newVal) {
      this.$configCommit('haws/currentCarouselSlide', newVal)
    },
    cb (msg) {
      console.log(msg)
    }
  }
}

</script>
