/* Treehouse FSJS Techdegree
 * Project 5 - Public API Requests
*/


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

const formatDate = (dob) => {

    const date = new Date(dob);
    return date.toDateString().slice(4);
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
        </div>
        `;
        body.innerHTML += modalBox;
        const modalBoxElement = document.querySelectorAll('.modal-container');
        modalBoxElement[modalBoxElement.length - 1].style.display = 'none';
    });


};

fetchData('https://randomuser.me/api/?nat=us&results=12')
        .then(data => generateGallery(data))
        .then(data => generateModal(data));



