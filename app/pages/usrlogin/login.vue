<script setup lang="ts">
import { reactive, computed } from 'vue'

const router = useRouter()

interface LoginResponse {
  success: boolean
  message: string
}

const requestBody = ref({ email: '', password: '' })

const { data, error, status, execute } = useFetch<LoginResponse>('/api/login/login', {
  method: 'POST',
  body: requestBody,
  immediate: false,
  watch: false,
})

const handleLogin = async () => {
  await execute()

  console.log('status:', status.value)
  console.log('data:', data.value)
  console.log('error:', error.value)

  if (data.value?.success) {
    await navigateTo('/home/dashboard')
  } else {
    alert('Gagal: ' + (data.value?.message || 'Unknown error'))
  }
}

const isLoading = computed(() => status.value === 'pending')

definePageMeta({
  layout: false,
  ssr: false 
})
</script>

<template>
  <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #f3f4f6;">
    <div style="background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center; width: 350px;">
      <UIcon name="i-heroicons-user" style="width: 48px; height: 48px; margin: 0 auto; color: #42b883;" />
      <h1 style="font-size: 20px; margin-top: 10px; margin-bottom: 5px;">Login</h1>
      <p style="color: #6478bb; font-size: 14px; margin-bottom: 20px;">Enter your credentials to access your account</p>
      
      <form @submit.prevent="handleLogin">
        <div style="text-align: left; margin-bottom: 15px;">
          <label style="font-size: 14px; color: #333;">Email</label>
          <input type="email" v-model="requestBody.email" placeholder="Email" style="width: 100%; padding: 10px; margin-top: 5px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box;" />
        </div>
        <div style="text-align: left; margin-bottom: 25px;">
          <label style="font-size: 14px; color: #333;">Password</label>
          <input type="password" v-model="requestBody.password" placeholder="Password" style="width: 100%; padding: 10px; margin-top: 5px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box;" />
        </div>
        
        <button type="submit" :disabled="isLoading" style="width: 100%; padding: 10px; background-color: #3b82f6; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">
          {{ isLoading ? 'Loading...' : 'Submit' }}
        </button>
      </form>

      <p style="margin-top: 20px; font-size: 14px; color: #6478bb;">Don't have an account?
        <UButton to="/usrregister/register" variant="link" color="primary" :padded="false" style="font-weight: bold; color: #3b82f6 !important;">Sign up</UButton>
      </p>
    </div>
  </div>
</template>