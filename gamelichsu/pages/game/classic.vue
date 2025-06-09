<template>
  <div class="w-full relative overflow-hidden h-[calc(100vh-100px-.25rem*4)]">
    <div class="relative z-20 flex flex-col items-center justify-between h-full py-8">
      <div class="flex-grow flex flex-col items-center justify-center w-full px-4 py-8">
        <div v-if="!gameStarted" class="text-center">
          <div class="text-white text-xl mb-4">Summoning champion</div>
          <div class="flex gap-1 mb-8">
            <div class="w-2 h-2 bg-white rounded-full"></div>
            <div class="w-2 h-2 bg-white/50 rounded-full"></div>
            <div class="w-2 h-2 bg-white/50 rounded-full"></div>
          </div>
          
          <button 
            @click="startGame" 
            class="px-6 py-3 bg-gradient-to-b from-yellow-500 to-yellow-700 text-white rounded-lg font-medium shadow-lg hover:from-yellow-400 hover:to-yellow-600 transition-all"
          >
            Start Game
          </button>
        </div>
        
        <div v-else class="w-full max-w-md">
          <h2 class="text-white text-xl mb-4 text-center">Guess the Champion</h2>
          
          <!-- Search input -->
          <div class="relative mb-4">
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Type a champion name..." 
              class="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:border-yellow-500"
              @input="filterChampions"
            />
            <div 
              v-if="filteredChampions.length > 0 && searchQuery" 
              class="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto"
            >
              <div 
                v-for="champion in filteredChampions" 
                :key="champion.id" 
                @click="selectChampion(champion)"
                class="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center gap-2"
              >
                <div class="w-8 h-8 rounded-full overflow-hidden">
                  <img :src="champion.icon" :alt="champion.name" class="w-full h-full object-cover" />
                </div>
                <span class="text-white">{{ champion.name }}</span>
              </div>
            </div>
          </div>
          
          <!-- Guesses -->
          <div class="space-y-2">
            <div v-for="(guess, index) in guesses" :key="index" class="bg-gray-800 rounded-lg p-3 flex items-center">
              <div class="w-10 h-10 rounded-full overflow-hidden mr-3">
                <img :src="guess.icon" :alt="guess.name" class="w-full h-full object-cover" />
              </div>
              <div class="flex-grow">
                <div class="text-white font-medium">{{ guess.name }}</div>
                <div class="flex gap-1 mt-1">
                  <div 
                    v-for="(attribute, attrIndex) in ['gender', 'position', 'species', 'resource', 'range']" 
                    :key="attrIndex"
                    :class="{
                      'bg-green-500': guess[attribute] === targetChampion[attribute],
                      'bg-yellow-500': attribute === 'position' && targetChampion.position.includes(guess[attribute]),
                      'bg-red-500': guess[attribute] !== targetChampion[attribute] && !(attribute === 'position' && targetChampion.position.includes(guess[attribute]))
                    }"
                    class="w-6 h-6 rounded-sm flex items-center justify-center text-xs text-white font-bold"
                  >
                    {{ attribute.charAt(0).toUpperCase() }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Win message -->
          <div v-if="hasWon" class="mt-6 text-center">
            <div class="text-green-400 text-xl font-bold mb-2">Congratulations!</div>
            <div class="text-white">You guessed the champion in {{ guesses.length }} tries!</div>
            <button 
              @click="resetGame" 
              class="mt-4 px-6 py-2 bg-gradient-to-b from-yellow-500 to-yellow-700 text-white rounded-lg font-medium shadow-lg hover:from-yellow-400 hover:to-yellow-600 transition-all"
            >
              Play Again
            </button>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="w-full flex flex-col items-center gap-4">
        <div class="flex gap-4">
          <a href="#" class="text-white hover:text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
            </svg>
          </a>
          <a href="#" class="text-white hover:text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"></path>
            </svg>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// Sample champion data
const champions = ref([
  { 
    id: 'aatrox', 
    name: 'Aatrox', 
    gender: 'Male', 
    position: ['Top'], 
    species: 'Darkin', 
    resource: 'Manaless', 
    range: 'Melee',
    icon: 'https://ddragon.leagueoflegends.com/cdn/13.10.1/img/champion/Aatrox.png'
  },
  { 
    id: 'ahri', 
    name: 'Ahri', 
    gender: 'Female', 
    position: ['Mid'], 
    species: 'Vastayan', 
    resource: 'Mana', 
    range: 'Ranged',
    icon: 'https://ddragon.leagueoflegends.com/cdn/13.10.1/img/champion/Ahri.png'
  },
  { 
    id: 'akali', 
    name: 'Akali', 
    gender: 'Female', 
    position: ['Mid', 'Top'], 
    species: 'Human', 
    resource: 'Energy', 
    range: 'Melee',
    icon: 'https://ddragon.leagueoflegends.com/cdn/13.10.1/img/champion/Akali.png'
  },
  { 
    id: 'ashe', 
    name: 'Ashe', 
    gender: 'Female', 
    position: ['Bottom'], 
    species: 'Human', 
    resource: 'Mana', 
    range: 'Ranged',
    icon: 'https://ddragon.leagueoflegends.com/cdn/13.10.1/img/champion/Ashe.png'
  },
  { 
    id: 'blitzcrank', 
    name: 'Blitzcrank', 
    gender: 'Other', 
    position: ['Support'], 
    species: 'Golem', 
    resource: 'Mana', 
    range: 'Melee',
    icon: 'https://ddragon.leagueoflegends.com/cdn/13.10.1/img/champion/Blitzcrank.png'
  },
  { 
    id: 'darius', 
    name: 'Darius', 
    gender: 'Male', 
    position: ['Top'], 
    species: 'Human', 
    resource: 'Mana', 
    range: 'Melee',
    icon: 'https://ddragon.leagueoflegends.com/cdn/13.10.1/img/champion/Darius.png'
  },
  { 
    id: 'ezreal', 
    name: 'Ezreal', 
    gender: 'Male', 
    position: ['Bottom'], 
    species: 'Human', 
    resource: 'Mana', 
    range: 'Ranged',
    icon: 'https://ddragon.leagueoflegends.com/cdn/13.10.1/img/champion/Ezreal.png'
  },
  { 
    id: 'lux', 
    name: 'Lux', 
    gender: 'Female', 
    position: ['Mid', 'Support'], 
    species: 'Human', 
    resource: 'Mana', 
    range: 'Ranged',
    icon: 'https://ddragon.leagueoflegends.com/cdn/13.10.1/img/champion/Lux.png'
  },
  { 
    id: 'yasuo', 
    name: 'Yasuo', 
    gender: 'Male', 
    position: ['Mid', 'Top'], 
    species: 'Human', 
    resource: 'Flow', 
    range: 'Melee',
    icon: 'https://ddragon.leagueoflegends.com/cdn/13.10.1/img/champion/Yasuo.png'
  },
  { 
    id: 'yuumi', 
    name: 'Yuumi', 
    gender: 'Female', 
    position: ['Support'], 
    species: 'Cat', 
    resource: 'Mana', 
    range: 'Ranged',
    icon: 'https://ddragon.leagueoflegends.com/cdn/13.10.1/img/champion/Yuumi.png'
  }
]);

const gameStarted = ref(false);
const searchQuery = ref('');
const guesses = ref([]);
const targetChampion = ref(null);
const hasWon = ref(false);

const filteredChampions = computed(() => {
  if (!searchQuery.value) return [];
  
  const query = searchQuery.value.toLowerCase();
  return champions.value.filter(champion => 
    champion.name.toLowerCase().includes(query) && 
    !guesses.value.some(g => g.id === champion.id)
  );
});

function startGame() {
  gameStarted.value = true;
  resetGame();
}

function resetGame() {
  // Select a random champion as the target
  const randomIndex = Math.floor(Math.random() * champions.value.length);
  targetChampion.value = champions.value[randomIndex];
  guesses.value = [];
  searchQuery.value = '';
  hasWon.value = false;
  console.log("Target champion:", targetChampion.value.name); // For debugging
}

function filterChampions() {
  // Already handled by the computed property
}

function selectChampion(champion) {
  guesses.value.unshift(champion);
  searchQuery.value = '';
  
  // Check if the player won
  if (champion.id === targetChampion.value.id) {
    hasWon.value = true;
  }
}

onMounted(() => {
  // You could fetch real champion data from an API here
});
</script>

<style scoped>
body {
  font-family: 'Poppins', sans-serif;
  margin: 0;
  padding: 0;
}

.logo-container {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  letter-spacing: 1px;
}

/* Custom scrollbar for the champion list */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #2d3748;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: #4a5568;
  border-radius: 6px;
}
</style>