<template>
  <div id="container" class="container">
    <form action="" class="row">
      <h2 class="text-center">Log in</h2>
      <div class="alert alert-danger" v-if="errorMsg.length > 0">{{ errorMsg }}</div>
      <div class="form-group">
        <input type="text" class="form-control" placeholder="Username" v-model="username" required="required">
      </div>
      <div class="form-group">
        <input type="password" class="form-control" placeholder="Password" v-model="password" required="required">
      </div>
      <div class="form-group">
          <a class="btn btn-primary btn-block" @click="authenticate">Log in </a>
        </div>
    </form>
  </div>
  <!--<div>
    <section class="hero is-primary">
      <div class="hero-body">
        <div class="container has-text-centered">
          <h2 class="title">Login</h2>
          <p class="subtitle error-msg">{{ errorMsg }}</p>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="field">
          <label class="label  is-large" for="email">Email:</label>
          <div class="control">
            <input type="username" class="input is-large" id="email" v-model="username">
          </div>
        </div>
        <div class="field">
          <label class="label  is-large" for="password">Password:</label>
          <div class="control">
            <input type="password" class="input is-large" id="password" v-model="password">
          </div>
        </div>

        <div class="control">
          <a class="button is-large is-primary" @click="authenticate">Login</a>
        </div>

      </div>
    </section>

  </div>-->
</template>

<script>
import { EventBus } from '../utils'
export default {
  data () {
    return {
      username: '',
      password: '',
      errorMsg: ''
    }
  },
  methods: {
    authenticate () {
      this.$store.dispatch('login', { username: this.username, password: this.password })
        .then(() => {
          console.log('success')
          this.$router.push('/gastos')
        }, () => {
          console.log('error')
          this.$router.push('/login')
        })
    }
  },
  mounted () {
    EventBus.$on('failedAuthentication', (msg) => {
      console.log('failedAuthentication')
      this.errorMsg = 'Authentication Fail'
    })
  },
  beforeDestroy () {
    EventBus.$off('failedAuthentication')
  }
}
</script>

<style lang="css">
#container{
    margin-top: 15rem;
    width: 40rem;
}
form{
    margin-bottom: 15px;
    background: #f7f7f7;
    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
    padding: 30px
}
</style>
