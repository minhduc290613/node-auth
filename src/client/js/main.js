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

  // 2. Subtle 3D Card Tilt Interaction (Desktop only)
  const card = document.getElementById('authCard');
  if (card && window.matchMedia('(min-width: 992px)').matches) {
    let bounds = null;

    const onMouseMove = (e) => {
      if (!bounds) bounds = card.getBoundingClientRect();
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      const leftX = mouseX - bounds.left;
      const topY = mouseY - bounds.top;
      const center = {
        x: leftX - bounds.width / 2,
        y: topY - bounds.height / 2
      };
      const distance = Math.hypot(center.x, center.y);

      // Max rotation: 3.5 degrees for an ultra-tasteful, elegant feel
      const maxRot = 3.5;
      const rotX = (-center.y / (bounds.height / 2)) * maxRot;
      const rotY = (center.x / (bounds.width / 2)) * maxRot;

      card.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
    };

    card.addEventListener('mouseenter', () => {
      bounds = card.getBoundingClientRect();
      card.style.transition = 'transform 0.1s ease-out, box-shadow 0.3s ease';
    });

    card.addEventListener('mousemove', (e) => {
      requestAnimationFrame(() => onMouseMove(e));
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.6s var(--ease-spring), box-shadow 0.3s ease';
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
      bounds = null;
    });
  }

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