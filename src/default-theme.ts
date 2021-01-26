document.documentElement.classList.toggle('dark', window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false)
