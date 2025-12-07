import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Colores para niveles de clasificación GMM
        nivel: {
          ambulatorio: {
            DEFAULT: '#22c55e',
            light: '#86efac',
            dark: '#166534',
          },
          hospitalario: {
            DEFAULT: '#eab308',
            light: '#fde047',
            dark: '#a16207',
          },
          especialidad: {
            DEFAULT: '#ef4444',
            light: '#fca5a5',
            dark: '#b91c1c',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
