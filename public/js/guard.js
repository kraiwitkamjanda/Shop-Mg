const Token = localStorage.getItem('token');

if (!token) {

    window.location.href = '/login.html';

}