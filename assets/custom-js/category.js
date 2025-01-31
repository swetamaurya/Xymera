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
import { TOKEN, CATEGORY_API_CREATE, CATEGORY_API_GETALL, CATEGORY_API_GETSINGLE, CATEGORY_API_UPDATE,SEARCH_API } from './global/apis.js';
// -----------------------------------------------------------------------------
import { checkbox_function } from './global/checkbox.js';
import { capitalizeFirstLetter } from './global/functions.js';
import { rtnPaginationParameters, setTotalDataCount } from './global/pagination.js';
import { status_popup } from './global/status_popup.js';
import { loading_shimmer, remove_loading_shimmer } from './global/loading_shimmer.js';
import { start_hidder } from './global/hide_unhide_ROLES.js';
// import {} from './global/exportData.js';
// import {} from './global/importData.js';
// import {} from './global/sample_file_download.js'
import {} from './global/location_track.js';
// -----------------------------------------------------------------------------
import { individual_delete, objects_data_handler_function } from './global/delete_data.js';
window.individual_delete = individual_delete;
// -----------------------------------------------------------------------------
// ==============================================================================

function renderTable(data) {
    try {
        const tbody = document.getElementById("all_data_list_table");

        if (!tbody) {
            throw new Error("Table body not found.");
        }

        // Clear the table before rendering new data
        tbody.innerHTML = "";

        if (!data || data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="text-center">Data Not Found.</td></tr>`;
            return;
        }

        let row = "";

        try {
            let ls1 = localStorage.getItem("roles");
            let bb1 = ls1 !== "Employee";

            data.forEach((e, i) => {
                let _id = e?._id || "-";
                let name = capitalizeFirstLetter(e?.name || "-");
                let category = capitalizeFirstLetter(e?.category?.name || "-");

                let status;
                if (bb1) {
                    status = `<span class="cursor-pointer badge ${
                        (e?.status || "Inactive").toLowerCase() === "active".toLowerCase()
                            ? "bg-success"
                            : "bg-danger"
                    }" data-bs-toggle="modal" data-bs-target="#modal_EDIT_STATUS" onclick="individual_edit('${_id}')">
                        <i class="ri-pencil-fill"></i> ${capitalizeFirstLetter(e?.status || "Inactive")}
                    </span>`;
                } else {
                    status = `<span class="badge ${
                        (e?.status || "Inactive").toLowerCase() === "active".toLowerCase()
                            ? "bg-success"
                            : "bg-danger"
                    }"> ${capitalizeFirstLetter(e?.status || "Inactive")}</span>`;
                }

                row += `
                    <tr data-id='${_id}'>
                        <td class="employee_restriction_d_none"><input type="checkbox" class="checkbox_child" value="${_id}"></td>
                        <td>${i + 1}</td>
                        <td>${name}</td>
                        <td>${category}</td>
                        <td>${status}</td>
                        <td class="text-end employee_restriction_d_none">
                            <button class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#modal_EDIT" onclick="edit_data_fn('${_id}')">
                                <i class="ri-pencil-line"></i>
                            </button>
                            <button class="btn btn-sm btn-danger" data-bs-toggle="modal" data-bs-target="#modal_DELETE" onclick="individual_delete('${_id}')">
                                <i class="ri-delete-bin-2-line"></i>
                            </button>
                        </td>
                    </tr>`;
            });
        } catch (error) {
            row = `<tr><td colspan="6" class="text-center">Got error, please try again later!</td></tr>`;
            console.error("Data processing error:", error);
        }

        tbody.innerHTML = row;

        try {
            checkbox_function();
            start_hidder();
        } catch (error) {
            console.error(error);
        }
    } catch (error) {
        console.error("Error in renderTable:", error.message);
    }
}

// ==============================================================================

async function fetchCategory() {
    try {
        const searchQuery = document.getElementById("category-search").value.trim();

        if (!searchQuery) {
            all_data_load_list(); // Reload the full data
            return;
        }

        const payload = {
            modelName: "Category",
            search: searchQuery,
            roles: "",
        };

        const response = await fetch(SEARCH_API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `${TOKEN}`,
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to fetch Category.");
        }

        const result = await response.json();
        renderTable(result.data); // Update table with search results
    } catch (error) {
        console.error("Error fetching Category:", error.message);
    }
}
// ==============================================================================

async function all_data_load_list() {
    try {
        loading_shimmer();
    } catch (error) {
        console.error(error);
    }

    try {
        let tbody = document.getElementById("all_data_list_table");
        tbody.innerHTML = '';
        let row = "";
        const API = `${CATEGORY_API_GETALL}${rtnPaginationParameters()}`;

        const response = await fetch(API, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `${TOKEN}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch data.");
        }

        const r1 = await response.json();
        const data = r1?.data;
        let zz1 = r1?.summary?.totalCategories;

        setTotalDataCount(zz1);
        if (zz1 > 0) {
            let ls1 = localStorage.getItem("roles");
            let bb1 = ls1 !== "Employee";

            try {
                data.forEach((e, i) => {
                    let _id = e?._id || '-';
                    let name = capitalizeFirstLetter(e?.name || '-');
                    let status;

                    if (bb1) {
                        status = `<span class="cursor-pointer badge ${
                            (e?.status || "Inactive").toLowerCase() === "active".toLowerCase()
                                ? "bg-success"
                                : "bg-danger"
                        }" data-bs-toggle="modal" data-bs-target="#modal_EDIT_STATUS" onclick="individual_edit('${_id}')">
                            <i class="ri-pencil-fill"></i> ${capitalizeFirstLetter(e?.status || "Inactive")}
                        </span>`;
                    } else {
                        status = `<span class="badge ${
                            (e?.status || "Inactive").toLowerCase() === "active".toLowerCase()
                                ? "bg-success"
                                : "bg-danger"
                        }"> ${capitalizeFirstLetter(e?.status || "Inactive")}</span>`;
                    }

                    row += `
                        <tr data-id='${_id}' >
                            <td class="employee_restriction_d_none"><input type="checkbox" class="checkbox_child" value='${_id}'></td>
                            <td>${i + 1}</td>
                            <td>${name}</td>
                            <td>${status}</td>
                            <td class="text-end employee_restriction_d_none">
                                <button class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#modal_EDIT" onclick="edit_data_fn('${_id}')">
                                    <i class="ri-pencil-line"></i>
                                </button>
                                <button class="btn btn-sm btn-danger" data-bs-toggle="modal" data-bs-target="#modal_DELETE" onclick="individual_delete('${_id}')">
                                    <i class="ri-delete-bin-2-line"></i>
                                </button>
                            </td>
                        </tr>`;
                });
            } catch (error) {
                row = `<tr><td colspan="4" class="text-center">Got error, please try again later!</td></tr>`;
                console.error("Data not found:", error);
            }
        } else {
            row = `<tr><td colspan="4" class="text-center">Data Not Found.</td></tr>`;
        }

        tbody.innerHTML = row;
        checkbox_function();
    } catch (error) {
        console.error("Error in all_data_load_list:", error.message);
        localStorage.clear();
        window.location.href = 'login.html';
    }

    try {
        start_hidder();
        remove_loading_shimmer();
    } catch (error) {
        console.error(error);
    }
}

document.getElementById("category-search").addEventListener("input", fetchCategory);

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

window.edit_data_fn = async function edit_data_fn(individual_id){
    try{
        loading_shimmer();
    } catch(error){console.log(error)}
    // -----------------------------------------------------------------------------------
    try{
        const API = `${CATEGORY_API_GETSINGLE}?id=${individual_id}`;
        const response = await fetch(API, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${TOKEN}`,
            },
        });
        // -----------------------------------------------------------------------------------
        let r1 = await response.json();
        document.getElementById("edit_id_hidden").value = r1?.category?._id || '-';
        document.getElementById("edit_category_name").value = r1?.category?.name || '-';
        document.getElementById("edit_select_status_cate").value = r1?.category?.status || '-';
    } catch(error){console.log(error)};
    // -----------------------------------------------------------------------------------
    try{
        remove_loading_shimmer();
    } catch(error){console.log(error)}
    
}
// -----------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------
let fff2 = "form_data_edit";
let ffffrom2 = document.getElementById(fff2);
ffffrom2.addEventListener("submit", async function(event){
    event.preventDefault();
    try{
        loading_shimmer();
    } catch(error){console.log(error)}
    try{
        document.querySelectorAll(".btn-close").forEach(e=>e.click());
    } catch(error){console.log(error)}
    // -----------------------------------------------------------------------------------
    try{
        const name = document.getElementById("edit_category_name").value;
        const _id = document.getElementById("edit_id_hidden").value;
        const status = document.getElementById("edit_select_status_cate").value;
        let API = `${CATEGORY_API_UPDATE}`;
        // -----------------------------------------------------------------------------------
        const response = await fetch(API, {
            method : 'POST',
            headers : {
                "Content-Type": "application/json",
                'Authorization': `${TOKEN}`,
            },
            body : JSON.stringify({name, _id, status}),
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
        ffffrom2.reset();
        remove_loading_shimmer();
    } catch(error){console.log(error)}
})
// ==============================================================================
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
        // history.back();
    }
    // -----------------------------------------------------------------------------------
    try{
        remove_loading_shimmer();
    } catch(error){console.log(error)}
});

