document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const errorMsg = document.getElementById('errorMsg');
  const togglePassBtn = document.getElementById('togglePass');
  const submitBtn = document.getElementById('submitBtn');

  // إظهار وإخفاء الباسورد
  if (togglePassBtn && passwordInput) {
    togglePassBtn.addEventListener('click', () => {
      const isPass = passwordInput.type === 'password';
      passwordInput.type = isPass ? 'text' : 'password';
      togglePassBtn.textContent = isPass ? 'Hide' : 'Show';
    });
  }

  // معالجة تسجيل الدخول
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      errorMsg.textContent = '';
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';

      const username = usernameInput.value.trim();
      const password = passwordInput.value;

      // إرسال البيانات بكلا الاسمين لضمان توافقه مع الـ backend لديك
      const payload = {
        username: username,
        usernameOrEmail: username,
        password: password
      };

      try {
        const res = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (res.ok && (data.success || data.token || res.status === 200)) {
          try { if (data.user) localStorage.setItem('cmsUser', JSON.stringify(data.user)); } catch (e) {}
          window.location.href = data.redirectUrl || '/dashboard.html';
        } else {
          errorMsg.textContent = data.message || 'بيانات الدخول غير صحيحة';
        }
      } catch (err) {
        errorMsg.textContent = 'تعذر الاتصال بالخادم. يرجى المحاولة مرة أخرى بعد قليل.';
      } finally {
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
      }
    });
  }
});