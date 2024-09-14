let userData;

cartFavouritePermetion();
countFavouriteAndCard('favourites');
countFavouriteAndCard('card');
createFooter();

document.querySelectorAll('header nav ul li').forEach(link => {
    link.addEventListener('click', () => {
        closeHeader();
    })
});

// Create Footer
function createFooter() {
    let div = document.createElement('div');
    div.classList.add('footer-con');
    let footer = document.createElement('footer');
    let content = `COPYRIGHT © ${new Date().getFullYear()} . ALL RIGHT RESERVED BY Abo Kamal`;
    footer.innerHTML = content;
    div.appendChild(footer);
    document.querySelectorAll('script')[0].before(div)
}

function goLogin() {
    localStorage.setItem('page', 'login');
}

function goSignUp() {
    localStorage.setItem('page', 'signUp');
}

function signOut() {
    goLogin();
    localStorage.removeItem('activeUser');
}

// Update Data After Login :)
if (localStorage.activeUser) {
    userData = JSON.parse(localStorage.usersData)[localStorage.activeUser];
    document.querySelector('header nav ul').classList.add('start');
    document.querySelector('header nav ul li a.username').innerHTML = `<i><img src="${userData.setting.avatar}"/></i>${userData.username}`;

    document.querySelector('header a span.cartNumber').innerHTML = `${userData.card.length}`;
    document.querySelector('header a span.favourtieNumber').innerHTML = `${userData.favourites.length}`;
}

// Open And Close Nav Menu
function menuBtn() {
    document.querySelector('header nav .nav-icon').classList.toggle('active');
    document.querySelector('header').classList.toggle('active');
}

// Close Nav Menu And Remove Overlay
function closeHeader() {
    document.querySelector('header').classList.remove('active');
    document.querySelector('header nav .nav-icon').classList.remove('active');
}

// Go Shopping From The Menu
function goShopping() {
    localStorage.setItem('goShopping', true);
    window.location = 'index.html';
}

// Go User Page From Menu
function goUser() {
    if (localStorage.activeUser) {
        window.location = 'user.html';
    }
}


// Go Favourite And Cart From The Menu
function cartFavouritePermetion() {
    document.querySelectorAll('.permetion').forEach(link => {
        link.addEventListener('click', () => {
            if (localStorage.activeUser) {
                if (link.classList.contains('love')) window.location = 'favourite.html';
                if (link.classList.contains('card')) window.location = 'card.html';
            }
            else {
                window.location = 'sign.html'
                localStorage.setItem('page', 'login');
            }
        })
    })
}

// Add To Favourite Function
function addToFavouriteOrCard(btn, id, select) {
    if (localStorage.activeUser) {
        // Stop Icons Animation
        loveAndCardBtnsReset(btn, select);

        addRemoveCardAndLove(id, select, 'add');
        localStorage.removeItem(`${select === 'favourites' ? 'loveEmpty' : 'cardEmpty'}`);

    } else {
        localStorage.setItem('page', 'login');
        window.location = 'sign.html';
    }
}

// Reset Love And Cart Btns
function loveAndCardBtnsReset(btn, select) {
    btn.classList.add('yes');
    btn.classList.remove('no');
    btn.firstElementChild.classList.remove(`${select === 'favourites' ? 'fa-beat' : 'fa-bounce'}`);
}

// Add Or Remove Product (From Or To) (Favourite Or Cart)
function addRemoveCardAndLove(id, select, check) {
    // Get Data From Local Storage
    let userMap = JSON.parse(localStorage.usersData);
    let user = userMap[localStorage.activeUser];

    // Add Or Remove Product Id
    let list = new Set(user[`${select}`]);

    if (check === 'add') list.add(id);
    else if (check === 'remove') list.delete(id);
    list.delete('');

    // Set Data In Local Storage
    user[`${select}`] = Array.from(list);
    userMap[localStorage.activeUser] = user;
    localStorage.usersData = JSON.stringify(userMap);

    countFavouriteAndCard(select);

    console.log(`${select} ` + userMap[localStorage.activeUser][`${select}`]);
}

function countFavouriteAndCard(select) {
    if (localStorage.activeUser) {
        let user = JSON.parse(localStorage.usersData)[localStorage.activeUser];
        let list = new Set(user[`${select}`]);
        document.querySelector(`header a span.${select === 'favourites' ? 'favourtieNumber' : 'cartNumber'}`).innerHTML = `${list.size}`;
        if (list.size === 0) {
            localStorage.setItem(`${select === 'favourites' ? 'loveEmpty' : 'cardEmpty'}`, true);
        }
    }
}

// Show Empty Message
function showEmptyMessage(boxsContainer) {
    let emptyMessage = document.createElement('h2');
    emptyMessage.classList.add('empty-message');
    emptyMessage.innerHTML = 'empty';
    boxsContainer.appendChild(emptyMessage);
}

// Search By Catigory From The Path
function pathSearch(id) {
    let searchWord = id;
    localStorage.setItem('pathSearch', searchWord);
    window.location = 'shopping.html';
}

// Change Product Image Btns
function changeImage(e, id) {
    let locatoin = id.split('-');
    let data = products;
    let linksList = data[locatoin[0]][locatoin[1]].url;
    let current = e.parentElement.dataset.current;

    if (e.classList.contains('next') && current < 2) {
        current++;
    } else if (e.classList.contains('prev') && current > 0) {
        current--;
    }
    e.parentElement.setAttribute('data-current', current);
    e.parentElement.style.setProperty("background-image", `url("${linksList[current]}")`);
}


// Go To Bill
function goBill(id, quantity, fromCardCheck) {
    if (localStorage.activeUser) {
        if (fromCardCheck == 'true') {
            localStorage.setItem('fromCard', true);
        } else {
            localStorage.removeItem('fromCard');
        }
        localStorage.setItem('singlBill', true);
        localStorage.setItem('singlBillData', [id, quantity]);
        localStorage.setItem('activeBuy', true);
        window.location = 'buy.html';
    } else {
        window.location = 'sign.html';
    }
}


// Open Bill From History :)
function openBill(index) {
    let data = JSON.parse(localStorage.usersData)[localStorage.activeUser];
    let purchases = data.purchases;
    let quantities = data.quantities;

    if (purchases[index].split(',').length > 1) {
        localStorage.removeItem('singlBill');
        localStorage.setItem('idList', purchases[index]);
        localStorage.setItem('quantityList', quantities[index]);
    } else {
        localStorage.setItem('singlBill', true);
        localStorage.setItem('singlBillData', `${purchases[index]},${quantities[index]}`);
    }
    window.location = 'buy.html';
}