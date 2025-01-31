import {} from './global/hide_unhide_ROLES.js';

const userRole = document.getElementById('user-role');
const user_Role = localStorage.getItem('roles');
const signOut = document.getElementById('sign-out');

const nameUser = document.getElementById("user_header_profile_name");
const user_header_mail_id = document.getElementById("user_header_mail_id");

nameUser.innerText = localStorage.getItem("name");
user_header_mail_id.innerText = localStorage.getItem("email");

document.getElementById("profile_photo_show_header_html").src = localStorage.getItem("image");


if(user_Role == "Employee"){
    userRole.innerText = user_Role
}
else if(user_Role == "Admin"){
    userRole.innerText = user_Role
}
else if(user_Role == "HR"){
    userRole.innerText = user_Role
}
else if(user_Role == "Manager"){
    userRole.innerText = user_Role
}

signOut.addEventListener('click',()=>{
    localStorage.clear();
    window.location.href = 'login.html'
})