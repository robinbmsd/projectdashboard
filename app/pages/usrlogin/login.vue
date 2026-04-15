<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '#ui/types'

definePageMeta({
  layout: false
})

interface LoginResponse {
  success: boolean
  message: string
  field?: string
  needsOTP?: boolean
  isNewOTP?: boolean
}

const formRef = ref()
const router = useRouter()
const toast = useToast()

const tempEmail = useCookie('temp_email') 

const state = reactive({
  email: '',
  password: '',
  remember: false
})

const schema = z.object({
  email: z.string().email('Format email salah'),
  password: z.string().min(8, 'Must be at least 8 characters')
})

type Schema = z.output<typeof schema>

const { data, status, error, execute } = useFetch<LoginResponse>('/api/login/login', {
  method: 'POST' as any,
  body: state,
  immediate: false, 
  watch: false,     
})

const isLoading = computed(() => status.value === 'pending')

async function onSubmit(_event: FormSubmitEvent<Schema>) {
  if (formRef.value) formRef.value.clear()

  await execute()

  if (data.value && data.value.success) {
    tempEmail.value = state.email

    if (data.value.needsOTP) {
      if (data.value.isNewOTP) {
        router.push('/setup/otp')
      } else {
        router.push('/setup/verify')
      }
    } else {
      router.push('/home/dashboard')
    }
    return 
  }

  if (error.value) {
    const errorData = error.value.data as LoginResponse
    
    if (errorData && errorData.field) {
      formRef.value.setErrors([{
        path: errorData.field,
        message: errorData.message
      }])
    } else {
      toast.add({
        title: 'Gagal',
        description: errorData?.message || 'Terjadi kesalahan sistem',
        color: 'error'
      })
    }
  }
} 
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen gap-4 p-4 bg-gray-50 dark:bg-gray-900">
    <UCard class="w-full max-w-md h-115 flex-col justify-between">
      <template #header>
        <div class="flex justify-center mb-2">
          <UIcon name="i-lucide-user" class="w-10 h-10 text-gray-700" />
        </div>
        <h1 class="text-xl font-bold text-center">Login</h1>
        <p class="text-sm text-center font-small mt-2 text-gray-500">Enter your credentials to access your account.</p>
      </template>

      <UForm
        ref="formRef"
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField label="Email" name="email">
          <UInput
            v-model="state.email"
            icon="i-heroicons-envelope"
            placeholder="Email"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Password" name="password">
          <UInput
            v-model="state.password"
            type="password"
            icon="i-heroicons-lock-closed"
            placeholder="Password"
            class="w-full"
          />
        </UFormField>

        <UButton
          type="submit"
          block
          :loading="isLoading"
          class="font-bold"
        >
          Submit
        </UButton>

        <div class="flex flex-col items-center justify-center mt-4 text-sm">
          <span class="text-gray-500">Don't have an account?</span>
          <UButton
            to="/usrregister/register"
            variant="link"
            color="primary"
            :padded="false"
            class="font-bold"
          >
            Sign up
          </UButton>
        </div>
      </UForm>
    </UCard>
  </div>
</template>