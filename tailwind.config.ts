import { type Config } from "tailwindcss";

export default {
  content: [
    "{routes,islands,components}/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // hexでなくcolor-nnnだとバグるので注意。
        "primary": "#f1f5f9", // slate-100
        "secondary": "#0f172a", // slate-900
        "acsent": "#dc2626", // red-600
      },
    },
  },
} satisfies Config;
