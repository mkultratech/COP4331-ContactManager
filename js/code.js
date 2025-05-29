function showMessage(id, message) {
  document.getElementById(id).textContent = message;
}

document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('signupForm');
  const loginForm = document.getElementById('loginForm');
  const toLogin = document.getElementById('toLogin');
  const toSignup = document.getElementById('toSignup');

  // Toggle between forms
  toLogin.addEventListener('click', () => {
    signupForm.classList.remove('active');
    loginForm.classList.add('active');
    showMessage('signup-message', '');
    showMessage('login-message', '');
  });

  toSignup.addEventListener('click', () => {
    loginForm.classList.remove('active');
    signupForm.classList.add('active');
    showMessage('signup-message', '');
    showMessage('login-message', '');
  });

  // SIGN UP HANDLER
  signupForm.addEventListener('submit', async e => {
    e.preventDefault();
    showMessage('signup-message', '');
    const payload = {
      firstName: document.getElementById('signupFirst').value.trim(),
      lastName: document.getElementById('signupLast').value.trim(),
      username: document.getElementById('signupUsername').value.trim(),
      email: document.getElementById('signupEmail').value.trim(),
      password: document.getElementById('signupPassword').value,
    };

    if (!payload.firstName || !payload.lastName || !payload.username || !payload.email || !payload.password) {
      return showMessage('signup-message', 'All fields are required.');
    }

    try {
      const res = await fetch('/LAMPAPI/SignUp.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const json = await res.json();

      if (res.status === 201) {
        showMessage('signup-message', 'Account created! Please log in.');
        setTimeout(() => toLogin.click(), 1000);
      } else {
        showMessage('signup-message', json.error || 'Sign-up failed.');
      }
    } catch (err) {
      showMessage('signup-message', 'Network error. Try again.');
    }
  });

  // LOGIN HANDLER
  loginForm.addEventListener('submit', async e => {
    e.preventDefault();
    showMessage('login-message', '');

    const payload = {
      username: document.getElementById('loginUsername').value.trim(),
      password: document.getElementById('loginPassword').value
    };

    if (!payload.username || !payload.password) {
      return showMessage('login-message', 'Both fields are required.');
    }

    try {
      const res = await fetch('/LAMPAPI/Login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const json = await res.json();

      if (res.status === 200 && json.id > 0) {
        sessionStorage.setItem('userId', json.id);
        sessionStorage.setItem('userFirstName', json.firstName);
        window.location.href = 'color.html';
      } else {
        showMessage('login-message', json.error || 'Login failed.');
      }
    } catch (err) {
      showMessage('login-message', 'Network error. Try again.');
    }
  });
});
