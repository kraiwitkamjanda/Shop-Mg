document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');
    const btnText = document.getElementById('btn-text');
    const btnSpinner = document.getElementById('btn-spinner');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // UI Loading state
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
                // Save JWT and user data to localStorage
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                // Redirect to Dashboard
                window.location.href = '/index.html';
            } else {
                throw new Error(data.message || 'Login failed');
            }
        } catch (error) {
            errorMessage.classList.remove('hidden');
        } finally {
            // Reset UI Loading state
            btnText.classList.remove('opacity-50');
            btnSpinner.classList.add('hidden');
        }
    });
});