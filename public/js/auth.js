document.addEventListener('DOMContentLoaded', () => {

    // เช็ค token ก่อน redirect — ถ้าหมดอายุให้ลบทิ้งและแสดงหน้า login
    const token = localStorage.getItem('token');

    if (token) {
        try {
            // decode payload จาก JWT (base64) โดยไม่ต้องใช้ library
            const payload = JSON.parse(atob(token.split('.')[1]));
            const isExpired = payload.exp && (payload.exp * 1000 < Date.now());

            if (isExpired) {
                // token หมดอายุ — ล้างแล้วอยู่หน้า login
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            } else {
                // token ยังใช้ได้ — redirect ไป dashboard
                window.location.href = '/index.html';
                return;
            }
        } catch (e) {
            // token format ผิด — ล้างทิ้ง
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    }

    // ===== LOGIN FORM LOGIC =====
    const loginForm    = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');
    const btnText      = document.getElementById('btn-text');
    const btnSpinner   = document.getElementById('btn-spinner');

    loginForm.addEventListener('submit', async (e) => {

        e.preventDefault();

        errorMessage.classList.add('hidden');
        btnText.classList.add('opacity-50');
        btnSpinner.classList.remove('hidden');

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {

            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                window.location.href = '/index.html';
            } else {
                throw new Error(data.message || 'Login failed');
            }

        } catch (error) {
            errorMessage.textContent = error.message;
            errorMessage.classList.remove('hidden');
        } finally {
            btnText.classList.remove('opacity-50');
            btnSpinner.classList.add('hidden');
        }

    });

});
