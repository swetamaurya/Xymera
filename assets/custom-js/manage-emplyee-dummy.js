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
import { TOKEN, EMPLOYEE_API_GETALL } from './global/apis.js';
// -----------------------------------------------------------------------------
import { checkbox_function } from './global/checkbox.js';
import { capitalizeFirstLetter } from './global/functions.js';
import { rtnPaginationParameters, setTotalDataCount } from './global/pagination.js';
import { loading_shimmer, remove_loading_shimmer } from './global/loading_shimmer.js';
// -----------------------------------------------------------------------------
import { individual_delete, objects_data_handler_function } from './global/delete_data.js';
window.individual_delete = individual_delete;
// -----------------------------------------------------------------------------
// ==============================================================================
// ==============================================================================
let cachedRealAllData = {};
let cachedRealEmployees = [];
let cachedFakeEmployees = [];

async function all_data_load_list(param_data){
    try{
        loading_shimmer();
    } catch(error){console.log(error)}
    // -----------------------------------------------------------------------------------
    try{
        let tbody = document.getElementById("all_data_list_table");
        tbody.innerHTML = '';
        let row="";

        if(param_data=='' || param_data==undefined){
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
            cachedRealAllData = await response.json();
            
            const data = cachedRealAllData?.employees;
            cachedRealEmployees = data;
            cachedFakeEmployees = cachedRealEmployees;
            setTotalDataCount(cachedRealAllData?.totalEmployees);
        } else if(cachedFakeEmployees != []){
            cachedFakeEmployees = cachedRealEmployees;
        } else {
            cachedFakeEmployees = param_data;
        }

        if(cachedFakeEmployees.length>0){
            try{
                cachedFakeEmployees.map((e,i)=>{
                    let _id = e?._id;
                    let name = `${capitalizeFirstLetter(e?.name)} (${e?.userId})`;
                    let email = e?.email;
                    let mobile = `${e?.mobile}`;
                    let department = `${e?.departments?.name}`;
                    let role = `${e?.roles}`;
                    let status = `<span class="badge ${(e?.status.toLowerCase()=='active'.toLowerCase())? 'bg-success' : 'bg-danger'}">${capitalizeFirstLetter(e?.status)}</span>`

                    // -----------------------------------------------------------------------------------
                    row+=`
                        <tr data-id='${_id}' >
                            <td ><input type="checkbox" class="checkbox_child" value='${_id}'></td>
                            <td>${name}</td>
                            <td>${email}</td>
                            <td>${mobile}</td>
                            <td>${department}</td>
                            <td>${role}</td>
                            <td>${status}</td>
                            <td class="text-end">
                                <a href="view-employee.html?id=${_id}" class="btn btn-sm btn-success"><i class="ri-eye-line"></i></a>
                                <a href="edit-employee.html?id=${_id}" class="btn btn-sm btn-primary"><i class="ri-pencil-line"></i></a>
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
all_data_load_list([]);
objects_data_handler_function(all_data_load_list);
// ==============================================================================
// ==============================================================================
document.getElementById("sorting_order_input_text").addEventListener("input", function(event){
    let searchTextValue = event.target.value.trim();
    if(searchTextValue!=''){
        console.log("cachedRealAllData :- ",cachedRealAllData);
        console.log("cachedRealEmployees :- ",cachedRealEmployees);
        console.log("cachedFakeEmployees :- ",cachedFakeEmployees);
    } else {
        cachedFakeEmployees = [];
        console.log("cachedRealAllData :- ",cachedRealAllData);
        console.log("cachedRealEmployees :- ",cachedRealEmployees);
        console.log("cachedFakeEmployees :- ",cachedFakeEmployees);
        // all_data_load_list([]);
        // objects_data_handler_function(all_data_load_list);
    }
    console.log("--------------------------------------------------")

});

