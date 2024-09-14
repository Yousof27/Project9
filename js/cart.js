document.querySelector('.page-path p a:nth-of-type(2)').innerHTML = JSON.parse(localStorage.usersData)[localStorage.activeUser].username;
let boxsContainer = document.querySelector('.boxs-con');


window.onload = getCard;

function getCard() {
    // Get Id Of In Cart Products To Create Elements
    let userData = JSON.parse(localStorage.usersData)[localStorage.activeUser];
    let favouriteList = new Set(userData.favourites);

    // Create Elements If Exists
    if (userData.card.length) {
        for (const id of userData.card) {
            let favouriteCheck = false;
            if (favouriteList.has(id)) {
                favouriteCheck = true;
            }
            if (id.split('-').length === 2) createBoxs(id, favouriteCheck);
            // createBoxs(id, favouriteCheck);
        }

        // Add OnClick Event To Favourite Btn
        let favouriteBtn = document.querySelectorAll('.love');
        favouriteBtn.forEach(btn => {
            let id = btn.parentElement.parentElement.parentElement.id;
            btn.addEventListener('click', () => addToFavouriteOrCard(btn, id, 'favourites'));
        })

        // Add OnClick Event To Buy Btn
        let buyBtns = document.querySelectorAll('.product-btns button.buy');
        buyBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                let parent = btn.parentElement.parentElement.parentElement;
                goBill(parent.id, parent.dataset.quantity, 'true');
            })
        })

        // Remove The Product From Cart
        let closeBtns = document.querySelectorAll('span.close');
        closeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                let id = btn.parentElement.id;
                addRemoveCardAndLove(id, 'card', 'remove');
                btn.parentElement.remove();

                // Show Empty Message
                if (localStorage.cardEmpty) {
                    showEmptyMessage(boxsContainer);
                    document.querySelector('.more-btns').classList.add('empty');
                }
            });
        });
    }

    // Show Empty Message
    if (localStorage.cardEmpty) {
        showEmptyMessage(boxsContainer);
        document.querySelector('.more-btns').classList.add('empty');
    } else {
        document.querySelector('.more-btns').classList.remove('empty');
    }
}

function createBoxs(id, favouriteCheck) {
    let location = id.split('-');
    let data = products;

    let box = document.createElement('div');
    box.classList.add('box');
    box.id = id;
    box.setAttribute('data-quantity', '1');
    let content = `
        <span class="close"><i class="fa-solid fa-xmark"></i></span>
        <div style="background-image: url('${data[location[0]][location[1]].url[0]}');" class="product-image" data-current=0>
            <button onclick="changeImage(this, '${id}')" class="prev"><i class="fa-solid fa-arrow-left"></i></button>
            <button onclick="changeImage(this, '${id}')" class="next"><i class="fa-solid fa-arrow-right"></i></button>
        </div>
        <div class="data">
            <div class="text">
                <h2 onclick="goToInfo('${id}')" class="title">${data[location[0]][location[1]].title}</h2>
                <p class="price">$${data[location[0]][location[1]].price}</p>
            </div>
            <div class="quantity-con">
                <span onclick="changeQuantity(this)" class="less"><i class="fa-solid fa-arrow-left"></i></span>
                <span class="quantity">1</span>
                <span onclick="changeQuantity(this)" class="more"><i class="fa-solid fa-arrow-right"></i></span>
            </div>
            <div class="btns product-btns">
                <button class="icon love ${favouriteCheck ? 'yes' : 'no'}"><i class="fa-solid fa-heart ${favouriteCheck ? 'yes' : 'fa-beat'}"></i></button>
                <button class="buy">buy</button>
            </div>
        </div>
    `;

    box.innerHTML = content;
    boxsContainer.appendChild(box);
}

// Open Info Page Of The Product
function goToInfo(id) {
    localStorage.setItem('productId', id);
    window.location = 'product_info.html';
}

// Change The Quantity
function changeQuantity(e) {
    let counter = e.parentElement.parentElement.parentElement.dataset.quantity;
    if (e.classList.contains('more') && counter < 99) {
        counter++;
        e.previousElementSibling.innerHTML = counter;
    } else if (e.classList.contains('less') && counter > 1) {
        counter--;
        e.nextElementSibling.innerHTML = counter;
    }
    e.parentElement.parentElement.parentElement.dataset.quantity = counter;
}


// Buy All Function
function buyAll() {
    localStorage.setItem('fromCard', true);
    let quantityList = [];
    let idList = [];
    let boxes = document.querySelectorAll('.boxs-con .box');
    boxes.forEach(box => {
        quantityList.push(box.dataset.quantity);
        idList.push(box.id)
    })
    console.log(idList);
    console.log(quantityList);
    localStorage.setItem('singlBill', false);
    localStorage.setItem('quantityList', quantityList);
    localStorage.setItem('idList', idList);
    localStorage.setItem('activeBuy', true);
    window.location = 'buy.html';
}
