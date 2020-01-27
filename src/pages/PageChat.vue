<template>
  <q-page class="flex column">

    <q-banner class="text-white bg-grey-4 text-center">
      Utilizador esta Offline
    </q-banner> 

    <div class="q-pa-md column col justify-end">
      <q-chat-message
        v-for="message in messages"
        :key="message.text"
        :name="message.from"
        :text="[message.text]"
        :sent="message.from == 'me' ? true : false"
      />
    </div>
    <q-footer elevated>
      <q-toolbar>
        <q-form
          @submit="sendMessage"
          class="full-width">
           <q-input
            v-model="newMessage"
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
  export default { 
    data() {
      return {
        newMessage: '',
        messages: [
          {
            text: 'Hey Ana. Como esta?',
            from: 'me'
          },
          {
            text: 'Bem gracas a Deus! E desse lado?',
            from: 'them'
          },
          {
            text: 'Muito be',
            from: 'me'
          }
        ]
      }
    },
    methods: {
      sendMessage() {
        thiss,messages.push({
          text: this.newMessage,
          from: 'me'
        })
      }
    }
  }
</script>
