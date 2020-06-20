const bntResgister = document.getElementById('register')
document.addEventListener("DOMContentLoaded", function(event) {
    const url = window.location.href
    const token = url.split('?')[1]
    console.log(token)
    axios({
        method: 'GET',
        url: `http://localhost:5001/user/confirmation/${token}`,
    })
    .then(res => {console.log(res.data)})
    .catch(err => console.log(err))
    

    
    
    
    
})


function getData() {
    const password = document.getElementById('password').value
    // const repitPass = document.getElementById('email').value

    const data = {
        password
    }
    return data
}
bntResgister.addEventListener('click', (e) => {
    e.preventDefault()
    const url = window.location.href
    const token = url.split('?')[1]
    axios({
        method: 'post',
        url: `http://localhost:5001/user/passwordreset/${token}`,
        data: getData()
    })
    .then(res => {console.log(res.data)})
    
})