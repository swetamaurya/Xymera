import {status_popup} from './GLOBAL_popup_shimmer.js';
import {user_API} from './apis.js';

// const token = localStorage.getItem('token');
// const user_Role = localStorage.setItem


// status_popup("hello brother <br> this is a demo", true)

// =======================================================
// =======================================================
// =======================================================

const registerForm = document.getElementById('postForm');


// Form submit event listener
registerForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  // Get form values after validation passes
  const name = document.getElementById('yourName').value;
  const email = document.getElementById('yourEmail').value;
  const mobile = document.getElementById('yourMobile').value;
  const password = document.getElementById('yourPassword').value;
  // const roles = document.getElementById('role').value;

  try {
    // Send data to the backend
    const response = await fetch(`${user_API}/admin/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
        // 'Authorization': token
      },
      body: JSON.stringify({ name, email, mobile, password }),
    });
    const res = await response.json();
    console.log(res)

    const c1 = (response.ok);
    try{
        status_popup( ((c1) ? "Account Created <br> Successfully" : "Please try again later"), (c1) );
        setTimeout(function(){
          window.location.href = 'login.html';
        },((Number(document.getElementById("b1b1").innerText)-1)*1000));
    } catch (error){
      status_popup( ("Please try again later"), (false) );
    }
  } catch (error) {
    status_popup( ("Please try again later"), (false) );
    // document.getElementById('response').innerText = 'Error connecting to the server.';
    console.error('Error:', error);
  }
});