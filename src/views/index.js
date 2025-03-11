import Login from './Login/index.vue'
Login.install = function (app) {
  app.component('Login', this)
}
export { Login }