changeAvatar();

localStorage.removeItem('activeBuy');
let data = JSON.parse(localStorage.usersData)[localStorage.activeUser];
document.querySelector('title').innerHTML = `Shopping | ${data.username.toUpperCase()}`;
document.querySelector('.page-title').innerHTML = data.username;
document.querySelector('.page-path p a:last-of-type').innerHTML = data.username;
document.querySelector('.info .text p.username span').innerHTML = data.username;
document.querySelector('.info .text p.email span').innerHTML = data.email;
document.querySelector('.dashboard .box.card span').innerHTML = data.card.length;
document.querySelector('.dashboard .box.love span').innerHTML = data.favourites.length;
document.querySelector('.dashboard .box.bill span').innerHTML = data.purchases.length;
document.querySelector('.dashboard .box.purchase span').innerHTML = countProducts();
document.querySelector('.dashboard .box.bill').addEventListener('click', () => window.location = 'bills.html');
document.querySelector('.dashboard .box.card').addEventListener('click', () => window.location = 'card.html');
document.querySelector('.dashboard .box.love').addEventListener('click', () => window.location = 'favourite.html');
document.querySelector('.dashboard .box.purchase').addEventListener('click', () => window.location = 'purchases.html');
document.querySelector('.image').addEventListener('click', (e) => {
    e.target.classList.toggle('active');
})

document.querySelectorAll('.chois').forEach(icon => {
    icon.addEventListener('click', (e) => {
        let link = e.target.getAttribute('src');
        // Get Data From Local Storage
        let userMap = JSON.parse(localStorage.usersData);
        let user = userMap[localStorage.activeUser];

        // Set Data In Local Storage
        user.setting.avatar = link;
        userMap[localStorage.activeUser] = user;
        localStorage.usersData = JSON.stringify(userMap);

        changeAvatar();
    });
});


// Change User Avatar Function :)
function changeAvatar() {
    let userMap = JSON.parse(localStorage.usersData);
    let user = userMap[localStorage.activeUser];
    document.querySelector('.image').style.setProperty('background-image', `url('${user.setting.avatar}')`)

    document.querySelector('header nav ul li a.username').innerHTML = `<i><img src="${user.setting.avatar}"/></i>${userData.username}`;
}


// Count All Products User Bought :)
function countProducts() {
    let counter = 0;
    let user = JSON.parse(localStorage.usersData)[localStorage.activeUser];
    user.quantities.forEach(qs => {
        qs.split(',').forEach(q => {
            counter += +q;
        })
    })
    return counter;
}

