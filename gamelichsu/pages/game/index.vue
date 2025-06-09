<template>
  <div class="space-y-12">
    <div class="flex flex-col md:flex-row items-center justify-between max-w-5xl mx-auto p-6">
      <div class="md:w-1/2 space-y-4 text-center md:text-left">
        <p class="text-sm text-gray-500 font-semibold uppercase">How it works</p>
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
          We Help You <br />
          Prioritize Your <br />
          Mental Health
        </h2>
        <p class="text-gray-600 text-base">
          Browse therapists, book a session, and start your healing journey with trusted professionals.
        </p>
        <NuxtLink :to="{ path: '/game/classic' }" class="bg-teal-900 text-white px-6 py-2 rounded-full hover:bg-teal-800 transition duration-300">
          Classic
        </NuxtLink>
      </div>
      <div class="md:w-1/2 mt-6 md:mt-0 flex justify-center">
        <img src="/game1.png" alt="Mental Health Illustration" class="w-72 h-72 object-cover rounded-3xl hidden md:block" />
      </div>
    </div>

    <div class="flex flex-col md:flex-row items-center justify-between max-w-5xl mx-auto p-6">
      <div class="md:w-1/2 mt-6 md:mt-0 flex justify-center">
        <img src="/game1.png" alt="Mental Health Illustration" class="w-72 h-72 object-cover rounded-3xl hidden md:block" />
      </div>
      <div class="md:w-1/2 space-y-4 text-center md:text-left">
        <p class="text-sm text-gray-500 font-semibold uppercase">How it works</p>
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
          We Help You <br />
          Prioritize Your <br />
          Mental Health
        </h2>
        <p class="text-gray-600 text-base">
          Browse therapists, book a session, and start your healing journey with trusted professionals.
        </p>
        <NuxtLink :to="{ path: '/game/emoji' }" class="bg-teal-900 text-white px-6 py-2 rounded-full hover:bg-teal-800 transition duration-300">
          Emoji
        </NuxtLink>
      </div>
    </div>

    <div class="flex flex-col md:flex-row items-center justify-between bg-white rounded-3xl shadow px-6 py-[64px] max-w-5xl mx-auto relative overflow-hidden">
      <div class="md:w-1/2 space-y-4 text-center md:text-left">
        <h2 class="text-2xl font-bold text-gray-900">Wellness Coaching</h2>
        <p class="text-gray-600 text-sm">
          Personalized guidance to help you build healthier habits, manage stress, and achieve balance in all areas of your life.
        </p>
        <p class="text-gray-600 text-sm">
          Our wellness coaches support you in creating sustainable routines for mental, emotional, and physical well-being.
        </p>
        <NuxtLink :to="{ path: '/game/quote' }" class="bg-teal-900 text-white px-6 py-2 rounded-full hover:bg-teal-800 transition duration-300">
          Quote
        </NuxtLink>
      </div>
      <div class="absolute right-0 bottom-0">
        <img src="/game2.png" alt="Wellness Illustration" class="w-72 h-72 object-cover rounded-br-3xl hidden md:block" />
      </div>
    </div>
  </div>
</template>
