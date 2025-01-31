try{
    localStorage.clear();
} catch(error){console.log(error)}
// -----------------------------------------------------------------------------
import { USER_API_LOGIN } from "./global/apis.js";
import { loading_shimmer, remove_loading_shimmer } from "./global/loading_shimmer.js";
import { status_popup } from "./global/status_popup.js";
// ==============================================================================
// ==============================================================================

let fff1 = "login-form";
document.getElementById(fff1).addEventListener("submit", async function (event){
    event.preventDefault();
    try{
        loading_shimmer();
    } catch(error){console.log(error);}
    // -----------------------------------------------------------------------------------
    try{
        const email = document.getElementById('yourUsername').value;
        const password = document.getElementById('yourPassword').value;
        const API = `${USER_API_LOGIN}`;
        // -----------------------------------------------------------------------------------
        const response = await fetch(API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password }),
        });
        // -----------------------------------------------------------------------------------
        const r1 = await response.json();
        // -----------------------------------------------------------------------------------
        try{
            status_popup(r1?.message, (response?.ok));
            if(response?.ok) {
                try{
                    localStorage.setItem('token', r1?.token);
                    localStorage.setItem('roles', r1?.user?.roles);
                    localStorage.setItem('name', r1?.user?.name);
                    localStorage.setItem('_id', r1?.user?._id);
                    localStorage.setItem('email',r1?.user?.email);
                    localStorage.setItem('image',r1?.user?.image);
                    localStorage.setItem('timestampActiveSession', Date.now().toString());
                } catch(error){
                    status_popup( ("please try again later, Server Error !"), (false));
                    console.log(error);
                }
                try{
                    let userRoleFile = r1?.user?.roles;

                    if(userRoleFile == "Employee"){
                        window.location.href = 'employee.html';
                    }
                    else if(userRoleFile == "Admin"){
                        window.location.href = 'index.html';
                    }
                    else if(userRoleFile == "HR"){
                        window.location.href = 'manage-department.html';
                    }
                    else if(userRoleFile == "Manager"){
                        window.location.href = 'manager-dashboard.html';
                    }
                } catch (error){
                    status_popup( ("please try again later, Server Error !"), (false));
                    console.log(error);
                }
            }
        } catch(error){console.log(error)}
    } catch(error){
        status_popup( ("Invalid Credentials"), (false));
        console.log(error);
    }
    // -----------------------------------------------------------------------------------
    try{
        document.getElementById(fff1).reset();
        remove_loading_shimmer();
    } catch(error){console.log(error);}
});
