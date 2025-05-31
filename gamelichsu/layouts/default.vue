<template>
    <section class="bg-secondary text-primary">
        <header class='fixed w-full top-0 z-50 h-[100px] flex item-center p-4'>
            <div :class="[
            'w-full p-2 h-full flex items-center justify-between gap-3 rounded-lg  transition-colors duration-300',
             isScrolled ? 'bg-white' : ''
            ]">
                <!-- Logo -->
                <div class="flex items-center space-x-2">
                    <img src="/logo.webp" alt="Cursor Logo" class="h-6 w-6" />
                    <span class="text-lg font-bold tracking-wide">CURSOR</span>
                </div>

                <!-- Menu -->
                <nav class="hidden md:flex space-x-8 text-sm text-gray-700 font-medium">
                    <a href="#" class="hover:text-black">Pricing</a>
                    <a href="#" class="hover:text-black">Features</a>
                    <a href="#" class="hover:text-black">Enterprise</a>
                    <a href="#" class="hover:text-black">Blog</a>
                    <a href="#" class="hover:text-black">Forum</a>
                    <a href="#" class="hover:text-black">Careers</a>
                </nav>

                <!-- Buttons -->
                <div class="flex items-center space-x-3">
                    <button class="px-4 py-1.5 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-100">
                        Sign in
                    </button>
                    <button
                        class="flex items-center space-x-2 bg-black text-white px-4 py-1.5 rounded-md text-sm font-medium hover:opacity-90">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path
                                d="M5 3h14a2 2 0 0 1 2 2v1H3V5a2 2 0 0 1 2-2zm-2 6h18v2H3V9zm0 4h18v2H3v-2zm0 4h18v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1z" />
                        </svg>
                        <span>Download</span>
                    </button>
                </div>
            </div>
        </header>
        <div class="pt-[100px] p-4">
            <slot />
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const isScrolled = ref(false)

const handleScroll = () => {
    isScrolled.value = window.scrollY > 10
}

onMounted(() => {
    window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll)
})
</script>
