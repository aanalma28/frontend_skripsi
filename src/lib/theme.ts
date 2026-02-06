import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const initialTheme = browser ? (localStorage.getItem('theme') ?? 'light') : 'light';
export const theme = writable(initialTheme);

theme.subscribe((value) => {
  if (browser) {
    localStorage.setItem('theme', value);
    const html = document.documentElement; // Ini target kita
    
    if (value === 'dark') {
      html.classList.add('dark');
      html.style.colorScheme = 'dark'; // Memberitahu browser ini mode gelap
    } else {
      html.classList.remove('dark');
      html.style.colorScheme = 'light';
    }
    
    // Console log untuk debugging, cek di F12
    console.log("Current Theme Class:", html.className);
  }
});