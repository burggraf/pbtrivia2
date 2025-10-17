/** @type {import('tailwindcss').Config} */
export default {
  // Content paths - tells Tailwind where to look for class names to include in final CSS
  // Purges unused styles in production for optimal bundle size
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Custom theme extensions go here
      // Example: add custom colors, fonts, spacing, etc.
    },
  },
  plugins: [
    // Tailwind plugins can be added here
  ],
}
