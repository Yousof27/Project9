userData = JSON.parse(localStorage.usersData)[localStorage.activeUser];
document.querySelector('.intro p.username span').innerHTML = userData.username;
document.querySelector('.path p a.username').innerHTML = userData.username;
document.querySelector('.intro p.email span').innerHTML = userData.email;

setData();

// Add Products To The Bill
function addProductToBill(id, quantity) {
    let data = products;
    let location = id.split('-');
    let product = data[location[0]][location[1]];

    let div = document.createElement('div');
    div.classList.add('box', 'box-product');
    div.id = id;

    let totalPrice = (quantity * product.price).toFixed(2);

    let content = `
        <h2 class="title">${product.title}</h2>
        <h2 class="price">$<span>${product.price}</span></h2>
        <h2 class="quantity">${quantity}</h2>
        <h2 class="total">$<span>${totalPrice}</span></h2>
    `;

    div.innerHTML = content;
    let element = document.querySelector('.bill-section .bill .box:last-child');
    element.after(div);

    return +totalPrice;
}

function setData() {
    // Active The Payment
    let theForm = document.querySelector('.finally form');
    if (localStorage.activeBuy) {
        theForm.classList.remove('not-active');
    } else {
        theForm.classList.add('not-active');
    }

    let totalPrice = 0;

    // Check If Single Product In Bill Or More
    //  Add Singl Product To The Bill
    if (localStorage.singlBill === 'true') {
        let product = localStorage.singlBillData.split(',');
        totalPrice = addProductToBill(product[0], product[1]);

        //  Add Multi Products To The Bill
    } else {
        let quantityList = localStorage.quantityList.split(',');
        let idList = localStorage.idList.split(',');

        for (let i = 0; i < idList.length; i++) {
            let total = addProductToBill(idList[i], quantityList[i]);
            totalPrice += +total;
        }
    }

    // The Total Price Of The Bill
    document.querySelector('.bill+.finally h2.total span').innerHTML = `$${totalPrice.toFixed(2)}`;

    // Go Info Page Of The Product When Click On It
    document.querySelectorAll('.box-product').forEach(box => {
        box.addEventListener('click', () => {
            localStorage.setItem('productId', box.id);
            window.location = 'product_info.html';
        });
    });


    // Payment Form Setting
    document.forms[0].addEventListener('submit', (e) => {
        e.preventDefault();
        let inputName = document.querySelector('input.name');
        let inputNumber = document.querySelector('input.number');
        let inputDate = document.querySelector('input.date');
        let inputCode = document.querySelector('input.code');
        let [checkName, checkNumber, checkDate, checkCode] = [false, false, false, false];

        // "1st.Name 2nd.Name 3rd.Name 4th.Name"
        if (!inputName.value.trim().match(/^[A-Za-z]+(\s[A-Za-z]+){3}$/)) {
            inputName.classList.add('invalid');
        } else {
            inputName.classList.remove('invalid');
            checkName = true
        }

        // 1234-5678-9101-1123
        if (inputNumber.value.trim().length !== 16 || !inputNumber.value.trim().match(/^\d{16}/)) {
            inputNumber.classList.add('invalid');
        } else {
            inputNumber.classList.remove('invalid');
            checkNumber = true;
        }

        if (!inputDate.value.trim().match(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/)) {
            inputDate.classList.add('invalid');
        } else {
            inputDate.classList.remove('invalid');
            checkDate = true;
        }

        if (inputCode.value.trim().length !== 3 || !inputCode.value.trim().match(/^\d{3}/)) {
            inputCode.classList.add('invalid');
        } else {
            inputCode.classList.remove('invalid');
            checkCode = true;
        }

        if (checkName && checkNumber && checkDate && checkCode) {
            console.log('yes');
            // Get User Data
            let data = JSON.parse(localStorage.usersData);
            let userData = data[localStorage.activeUser];
            let list = new Set(userData.card);

            // Set The New Bill Data
            if (localStorage.singlBill == 'true') {
                console.log('from singl product bill')
                let billData = localStorage.singlBillData.split(',');
                userData.purchases[userData.purchases.length] = billData[0];
                userData.quantities[userData.quantities.length] = billData[1];

                // Remove Product From Card When Buy From It
                if (localStorage.fromCard == 'true') {
                    list.delete(billData[0]);
                    console.log('Removed From The Cart', billData[0]);
                }
            } else {
                console.log('from multi products bill')
                userData.purchases[userData.purchases.length] = localStorage.idList;
                userData.quantities[userData.quantities.length] = localStorage.quantityList;

                // Remove Products From Card When Buy From It
                if (localStorage.fromCard == 'true') {
                    for (const id of localStorage.idList.split(',')) {
                        list.delete(id);
                        console.log('Removed From The Cart', id);
                    }
                }
            }

            userData.totalPrice[userData.totalPrice.length] = totalPrice.toFixed(2);
            list.delete('');

            document.querySelector(`header a span.cartNumber`).innerHTML = `${list.size}`;
            if (list.size === 0) {
                localStorage.setItem(`cardEmpty`, true);
            }

            // Set Data After Update
            userData.card = Array.from(list);
            data[localStorage.activeUser] = userData;

            // Save Data In Local Storage
            localStorage.setItem('usersData', JSON.stringify(data));
            localStorage.removeItem('activeBuy');

            console.log('yes');
            window.location = 'afterBuy.html';
        }
    })
}

