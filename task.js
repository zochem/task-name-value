// Storage of Name/Value pairs from user input
let data = [];

// Elements parsed from the page
const input = document.getElementById('value');
const error = document.getElementById('error');
const table = document.getElementById('table');
const modalXML = document.getElementById('modalXML'); 
const modalSpan = document.getElementsByClassName('closeModal')[0];
const XML = document.getElementById('XML');

// When user submites his inserted Name/Value pair, we should validate them first
// and only after insert them in our storage and render element on the page
document.getElementById('ValueInput').addEventListener('submit', e => {
    // receive user inserted Name/Value pair
    let pair = document.getElementById('value').value; 
    // we delimit the pair by '=' sign and ignore all spaces, inserted by user
    pair = pair.split('=').map(el => el.trim()); 

    // Check inserted values, in our case we should validate only alphanumeric values 
    if(!validate(pair)){
        // If it is not validated, we will re-render input element and show appropriate message
        input.style.border = '2px solid red';
        error.textContent = 'Names and Values can contain only alpha-numeric characters.';
    } else {
        // Values are validated successfully, we can proceed
        input.style.border = '2px solid black';
        error.textContent = '';
        let obj = {key: pair[0], value: pair[1]};
        data.push(obj);
        renderElement(obj);
    }

    e.preventDefault();
})

// Validation
let validate = (value) => {
    // Regular Expression which matches only alphanumeric valeus
    const regexp = /^[0-9a-zA-Z]+$/; 

    if(value.length > 2) return false; 
    else if(value[0] == null || value[1] == null) return false; 

    for(let el of value){
        if(!el.match(regexp)) return false; 
    }

    return true; 
}

// Render element on the page by appending child to the parent element in order 
// not to re-render parent element each time
let renderElement = pair => {
    let elem = document.createElement('tr');
    elem.innerHTML = `<td>${pair.key}=${pair.value}</td><td><button id='key-${pair.key}'>Delete</button><td>`;
    table.appendChild(elem);
}

// In this case we should re-render parent element, because we use sort and our Name/Value 
// pairs order can be changed 
let renderElements = () => {
    data.forEach( e => {
        renderElement(e);
    })
}

// Button is created in order to provide user with ability to delete appropriate 
// single Name/Value pair
table.addEventListener('click', e => {
    // We ignore all elements except BUTTON 
    if(e.target.tagName != 'BUTTON') return;
    else {
        // Find required id in data storage in order to delete
        data = data.filter( el => el.key !== e.target.id.slice(4));
        // Removing Name/Value pair
        e.target.parentNode.parentNode.remove();
    }
})

// Sort pairs by Name(key) value
// After ssort is applied, element will re-rendered on the page 
let sortByName = () => {
    data.sort((a,b) => {
        if(a.key > b.key) return 1;
        if(a.key < b.key) return -1;
        return 0;
    })
    table.innerHTML = null;
    renderElements();
    return false;
}

// Sort pairs by their Value
// After ssort is applied, element will re-rendered on the page 
let sortByValue = () => {
    data.sort((a,b) => {
        if(a.value > b.value) return 1;
        if(a.value < b.value) return -1;
        return 0; 
    })
    table.innerHTML = null;
    renderElements();
    return false;
}

// Delete all records and re-render element on the page
let _delete = () => {
    data = [];
    table.innerHTML = null;
    document.getElementById('list').innerHTML = null; 
}

// Show inserted pairs in XML format via modal window
showXML = () => {
    modalXML.style.display = 'block';
    XML.textContent = '<?xml version="1.0" encoding="UTF-8"?><Envelope><Body>'
    data.forEach( el => {
        XML.textContent += `<Name>${el.key}</Name>=<Value>${el.value}</Value>`;
    })
    XML.textContent += '</Body></Envelope>'
}

// Close modal window by clicking 'x' button  
modalSpan.onclick = () => {
    modalXML.style.display = 'none';
    XML.textContent = '';
}

// If user clicks somewhere except modal window, modal will close
window.onclick = e => {
    if (e.target == modalXML){
        modalXML.style.display = 'none';
        XML.textContent = '';
    }
}