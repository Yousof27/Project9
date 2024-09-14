let mainTitle = document.querySelector('main>.container .main-title span');
localStorage.activeUser ?
    mainTitle.innerHTML = JSON.parse(localStorage.usersData)[localStorage.activeUser].username :
    mainTitle.innerHTML = 'To Our Shop';

document.querySelectorAll('.main-catigories .box').forEach(box => {
    box.addEventListener('click', ()=> pathSearch(box.id))
});