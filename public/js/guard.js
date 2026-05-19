// guard.js
var token = localStorage.getItem('token');

if (!token) {
    window.location.href = '/login.html';
}