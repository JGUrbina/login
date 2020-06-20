const bntResgister = document.getElementById('register')


function getData() {
    const password = document.getElementById('password').value
    const email = document.getElementById('email').value


    const data = {
        password,
        email
    }

    console.log(data)
    return data
}

bntResgister.addEventListener('click', (e) => {
    axios({
        method: 'post',
        url: 'http://localhost:5001/user/login',
        data: getData()
    })
    .then(res => {console.log(res.data)})
    .catch(err => {console.log(err)})
    getData()
    e.preventDefault()
})