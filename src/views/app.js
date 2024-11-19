const container = document.getElementById('container');
const formContent = document.getElementById('form-content');
const imageText = document.getElementById('image-text');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');

function showLogin() {
    container.classList.add('right-panel-active');
    loginForm.style.display = 'block';
    signupForm.style.display = 'none';
    imageText.innerText = 'Welcome Back!';
}

function showSignup() {
    container.classList.remove('right-panel-active');
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
    imageText.innerText = 'Let`s Get Started!';
}