function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

const onOneTapSignedIn = response => {
    const credential = parseJwt(response.credential) //use this for your apps
    const name = credential.name
    const email = credential.email
    const picture = credential.picture

    const target = document.querySelector('#pesan')
    target.innerHTML = `Welcome ${name}<br>
    <img src="${picture}" class="small-circle" />
    <button onclick="signout()">
        <img src="https://image.similarpng.com/very-thumbnail/2020/12/Illustration-of-Google-icon-on-transparent-background-PNG.png" class="icon">
        SignOut
    </button>`
    document.querySelector('#notif').style.display = 'block'
    const credShow = document.querySelector('#credential')
    credShow.innerHTML = JSON.stringify(credential, undefined, 2)
    credShow.classList.add('show', 'blur')
}

function credentialToggleBlur() {
    document.querySelector('#credential').classList.toggle('blur')
}

const initializeGSI = () => {
    google.accounts.id.initialize({
        client_id: 'YOUR-CLIENT-ID',
        cancel_on_tap_outside: false,
        callback: onOneTapSignedIn
    });
    // google.accounts.id.prompt((notification) => {
    //     if (notification.isNotDisplayed()) {
    //         console.log('isNotDisplayed')
    //         console.log(notification.getNotDisplayedReason())
    //     } else if (notification.isSkippedMoment()) {
    //         console.log('isSkippedMoment')
    //         console.log(notification.getSkippedReason())
    //     } else if(notification.isDismissedMoment()) {
    //         console.log('isDismissedMoment')
    //         console.log(notification.getDismissedReason())
    //     }
    // });
    google.accounts.id.prompt((notification) => {
        try {
            notification.getNotDisplayedReason() === 'opt_out_or_no_session' ? loginManual() : null
        } catch (error) {
            console.log(error)
            console.log(notification.getSkippedReason())
        }
    })
}

const signout = () => {
    google.accounts.id.disableAutoSelect()
    window.location.reload()
}

initializeGSI()

function loginManual() {
    const target = document.querySelector('#pesan')
    target.innerHTML = `Please login manually<br>
    <img src="https://ndalu.id/favicon.png" class="small-circle" style="max-width: 100px; max-height: 100px" />
    <button onclick="manuallyLogin()">
        Login
    </button>`
    document.querySelector('#notif').style.display = 'block'
    const credShow = document.querySelector('#credential')
    credShow.innerHTML = `
    <label>User Name<label>
    <input name="username" />
    <br />
    <label>Password<label>
    <input name="password" type="password" />
    <br />`
    credShow.classList.add('show')
}

function manuallyLogin() {
    const uName = document.querySelector('input[name="username"]')
    const uPass = document.querySelector('input[name="password"]')
    if (!uName.value) return alert('Username is empty')
    if (!uPass.value) return alert('Password is empty')
    if (uName.value === 'tofik' && uPass.value === 'ndalu.id') {
        document.querySelector('#notif').style.display = 'block'
        const credShow = document.querySelector('#credential')
        credShow.innerHTML = ` Welcome ${uName.value}`
        credShow.classList.add('show')
    } else {
        alert('Username or Password is not match')
    }
}