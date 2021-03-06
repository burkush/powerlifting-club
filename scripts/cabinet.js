if (!localStorage.getItem("Token")) {
    window.location.replace('./index.html');
}

const token = localStorage.getItem("Token");
const user = JSON.parse(atob(token.split('.')[1]));

const username = document.querySelector('#current-user');
const avatar = document.querySelector('.avatar img');


username.innerHTML = user.name;
avatar.src = user.avatar;

if(user.about) {
    const aboutText = document.querySelector('.about-text');
    aboutText.innerHTML = user.about 
}

const openAboutBtn = document.querySelector('.toggle-about');
openAboutBtn.addEventListener('click', openAbout);

const aboutSection = document.querySelector('.about');

const closeAboutBtn = document.querySelector('.about-content .close-modal');
closeAboutBtn.addEventListener('click', closeAbout);

document.addEventListener('click', clickOutsideAbout);
document.addEventListener('keyup', escapeCloseAbout);

function openAbout() {
    aboutSection.style.display = 'block';
}

function closeAbout() {
    aboutSection.style.display = 'none';
}

function clickOutsideAbout (event) {
    if(event.target === aboutSection) {
        aboutSection.style.display = 'none';
    }
}

function escapeCloseAbout (event) {
    if (event.keyCode === 27) {
        aboutSection.style.display = 'none';
    }
}