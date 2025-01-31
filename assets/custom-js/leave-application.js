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
import { LEAVE_API_GETALL, LEAVE_API_GETSINGLE, TOKEN, } from './global/apis.js';
// -----------------------------------------------------------------------------
import { checkbox_function } from './global/checkbox.js';
import { capitalizeFirstLetter, formatDate, formatTime } from './global/functions.js';
import { rtnPaginationParameters, setTotalDataCount } from './global/pagination.js';
import { loading_shimmer, remove_loading_shimmer } from './global/loading_shimmer.js';
import { start_hidder } from './global/hide_unhide_ROLES.js';
import { iFrameRenderFunction, clearIFrameRenderEventListener } from './global/iframe_profile_open.js';
import {} from './global/location_track.js';
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
        const API = `${LEAVE_API_GETALL}${rtnPaginationParameters()}`;
        // -----------------------------------------------------------------------------------
        const response = await fetch(API,{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `${TOKEN}`,
            }
        });
        // -----------------------------------------------------------------------------------
        const r1 = await response.json();        
        const data = r1?.leaves;
        let zz1 = r1?.summary?.totalRecords;

        setTotalDataCount(zz1);
        if(zz1>0){

            try{
                data.map((e,i)=>{
                    let _id = e?._id;
                    
                    let sss2 = ((e?.status || 'Pending').toLowerCase()=='Pending'.toLowerCase())? '' : 'd-none';
                    let status = `<span class="badge ${(((e?.status || 'Pending').toLowerCase()=='Pending'.toLowerCase()) || ((e?.status || 'Rejected').toLowerCase()=='Rejected'.toLowerCase())) ? 'bg-danger' : 'bg-success'}">${capitalizeFirstLetter(e?.status)}</span>`;
                    
                    row+=`
                        <tr data-id='${_id}' >
                            <td class="employee_restriction_d_none  " ><input type="checkbox" class="checkbox_child" value='${_id}'></td>
                            <td class="employee_restriction_d_none "><span  class=" cursor-pointer" data-bs-toggle="modal" data-bs-target="#modal_I_FRAME" created-by="./view-employee.html?id=${e?.name?._id}"  >${capitalizeFirstLetter(e?.name?.name)}</span></td>
                            <td>${e?.leaveType}</td>
                            <td>${e?.noOfDays}</td>
                            <td>${formatDate(e?.from)}</td>
                            <td>${formatDate(e?.to)}</td>
                            <td>${status}</td>
                            <td class="text-end ">
                                <a href="view-leave.html?id=${e?._id}" class="btn btn-sm btn-success"><i class="ri-eye-line"></i></a>
                                <a href="edit-leave.html?id=${e?._id}"  class="btn btn-sm btn-primary ${sss2} " ><i class="ri-pencil-line"></i></a>
                                <button class="btn btn-sm btn-danger ${sss2} manager_restriction_d_none " data-bs-toggle="modal" data-bs-target="#modal_DELETE" onclick="individual_delete('${_id}')" ><i class="ri-delete-bin-2-line"></i></button>
                            </td>
                        </tr>
                    `;
                });

            } catch(error){
                row = `<tr><td colspan="8" class="text-center">Got error, please try again later!</td></tr>`;
                console.log("data not found : - ",error);
            }
        } else {
            row = `<tr><td colspan="8" class="text-center">Data Not Found.</td></tr>`;
        }        
        tbody.innerHTML = row;
        checkbox_function();

    } catch(error){console.log(error)}
    // -----------------------------------------------------------------------------------
    try{
        start_hidder();
        iFrameRenderFunction();
        remove_loading_shimmer();
    } catch(error){console.log(error)}
}
all_data_load_list();