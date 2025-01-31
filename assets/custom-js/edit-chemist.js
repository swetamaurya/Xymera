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
import { validateForm1 } from './global/validation.js';
import {} from './global/location_track.js';
// -----------------------------------------------------------------------------
const id_param = new URLSearchParams(window.location.search).get("id");
// ==============================================================================
// ==============================================================================

async function editData() {
    try{
        loading_shimmer();
    } catch(error){console.log(error)}
    // -----------------------------------------------------------------------------------
    try{
        let id = document.getElementById("id");
        let name = document.getElementById("name");
        let email = document.getElementById("email");
        let mobile = document.getElementById("mobile");
        let address = document.getElementById("address");
        let d_t_1_from = document.getElementById("d_t_1_from");
        let d_t_1_to = document.getElementById("d_t_1_to");
        let d_t_2_from = document.getElementById("d_t_2_from");
        let d_t_2_to = document.getElementById("d_t_2_to");
        let noOfFeq = document.getElementById("noOfFeq");
        let categoryyy = document.getElementById("categoryyy");
        let doob = document.getElementById("doob");
        let image = document.getElementById("user_profile_img");
        let status = document.getElementById("status_role");

        let API = `${EMPLOYEE_API_GETSINGLE}?id=${id_param}`;
        // -----------------------------------------------------------------------------------
        const response = await fetch(API, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `${TOKEN}`,
            },
        });
        if((!response.ok) || (response?.status!==200)){
            throw new Error();
        }
        // -----------------------------------------------------------------------------------
        let r2 = (await response.json())?.data;
        // -----------------------------------------------------------------------------------
        
        id.value = r2?.userId || '' ;
        name.value = r2?.name || '' ;
        email.value = r2?.email || '' ;
        mobile.value = r2?.mobile || '' ;
        address.value = r2?.area || '' ;
        noOfFeq.value = r2?.visitFrequency || '';
        categoryyy.value = r2?.category || '' ;
        doob.value = r2?.onboarding || '' ;
        image.src = r2?.image || 'https://pinnacle.works/wp-content/uploads/2022/06/dummy-image.jpg' ;
        status.value = r2?.status || '' ;

        try{
            let [time1From, time1To] = (r2?.chemist_time1 || '' ).split(" to ");
            let [time2From, time2To] = (r2?.chemist_time2 || '').split(" to ");
            d_t_1_from.value = time1From;
            d_t_1_to.value = time1To;
            d_t_2_from.value = time2From;
            d_t_2_to.value = time2To;
        } catch(error){
            console.log(error)
        }
    } catch(error){
        localStorage.clear();
        window.location.href = 'login.html';
    }
    // -----------------------------------------------------------------------------------
    try{
        remove_loading_shimmer();
    } catch(error){console.log(error)}    
}
editData();

// ==============================================================================
document.getElementById("edit-doctor").addEventListener("submit", async function(event){
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
            window.location.href = 'manage-chemist.html'; 
        },1000);
    } catch(error){
        console.log(error)
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
    
    let noOfFeq = document.getElementById("noOfFeq").value;
    let categoryyy = document.getElementById("categoryyy").value;
    let doob = document.getElementById("doob").value;
    let image = document.getElementById("photo").files[0];
    let status_role = document.getElementById("status_role").value;

    let d_t_1_from = document.getElementById("d_t_1_from").value;
    let d_t_1_to = document.getElementById("d_t_1_to").value;
    let d_t_1_final = `${d_t_1_from} to ${d_t_1_to}`;

    let d_t_2_from = document.getElementById("d_t_2_from").value;
    let d_t_2_to = document.getElementById("d_t_2_to").value;
    let d_t_2_final = `${d_t_2_from} to ${d_t_2_to}`;


    let f1 = new FormData();
    f1.append("id", id_param)
    f1.append("name",name);
    f1.append("email",email);
    f1.append("mobile",mobile);
    f1.append("area",address);
    f1.append("chemist_time1",d_t_1_final);
    f1.append("chemist_time2",d_t_2_final);
    f1.append("visitFrequency",noOfFeq);
    f1.append("category",categoryyy);
    f1.append("onboarding",doob);
    f1.append("status", status_role);
    f1.append("roles","Chemist");

    if( image!=undefined || image!=null || image!=''){
        f1.append("image",image);
    }

    return f1;
}