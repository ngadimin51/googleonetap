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
    google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed()) {
            console.log('isNotDisplayed')
            console.log(notification.getNotDisplayedReason())
        } else if (notification.isSkippedMoment()) {
            console.log('isSkippedMoment')
            console.log(notification.getSkippedReason())
        } else if(notification.isDismissedMoment()) {
            console.log('isDismissedMoment')
            console.log(notification.getDismissedReason())
        }
    });
}

const signout = () => {
    google.accounts.id.disableAutoSelect()
    window.location.reload()
}

initializeGSI()
