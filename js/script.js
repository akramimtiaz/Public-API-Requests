/* Treehouse FSJS Techdegree
 * Project 5 - Public API Requests "1990-07-14T12:13:46Z
*/

/** 
    * Accepts a date in the format of 'YYYY-MM-DDTHH:MM:SSZ'
    * and returns a date in the format of 'DD/MM/YYYY'
    * @param   {string}     the date to be formatted
    * @return  {string}     a string in the format of DD/MM/YYYY
*/
const formatDate = (dob) => {

    const date = dob.slice(0, dob.indexOf('T'));

    const year = date.split('-')[0];
    const month = date.split('-')[1];
    const day = date.split('-')[2];

    return `${day}/${month}/${year}`;
};


/** 
    * Determines if the fetch request has succeeded by evaluating the status code 
    * @param   {response}     the response of a fetch request
    * @return  {promise}      promise object which is either resolved with the response or rejected
*/
const checkStatus = (response) => {
    if(response.ok){
        return Promise.resolve(response);
    }else{
        return Promise.reject(new Error(response.statusText));
    }
}

/** 
    * Performs a fetch request, validates the response and converts response to JSON format if successful
    * @param   {string}       the url passed to the fetch request
    * @return  {json}         if the request is successful, the response is converted to JSON and returned
*/
const fetchData = (url) => {
    return fetch(url)
        .then(checkStatus)
        .then(response => response.json())
        .catch(error => console.log(error));
};


/** 
    * Adds a provided list of user data to the gallery
    * @param   {object}      an object containing an array of user profile objects
    * @return  {object}      param object
*/
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
    //to be used in modal creation
    return users;
};


/** 
    * Creates a list of hidden modal boxes provided a list of user data 
    * @param   {object}      an object containing an array of user profile objects
*/
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
        //select all modal boxes currently on the document
        const modalBoxElement = document.querySelectorAll('.modal-container');
        //obtain the most recent modal box added to the document and hide it
        modalBoxElement[modalBoxElement.length - 1].style.display = 'none';
    });

};

/** 
    * Displays the associated modal box of a profile selected in the gallery 
    * @param   {HTML Element}      the assoc. card DIV of the profile that was selected
*/
const displayModal = (selectedProfile) => {

    const userEmail = selectedProfile.querySelector('p').textContent; //email assoc. w/ selected profile
    const modals = document.querySelectorAll('.modal-container');

    //find and show the modal box which has an email matching the email of the selected profile. 
    modals.forEach(modal => {
        const modalEmail = modal.querySelector('p').textContent; //email assoc. w/ curr modal box
        if(modalEmail === userEmail){
            modal.style.display = '';
        }else {
            modal.style.display = 'none';
        }
    });
};

/** 
    * Configues an event handler for each card/profile within the gallery 
    * such that the assoc. modal box is shown on click
*/
const configGalleryHandler = () => {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('click', (event) => {
            displayModal(event.currentTarget);
        });
    });
}

/** 
    * Displays the associated modal box of a profile selected in the gallery 
    * @param   {HTML Element}   the modal box currently in view
    * @param   {string}         the id of the button that was clicked, determines the direction of the toggle i.e. next/prev
*/
const toggleModal = (currModal, toggle) => {

    const userEmail = currModal.querySelector('p').textContent; //email assoc. w/ curr modal box
    const cards = document.querySelectorAll('.card');
    
    //find the card/profile which has an email matching the email of the current modal box.
    //once a match is found show either that card's/profile's previous or subsequent card/profile's modal box if applicable 
    cards.forEach(card => {
        const cardEmail = card.querySelector('p').textContent; //email assoc. w/ curr profile

        if(cardEmail === userEmail){
            if(toggle === 'modal-prev' && card.previousElementSibling !== null){
                displayModal(card.previousElementSibling);
            }else if (toggle === 'modal-next' && card.nextElementSibling !== null){
                displayModal(card.nextElementSibling);
            }
        }
    });
}

/** 
    * Configues an event handler for each Modal Box to respond to 
    * either the 'Prev', 'Next' or 'X' button being clicked
*/
const configModalHandler = () => {

        const modals = document.querySelectorAll('.modal-container');

        modals.forEach(modal => modal.addEventListener('click', (event) => {
          
            if(event.target.tagName === 'BUTTON'){

                if(event.target.id === 'modal-prev' || event.target.id === 'modal-next'){
                    //event.target.offsetParent provides the parent modal container div
                    toggleModal(event.target.offsetParent, event.target.id);
                } else if (event.target.id === 'modal-close-btn'){
                    event.currentTarget.style.display = 'none';
                }

            }
       }));

}

/** 
    * Filters the list of profiles shown in the gallery to those matching the search string
    * @param    {string}    the search string obtained from the search input field.
*/
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

/** 
    * Creates a search form as specified in the requirements
*/
const createSearch = () => {

    const searchContainer = document.querySelector('.search-container');
    const searchHTML = `
    <form action="#" method="get">
        <input type="search" id="search-input" class="search-input" placeholder="Search...">
        <input type="submit" value="&#x1F50D;" id="serach-submit" class="search-submit">
    </form>`;
    
    searchContainer.innerHTML += searchHTML;
};

/** 
    * Configues event handlers for both the search input field and search button respectively
*/
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
   