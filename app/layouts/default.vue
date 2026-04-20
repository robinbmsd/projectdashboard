<template>
  <div class="flex h-screen w-full bg-white dar:bg-[#121212]">
  
    <div class="shrink-0 w-60 bg-gray-100 dark:bg-gray-900 text-center p-4">
      Ini Sidebar
    </div>

    <div class="flex flex-col flex-1 min-w-0 overflow-hidden">
      <div class="shrink-0 h-16 bg-gray-200 dark:bg-gray-800 text-center p-4">
        Ini Navbar
      </div>

      <main class="flex-1 min-h-0 relative overflow-y-auto p-4">
        <slot />
      </main>
    </div>

</div>
</template>