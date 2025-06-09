<template>
    <section class="bg-secondary text-primary">
        <header class='fixed w-full top-0 z-50 h-[100px] flex item-center p-4'>
            <div :class="[
                'w-full p-2 h-full flex items-center justify-between gap-3 rounded-lg  transition-colors duration-300',
                isScrolled ? 'bg-white' : ''
            ]">
                <!-- Logo -->
                <div >
                    <NuxtLink to="/" class="flex items-center space-x-2">
                        <img src="/logo.webp" alt="Cursor Logo" class="h-6 w-6" />
                        <span class="text-lg font-bold tracking-wide">Sử việt Idle</span>
                    </NuxtLink>
                </div>

                <!-- Menu -->
                <nav class="hidden md:flex space-x-8 text-sm text-gray-700 font-medium">
                    <NuxtLink to="/game" class="hover:text-black">Trò chơi</NuxtLink>
                    <NuxtLink href="#" class="hover:text-black">Bài viết</NuxtLink>
                    <NuxtLink href="#" class="hover:text-black">Về chúng tôi</NuxtLink>
                    <NuxtLink href="#" class="hover:text-black">Liên hệ</NuxtLink>
                </nav>

                <!-- Buttons -->
                <div class="flex items-center space-x-3">
                    <button class="px-4 py-1.5 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-100">
                        Đăng nhập
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
