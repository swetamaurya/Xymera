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
import { TOKEN, EMPLOYEE_API_GETSINGLE, EMPLOYEE_API_UPDATE } from './global/apis.js';
// -----------------------------------------------------------------------------
import { status_popup } from './global/status_popup.js';
import { loading_shimmer, remove_loading_shimmer } from './global/loading_shimmer.js';
import { formatDate, formatTime } from './global/functions.js';
import {} from './global/location_track.js';
// -----------------------------------------------------------------------------
const _id_current = localStorage.getItem("_id");
// ==============================================================================
// ==============================================================================

async function all_data_load_list(){
    console.log("brother")
    try{
        loading_shimmer();
    } catch(error){console.log(error)}
    // -----------------------------------------------------------------------------------
    try{
        let API = `${EMPLOYEE_API_GETSINGLE}?id=${_id_current}`;
        // -----------------------------------------------------------------------------------
        const response = await fetch(API, {
            method : 'GET',
            headers : {
                "Content-Type": "application/json",
                'Authorization': `${TOKEN}`,
            }
        });
        // -----------------------------------------------------------------------------------
        let r1 = await response.json();
        const {name, email, mobile, departments, designations, joiningDate, shiftStart, shiftEnd, km, image, userId, status} = r1?.data;
        // -----------------------------------------------------------------------------------
        console.log(r1)
        try{
            document.getElementById("profile_photo").src = image || '';
            document.getElementById("user_id_profile").innerText = userId || '';
            document.getElementById("user_name").innerText = name || '';
            if(status == "Active"){
                document.getElementById("status_current_profile").innerText = status || '';
                document.getElementById("status_current_profile").classList.add("bg-success");
            } else {
                document.getElementById("status_current_profile").innerText = status || '';
                document.getElementById("status_current_profile").classList.add("bg-danger");
            }
            
        } catch (error){console.log(error)}
        
        
        try{
            let d1 = [name || '', email || '', mobile || '', departments?.name || '', designations || '', formatDate(joiningDate || ''), formatTime(shiftStart || ''), formatTime(shiftEnd || ''), km || ''];

            let a1 = Array.from(document.querySelectorAll(".fc-fn-1"));
            let a2 = Array.from(document.querySelectorAll(".fc-eml-2"));
            let a3 = Array.from(document.querySelectorAll(".fc-mbl-3"));
            let a4 = Array.from(document.querySelectorAll(".fc-dpt-4"));
            let a5 = Array.from(document.querySelectorAll(".fc-dgn-5"));
            let a6 = Array.from(document.querySelectorAll(".fc-doj-6"));
            let a7 = Array.from(document.querySelectorAll(".fc-ysst-7"));
            let a8 = Array.from(document.querySelectorAll(".fc-yset-8"));
            let a9 = Array.from(document.querySelectorAll(".fc-pkmc-9"));
            
            let zz1 = [a1, a2, a3, a4, a5, a6, a7, a8, a9];
            
            zz1.map((e,i)=>{
                e.map(f=>{
                    f.value = d1[i];
                });
            });
        } catch(error){console.log(error)}
        
    } catch(error){
        console.log(error);
        
        localStorage.clear();
        window.location.href = 'login.html';
    }
    // ----------------------------------------------------------------------------------------------------
    try{
        remove_loading_shimmer();
    } catch(error){console.log(error)}
    
}
all_data_load_list();
// ==============================================================================
// ==============================================================================
let edit_profile_form_id = document.getElementById("edit_profile_form_id");
edit_profile_form_id.addEventListener("submit", async function(event){
    event.preventDefault();
    try{
        loading_shimmer();
    } catch(error){console.log(error)}
    // -----------------------------------------------------------------------------------
    try{
        document.getElementById("updatebtnform").classList.add("disabled");
        let formData = rtnFormData();
        let API = `${EMPLOYEE_API_UPDATE} `;
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
            localStorage.setItem('name', r1?.updatedUser?.name);
            localStorage.setItem('email',r1?.updatedUser?.email);
            localStorage.setItem('image',r1?.updatedUser?.image);
            
            window.location.reload();
        },300);
    } catch(error){
        console.log(error);
        history.back();
    }
    // -----------------------------------------------------------------------------------
    try{
        remove_loading_shimmer();
    } catch(error){console.log(error)}
});
// ==============================================================================
// ==============================================================================
let password_change_form_id = document.getElementById("password_change_form_id");
password_change_form_id.addEventListener("submit", async function(event){
    event.preventDefault();
    if(rtnPassCnfmPass()){
        console.log("bro :- ",rtnPassCnfmPass())
        return;
    }
    try{
        loading_shimmer();
    } catch(error){console.log(error)}
    // -----------------------------------------------------------------------------------
    try{
        let id = localStorage.getItem("_id");
        let password = document.getElementById("oldPassword").value;
        let newPassword = document.getElementById("newPassword").value;
        
        let API = `${EMPLOYEE_API_UPDATE} `;
        // -----------------------------------------------------------------------------------
        const response = await fetch(API, {
            method : 'POST',
            headers : {
                "Content-Type": "application/json",
                'Authorization': `${TOKEN}`,
            },
            body : JSON.stringify({id, password, newPassword})
        });
        // -----------------------------------------------------------------------------------
        let r1 = await response?.json();
        status_popup(r1?.message, response?.ok);
        
        setTimeout(function(){
            window.location.reload();
        },300);
    } catch(error){
        console.log(error);
        history.back();
    }
    // -----------------------------------------------------------------------------------
    try{
        remove_loading_shimmer();
    } catch(error){console.log(error)}
});

// ==============================================================================
// ==============================================================================
function rtnPassCnfmPass(){
    let isValid = false;

    let a1 = document.getElementById("newPassword").value;
    let a2 = document.getElementById("renewPassword").value;

    if(a1!=a2 || a1=='' || a1==null  || a2=='' || a2==null){
        document.getElementById("notmatchpassword").classList.remove("d-none");
        isValid = true;
    } else {
        document.getElementById("notmatchpassword").classList.add("d-none");
        isValid = false;
    }

    return isValid;
}
// ==============================================================================
// ==============================================================================
// --------------------------------------------------------------------------------------
function rtnFormData(){
    let name = document.getElementById("fullName").value;
    let mobileno = document.getElementById("mobile").value;
    let image = document.getElementById("photo").files[0];
    
    let f1 = new FormData();
    f1.append("id", _id_current)
    f1.append("name",name);
    f1.append("mobile",mobileno);
    
    if( image!=undefined || image!=null || image!='' ){
        f1.append("image",image);
    }
    
    return f1;
}
// ==============================================================================
