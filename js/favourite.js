document.querySelector('.page-path p a:nth-of-type(2)').innerHTML = JSON.parse(localStorage.usersData)[localStorage.activeUser].username;
let boxsContainer = document.querySelector('.boxs-con');

window.onload = getFavourites;

function getFavourites() {
    // Get Id Of Favourites Products To Create Elements
    let userData = JSON.parse(localStorage.usersData)[localStorage.activeUser];
    let cardlist = new Set(userData.card);

    // Create Elements If Exists
    if (userData.favourites.length) {
        for (const id of userData.favourites) {
            let cardCheck = false;
            if (cardlist.has(id)) {
                cardCheck = true;
            }
            if (id.split('-').length === 2) createBoxs(id, cardCheck);
            // createBoxs(id, cardCheck);
        }

        // Add OnClick Event To Cart Btn
        let cardBtns = document.querySelectorAll('.card');
        cardBtns.forEach(btn => {
            let id = btn.parentElement.parentElement.parentElement.id;
            btn.addEventListener('click', () => addToFavouriteOrCard(btn, id, 'card'));
        })

        // Remove The Product From Favourites
        let closeBtns = document.querySelectorAll('span.close');
        closeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                let id = btn.parentElement.id;
                addRemoveCardAndLove(id, 'favourites', 'remove');
                btn.parentElement.remove();

                // Show Empty Message
                if (localStorage.loveEmpty) {
                    showEmptyMessage(boxsContainer);
                }
            });
        });
    }

    // Show Empty Message
    if (localStorage.loveEmpty) {
        showEmptyMessage(boxsContainer);
    }
}

function createBoxs(id, cardCheck) {
    let location = id.split('-');
    let data = products;

    let box = document.createElement('div');
    box.classList.add('box');
    box.id = id;
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
            <div class="btns product-btns">
                <button class="icon card ${cardCheck ? 'yes' : 'no'}"><i class="fa-solid fa-cart-plus ${cardCheck ? 'yes' : 'fa-bounce'}"></i></button>
                <button onclick="goBill('${id}', 1, false)" class="buy">buy</button>
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

