export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie('auth_token')

  if (to.path === '/usrlogin/login' && token.value) {
    return navigateTo('/home/dashboard')
  }

  if (!token.value && to.path !== '/usrlogin/login') {
    return navigateTo('/usrlogin/login')
  }

  if (token.value) {
    try {
      const parts = token.value.split('.')
      
      if (parts.length !== 3) {
        token.value = null
        if (to.path !== '/usrlogin/login') return navigateTo('/usrlogin/login')
        return
      }
      
      const payloadRaw = atob(parts[1] as string)
      const payload = JSON.parse(payloadRaw)
      
      const isExpired = payload.exp * 1000 < Date.now()
      
      if (isExpired) {
        token.value = null
        if (to.path !== '/usrlogin/login') return navigateTo('/usrlogin/login')
      }
    } catch (e) {
      token.value = null
      if (to.path !== '/usrlogin/login') return navigateTo('/usrlogin/login')
    }
  }
})