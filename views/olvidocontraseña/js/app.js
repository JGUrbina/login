const bntResgister = document.getElementById('register')


function getData() {
    const nameBusiness = document.getElementById('nameBusiness').value
    const email = document.getElementById('email').value


    const data = {
        nameBusiness,
        email
    }
    return data
}

bntResgister.addEventListener('click', (e) => {
    axios({
        method: 'post',
        url: 'http://localhost:5001/user/emailpassreset',
        data: getData()
    })
    .then(res => {console.log(res.data)})
    e.preventDefault()
})