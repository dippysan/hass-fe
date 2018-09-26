import TreeView from 'vue-json-tree-view'

export default ({ app, router, Vue }) => {
//   Vue.use(VueJsonPretty)
  Vue.use(TreeView)
  Vue.component('vue-json-tree-view', TreeView)
}
