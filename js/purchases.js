let data = JSON.parse(localStorage.usersData)[localStorage.activeUser];
let purchases = data.purchases;
let quantities = data.quantities;
let productsSet = new Set();
let productList = new Array();
let billsIndexList = new Object();
let bills = new Object();

let container = document.querySelector('.history .boxes-con');
document.querySelector('.page-path p a:nth-of-type(2)').innerHTML = data.username;

window.onload = setBills;

function createBillHistory(id) {
    let div = document.createElement('div');
    div.classList.add('box');
    div.id = id;
    let location = id.split('-');

    div.setAttribute('title', products[location[0]][location[1]].title);

    let billTag = '';
    for (const e of bills[id]) {
        billTag += `<span onclick="openBill(${e})" class="bill">bill ${e + 1}</span>`;
    }

    let content = `
        <p class="title">${products[location[0]][location[1]].title}</p>
        <p class="quantity">${billsIndexList[id]} ${billsIndexList[id] > 1 ? 'items' : 'item'}</p>
        <p class="price">$${products[location[0]][location[1]].price}</p>
        <div class="options">
            <span onclick="goInfoPage('${id}')" class="info">info</span>
            ${billTag}
        </div>
    `;

    div.innerHTML = content;

    div.addEventListener('click', () => activeToggle(div));
    div.addEventListener('mouseleave', () => div.classList.remove('active'));

    container.appendChild(div);
}


// Set Bills Function
function setBills() {
    if (purchases.length > 0) {
        for (const i of purchases) {
            for (const id of i.split(',')) {
                productsSet.add(id);
                productList.push(id);
            }
        }

        bills = countProductBills(productsSet, purchases);
        billsIndexList = countProductItems(bills);

        for (const id of productsSet) {
            createBillHistory(id);
        }
    } else {
        container.classList.add('empty');
        showEmptyMessage(container);
    }
}

// Count Bought Products Function :)
const countProductItems = (theBills) => {
    const counts = {};

    for (const key in theBills) {
        let count = 0;
        for (const element of theBills[key]) {
            count += +quantities[element].split(',')[purchases[element].split(',').indexOf(key)];
        }
        counts[key] = count;
    }

    return counts;
}

// Count Bought Products Function :)
const countProductBills = (ids, theBills) => {
    const counts = {};
    ids.forEach(id => {
        for (let i = 0; i < theBills.length; i++) {
            if (new Set(theBills[i].split(',')).has(id)) {
                counts[id] = (counts[id] || new Set()).add(i);
            }
        }
    });

    return counts;
}

// Open Options Menu Function
function activeToggle(element) {
    for (const e of element.parentElement.children) {
        e.classList.remove('active');
    }
    element.classList.add('active')
}

// Go Product Info Page Function :)
function goInfoPage(id) {
    localStorage.setItem('productId', id);
    window.location = 'product_info.html';
}
