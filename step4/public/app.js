// == Selectors ==
const whispers = document.getElementById('whispers')
const whisperCreateButton = document.getElementById('whisper-create')
const welcome = document.getElementById('welcome')
// == Event Listeners ==
whispers.addEventListener('click', event => {
    if(event.target.tagName === 'BUTTON') {
        const button = event.target
        const article = event.target.closest('article')
        const action = button.dataset.action
        const id = article.dataset.id
        const message = article.querySelector('p').innerText
        if(action === 'edit') requestUserEdit(id, message)
        if(action === 'delete') requestUserDelete(id)
    }
})

whisperCreateButton.addEventListener('click', event => {
    const message = prompt("What's your whisper?")
    if(message) {
        createWhisper(message, user.id)
        .then(refreshAllUI)
    }
})

// === Functions ==
// -- Utils --

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

// -- API --
const fetchAllWhispers = () => fetch('http://localhost:3000/api/v1/whisper', {
    headers: {Authentication: `Bearer ${accessToken}`}
  }).then((response) => response.json())
const deleteWhisper = (id) => fetch(`http://localhost:3000/api/v1/whisper/${id}`, { 
    method: 'DELETE',
    headers: {Authentication: `Bearer ${accessToken}`}
})
const updateWhisper = (id, message) => fetch(`http://localhost:3000/api/v1/whisper/${id}`, { 
    method: 'PUT', 
    headers: { 
        'Content-Type': 'application/json', 
        'Authentication': `Bearer ${accessToken}` 
    }, 
    body: JSON.stringify({ message }) })
const createWhisper = (message) => fetch('http://localhost:3000/api/v1/whisper', { 
    method: 'POST', 
    headers: { 
        'Content-Type': 'application/json',
        'Authentication': `Bearer ${accessToken}`
    }, 
    body: JSON.stringify({ message }) })

// -- UI --
const controlEdition = (whisper, user) => {
    if(whisper.author.id === user.id) {
        return ''
    } else {
        return 'style="display:none;"'
    }
}

const refreshWhispers = data => whispers.innerHTML = data
    .reverse()
    .map(whisper => {
        return `
        <article data-id="${whisper.id}">
            <div class="actions" ${controlEdition(whisper, user)}>
                <button data-action="edit">✏️</button>
                <button data-action="delete">❌</button>
            </div>
            <p>${whisper.message}</p>
            </hr>
            <p class="meta">
                <span class="author">By ${whisper.author.username}</span>
                <span class="date">at ${new Date(whisper.creationDate).toLocaleString()}</span>
            </p>
        </article>`
    }).join('')

const refreshAllUI = () => fetchAllWhispers().then(refreshWhispers)

const requestUserEdit = (id, message) => {
    const newMessage = prompt("Edit the Whisper", message);
    if(newMessage && newMessage !== message) {
        updateWhisper(id, newMessage)
        .then(refreshAllUI)
    }
}
const requestUserDelete = (id) => {
    const confirmation = confirm("Are you sure you want to delete this whisper?");
    if(confirmation) {
        deleteWhisper(id)
        .then(refreshAllUI)
    }
}

// == Initialization ==
const accessToken = localStorage.getItem('accessToken')

if(!accessToken) {
    window.location.href = '/login'
}

const {data: user} = parseJwt(accessToken)

welcome.innerText = `Welcome, ${user.username} 👋`
refreshAllUI()