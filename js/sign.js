let username = document.querySelector('input[type=text]');
let email = document.querySelector('input[type=email]');
let emailMessage = email.nextElementSibling;
let password = document.querySelector('input[type=password]:not(:first-of-type)');
let confirmPassword = document.querySelector('input[type=password]:last-of-type');

email.addEventListener('input', () => email_username_lock_function(email));
username.addEventListener('input', () => email_username_lock_function(username));

let submitBtn = document.querySelector('form input[type=submit]');
let theForm = document.forms[0];
let formTitle = theForm.firstElementChild;
let question = document.querySelector('.question');
let signUpInputs = document.querySelectorAll('.sign-up');

window.onload = formSubmitBtnText;
createFooter();

function menuBtn() {
    document.querySelector('header nav .nav-icon').classList.toggle('active');
}

// Create Footer
function createFooter() {
    let footer = document.createElement('footer');
    let content = `COPYRIGHT © ${new Date().getFullYear()} . ALL RIGHT RESERVED BY Abo Kamal`;
    footer.innerHTML = content;
    document.body.lastElementChild.before(footer)
}

function goLogin() {
    localStorage.setItem('page', 'login');
    emailMessage.innerHTML = 'this email is not exist';
    formSubmitBtnText('login');
}

function goSignUp() {
    localStorage.setItem('page', 'signUp');
    emailMessage.innerHTML = 'this email is already exist';
    formSubmitBtnText('signUp');
}

function formSubmitBtnText() {
    if (localStorage.page === 'login') {
        document.title = 'Shopping | Login';
        submitBtn.value = 'Login';
        emailMessage.innerHTML = 'this email is not exist';
        formClassList('login');
    } else if (localStorage.page === 'signUp') {
        document.title = 'Shopping | Sign Up';
        submitBtn.value = 'Sign Up';
        emailMessage.innerHTML = 'this email is already exist';
        formClassList('signUp');
    }
}

function formClassList(status) {
    if (status === 'login') {
        theForm.classList.add('login');
        theForm.classList.remove('signUp');
        formTitle.innerHTML = 'Login';
        question.innerHTML = `Don't Have Account Yet <a onclick="goSignUp()" href="sign.html">Sign Up</a>`
        for (const input of signUpInputs) {
            input.required = false;
        }
    } else if (status === 'signUp') {
        theForm.classList.add('signUp');
        theForm.classList.remove('login');
        formTitle.innerHTML = 'Sign Up';
        question.innerHTML = `Already Have Account <a onclick="goLogin()" href="sign.html">Login</a>`
        for (const input of signUpInputs) {
            input.required = true;
        }
    }
}


let usersList = new Array();
let usersMap = new Object();

if (localStorage.users) {
    usersList = localStorage.users.split(',');
    usersMap = JSON.parse(localStorage.usersData);
}

function formSubmit(e) {
    e.preventDefault();
    if (localStorage.page === 'signUp') {
        signUp();
    } else if (localStorage.page === 'login') {
        login();
    }
}

theForm.addEventListener('submit', (e) => formSubmit(e));


// Sign Up Function :)
function signUp() {
    let userNumber;

    if (password.value !== confirmPassword.value) {
        confirmPassword.classList.add('invalid');
    }
    else if (email_username_lock_function(email) && email_username_lock_function(username)) {
        userNumber = usersList.length++;
        usersList[userNumber] = (`user${userNumber}`);
        let newUser = {
            username: username.value,
            email: email.value,
            password: password.value,
            favourites: [],
            card: [],
            setting: {
                avatar: "imgs/avatars/avatar1.jpg"
            },
            purchases: [],
            totalPrice: [],
            quantities: []
        }
        usersMap[`user${userNumber}`] = newUser;

        localStorage.setItem('usersData', JSON.stringify(usersMap));
        localStorage.setItem('users', usersList);

        console.log(usersMap);

        confirmPassword.classList.remove('invalid')
        email.value = '';
        password.value = '';
        goLogin();
    }
}


// Check If The Name Or Email Is Aready Exists :)
function checkEmailAndUsername(field, value) {
    if (usersList) {
        for (const key in usersMap) {
            let valueExist = usersMap[key][field];
            if (valueExist.match(/\w+/)[0] === value.match(/\w+/)[0]) {
                return true;
            }
        }
    }
    return false;
}


// UserName And Email oninput Function :)
function email_username_lock_function(select) {
    if (select.value && localStorage.page === 'signUp') {
        let lock = checkEmailAndUsername(select.placeholder, select.value);
        if (lock) {
            select.classList.add('invalid');
            return false;
        } else {
            select.classList.remove('invalid');
            return true;
        }
    }
}


// Login Function :)
function login() {
    let emailRight = false;
    let passwordRight = false;
    let userKey;

    let usersExist = Object.keys(usersMap).length;

    if (usersExist) {
        for (const key in usersMap) {
            console.log('g');
            let valueExist = usersMap[key].email;
            if (email.value.trim() === valueExist) {
                emailRight = true;

                if (password.value.trim() === usersMap[key].password) {
                    passwordRight = true;
                    userKey = key;
                } else {
                    email.classList.remove('invalid');
                    password.classList.add('invalid');
                }
                break;
            } else {
                email.classList.add('invalid');
                password.classList.remove('invalid');
                console.log('gg');
            }
        }
    } else {
        email.classList.add('invalid');
        password.classList.remove('invalid');
        console.log('gg');
    }


    if (emailRight && passwordRight) {
        email.classList.remove('invalid');
        password.classList.remove('invalid');
        localStorage.setItem('activeUser', userKey);

        document.querySelector('header nav ul').classList.add('start');
        document.querySelector('header nav ul li a.username').innerHTML = usersMap[userKey].username;

        window.location = 'index.html';
    }
}

function signOut() {
    goLogin();
    localStorage.removeItem('activeUser');
}


// Go Shopping From The Menu
function goShopping() {
    localStorage.setItem('goShopping', true);
    window.location = 'index.html';
}
