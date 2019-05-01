/* Treehouse FSJS Techdegree
 * Project 5 - Public API Requests
*/

const formatDate = (dob) => {

    const date = new Date(dob);
    return date.toDateString().slice(4);
};

const checkStatus = (response) => {
    if(response.ok){
        return Promise.resolve(response);
    }else{
        return Promise.reject(new Error(response.statusText));
    }
}
    
const fetchData = (url) => {
    return fetch(url)
        .then(checkStatus)
        .then(response => response.json())
        .catch(error => console.log(error));
};



const generateGallery = (users) => {

    const gallery = document.querySelector('#gallery');

    users.results.forEach(user => {
        const card = `
        <div class="card">
            <div class="card-img-container">
                <img class="card-img" src="${user.picture.medium}" alt="user picture">
            </div>
            <div class="card-info-container">
                <h3 id="${user.name.first}-${user.name.last}" class="card-name cap">${user.name.first} ${user.name.last}</h3>
                <p class="card-text">${user.email}</p>
                <p class="card-text cap">${user.location.city}, ${user.location.state}</p>
            </div>
        </div>`;
        gallery.innerHTML += card;
    });

    //might want to change this later on -\_(:/)_/-
    return users;
};



const generateModal = (users) => {

    const body = document.querySelector('body');
    
    users.results.forEach(user => {
        const modalBox = `
        <div class="modal-container">
        <div class="modal">
            <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
            <div class="modal-info-container">
                <img class="modal-img" src="${user.picture.large}" alt="profile picture">
                <h3 id="name" class="modal-name cap">${user.name.first} ${user.name.last}</h3>
                <p class="modal-text">${user.email}</p>
                <p class="modal-text cap">${user.location.city}</p>
                <hr>
                <p class="modal-text">${user.cell}</p>
                <p class="modal-text">${user.location.street}, ${user.location.city}, ${user.location.state} ${user.location.postcode}</p>
                <p class="modal-text">Birthday: ${formatDate(user.dob.date)}</p>
            </div>

            <div class="modal-btn-container">
                <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                <button type="button" id="modal-next" class="modal-next btn">Next</button>
            </div>
        </div>
        `;
        body.innerHTML += modalBox;
        const modalBoxElement = document.querySelectorAll('.modal-container');
        modalBoxElement[modalBoxElement.length - 1].style.display = 'none';
    });

};

const displayModal = (selectedProfile) => {

    const userEmail = selectedProfile.querySelector('p').textContent;
    const modals = document.querySelectorAll('.modal-container');

    modals.forEach(modal => {
        modal.style.display = 'none';
        const modalEmail = modal.querySelector('p').textContent;
        if(modalEmail === userEmail){
            modal.style.display = '';
        }
    });
};

const configGalleryHandler = () => {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('click', (event) => {
            displayModal(event.currentTarget);
        });
    });
}


const toggleModal = (currModal, toggle) => {

    const userEmail = currModal.querySelector('p').textContent;
    const cards = document.querySelectorAll('.card');
    console.log('hello');
    cards.forEach(card => {
        const cardEmail = card.querySelector('p').textContent;
        if(cardEmail === userEmail){
            if(toggle === 'previous' && card.previousElementSibling !== null){
                console.log();
                displayModal(card.previousElementSibling);
            }else if (toggle === 'next' && card.nextElementSibling !== null){
                displayModal(card.nextElementSibling);
            }
        }
    });

   

}

const configModalHandler = () => {

    const modals = document.querySelectorAll('.modal-container');

    modals.forEach(modal => {
        const previousModalBtn = modal.querySelector('.modal-btn-container #modal-prev');
        const nextModalBtn = modal.querySelector('.modal-btn-container #modal-next');

        previousModalBtn.addEventListener('click', (event) => {
            toggleModal(event.target.offsetParent, 'previous');
        });
    });


}































fetchData('https://randomuser.me/api/?nat=us&results=12')
        .then(data => generateGallery(data))
        .then(data => generateModal(data))
        .then(configGalleryHandler)
        .then(configModalHandler);
   