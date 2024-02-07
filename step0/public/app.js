// == Selectors ==
const whispers = document.getElementById('whispers')
const whisperCreateButton = document.getElementById('whisper-create')

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
        createWhisper(message)
        .then(refreshAllUI)
    }
})

// === Functions ==
// -- API --
const fetchAllWhispers = () => fetch('http://localhost:3000/api/v1/whisper').then((response) => response.json())
const deleteWhisper = (id) => fetch(`http://localhost:3000/api/v1/whisper/${id}`, { method: 'DELETE' })
const updateWhisper = (id, message) => fetch(`http://localhost:3000/api/v1/whisper/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message }) })
const createWhisper = (message) => fetch('http://localhost:3000/api/v1/whisper', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message }) })

// -- UI --
const refreshWhispers = data => whispers.innerHTML = data
    .reverse()
    .map(whisper => {
        return `
        <article data-id="${whisper.id}">
            <div class="actions">
                <button data-action="edit">✏️</button>
                <button data-action="delete">❌</button>
            </div>
            <p>${whisper.message}</p>
        </article>`
    }).join('')

const refreshAllUI = () => fetchAllWhispers().then(refreshWhispers)

const requestUserEdit = (id, message) => {
    const newMessage = prompt("Edit the Whisper", message);
    if(newMessage && newMessage !== message) {
        updateWhisper(id, newMessage)
        .then(refreshAllUI)
    }
    console.log("Request User Edit", id, message)
}
const requestUserDelete = (id) => {
    const confirmation = confirm("Are you sure you want to delete this whisper?");
    if(confirmation) {
        deleteWhisper(id)
        .then(refreshAllUI)
    }
}

// == Initialization ==
refreshAllUI()