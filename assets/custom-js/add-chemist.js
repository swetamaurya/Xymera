(function(){
    const timestamp = localStorage.getItem('timestampActiveSession');
    if (timestamp) {
        const currentTime = Date.now();
        const timeDiff = currentTime - parseInt(timestamp);
        let hrs = 9.5; // hrs session active condition
        if (timeDiff > hrs * 60 * 60 * 1000) {
            localStorage.clear();
            window.location.href = 'login.html';
        }
    } else {
        localStorage.clear();
        window.location.href = 'login.html';
    }
})();
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
import { TOKEN, EMPLOYEE_API_CREATE } from './global/apis.js';
// -----------------------------------------------------------------------------
import { status_popup } from './global/status_popup.js';
import { loading_shimmer, remove_loading_shimmer } from './global/loading_shimmer.js';
import { validateForm1 } from './global/validation.js';
import {} from './global/location_track.js';
// -----------------------------------------------------------------------------
import {  } from './global/hide_unhide_ROLES.js';
// ==============================================================================
// ==============================================================================

document.getElementById("add-employee").addEventListener("submit", async function(event){
    event.preventDefault();
    if (!validateForm1()) {
        return;
    }
    try{
        loading_shimmer();
    } catch(error){console.log(error)}
    // -----------------------------------------------------------------------------------
    try{
        document.getElementById("register").classList.add("disabled");
        let formData = rtnFormData();
        let API = `${EMPLOYEE_API_CREATE} `;
        // -----------------------------------------------------------------------------------
        const response = await fetch(API, {
            method : 'POST',
            headers : {
                'Authorization': `${TOKEN}`,
            },
            body : formData
        });
        // -----------------------------------------------------------------------------------
        let r1 = await response?.json();
        status_popup(r1?.message, response?.ok);

        setTimeout(function(){
            window.location.href = 'manage-chemist.html'; 
        },1000);
    } catch(error){
        console.log(error)
        history.back();
    }
    // -----------------------------------------------------------------------------------
    try{
        remove_loading_shimmer();
    } catch(error){console.log(error)}
})

// --------------------------------------------------------------------------------------
function rtnFormData(){
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let mobile = document.getElementById("mobile").value;
    let address = document.getElementById("address").value;

    let status_role = document.getElementById("status_role").value;
    let image = document.getElementById("photo").files[0];
    let doob = document.getElementById("doob").value;
    let noOfFeq = document.getElementById("noOfFeq").value;
    let categoryyy = document.getElementById("categoryyy").value;
    
    let d_t_1_from = document.getElementById("d_t_1_from").value;
    let d_t_1_to = document.getElementById("d_t_1_to").value;
    let d_t_1_final = `${d_t_1_from} to ${d_t_1_to}`;

    let d_t_2_from = document.getElementById("d_t_2_from").value;
    let d_t_2_to = document.getElementById("d_t_2_to").value;
    let d_t_2_final = `${d_t_2_from} to ${d_t_2_to}`;


    let f1 = new FormData();
    f1.append("name",name);
    f1.append("email",email);
    f1.append("mobile",mobile);
    f1.append("area",address);
    f1.append("chemist_time1",d_t_1_final);
    f1.append("chemist_time2",d_t_2_final);
    f1.append("visitFrequency",noOfFeq);
    f1.append("category",categoryyy);
    f1.append("onboarding",doob);
    f1.append("image",image);
    f1.append("status", status_role);
    f1.append("roles","Chemist");

    return f1;
}