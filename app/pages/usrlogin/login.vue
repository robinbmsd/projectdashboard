<script setup lang="ts">
import {ref} from 'vue'

const usremail = ref('')
const usrpass = ref('')

const loginprocess = () => {
  console.log('Mencoba login dengan:', usremail.value, usrpass.value)
  }
</script>

<template>

  <div>
    <div class="flex flex-col items-center justify-center min-h-screen p-4 bg-[#0f172a]"></div>
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