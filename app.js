
function sendContact(event) {
    // Prevent the form from submitting in the traditional way
    event.preventDefault();

    // Get the form elements
    var form = document.querySelector('.contact-form');
    var name = form.querySelector('input[type="text"]');
    var email = form.querySelector('input[type="email"]');
    var subject = form.querySelector('input[type="text"]');
    var message = form.querySelector('textarea');

    // Log the form data to the console
    console.log('Name: ' + name.value);
    console.log('Email: ' + email.value);
    console.log('Subject: ' + subject.value);
    console.log('Message: ' + message.value);
}

// Existing app.js code
const sections = document.querySelectorAll('.section');
const sectBtns = document.querySelectorAll('.controlls');
const sectBtn = document.querySelectorAll('.control');
const allSections = document.querySelector('.main-content');


function PageTransitions() {
    //Button click active class
    for (let i = 0; i < sectBtn.length; i++) {
        sectBtn[i].addEventListener('click', function () {
            let currentBtn = document.querySelectorAll('.active-btn');
            currentBtn[0].className = currentBtn[0].className.replace('active-btn', '');
            this.className += ' active-btn';
        })
    }

    //Sctions Active 
    allSections.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        if (id) {
            //resmove selected from the other btns
            sectBtns.forEach((btn) => {
                btn.classList.remove('active')
            })
            e.target.classList.add('active')

            //hide other sections
            sections.forEach((section) => {
                section.classList.remove('active')
            })

            const element = document.getElementById(id);
            element.classList.add('active');
        }
    })

    //Toggle theme
    const themeBtn = document.querySelector('.theme-btn');
    themeBtn.addEventListener('click', () => {
        let element = document.body;
        element.classList.toggle('light-mode')
    })
}

PageTransitions();