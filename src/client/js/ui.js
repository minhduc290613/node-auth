/**
 * UI Controller with silky smooth animations & dynamic state management
 */

export function switchView(view) {
  const forms = {
    login: document.getElementById('loginForm'),
    register: document.getElementById('registerForm'),
    forgot: document.getElementById('forgotForm')
  };

  const tabs = document.getElementById('authTabs');
  const tabLogin = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');
  const title = document.getElementById('formHeaderTitle');
  const subtitle = document.getElementById('formHeaderSubtitle');

  // Identify currently active form for exit animation
  let currentActive = null;
  Object.values(forms).forEach(f => {
    if (f && f.classList.contains('active-form')) {
      currentActive = f;
    }
  });

  const performSwitch = () => {
    Object.values(forms).forEach(f => {
      if (f) {
        f.classList.add('form-hidden');
        f.classList.remove('active-form', 'form-exit');
      }
    });

    if (view === 'login') {
      tabs?.classList.remove('d-none');
      tabLogin?.classList.add('active');
      tabRegister?.classList.remove('active');
      if (title) title.textContent = 'Xin Chào!';
      if (subtitle) subtitle.textContent = 'Vui lòng đăng nhập để tiếp tục';
      if (forms.login) {
        forms.login.classList.remove('form-hidden');
        forms.login.classList.add('active-form');
      }
    } else if (view === 'register') {
      tabs?.classList.remove('d-none');
      tabRegister?.classList.add('active');
      tabLogin?.classList.remove('active');
      if (title) title.textContent = 'Tạo Tài Khoản';
      if (subtitle) subtitle.textContent = 'Điền thông tin để bắt đầu trải nghiệm';
      if (forms.register) {
        forms.register.classList.remove('form-hidden');
        forms.register.classList.add('active-form');
      }
    } else if (view === 'forgot') {
      tabs?.classList.add('d-none');
      if (title) title.textContent = 'Khôi Phục Mật Khẩu';
      if (subtitle) subtitle.textContent = 'Chúng tôi sẽ gửi liên kết khôi phục tới email của bạn';
      if (forms.forgot) {
        forms.forgot.classList.remove('form-hidden');
        forms.forgot.classList.add('active-form');
      }
    }
  };

  if (currentActive && currentActive !== forms[view]) {
    currentActive.classList.add('form-exit');
    setTimeout(performSwitch, 150);
  } else {
    performSwitch();
  }
}

export function showAlert(message, type = 'success') {
  const alertBox = document.getElementById('alertBox');
  if (!alertBox) return;
  alertBox.className = `alert alert-${type} alert-dismissible fade show`;
  alertBox.innerHTML = `
    <div class="d-flex align-items-center gap-2">
      <i class="fa-solid ${type === 'success' ? 'fa-circle-check text-success' : 'fa-circle-exclamation text-danger'}"></i>
      <span>${message}</span>
    </div>
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;
  alertBox.classList.remove('d-none');
}

export function toggleLoading(show) {
  const loader = document.getElementById('loading');
  if (!loader) return;
  show ? loader.classList.add('active') : loader.classList.remove('active');
}