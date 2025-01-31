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
import { TOKEN, DEPARTMENT_API_CREATE, DEPARTMENT_API_GETALL, DEPARTMENT_API_GETSINGLE, DEPARTMENT_API_UPDATE } from './global/apis.js';
// -----------------------------------------------------------------------------
import { checkbox_function } from './global/checkbox.js';
import { capitalizeFirstLetter } from './global/functions.js';
import { rtnPaginationParameters, setTotalDataCount } from './global/pagination.js';
import { status_popup } from './global/status_popup.js';
import { loading_shimmer, remove_loading_shimmer } from './global/loading_shimmer.js';
import {} from './global/exportData.js';
import {} from './global/importData.js';
import {} from './global/sample_file_download.js';
import {} from './global/location_track.js';
// -----------------------------------------------------------------------------
import { individual_delete, objects_data_handler_function } from './global/delete_data.js';
window.individual_delete = individual_delete;
// ------------------------------------------------------------------------------
// ==============================================================================
// ==============================================================================

async function all_data_load_list(){
    try{
        loading_shimmer();
    } catch(error){console.log(error)}
    // -----------------------------------------------------------------------------------
    try{
        let tbody = document.getElementById("all_data_list_table");
        tbody.innerHTML = '';
        let row="";
        const API = `${DEPARTMENT_API_GETALL}${rtnPaginationParameters()}`;
        // -----------------------------------------------------------------------------------
        const response = await fetch(API,{
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
        const r1 = await response.json();        
        const data = r1?.data || '-';
        let zz1 = r1?.totalDepartments || '-';

        setTotalDataCount(zz1);
        if(zz1>0){
            try{
                data.map((e,i)=>{
                    let _id = e?._id || '-';
                    let name = capitalizeFirstLetter(e?.name || '-');
                    row+=`
                        <tr data-id='${_id}' >
                            <td ><input type="checkbox" class="checkbox_child" value='${_id}'></td>
                            <td>${i+1}</td>
                            <td>${name}</td>
                            <td class="text-end">
                                <button class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#modal_EDIT" onclick="edit_data_fn('${_id}')" ><i class="ri-pencil-line"></i></button>
                                <button class="btn btn-sm btn-danger" data-bs-toggle="modal" data-bs-target="#modal_DELETE" onclick="individual_delete('${_id}')" ><i class="ri-delete-bin-2-line"></i></button>
                            </td>
                        </tr>
                    `;
                });

            } catch(error){
                row = `<tr><td colspan="4" class="text-center">Got error, please try again later!</td></tr>`;
                console.log("data not found : - ",error);
            }
        } else {
            row = `<tr><td colspan="4" class="text-center">Data Not Found.</td></tr>`;
        }        
        tbody.innerHTML = row;
        checkbox_function();
    } catch(error){
        localStorage.clear();
        window.location.href = 'login.html';
    }
    // ----------------------------------------------------------------------------------------------------
    try{
        remove_loading_shimmer();
    } catch(error){console.log(error)}
}
// -----------------------------------------------------------------------------
all_data_load_list();
objects_data_handler_function(all_data_load_list);
// ==============================================================================
// ==============================================================================
let fff1 = "form_data_add";
let fffform1 = document.getElementById(fff1);
fffform1.addEventListener("submit", async function(event){
    event.preventDefault();
    try{
        loading_shimmer();
    } catch(error){console.log(error)}
    try{
        document.querySelectorAll(".btn-close").forEach(e=>e.click());
    } catch(error){console.log(error)}
    // -----------------------------------------------------------------------------------
    try{
        const name = document.getElementById("add_department_name").value;
        document.getElementById("add_department_name").value = '';        
        let API = `${DEPARTMENT_API_CREATE}`;
        // -----------------------------------------------------------------------------------
        const response = await fetch(API, {
            method : 'POST',
            headers : {
                "Content-Type": "application/json",
                'Authorization': `${TOKEN}`,
            },
            body : JSON.stringify({name}),
        });
        // -----------------------------------------------------------------------------------
        let r1 = await response?.json();
        
        status_popup(r1?.message, response?.ok);
        if(response.ok){
            all_data_load_list();
        }
    } catch(error){
        status_popup("Server Down, Please Try Again Later!")
        console.error(error);
    }
    // -----------------------------------------------------------------------------------
    try{
        fffform1.reset();
        remove_loading_shimmer();
    } catch(error){console.log(error)}
})

// ==============================================================================
// ==============================================================================

window.edit_data_fn = async function edit_data_fn(individual_id){
    try{
        loading_shimmer();
    } catch(error){console.log(error)}
    // -----------------------------------------------------------------------------------
    try{
        const API = `${DEPARTMENT_API_GETSINGLE}?id=${individual_id}`;
        const response = await fetch(API, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${TOKEN}`,
            },
        });
        // -----------------------------------------------------------------------------------
        let r1 = await response.json();
        document.getElementById("edit_id_hidden").value = r1?.department?._id;
        document.getElementById("edit_department_name").value = r1?.department?.name;
    } catch(error){console.log(error)};
    // -----------------------------------------------------------------------------------
    try{
        remove_loading_shimmer();
    } catch(error){console.log(error)}
}
// -----------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------
let fff2 = "form_data_edit";
let fffform2 = document.getElementById(fff2);
fffform2.addEventListener("submit", async function(event){
    event.preventDefault();
    try{
        loading_shimmer();
    } catch(error){console.log(error)}
    try{
        document.querySelectorAll(".btn-close").forEach(e=>e.click());
    } catch(error){console.log(error)}
    // -----------------------------------------------------------------------------------
    try{
        const name = document.getElementById("edit_department_name").value;
        const _id = document.getElementById("edit_id_hidden").value;
        let API = `${DEPARTMENT_API_UPDATE}`;
        // -----------------------------------------------------------------------------------
        const response = await fetch(API, {
            method : 'POST',
            headers : {
                "Content-Type": "application/json",
                'Authorization': `${TOKEN}`,
            },
            body : JSON.stringify({name, _id}),
        });
        // -----------------------------------------------------------------------------------
        let r1 = await response?.json();
        
        status_popup(r1?.message, response?.ok);
        if(response.ok){
            all_data_load_list();
        }
    } catch(error){
        status_popup("Server Down, Please Try Again Later!")
        console.error(error);
    }
    // -----------------------------------------------------------------------------------
    try{
        fffform2.reset();
        remove_loading_shimmer();
    } catch(error){console.log(error)}
})
