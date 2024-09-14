let productTitle = document.querySelector('.title');
let productDescription = document.querySelector('.description');
let productRate = document.querySelector('.rate span');
let productPrice = document.querySelector('.price span');
let productFeatures = document.querySelector('.features');
let productPathTitle = document.querySelector('.path .product-title');
let productPathType = document.querySelector('.path .product-type');
let favouriteBtn = document.querySelector('button.love');
let cardBtn = document.querySelector('button.card');
let buyBtn = document.querySelector('button.buy');

window.onload = accessProducts;

// Reset Favourite And Card Btns
if (localStorage.activeUser) {
    let favouritList = new Set(JSON.parse(localStorage.usersData)[localStorage.activeUser].favourites);
    let cardList = new Set(JSON.parse(localStorage.usersData)[localStorage.activeUser].card);

    if (favouritList.has(localStorage.productId)) {
        loveAndCardBtnsReset(favouriteBtn, 'favourites');
    }

    if (cardList.has(localStorage.productId)) {
        loveAndCardBtnsReset(cardBtn, 'card');
    }
}

function accessProducts() {
    let data = products;
    let location = localStorage.productId.split('-');
    let product = data[location[0]][location[1]];
    productTitle.innerHTML = product.title;
    productDescription.innerHTML = product.description;
    productRate.innerHTML = product.rate;
    productPrice.innerHTML = product.price;
    productPathType.innerHTML = location[0];
    productPathType.id = location[0];
    productPathTitle.innerHTML = product.title

    for (const feature in product.fetures) {
        let div = document.createElement('div');
        div.innerHTML = `${feature}: ${product.fetures[feature]}`;
        productFeatures.appendChild(div);
    }

    let links = product['url'];

    let image = document.querySelector('.image');
    image.style.setProperty("background-image", `url("${links[0]}")`);

    // Add On Click Event To Love, Cart And Buy Btns And Path
    favouriteBtn.addEventListener('click', () => addToFavouriteOrCard(favouriteBtn, localStorage.productId, 'favourites'));
    cardBtn.addEventListener('click', () => addToFavouriteOrCard(cardBtn, localStorage.productId, 'card'));
    buyBtn.addEventListener('click', () => goBill(localStorage.productId, 1, false));
    productPathType.addEventListener('click', (e) => pathSearch(productPathType.id));

    popupImageBtns(links);
}

// Next And Previous Popup Image Function
function popupImageBtns(links) {
    let nextBtn = document.documentElement.querySelector('button.next');
    let prevBtn = document.documentElement.querySelector('button.prev');
    let image = document.documentElement.querySelector('.image');
    let icons = document.documentElement.querySelectorAll('.icon');
    let backgroundIndex = 0;
    let counter = 0;

    icons.forEach(icon => {
        icon.style.setProperty("background-image", `url("${links[counter++]}")`);
    });

    // Next Image Btn
    nextBtn.addEventListener('click', () => {
        if (backgroundIndex < 2) {
            backgroundIndex++;
            changeActiveIcon(links, icons, image, backgroundIndex);
        }
    });

    // Prev Image Btn
    prevBtn.addEventListener('click', () => {
        if (backgroundIndex > 0) {
            backgroundIndex--;
            changeActiveIcon(links, icons, image, backgroundIndex);
        }
    });
}

// Change The Popup Image And Active Icon Of The Popup
function changeActiveIcon(links, icons, element, num) {
    element.style.setProperty("background-image", `url("${links[num]}")`);
    icons.forEach(icon => {
        if (icon.classList.contains(`icon${num}`)) {
            icon.classList.add('active');
        } else {
            icon.classList.remove('active');
        }
    });
}
