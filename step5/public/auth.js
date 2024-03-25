const locationPath = window.location.pathname
let accessToken = localStorage.getItem('accessToken')

if(accessToken) {
    localStorage.removeItem('accessToken')
    accessToken = null
}

if(locationPath === '/login'){
    const login = document.getElementById('login');
    login.addEventListener('submit', (event) => {
        event.preventDefault();
        const username = event.target.username.value;
        const password = event.target.password.value;
    
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password
            })
        })
        .then(response => {
            if(response.status !== 200) {
                throw new Error("Invalid credentials")
            }
            return response.json()
        })
        .then(({accessToken}) => {
            localStorage.setItem('accessToken', accessToken);
            window.location.href = '/';
        })
        .catch(error => {
            alert(error);
        })
    });
}

if(locationPath === '/signup'){
    const sigupForm = document.getElementById('sigup');
    sigupForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const username = event.target.username.value;
        const email = event.target.email.value;
        const password = event.target.password.value;
    
        fetch('/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                email,
                password
            })
        })
        .then(response => {
            if(response.status !== 200) {
                throw new Error("Error while registering the user")
            }
            return response.json()
        })
        .then(({accessToken}) => {
            localStorage.setItem('accessToken', accessToken);
            window.location.href = '/';
        })
        .catch(error => {
            alert(error);
        })
    });

}
