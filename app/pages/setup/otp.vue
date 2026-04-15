<script setup lang="ts">
definePageMeta({ layout: false })

const tempEmail = useCookie('temp_email')
const qrImage = ref('')
const secretCode = ref('')
const errorMsg = ref('')

const step = ref(1) 
const otpCode = ref<string[]>([])

const router = useRouter()
const toast = useToast()

interface SetupResponse {
  success: boolean
  message: string
  qrImage?: string
  secretCode?: string
}

const { data: setupData, status: setupStatus, error: setupError, execute: executeSetup } = useFetch<SetupResponse>('/api/otp/setup', {
  method: 'POST',
  body: { email: tempEmail.value },
  immediate: false,
  watch: false
})
const isSetupLoading = computed(() => setupStatus.value === 'pending')

interface VerifyResponse {
  success: boolean
  message: string
}

const { data: verifyData, status: verifyStatus, error: verifyError, execute: executeVerify } = useFetch<VerifyResponse>('/api/otp/verify', {
  method: 'POST',
  body: computed(() => ({
    email: tempEmail.value,
    code: otpCode.value.join('')
  })),
  immediate: false,
  watch: false
})
const isVerifyLoading = computed(() => verifyStatus.value === 'pending')

onMounted(async () => {
  if (!tempEmail.value) {
    toast.add({ title: 'Error', description: 'Email not found. Please log in again.', color: 'error' })
    router.push('/login')
    return
  }
  await generateQR()
})

const generateQR = async () => {
  errorMsg.value = ''
  try {
    await executeSetup()
    if (setupError.value) throw setupError.value
    
    if (setupData.value?.success && setupData.value.qrImage) {
      qrImage.value = setupData.value.qrImage
      secretCode.value = setupData.value.secretCode || ''
    } else {
      errorMsg.value = setupData.value?.message || 'Failed to get QR Code'
    }
  } catch (err: any) {
    errorMsg.value = err.data?.message || err.message || 'A system error occurred'
  }
}

const goToVerify = () => {
  if (!qrImage.value) {
    toast.add({ title: 'Error', description: 'QR Code has not been created yet', color: 'error' })
    return
  }
  step.value = 2 
}

const verifyOTP = async () => {
    if (otpCode.value.length !== 6) {
        toast.add({ title: 'Error', description: 'Enter 6 digit code', color: 'error' })
        return
    }

    await executeVerify()

    if (verifyData.value && verifyData.value.success) {
        toast.add({ title: 'Success', description: 'Two-Factor Authentication Success!', color: 'success' })
        tempEmail.value = null 
        router.push('/home/dashboard')
        return
    }

    if (verifyError.value || (verifyData.value && !verifyData.value.success)) {
        otpCode.value = []
        toast.add({
            title: 'Failed',
            description: verifyError.value?.data?.message || verifyData.value?.message || 'Incorrect OTP Code',
            color: 'error'
        })
    }
}
</script>

<template>
  <div class="max-w-md mx-auto mt-10 p-4">
    <UCard>
      <template #header>
        <h2 class="text-xl font-bold text-center">
          {{ step === 1 ? 'Setup Google Authenticator' : 'Two-Factor Authentication' }}
        </h2>
      </template>

      <div v-if="step === 1" class="space-y-6 py-4">
        
        <div v-if="isSetupLoading" class="flex flex-col items-center gap-3 py-12">
          <UIcon name="i-lucide-loader-2" class="w-10 h-10 animate-spin text-primary" />
          <p class="text-gray-500">Membuat QR Code...</p>
        </div>

        <div v-else-if="errorMsg" class="text-center space-y-4">
          <UIcon name="i-lucide-alert-circle" class="w-12 h-12 text-red-500 mx-auto" />
          <p class="text-red-600">{{ errorMsg }}</p>
          <UButton color="primary" @click="generateQR">Coba Lagi</UButton>
        </div>

        <div v-else-if="qrImage" class="flex flex-col items-center gap-6 text-center">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Scan this QR Code using Google Authenticator:
          </p>

          <div class="bg-white p-4 rounded-xl shadow-sm">
            <img :src="qrImage" alt="QR Code" class="w-56 h-56" />
          </div>

          <div class="w-full bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <p class="text-xs text-gray-500 mb-1">or enter the manual code:</p>
            <p class="font-mono text-xl font-bold tracking-widest break-all">{{ secretCode }}</p>
          </div>

          <UButton 
          block size="lg" 
          color="primary" 
          @click="goToVerify"
          class="font-bold"
          >
            Continue
          </UButton>
        </div>
      </div>

      <div v-else class="space-y-6 py-4">
        <div class="flex flex-col items-center mb-4">
           <UIcon name="i-lucide-shield-check" class="w-10 h-10 text-primary mb-2" />
           <p class="text-sm text-center text-gray-500">
             Enter the 6-digit code from your Authenticator Application
           </p>
        </div>

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
          color="primary"
          :loading="isVerifyLoading"
          :disabled="otpCode.length !== 6"
          class="font-bold"
          @click="verifyOTP"
        >
          Continue
        </UButton>

        <div class="text-center">
          <UButton 
          variant="ghost" 
          size="sm" 
          class="font-bold"
          @click="step = 1">
            ← Go back to view QR Code
          </UButton>
        </div>
      </div>

    </UCard>
  </div>
</template>