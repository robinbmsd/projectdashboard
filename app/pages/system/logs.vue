<script setup lang="ts">
definePageMeta({
    layout: 'default',
    ssr: false,
    middleware: 'auth' 
})

const router = useRouter()
const toast = useToast()

const authToken = useCookie('auth_token')
const tempEmail = useCookie('temp_email')

const handleLogout = () => {
    authToken.value = null
    tempEmail.value = null
    
    toast.add({
        title: 'Logout Success',
        description: 'See you again!',
        color: 'success'
    })

    router.push('/usrlogin/login')
}
</script>

<template>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center gap-6">
        <h1 class="text-4xl font-bold text-gray-800 dark:text-white">System Logs Page On Progress</h1>
        
        <div class="flex gap-4">
            <UButton 
                icon="i-heroicons-arrow-right-on-rectangle"
                color="warning" 
                variant="soft" 
                size="lg"
                @click="handleLogout"
            >
                Logout
            </UButton>
        </div>
    </div>
</template>