<script setup lang="ts">
definePageMeta({ layout: false })

const tempEmail = useCookie('temp_email')
const otpCode = ref<string[]>([]) 
const toast = useToast()
const router = useRouter()

interface VerifyResponse {
  success: boolean
  message: string
}

const { data, status, error, execute } = useFetch<VerifyResponse>('/api/otp/verify', {
  method: 'POST',
  body: computed(() => ({
    email: tempEmail.value,
    code: otpCode.value.join('')
  })),
  immediate: false,
  watch: false
})

const isLoading = computed(() => status.value === 'pending')

onMounted(() => {
    if (!tempEmail.value) {
        router.push('/login')
    }
})

const verifyOTP = async () => {
    if (otpCode.value.length !== 6) {
        toast.add({ title: 'Error', description: 'Masukkan kode 6 digit', color: 'error' })
        return
    }

    await execute()

    if (data.value && data.value.success) {
        toast.add({ title: 'Berhasil', description: 'Login sukses!', color: 'success' })
        tempEmail.value = null
        router.push('/home/dashboard')
        return
    }

    if (error.value || (data.value && !data.value.success)) {
        otpCode.value = []
        const errorMsg = error.value?.data?.message || data.value?.message || 'Kode OTP salah atau expired'
        toast.add({
            title: 'Gagal',
            description: errorMsg,
            color: 'error'
        })
    }
}
</script>

<template>
    <div class="max-w-md mx-auto mt-10 p-4">
        <UCard>
        <template #header>
            <div class="flex justify-center mb-2">
            <UIcon name="i-lucide-shield-check" class="w-10 h-10 text-primary" />
            </div>
            <h2 class="text-xl font-bold text-center">Two-Factor Authentication</h2>
            <p class="text-sm text-center text-gray-500 mt-1">
            Enter the 6-digit code from your Authenticator Application
            </p>
        </template>

        <div class="space-y-6 py-2">
            <UFormField label="OTP Code" name="code" class="w-full flex flex-col items-center">
                <UPinInput
                    v-model="otpCode"
                    :length="6"
                    size="xl"
                    placeholder="○"
                    class="mt-2"
                    @keyup.enter="verifyOTP"
                />
            </UFormField>

            <UButton
                block
                size="lg"
                color="primary"
                :loading="isLoading"
                :disabled="otpCode.length !== 6"
                class="font-bold"
                @click="verifyOTP"
            >
                Continue
            </UButton>

            <div class="text-center">
                <UButton variant="ghost" size="sm" class="font-bold" to="/login">
                    ← Back to Login
                </UButton>
            </div>
        </div>
        </UCard>
    </div>
</template>