import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      fontFamily: {
        rubik: ['var(--font-rubik)', 'Arial', 'Helvetica', 'sans-serif'],
        poppins: [
          'var(--font-poppins)',
          'Verdana',
          'Trebuchet MS',
          'Tahoma',
          'sans-serif',
        ],
      },
      spacing: {
        'nav-h': 'var(--nav-height)',
        'footer-h': 'var(--footer-height)',
        '13': '3.25rem',
      },
    },
  },
  plugins: [],
};
export default config;
