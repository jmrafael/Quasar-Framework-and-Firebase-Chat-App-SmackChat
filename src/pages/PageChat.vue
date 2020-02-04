<template>
  <q-page 
    ref="pageChat"
    class="page-chat flex column">

    <q-banner
      v-if="!otherUserDetails.online" 
      class="bg-grey-4 text-center fixed-top">
      {{ otherUserDetails.name }} está Offline.
    </q-banner> 

    <div 
      :class="{ 'invisible' : !showMessages }"
      class="q-pa-md column col justify-end">
      <q-chat-message
        v-for="(message, key) in messages"
        :key="key"
        :name="message.from == 'me' ? userDetails.name : otherUserDetails.name"
        :text="[message.text]"
        :sent="message.from == 'me' ? true : false"
        :bg-color="message.from == 'me' ? 'white' : 'light-green-2'"
      />
    </div>
    <q-footer elevated>
      <q-toolbar>
        <q-form
          @submit="sendMessage"
          class="full-width">
           <q-input
            v-model="newMessage"
            ref="newMessage"            
            bg-color="white"
            class="full-width"
            outlined
            rounded         
            label="Mensagem" 
            dense>

            <template v-slot:after>
              <q-btn
                round
                dense
                flat
                tyoe="submit"
                color="white"
                icon="send" />
            </template>
          </q-input>          
        </q-form>
      </q-toolbar>
    </q-footer>
  </q-page>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import mixinOtherUserDetails from 'src/includes/mixin-other-user-details.js'

  export default { 

    mixins: [mixinOtherUserDetails],
    data() {
      return {
        newMessage: '',
        showMessages: false
      }
    },
    computed: {
      ...mapState('store', ['messages', 'userDetails']),
    },

    methods: {
      ...mapActions('store', ['firebaseGetMessages', 'firebaseStopGettingMessages', 'firebaseSendMessage']),
      sendMessage() { //Metodo para enviar mensagens
        this.firebaseSendMessage({
          message: {
             text: this.newMessage, //O que permite armazenar a mensagem no proprio repositorio
              from: 'me'
          },
          otherUserId: this.$route.params.otherUserId //permite armazenar no repositorio do outro user  
        })
        //Apos enviar mensagem, limpar o campo
        this.clearMessage()
      },
      clearMessage() { //Metodo que limpa o campo de escrita apos submit
        this.newMessage = ''
        //Focar o campos apo limpar a teal
        this.$refs.newMessage.focus()

      },
      scroolToBottom() { //Metodo para ir ao rodape da tela
      let pageChat = this.$refs.pageChat.$el //Buscar o tamanho da tela
      setTimeout(() => { 
        window.scrollTo(0, pageChat.scrollHeight)
      }, 20); 
      }
    },
    watch: { //Metodo para verificar se tem novas mensagens a cada acesso do user e ir ao rodape da tela
      messages: function(val) {
        if (Object.keys(val).length) {
          this.scroolToBottom()
          setTimeout(() => {
            this.showMessages = true
          }, 200)
        }
      }    
    },
    mounted() {
      this.firebaseGetMessages(this.$route.params.otherUserId)
    },
    destroyed() {
      this.firebaseStopGettingMessages()
    }

  }
</script>


<style lang="stylus">
  .page-chat
    background #e2dfd5
    &:after
      content ''
      position fixed 
      left 0
      right 0
      top 0
      bottom 0
      opacity 0.1
      background-image: radial-gradient(circle at 100% 150%, silver 24%, white 24%, white 28%, silver 28%, silver 36%, white 36%, white 40%, transparent 40%, transparent),
        radial-gradient(circle at 0    150%, silver 24%, white 24%, white 28%, silver 28%, silver 36%, white 36%, white 40%, transparent 40%, transparent),
        radial-gradient(circle at 50%  100%, white 10%, silver 10%, silver 23%, white 23%, white 30%, silver 30%, silver 43%, white 43%, white 50%, silver 50%, silver 63%, white 63%, white 71%, transparent 71%, transparent),
        radial-gradient(circle at 100% 50%, white 5%, silver 5%, silver 15%, white 15%, white 20%, silver 20%, silver 29%, white 29%, white 34%, silver 34%, silver 44%, white 44%, white 49%, transparent 49%, transparent),
        radial-gradient(circle at 0    50%, white 5%, silver 5%, silver 15%, white 15%, white 20%, silver 20%, silver 29%, white 29%, white 34%, silver 34%, silver 44%, white 44%, white 49%, transparent 49%, transparent);
      background-size 100px 50px
  .q-banner
    top 50px
    z-index 2
    opacity  0.8
  .q-message
    z-index 1
</style>