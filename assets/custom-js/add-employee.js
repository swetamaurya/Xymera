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
import { TOKEN, DEPARTMENT_API_GETALL, EMPLOYEE_API_CREATE } from './global/apis.js';
// -----------------------------------------------------------------------------
import { status_popup } from './global/status_popup.js';
import { loading_shimmer, remove_loading_shimmer } from './global/loading_shimmer.js';
import { validateForm1 } from './global/validation.js';
import {} from './global/location_track.js';
// -----------------------------------------------------------------------------
// ==============================================================================
// ==============================================================================

let cachedDepartment = [];
async function fetchDepartment() {
    try{
        loading_shimmer();
    } catch(error){console.log(error)}
    // -----------------------------------------------------------------------------------
    if(cachedDepartment.length === 0){
        try{
            let API = `${DEPARTMENT_API_GETALL}`;
            const response = await fetch(API, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `${TOKEN}`,
                },
            });
            // ---------------------------------------------------------------------------
            cachedDepartment = (await response.json())?.data;
            
            try {
                const s1 = document.getElementById("department");
                
                cachedDepartment.forEach(({ _id, name }) => {
                    const option1 = document.createElement("option");
                    option1.value = _id;
                    option1.textContent = name;
                    s1.appendChild(option1);
                });
            } catch (error){
                console.log(error)
            }
        } catch(error){
            console.log(error)
        }
    }
    // ----------------------------------------------------------------------------------------------------
    try{
        remove_loading_shimmer();
    } catch(error){console.log(error)}
}
try{
    await fetchDepartment();
} catch(error){console.log(error)}

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
            window.location.href = 'manage-employee.html';
            // history.back();
        },1000);
    } catch(error){
        console.log(error);
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
    let emailid = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let mobileno = document.getElementById("mobile").value;
    let role = document.getElementById("role").value;
    
    let shift_start = document.getElementById("shift_start").value;
    let shift_end = document.getElementById("shift_end").value;
    let department = document.getElementById("department").value;
    let designation = document.getElementById("designation").value;
    let dateOfJoining = document.getElementById("doj").value;
    let kmPerCost = document.getElementById("per_km_cost").value;
    let image = document.getElementById("photo").files[0];
    let status_role = document.getElementById("status_role").value;
    
    let f1 = new FormData();
    f1.append("name",name);
    f1.append("email",emailid);
    f1.append("password",password);
    f1.append("mobile",mobileno);
    f1.append("roles",role);
    f1.append("shiftStart",shift_start);
    f1.append("shiftEnd",shift_end);
    f1.append("joiningDate",dateOfJoining);
    f1.append("image",image);
    f1.append("departments",department);
    f1.append("designations",designation);
    f1.append("km",kmPerCost);
    f1.append("status", status_role);

    return f1;
}