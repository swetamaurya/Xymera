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
import { TOKEN, DELETE_API } from './apis.js';
// -----------------------------------------------------------------------------
import { r_arr1, u_arr1 } from './checkbox.js';
import { status_popup } from './status_popup.js';
import { loading_shimmer, remove_loading_shimmer } from './loading_shimmer.js';
// ==============================================================================
// ==============================================================================
let table_data_reload;
export function objects_data_handler_function(table_data_function){
    table_data_reload = table_data_function;
}

export function individual_delete (_id) {
    u_arr1();
    document.querySelector(`[data-id='${_id}']`).querySelector('input[type="checkbox"]').checked = true;
    deleteFunction();
};

// Delete selected employees
let deleteVariable_globalFunction2;
function deleteFunction() {
    if(r_arr1().length<=0){
        return;
    }
    deleteVariable_globalFunction2 = document.getElementById("deleteButton")
    deleteVariable_globalFunction2.addEventListener("click",deleteEventFunction);
}

async function deleteEventFunction(event) {
    event.preventDefault();
    try{
        loading_shimmer();
    } catch(error){console.log(error)}
    try{
        document.querySelectorAll(".btn-close").forEach(e=>e.click());
    } catch(error){console.log(error)}
    try{
        deleteVariable_globalFunction2.removeEventListener("click",deleteEventFunction);
    } catch(error){console.log(error)}

    const selectedIds = r_arr1();
    if (selectedIds.length > 0) {
        try {
            let API = `${DELETE_API}`;
            const response = await fetch(API, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${TOKEN}`,
                },
                body: JSON.stringify({ "_id": selectedIds }),
            });

            // ----------------------------------------------------------------------------------------------------
            try{
                u_arr1();
            } catch(error){console.log(error)}
            // ----------------------------------------------------------------------------------------------------

            const success = response.ok;
            status_popup((success ? "Data Remove Successfully" : "Please try again later"), success);
            
            if (success){
                table_data_reload();
            }
        } catch (error) {
            console.error("Error deleting data:", error);
            status_popup("Please try <br> again later", false);
        }
        // ----------------------------------------------------------------------------------------------------
        try{
            remove_loading_shimmer();
        } catch(error){console.log(error)}
    }
}