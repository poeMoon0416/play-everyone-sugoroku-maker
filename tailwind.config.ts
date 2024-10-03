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
        "secondary": "#020617", // slate-950
        "acsent": "#f87171", // red-400
      },
    },
  },
} satisfies Config;
