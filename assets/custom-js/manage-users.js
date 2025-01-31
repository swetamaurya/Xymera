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
import { TOKEN, EMPLOYEE_API_GETALL, EMPLOYEE_API_UPDATE } from './global/apis.js';
// -----------------------------------------------------------------------------
import { checkbox_function } from './global/checkbox.js';
import { capitalizeFirstLetter } from './global/functions.js';
import { rtnPaginationParameters, setTotalDataCount } from './global/pagination.js';
import { loading_shimmer, remove_loading_shimmer } from './global/loading_shimmer.js';
// -----------------------------------------------------------------------------
import { individual_delete, objects_data_handler_function } from './global/delete_data.js';
import { status_popup } from './global/status_popup.js';
window.individual_delete = individual_delete;
// -----------------------------------------------------------------------------
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
        const API = `${EMPLOYEE_API_GETALL}${rtnPaginationParameters()}`;
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
        const data = r1?.employees;
        let zz1 = r1?.totalEmployees;

        setTotalDataCount(zz1);
        if(zz1>0){

            try{
                data.map((e,i)=>{
                    let _id = e?._id;
                    let name = `${capitalizeFirstLetter(e?.name)} (${e?.userId})`;
                    let mobile = `${e?.mobile}`;
                    let department = `${e?.departments?.name}`;
                    let role = `${e?.roles}`;
                    let status = `<span class="badge ${(e?.status.toLowerCase()=='active'.toLowerCase())? 'bg-success' : 'bg-danger'}">${capitalizeFirstLetter(e?.status)}</span>`

                    // --------------------------------------
                    row+=`
                        <tr data-id='${_id}' >
                            <td ><input type="checkbox" class="checkbox_child" value='${_id}'></td>
                            <td>${name}</td>
                            <td>${mobile}</td>
                            <td>${department}</td>
                            <td>${role}</td>
                            <td>${status}</td>
                            <td class="text-end">
                                <button class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#modal_EDIT" onclick="individual_edit('${_id}')" ><i class="ri-pencil-line"></i></button>
                                <button class="btn btn-sm btn-danger" data-bs-toggle="modal" data-bs-target="#modal_DELETE" onclick="individual_delete('${_id}')" ><i class="ri-delete-bin-2-line"></i></button>
                            </td>
                        </tr>
                    `;
                });

            } catch(error){
                row = `<tr><td colspan="7" class="text-center">Got error, please try again later!</td></tr>`;
                console.log("data not found : - ",error);
            }
        } else {
            row = `<tr><td colspan="7" class="text-center">Data Not Found.</td></tr>`;
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

window.individual_edit = function individual_edit(id){
    document.getElementById("_hidden_id_model").value = id;
    console.log(document.getElementById("_hidden_id_model").value);
}

document.getElementById("edit_status").addEventListener("submit", async function(event) {
    event.preventDefault();
    try{
        loading_shimmer();
    } catch(error){console.log(error)}
    // -----------------------------------------------------------------------------------

    const id = document.getElementById("_hidden_id_model").value;
    const clickedButton = event.submitter;

    let status;
    if (clickedButton.classList.contains("btn-secondary")) {
        status = "Inactive";
    } else if (clickedButton.classList.contains("btn-primary")) {
        status = "Active";
    }

    try{
        let API = `${EMPLOYEE_API_UPDATE}`;
        const response = await fetch(API, {
            method : 'POST',
            headers : {
                "Content-Type": "application/json",
                'Authorization': `${TOKEN}`,
            },
            body : JSON.stringify({id, status}),
        });
        // -----------------------------------------------------------------------------------
        let r1 = await response?.json();
        
        status_popup(r1?.message, response?.ok);
        if(response.ok){
            all_data_load_list();
            console.log("hello wor,d ")
        }
    } catch(error){
        console.log(error);
    }
    // -----------------------------------------------------------------------------------
    try{
        remove_loading_shimmer();
    } catch(error){console.log(error)}
});
