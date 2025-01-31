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
import { TOKEN, EMPLOYEE_API_GETALL, EMPLOYEE_API_UPDATE ,SEARCH_API } from './global/apis.js';
// -----------------------------------------------------------------------------
import { start_hidder } from './global/hide_unhide_ROLES.js';
import { status_popup } from './global/status_popup.js';
import { checkbox_function } from './global/checkbox.js';
import { capitalizeFirstLetter } from './global/functions.js';
import { rtnPaginationParameters, setTotalDataCount } from './global/pagination.js';
import { loading_shimmer, remove_loading_shimmer } from './global/loading_shimmer.js';
import {} from './global/exportData.js';
import {} from './global/importData.js';
import {} from './global/sample_file_download.js';
import {} from './global/location_track.js';
// -----------------------------------------------------------------------------
import { individual_delete, objects_data_handler_function } from './global/delete_data.js';
window.individual_delete = individual_delete;
// -----------------------------------------------------------------------------
// ==============================================================================
function renderTable(data) {
    const tbody = document.getElementById("all_data_list_table");

    if (!tbody) {
        console.error("Table body not found.");
        return;
    }

    // Clear the table before rendering new data
    tbody.innerHTML = "";

    if (!data || data.length === 0) {
        tbody.innerHTML = "<tr><td colspan='7' class='text-center'>No data found.</td></tr>";
        return;
    }

    let row = "";

    try {
        let ls1 = localStorage.getItem("roles");
        let bb1 = ls1 !== "Employee";

        data.forEach((e) => {
            let _id = e?._id || "-";
            let name = `${capitalizeFirstLetter(e?.name || "-")} (${e?.userId || "-"})`;
            let email = e?.email || "-";
            let mobile = e?.mobile || "-";
            let department = e?.departments?.name || "-";
            let role = e?.roles || "-";

            let status;
            if (bb1) {
                status = `<span class="cursor-pointer badge ${
                    (e?.status || "Inactive").toLowerCase() === "active".toLowerCase()
                        ? "bg-success"
                        : "bg-danger"
                }" data-bs-toggle="modal" data-bs-target="#modal_EDIT" onclick="individual_edit('${_id}')">
                    <i class="ri-pencil-fill"></i> ${capitalizeFirstLetter(e?.status || "Inactive")}
                </span>`;
            } else {
                status = `<span class="badge ${
                    (e?.status || "Inactive").toLowerCase() === "active".toLowerCase()
                        ? "bg-success"
                        : "bg-danger"
                }">${capitalizeFirstLetter(e?.status || "Inactive")}</span>`;
            }

            row += `
                <tr data-id='${_id}'>
                    <td class="manager_restriction_d_none "><input type="checkbox" class="checkbox_child" value='${_id}'></td>
                    <td>${name}</td>
                    <td>${email}</td>
                    <td>${mobile}</td>
                    <td>${department}</td>
                    <td>${role}</td>
                    <td>${status}</td>
                    <td class="text-end">
                        <a href="view-employee.html?id=${_id}" class="btn btn-sm btn-success"><i class="ri-eye-line"></i></a>
                        <a href="edit-employee.html?id=${_id}" class="btn btn-sm btn-primary manager_restriction_d_none"><i class="ri-pencil-line"></i></a>
                        <button class="btn btn-sm btn-danger manager_restriction_d_none" data-bs-toggle="modal" data-bs-target="#modal_DELETE" onclick="individual_delete('${_id}')">
                            <i class="ri-delete-bin-2-line"></i>
                        </button>
                    </td>
                </tr>`;
        });
    } catch (error) {
        row = `<tr><td colspan="7" class="text-center">Got error, please try again later!</td></tr>`;
        console.error("Data processing error:", error);
    }

    tbody.innerHTML = row;

    try {
        checkbox_function();
        start_hidder();
    } catch (error) {
        console.error(error);
    }
}

async function fetchEmployee() {
    try {
        const searchQuery = document.getElementById("employee-search").value.trim();

        if (!searchQuery) {
            all_data_load_list(); // Reload full data if search query is empty
            return;
        }

        const payload = {
            modelName: "User",
            search: searchQuery,
            roles: ["Employee", "HR", "Manager"], // Array of roles
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
            throw new Error(errorData.message || "Failed to fetch employees.");
        }

        const result = await response.json();
        renderTable(result.data); // Update table with search results
    } catch (error) {
        console.error("Error fetching employees:", error.message);
    }
}

async function all_data_load_list() {
    try {
        loading_shimmer();

        const API = `${EMPLOYEE_API_GETALL}${rtnPaginationParameters()}`;
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
        const data = r1?.employees;
        const zz1 = r1?.totalEmployees;

        if (zz1 > 0) {
            setTotalDataCount(zz1); // Set total count for pagination
        }

        renderTable(data || []); // Render the table with fetched data
    } catch (error) {
        console.error("Error loading all data:", error.message);
        localStorage.clear();
        window.location.href = "login.html";
    } finally {
        try {
            start_hidder();
            remove_loading_shimmer();
        } catch (error) {
            console.error(error);
        }
    }
}

// Add event listener for search input
document.getElementById("employee-search").addEventListener("input", fetchEmployee);

// Load all data on page load
all_data_load_list();
objects_data_handler_function(all_data_load_list);

// -----------------------------------------------------------------------------
 
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
