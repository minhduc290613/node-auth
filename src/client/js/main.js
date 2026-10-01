import '../css/style.css';
import { switchView } from './ui.js';
import { handleFormSubmit } from './api.js';

// Expose switchView to global window for inline click handlers
window.switchView = switchView;

document.addEventListener('DOMContentLoaded', () => {
  // 1. Password Visibility Toggle
  document.querySelectorAll('.toggle-password-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      if (!input) return;

      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';

      const icon = btn.querySelector('i');
      if (icon) {
        if (isPassword) {
          icon.classList.remove('fa-eye');
          icon.classList.add('fa-eye-slash');
        } else {
          icon.classList.remove('fa-eye-slash');
          icon.classList.add('fa-eye');
        }
      }
    });
  });



  // 3. Form Submit Handlers
  document.getElementById('loginForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    handleFormSubmit('/api/auth/login', {
      email: document.getElementById('loginEmail').value,
      password: document.getElementById('loginPassword').value
    }, () => {
      // Smooth redirect after successful login
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 500);
    });
  });

  document.getElementById('registerForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    handleFormSubmit('/api/auth/register', {
      name: document.getElementById('regName').value,
      email: document.getElementById('regEmail').value,
      password: document.getElementById('regPassword').value
    }, () => {
      document.getElementById('registerForm').reset();
      setTimeout(() => {
        switchView('login');
      }, 800);
    });
  });

  document.getElementById('forgotForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    handleFormSubmit('/api/auth/forgot', {
      email: document.getElementById('forgotEmail').value
    }, () => {
      document.getElementById('forgotForm').reset();
    });
  });
});