module.exports = {
    content: [
      './pages/**/*.{js,ts,jsx,tsx}',
      './components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
      extend: {
        backgroundImage: {
          'gradient-slate-indigo': 'linear-gradient(to right, #0f172a, #312e81, #0f172a)',
        },
      },
    },
    plugins: [],
  };