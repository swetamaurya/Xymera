if (!localStorage.getItem("token")) {
    localStorage.clear();
    window.location.href = 'index.html';
}
// -----------------------------------------------------------------------------
import { TOKEN, CATEGORY_API_CREATE, CATEGORY_API_GETALL, CATEGORY_API_UPDATE } from './global/apis.js';
// -----------------------------------------------------------------------------
import { checkbox_function } from './global/checkbox.js';
import { capitalizeFirstLetter } from './global/functions.js';
import { rtnPaginationParameters, setTotalDataCount } from './global/pagination.js';
import { status_popup } from './global/status_popup.js';
import { loading_shimmer, remove_loading_shimmer } from './global/loading_shimmer.js';
// -----------------------------------------------------------------------------
import { individual_delete, objects_data_handler_function } from './global/delete_data.js';
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
        const API = `${CATEGORY_API_GETALL}${rtnPaginationParameters()}`;
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
        const data = r1?.data;
        let zz1 = r1?.summary?.totalCategories;

        setTotalDataCount(zz1);
        if(zz1>0){

            try{
                data.map((e,i)=>{
                    let _id = e?._id;
                    let name = capitalizeFirstLetter(e?.name);
                    let status = `<span class="badge ${((e?.status || 'Inactive').toLowerCase()=='active'.toLowerCase())? 'bg-success' : 'bg-danger'}">${capitalizeFirstLetter(e?.status || 'Inactive')}</span>`;
                    
                    row+=`
                        <tr data-id='${_id}' >
                            <td ><input type="checkbox" class="checkbox_child" value='${_id}'></td>
                            <td>${i+1}</td>
                            <td>${name}</td>
                            <td>${status}</td>
                            <td class="text-end">
                                <button class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#modal_EDIT" onclick="individual_edit('${_id}')" ><i class="ri-pencil-line"></i></button>
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
let ffffrom1 = document.getElementById(fff1);
ffffrom1.addEventListener("submit", async function(event){
    event.preventDefault();
    try{
        loading_shimmer();
    } catch(error){console.log(error)}
    try{
        document.querySelectorAll(".btn-close").forEach(e=>e.click());
    } catch(error){console.log(error)}
    // -----------------------------------------------------------------------------------
    try{
        const name = document.getElementById("add_category_name").value;
        const status = document.getElementById("select_status_cate").value;
        let API = `${CATEGORY_API_CREATE}`;
        // -----------------------------------------------------------------------------------
        const response = await fetch(API, {
            method : 'POST',
            headers : {
                "Content-Type": "application/json",
                'Authorization': `${TOKEN}`,
            },
            body : JSON.stringify({name, status}),
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
        history.back();
    }
    // -----------------------------------------------------------------------------------
    try{
        ffffrom1.reset();
        remove_loading_shimmer();
    } catch(error){console.log(error)}
})

// ==============================================================================
// ==============================================================================

window.individual_edit = function individual_edit(id){
    document.getElementById("_hidden_id_model").value = id;
}
// -----------------------------------------------------------------------------------
document.getElementById("edit_status").addEventListener("submit", async function(event) {
    event.preventDefault();
    try{
        loading_shimmer();
    } catch(error){console.log(error)}
    // -----------------------------------------------------------------------------------
    
    const _id = document.getElementById("_hidden_id_model").value;
    const clickedButton = event.submitter;

    let status;
    if (clickedButton.classList.contains("btn-secondary")) {
        status = "Inactive";
    } else if (clickedButton.classList.contains("btn-primary")) {
        status = "Active";
    }

    try{
        let API = `${CATEGORY_API_UPDATE}`;
        const response = await fetch(API, {
            method : 'POST',
            headers : {
                "Content-Type": "application/json",
                'Authorization': `${TOKEN}`,
            },
            body : JSON.stringify({_id, status}),
        });
        // -----------------------------------------------------------------------------------
        let r1 = await response?.json();
        
        status_popup(r1?.message, response?.ok);
        if(response.ok){
            all_data_load_list();
        }
    } catch(error){
        console.log(error);
        history.back();
    }
    // -----------------------------------------------------------------------------------
    try{
        remove_loading_shimmer();
    } catch(error){console.log(error)}
});