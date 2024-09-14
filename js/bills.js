let data = JSON.parse(localStorage.usersData)[localStorage.activeUser];
let purchases = data.purchases;
let quantities = data.quantities;
let totalPrice = data.totalPrice;

let container = document.querySelector('.history .boxes-con');
document.querySelector('.page-path p a:nth-of-type(2)').innerHTML = data.username;

window.onload = setBills;

function createBillHistory(index) {
    let div = document.createElement('div');
    div.classList.add('box');
    div.id = index;

    let content = `
        <p class="title">Bill ${index + 1}</p>
        <p class="quantity">${countProducts(index)} Product</p>
        <p class="price">$${totalPrice[index]}</p>
    `;

    div.innerHTML = content;

    container.appendChild(div);
}


// Count Products Of Each Bill Function :)
function countProducts(index) {
    let counter = 0;
    quantities[index].split(',').forEach(q => {
        counter += +q;
    });
    return counter;
}


// Function Set Bills
function setBills() {
    if (purchases.length > 0) {
        container.classList.remove('empty');

        for (let i = 0; i < quantities.length; i++) {
            createBillHistory(i);
        }
    
        document.querySelectorAll('.box').forEach(box => {
            box.addEventListener('click', () => openBill(box.id));
        })

    } else {
        container.classList.add('empty');
        showEmptyMessage(container);
    }
}

