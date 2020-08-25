$('#navbar').load('navbar.html');
$('#footer').load('footer.html');
const API_URL = 'https://api-nu-sage.vercel.app/api';
//const devices= JSON.parse(localStorage.getItem('devices')) || [];
//const users= JSON.parse(localStorage.getItem('users')) || [];
const currentUser = localStorage.getItem('user');
if (currentUser) {
$.get(`${API_URL}/users/${currentUser}/devices`) 
.then(response => { 
    response.forEach((device) => { 
     $('#devices tbody').append(` 
        <tr data-device-id=${device._id}> 
        <td>${device.user}</td> 
        <td>${device.name}</td> 
        </tr>` 
        ); 
    });
    $('#devices tbody tr').on('click', (e) => { 
        const deviceId = e.currentTarget.getAttribute('data-device-id'); 
        $.get(`${API_URL}/devices/${deviceId}/device-history`) 
        .then(response => { 
            response.map(sensorData => { 
                $('#historyContent').append(` 
                <tr> 
                <td>${sensorData.ts}</td> 
                <td>${sensorData.temp}</td> 
                <td>${sensorData.loc.lat}</td> 
                <td>${sensorData.loc.lon}</td> 
                </tr> `); 
            }); 
            $('#historyModal').modal('show');
        }); 
    });
}) 
.catch(error => { 
    console.error(`Error: ${error}`); 
});
}
else { 
    const path = window.location.pathname; 
    if (path !== '/login' && path !== '/registration') { 
        location.href = '/login'; 
    } 
}
$('#add-device').on('click', () => { 
    const name = $('#name').val(); 
    const user = $('#user').val(); 
    const sensorData = [];
    const body = { 
        name, 
        user, 
        sensorData
    };
    $.post(`${API_URL}/devices`, body) 
    .then(response => { location.href = '/'; }) 
    .catch(error => { 
        console.error(`Error: ${error}`); 
    }); 
});
$('#register').on('click', function() { 
    const name = $('#user').val();
    const password = $('#password').val();
    const confirmpassword = $('#confirm_password').val(); 
    //const users = JSON.parse(localStorage.getItem('users')) || [];
    //const user_exists = users.find(user => user.user === username);
    if (password == confirmpassword)
    {
        $.post(`${API_URL}/registration`, { name, password, isBoolean : 1})
        .then((response) => { 
            if (response.success) {
                location.href = '/login';
            } 
            else {
                $('#message').append(`<p class="alert alert-danger">${response} 
            </p>`); 
            } 
        });
    }
});
$('#login').on('click', () => { 
    const user = $('#user').val(); 
    const password = $('#password').val(); 
    $.post(`${API_URL}/authenticate`, { user, password }) 
    .then((response) => { 
        if (response.success) {
            localStorage.setItem('user', user); 
            localStorage.setItem('isAdmin', response.isBoolean); 
            localStorage.setItem('isAuthenticated', true); 
            location.href = '/';
        } 
        else {
            $('#message').append(`<p class="alert alert-danger">${response} 
        </p>`); 
        } 
    }); 
});
$('#send-command').on('click', function() { 
    const command = $('#command').val();
    const deviceId = $('device').val();
    console.log(`id is: ${id}  command is: ${command}`);
    $.post(`$http://localhost:5001/send-command`, { command, deviceId}) 
    .then((response) => { 
        if (response.success) {
            $('#message').append(`<p class="alert alert-success">${response.message}</p>`);
        } 
        else {
            $('#message').append(`<p class="alert alert-danger">${err}</p>`); 
        } 
    console.log(`command is: ${command}`); 
    });
});
const logout = () =>
{
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    location.href = '/login';
}