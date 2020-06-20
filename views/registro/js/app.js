const bntResgister = document.getElementById('register')


function getData() {
    const nameBusiness = document.getElementById('nameBusiness').value
    const name = document.getElementById('name').value
    const lastName = document.getElementById('lastName').value
    const motherLastName = document.getElementById('motherLastName').value
    const genero = document.getElementById('genero').value
    const email = document.getElementById('email').value


    const data = {
        nameBusiness,
        name,
        lastName,
        motherLastName,
        genero,
        email
    }

    console.log(data)
    return data
}

bntResgister.addEventListener('click', (e) => {
    axios({
        method: 'post',
        url: 'http://localhost:5001/user/register',
        data: getData()
    })
    .then(res => {console.log(res)})
    getData()
    e.preventDefault()
})