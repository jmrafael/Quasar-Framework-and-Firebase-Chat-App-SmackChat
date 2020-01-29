<template>
    <q-form @submit="submitForm">
        <q-input
            v-if="tab == 'register'"
            v-model="formData.name"
            class="q-mb-md"
            outlined 
            label="Nome" />

        <q-input
            v-model="formData.email"
            class="q-mb-md"
            outlined 
            type="email"
            label="Email" />

        <q-input
            v-model="formData.password"
            class="q-mb-md" 
            outlined 
            type="password" 
            label="Password" />

        <div class="row">
            <q-space/>
            <q-btn 
                color="primary" 
                type="submit"
                :label="tab" />
        </div>        

    </q-form>    
</template>

<script>
    import { mapActions } from 'vuex'
    export default {
        props: ['tab'],
        data() {
            return {
                formData: {
                    name: '',
                    email: '',
                    password: ''
                }
            }            
        },
        methods:{
            ...mapActions('store', ['registerUser', 'loginUser']), //Mapeamento das actions, que estao em store. O array eh usado para inserir as actions que queremos

            submitForm() {
                if(this.tab == 'login') {
                    this.loginUser(this.formData)
                }
                else  { //trigger a action que regista utilizadores. Para tal eh preciso mapear a actiom, acima
                    this.registerUser(this.formData); // No store eh representado pelo payload
                }
            }
        }
    }
</script>
