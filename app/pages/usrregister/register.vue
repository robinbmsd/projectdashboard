<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '#ui/types'

definePageMeta({
  layout: false
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

const { data, status, error, execute } = useFetch<RegisterResponse>('/api/register', {
  method: 'POST',
  body: state,
  immediate: false,
  watch: false,
  server: false,   
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
    router.push('/usrlogin/login')
    return 
  }

  if (error.value) {
    const errorData = error.value.data as RegisterResponse

    console.log('ERROR FROM SERVER:', errorData)

    if (errorData && errorData.field) {
      formRef.value.setErrors([{
        path: errorData.field,
        message: errorData.message
      }])
    } else {
      toast.add({
        title: 'Unsuccessful',
        description: errorData?.message || 'System error occurred',
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
        <h1 class="text-xl font-bold text-center">Register</h1>
        <p class="text-sm text-center font-small mt-2 text-gray-500">Set up your credentials to create a new account.</p>
      </template>

      <UForm
        ref="formRef"
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField
          label="Email"
          name="email"
        >
          <UInput
            v-model="state.email"
            icon="i-heroicons-envelope"
            placeholder="Email"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Password"
          name="password"
        >
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
          color="primary"
          :loading="isLoading"
          class="font-bold"
        >
          Submit
        </UButton>

        <div class="flex flex-col items-center justify-center mt-4 text-sm">
          <span class="text-gray-500">Already have an account?</span>
          <UButton
            to="/usrlogin/login"
            variant="link"
            color="primary"
            :padded="false"
            class="font-bold"
          >
            Login
          </UButton>
        </div>
      </UForm>
    </UCard>
  </div>
</template>