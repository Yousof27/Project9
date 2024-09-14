let productsContainer = document.documentElement.querySelector('.products .container');
let catigoriesList = document.querySelectorAll('.catigories .catigory-con div');
let searchInput = document.querySelector('.catigories input.search');

searchInput.addEventListener('input', searchInProducts)


// Add On Click Event To Catigories
catigoriesList.forEach(box => {
    box.addEventListener('click', () => getCatigory(box.id));

    for (const element of catigoriesList) {
        element.classList.remove('active');
    }
    box.classList.add('active');
});

// Reset The Catigory When We Come From Info Page Path :)
if (localStorage.pathSearch) {
    let searchWord = localStorage.pathSearch;
    getCatigory(`${searchWord}`);
    localStorage.removeItem('pathSearch')
} else {
    getCatigory('random');
}


function getCatigory(select) {
    let result = products;
    clearHomeProducts();

    document.querySelector('.empty-message').classList.add('remove');
    searchInput.value = '';

    // Generate Non Random Products
    if (select !== 'random') {
        let laps = result[select];
        for (let lap in laps) {
            id = `${select}-${lap}`;

            createHomeProduct(id);
        }
        // Generate Random Products
    } else {
        let data = result;
        let pairs = generatePairs(2, 11);
        let catigories = Object.keys(data);

        for (const n of pairs) {
            let productsList = Object.keys(data[catigories[n[0]]]);
            let productNumber = productsList[n[1]];

            id = `${catigories[n[0]]}-${productNumber}`;

            createHomeProduct(id);
        }
    }
    accessProductInfo()

    // Add Active On Catigory
    for (const element of catigoriesList) {
        if (element.classList.contains(select)) {
            element.classList.add('active');
        } else {
            element.classList.remove('active');
        }
    }
}


// Set Events To Products
function accessProductInfo() {
    let moreLinks = document.documentElement.querySelectorAll('button.more');
    let theTitle = document.documentElement.querySelectorAll('h2.box-title');
    let controlBtns = document.documentElement.querySelectorAll('.product-btns .icon');

    // Set OnClick Event To (More Links) Of Products
    moreLinks.forEach(link => {
        link.addEventListener('click', () => {
            let element = link.parentElement.parentElement.parentElement;
            localStorage.setItem('productId', element.id);
            window.location = 'product_info.html';
        });
    });

    // Set OnClick Event To The Title Of Products
    theTitle.forEach(title => {
        title.addEventListener('click', () => {
            let element = title.parentElement.parentElement;
            localStorage.setItem('productId', element.id);
            window.location = 'product_info.html';
        });
    })

    // Add OnClick Event To Favourite And Cart Button
    controlBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            let id = btn.parentElement.parentElement.parentElement.id;
            addToFavouriteOrCard(btn, id, `${btn.classList.contains('love') ? 'favourites' : 'card'}`);
        })
    })
}


// Generate Random Pairs Of Numbers
function generateRandomNumber(max) {
    return Math.floor(Math.random() * (max + 1));
}
function generatePairs(maxA, maxB) {
    const pairs = new Set();
    while (pairs.size < 12) {
        const numA = generateRandomNumber(maxA);
        const numB = generateRandomNumber(maxB);
        const pair = `${numA},${numB}`;
        pairs.add(pair);
    }
    return Array.from(pairs).map(pair => pair.split(',').map(Number));
}



// Create A New Product :)
function createHomeProduct(id) {
    // Create Product Element And Give It Id
    let product = document.createElement('div');
    product.classList.add('box');
    product.id = id;

    // Get The Data Of The Product
    let data = products;
    let location = id.split('-');
    let url = data[location[0]][location[1]]['url'][0];
    let title = data[location[0]][location[1]]['title'];
    let rate = data[location[0]][location[1]]['rate'];
    let price = data[location[0]][location[1]]['price'];

    // Check If The Product Are In Favourites Or Cart
    let favourite, card;
    // Get Products From Favourites And Cart If Exists
    if (localStorage.activeUser) {
        let favouritesList = new Set(JSON.parse(localStorage.usersData)[localStorage.activeUser].favourites);
        let cardsList = new Set(JSON.parse(localStorage.usersData)[localStorage.activeUser].card);

        favouritesList.has(id) ? favourite = true : favourite = false;
        cardsList.has(id) ? card = true : card = false;
    }

    // Create Product Content :)
    let content = `
        <div class="image-con">
            <div style="background-image: url('${url}');" class="product-image" data-current=0>
                <button onclick="changeImage(this, '${id}')" class="prev"><i class="fa-solid fa-arrow-left"></i></button>
                <button onclick="changeImage(this, '${id}')" class="next"><i class="fa-solid fa-arrow-right"></i></button>
            </div>
        </div>
        <div class="data">
            <h2 class="box-title">${title}</h2>
            <p class="rate">Rate: ${rate}</p>
            <p class="price">$${price}</p>
            <div class="btns product-btns">
                <button class="more">more</button>
                <button class="icon card ${card ? 'yes' : 'no'}"><i class="fa-solid fa-cart-plus ${card ? 'yes' : 'fa-bounce'}"></i></button>
                <button class="icon love ${favourite ? 'yes' : 'no'}"><i class="fa-solid fa-heart ${favourite ? 'yes' : 'fa-beat'}"></i></button>
                <button onclick="goBill('${id}', 1, false)" class="buy">buy</button>
            </div>
        </div>
    `;

    // Set Content In Element And Add Element In Container :)
    product.innerHTML = content;
    productsContainer.appendChild(product);
}


// Clear All Products From The Page :)
function clearHomeProducts() {
    let boxes = document.querySelectorAll('.products .container .box')
    boxes.forEach(box => box.remove());
}


// Search Function
function searchInProducts() {
    let values = searchInput.value;
    let productSet = new Set();
    if (values !== '') {
        values = values.split(' ');
        for (let i = 0; i < values.length; i++) {
            let value = values[i].toLocaleLowerCase().trim();
            if (value !== '') {
                if (i === 0) {
                    productSet = searchHelper(value);
                } else {
                    productSet = searchHelper(value, productSet);
                }
            }
        }

        if (productSet.size === 0) {
            document.querySelector('.empty-message').classList.remove('remove');
            clearHomeProducts();
        } else {
            clearHomeProducts();
            for (const id of productSet) {
                createHomeProduct(id);
            }
            document.querySelector('.empty-message').classList.add('remove');
            catigoriesList.forEach(box => {
                if (box.id === 'random') {
                    box.classList.add('active');
                } else {
                    box.classList.remove('active');
                }
            });
            accessProductInfo();
        }
    } else {
        getCatigory('random');
    }
}


// Search Helper Function
function searchHelper(value, idsSet) {
    let data = products;
    let productSet = new Set();
    let catigories = Object.keys(data);
    let idsList = new Array();
    let searchList;

    for (const catigory in data) {
        for (const product in data[catigory]) {
            idsList.push(`${catigory}-${product}`);
        }
    }

    idsSet ? searchList = idsSet : searchList = idsList;

    for (const id of searchList) {
        let location = id.split('-');

        let title = data[location[0]][location[1]]['title'].toLocaleLowerCase();
        let catigory = data[location[0]][location[1]]['catigory'].toLocaleLowerCase();

        // Catigory
        if (catigory.includes(value)) {
            productSet.add(id);
        }
        // Title
        if (title.includes(value)) {
            productSet.add(id);
        }
        // Price
        if (value.includes('$') && data[location[0]][location[1]]['price'] <= +value.substring(1)) {
            productSet.add(id);
            // Rate
        } else if (data[location[0]][location[1]]['rate'] >= +value) {
            productSet.add(id);
        }
    }

    return productSet;
}
