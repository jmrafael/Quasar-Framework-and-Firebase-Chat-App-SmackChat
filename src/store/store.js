import Vue from 'vue'
import { firebaseAuth, firebaseDb } from 'boot/firebase'

let messagesRef

const state = {
    userDetails: {}, //Para armazenar detalhes do Utilizador logado
    users: {}, //Para carregar todos os utilizadores
    messages: {}

}

const mutations = {
    setUserDetails(state, payload) { //mutation usada para armazenar dados de user logado. Para correr esta mutation eh necessario invoca-la em handleAuthStateChanged atraves de commit
         state.userDetails = payload
    },
    addUser(state, payload) { 
        Vue.set(state.users, payload.userId, payload.userDetails)
    },
    updateUser(state, payload) {
        Object.assign(state.users[payload.userId], payload.userDetails)
    },
    addMessage(state, payload) {
        Vue.set(state.messages, payload.messageId, payload.messageDetails)
    },
    clearMessages(state) {
        state.messages = {}
    }

} 

const actions = {
    //accao para registar utilizador
    registerUser({}, payload) { //Representa o this.formData na component
        ///METDOS de Auth existentes em: https://firebase.google.com/docs/reference/js/firebase.auth.Auth?authuser=0
        firebaseAuth.createUserWithEmailAndPassword(payload.email, payload.password)
        .then(response => {
            //Escrever os dados do Utilizador na BD: realtime DB
            
            //variavel que gera ID do user
            let userId = firebaseAuth.currentUser.uid

            //Eh necessario referenciar o node(no) a ser usado para armazenar os dados na BD de Firebase
            //Eh necessario invocar a funcao que faz o Set/Registo dos dados do user
            firebaseDb.ref('users/' + userId).set({
                name: payload.name,
                email: payload.email,
                online: true
            })
        })
        .catch(error => {
            //Regista
            console.log(error.message)
        })
    },
    loginUser({}, payload) {
        firebaseAuth.signInWithEmailAndPassword(payload.email, payload.password)
        .then(response => {
            //console.log(response)
        })
        .catch(error => {
            console.log(error.message)
        })
    },
    logoutUser() {
        firebaseAuth.signOut()
    },
    handleAuthStateChanged( { commit, dispatch, state }) { //commit eh usado para carregar dados da mutation setUserDetails
        firebaseAuth.onAuthStateChanged(user => {
            if (user) {
              // User is logged in.
              let userId = firebaseAuth.currentUser.uid
              firebaseDb.ref('users/' + userId).once('value', snapshot => {
                  let userDetails = snapshot.val()
                  commit('setUserDetails', {
                      name: userDetails.name,
                      email: userDetails.email,
                      userId: userId
                  })
              })
              //muda o estado utilizadsor. Para trigger uma action dentro de outra, usa-se o dispatch
              dispatch('firebaseUpdateUser', {
                  userId: userId,
                  updates:  {
                      online: true
                  }
              })
              //Buscar variaveis de sessao de utilizador...depois redirecionar
              dispatch('firebaseGetUsers')
              this.$router.push('/') //Apois Login redirect the user
            }
            else{
                //User is logged out
                dispatch('firebaseUpdateUser', {
                    userId: state.userDetails.userId,
                    updates:  {
                        online: false
                    } 
                })
                commit('setUserDetails', {}) //Quando fizer logout fazer set para um objecto vazio                
                this.$router.replace('/auth') //Apos logout, remove variaveis de sessao e redirect to login
            }
          })          
    },
    firebaseUpdateUser({}, payload) {
        firebaseDb.ref('users/' + payload.userId)
        if (payload.userId) {
            firebaseDb.ref('users/' + payload.userId).update(payload.updates)
        }
    },
    firebaseGetUsers({ commit }) {
        firebaseDb.ref('users').on('child_added', snapshot => {
            let userDetails = snapshot.val()
            let userId = snapshot.key
            commit('addUser', {
                userId,
                userDetails
            })
        })
        firebaseDb.ref('users').on('child_changed', snapshot => {
            let userDetails = snapshot.val()
            let userId = snapshot.key
            commit('updateUser', {
                userId,
                userDetails
            })
        })
    },
    firebaseGetMessages({commit , state }, otherUserId) { //Metodo usado para receber mensages de usser
        let userId = state.userDetails.userId
        messagesRef = firebaseDb.ref('chats/' + userId + '/' + otherUserId)
        messagesRef.on('child_added', snapshot => {
            let messageDetails = snapshot.val()
            let messageId = snapshot.key
            commit('addMessage', {
                messageId,
                messageDetails
            })
        })
    },
    firebaseStopGettingMessages({ commit }) { //Metodo usado para parar de recebe mensages de users. Usado para evitar que mensagens de um user sejam visualizadas neoutro users
        if(messagesRef) {
            messagesRef.off('child_added')
            commit('clearMessages')
        }
        
    },
    firebaseSendMessage({}, payload) {
        console.log('payload', payload)
    }
}

const getters = {
    users: state => { //getter que devolve os utilizadores
        //impede que o user logado seja listado
        let usersFiltered = {}
        Object.keys(state.users).forEach(key => {
            if (key !== state.userDetails.userId) {
                usersFiltered[key] = state.users[key]
            }
        })
        //retorna os users
        return usersFiltered
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}