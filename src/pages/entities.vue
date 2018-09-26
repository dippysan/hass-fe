<template>
    <q-page padding class='bg-white'>
        <div class="row">
        <q-input class="col-4" v-model="filter" :lower-case="true" />
        <q-btn  class="col-2 q-ml-lg" label="Get Entities" @click="getEntities" />
        </div>
        <tree-view :data="jsonData" />
    </q-page>
</template>

<script>
export default {
  name: 'Entities',
  data () {
    return {
      filter: '',
      jsonData: {}
    }
  },
  mounted () {
    this.jsonData = this.$store.state.haws.entities
  },

  watch: {
    filter: function (result, oldResult) {
      var ret = {}
      for (var type in this.$store.state.haws.entities) {
        if (type.toLowerCase().includes(result)) {
          if (ret[type] === undefined) {
            ret[type] = []
          }
          ret[type].push(this.$store.state.haws.entities[type])
        } else {
          for (var index in this.$store.state.haws.entities[type]) {
            if (this.$store.state.haws.entities[type][index].entity_id.includes(result)) {
              if (ret[type] === undefined) {
                ret[type] = []
              }
              ret[type].push(this.$store.state.haws.entities[type][index])
            }
          }
        }
      }
      this.jsonData = ret
    }
  },
  methods: {
    getEntities: async function () {
      await this.$hawsGetStates()
    }
  }

}
</script>

<style>
</style>
