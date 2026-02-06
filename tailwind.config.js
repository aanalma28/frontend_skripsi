/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'], // Memberitahu Tailwind file mana saja yang perlu dipindai
  darkMode: 'class', // PENTING: Untuk mendukung toggle dark mode yang kita buat
  theme: {
    extend: {
      // Kamu bisa kustomisasi warna atau font di sini jika mau
    },
  },
  plugins: [],
}