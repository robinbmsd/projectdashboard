<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const password = ref('')
const handleLogin = async () => {
    console.log("Trying to login with: ", email.value)
}
definePageMeta({
    layout: false
})

</script>

<template>
    <div style="display: flex; justify-content: center; align-items: center; hieght: 100vh; background-color:f3f4f6;">
        <div style="background: white; padding: 2rem; border radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);text-align: center; width: 350px;">
            <User style="width: 48px; height: 48px; margin: 0auto; color: #374151;"/>
                <h1 style="font-size: 24px; margin-top: 10px; margin bottom: 5px;">
                    Login
                </h1>
                <p style="color: #6478b; font-size: 14px; margin-bottom: 20px;">
                    Enter your credentials to access your account
                </p>
                <div>
                    <label>
                        Email
                    </label>
                    <input type="email" v-model="email" placeholder="Email" />
                </div>
                <div>
                <label>
                    Password
                </label>
                <input type="password" v-model="password" placeholder="Password" />
                </div>
        </div>
    </div>
</template>