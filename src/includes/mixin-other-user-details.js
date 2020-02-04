export default {
    computed :{
        otherUserDetails() { //usado para buscar detalhes do outro user logado
            if(this.$store.state.store.users[this.$route.params.otherUserId]) {
                return this.$store.state.store.users[this.$route.params.otherUserId]                
            }
            return {}
          }
    }
}