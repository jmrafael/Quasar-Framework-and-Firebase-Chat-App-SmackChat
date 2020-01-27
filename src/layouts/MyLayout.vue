<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          v-if="$route.fullPath.includes('/chat')"
          v-go-back.single
          icon="arrow_back"
          flat
          dense
          label="Voltar" />   

        <q-toolbar-title class="absolute-center">
          {{ title }}
        </q-toolbar-title>

        <q-btn
          to="/auth"
          class="absolute-right q-pr-sm"
          icon="account_circle"
          flat
          dense
          label="Login" /> 

      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'
export default {
  computed: {
    title() {
      //definicao de titulos em cada pagina
      let curretPath = this.$route.fullPath
      if(curretPath == '/') return "SmackChat"
      else if (curretPath == '/chat') return 'Chat'
      else if (curretPath == '/auth') return 'Login'
    }
  },
  data () {
    return {
      leftDrawerOpen: false
    }
  }
}
</script>
