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
            <button type="button" id="modal-close-btn" class="modal-close-btn">X</button>
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
  
    cards.forEach(card => {
        const cardEmail = card.querySelector('p').textContent;
        if(cardEmail === userEmail){
            if(toggle === 'modal-prev' && card.previousElementSibling !== null){
                displayModal(card.previousElementSibling);
            }else if (toggle === 'modal-next' && card.nextElementSibling !== null){
                displayModal(card.nextElementSibling);
            }
        }
    });

}

const configModalHandler = () => {

        const modals = document.querySelectorAll('.modal-container');

        modals.forEach(modal => modal.addEventListener('click', (event) => {
            console.log(event.target);
            if(event.target.tagName === 'BUTTON'){
                if(event.target.id === 'modal-prev' || event.target.id === 'modal-next'){
                    toggleModal(event.target.offsetParent, event.target.id);
                } else if (event.target.id === 'modal-close-btn'){
                    event.currentTarget.style.display = 'none';
                }
            }
       }));

}


const searchProfiles = (search) => {

    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        const profileName = card.querySelector('h3').textContent;
        const profileEmail = card.querySelector('p').textContent;
        
        if(profileName.startsWith(search) || profileEmail.startsWith(search)){
            card.style.display = '';
        }else {
            card.style.display = 'none';
        }
    });
};

const createSearch = () => {

    const searchContainer = document.querySelector('.search-container');
    const searchHTML = `
    <form action="#" method="get">
        <input type="search" id="search-input" class="search-input" placeholder="Search...">
        <input type="submit" value="&#x1F50D;" id="serach-submit" class="search-submit">
    </form>`;
    
    searchContainer.innerHTML += searchHTML;
};

const configSearchHandler = () => {

    const search = document.querySelector('#search-input');
    search.addEventListener('input', (event) => {
        searchProfiles(event.target.value);
    });

    const searchBtn = document.querySelector('#serach-submit');
    searchBtn.addEventListener('click', (event) => {
        event.preventDefault();
        searchProfiles(document.querySelector('#search-input').textContent);
    });
};


fetchData('https://randomuser.me/api/?nat=us&results=12')
        .then(data => generateGallery(data))
        .then(data => generateModal(data))
        .then(createSearch)
        .then(configGalleryHandler)
        .then(configModalHandler)
        .then(configSearchHandler);
   