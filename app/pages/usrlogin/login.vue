<script setup lang="ts">
import {ref} from 'vue'

const usremail = ref('')
const usrpass = ref('')

const loginprocess = () => {
  console.log('E-Mail yang diketik:', usremail.value)
  console.log('Password yang diketik:', usrpass.value)
  }
</script>

<template>
  <div>
    <h2>Welcome back!</h2>
    <p>Don't have an account? <a href="/usrregister/register">Sign up</a></p>
    
    <div>
      <label>Email</label>
      <input type="email" placeholder="Enter your E-Mail"/>
      
      <label>Password</label>
      <input type="password" placeholder="Enter you password"/>
      
      <button>Continue</button>
    </div>
  </div>
</template>