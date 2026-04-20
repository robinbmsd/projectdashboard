<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '#ui/types'

definePageMeta({
  layout: false,
  ssr: false  
})

interface RegisterResponse {
  success: boolean
  message: string
  user?: string
  field?: string
}

const formRef = ref()
const router = useRouter()
const toast = useToast()
const isLoading = computed(() => status.value === 'pending')

const state = reactive({
  email: '',
  password: ''
})

const schema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters')
})

type Schema = z.output<typeof schema>

const { data, status, error, execute } = useFetch<RegisterResponse>('/api/register/register', {
  method: 'POST',
  body: state,
  immediate: false,
  watch: false,
})

async function onSubmit(_event: FormSubmitEvent<Schema>) {
  formRef.value.clear()
  await execute()

  if (data.value?.success) {
    toast.add({
      title: 'Success',
      description: 'Account successfully created! Please login.',
      color: 'success'
    })
    await new Promise(resolve => setTimeout(resolve, 1500))
    router.push('/usrlogin/login?registered=true')
    return
  }

  if (error.value) {
    const errorData = error.value.data as RegisterResponse

    if (errorData?.field) {
      formRef.value.setErrors([{
        path: errorData.field,
        message: errorData.message
      }])

      toast.add({
        title: 'Unsuccessful',
        description: errorData.message,
        color: 'error'
      })
    } else {
      toast.add({
        title: 'Unsuccessful',
        description: errorData?.message || 'System error occurred',
        color: 'error'
      })
    }
  }

  if (!data.value?.success && !error.value) {
    toast.add({
      title: 'Unsuccessful',
      description: data.value?.message || 'Registration failed',
      color: 'error'
    })
  }
}
</script>

<template>
  <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #f3f4f6;">
    <div style="background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center; width: 350px;">
      <UIcon name="i-heroicons-user-plus" style="width: 48px; height: 48px; margin: 0 auto; color: #3178c6;" />
      <h1 style="font-size: 20px; margin-top: 10px; margin-bottom: 5px;">Register</h1>
      <p style="color: #6478bb; font-size: 14px; margin-bottom: 20px;">Set up your credentials to create a new account.</p>

      <UForm ref="formRef" :schema="schema" :state="state" @submit="onSubmit">
        <div style="text-align: left; margin-bottom: 15px;">
          <label style="display: block; font-size: 14px; color: #333;">Email</label>
          <input type="email" v-model="state.email" placeholder="Email" style="width: 100%; padding: 10px; margin-top: 5px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box;" />
        </div>

        <div style="text-align: left; margin-bottom: 25px;">
          <label style="display: block; font-size: 14px; color: #333;">Password</label>
          <input type="password" v-model="state.password" placeholder="Password" style="width: 100%; padding: 10px; margin-top: 5px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box;" />
        </div>

        <button type="submit" style="width: 100%; padding: 10px; background-color: #3b82f6; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">
          {{ isLoading ? 'Loading...' : 'Submit' }}
        </button>
      </UForm>

      <p style="margin-top: 20px; font-size: 14px; color: #6478bb;">Already have an account?
        <UButton 
                to="/usrlogin/login" 
                variant="link" 
                color="primary" 
                :padded="false" 
                style="font-weight: bold; color: #3b82f6 !important; text-decoration: none !important;"
                >
                    Login
                </UButton>
      </p>
    </div>
  </div>
</template>