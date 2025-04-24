
document.addEventListener('DOMContentLoaded', function() {
  const darkModeToggle = document.getElementById('dark-mode');
  const body = document.body;

  // Check for saved user preference
  if (localStorage.getItem('darkMode') === 'enabled') {
    body.classList.add('dark-mode');
    body.classList.remove('light-mode');
    darkModeToggle.checked = true;
  }

  // toggle dark mode
  darkModeToggle.addEventListener('change', function() {
    if (this.checked) {
      body.classList.add('dark-mode');
      body.classList.remove('light-mode');
      localStorage.setItem('darkMode', 'enabled');
    } else {
      body.classList.remove('dark-mode');
      body.classList.add('light-mode');
      localStorage.setItem('darkMode', 'disabled');
    }
  });
});
