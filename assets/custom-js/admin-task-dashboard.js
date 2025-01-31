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
import { TOKEN, EMPLOYEE_API_GETALL, PRODUCT_API_GETALL, VISIT_API_CREATE, VISIT_API_GETALL, REMARK_API_CREATE, SEARCH_API, VISIT_API_GETSINGLE, VISIT_API_UPDATE } from './global/apis.js';
// -----------------------------------------------------------------------------
import { status_popup } from './global/status_popup.js';
import { loading_shimmer, remove_loading_shimmer } from './global/loading_shimmer.js';
import { formatDate, formatTime } from './global/functions.js';
import { iFrameRenderFunction, clearIFrameRenderEventListener } from './global/iframe_profile_open.js';
// -----------------------------------------------------------------------------
import { individual_delete, objects_data_handler_function } from './global/delete_div.js';
window.individual_delete = individual_delete;
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// Search button click handler
document.getElementById("searchButton").addEventListener("click", () => {
    const searchType = document.getElementById("searchAll").value;
    const searchQuery = document.getElementById("searchInput").value;
    if (!searchType || !searchQuery) {
      alert("Please select a search type and enter a query.");
      return;
    }
    console.log(`Searching ${searchType} with query: ${searchQuery}`);
    performSearch(searchType, searchQuery);
});


document.getElementById("searchEmployeeDropDown").addEventListener("input", async () => {
    const dropdown = document.getElementById("searchEmployeeDropDown");
    const selectedText = dropdown.options[dropdown.selectedIndex]?.text?.trim(); // Get the full text
  
    if (!selectedText) return;
  
    // Extract just the name or ID
    const employeeName = selectedText.split(" (")[0]; // Extract name before "("
    const employeeId = selectedText.match(/\((.*?)\)/)?.[1]; // Extract ID inside "()"
  
    console.log(`Searching Employee with Name: ${employeeName}, ID: ${employeeId}`);
  
    // You can now decide to search by name or ID:
    // Example: Perform a search using the extracted name
    performSearch("User", employeeName); // Or use `employeeId` based on your requirement
  });
  


  async function performSearch(type, query) {
    try {
      const payload = {
        modelName: type === "Employee" ? "User" : type, // Ensure correct model name
        search: query, // Query passed for searching
        roles: type === "Employee" ? ["Employee"] : undefined, // Roles for filtering employees
      };
  
      console.log("Payload being sent:", payload);
  
      const response = await fetch(SEARCH_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${TOKEN}`, // Ensure TOKEN is defined
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Failed to fetch search results: ${response.statusText}`
        );
      }
  
      const { data } = await response.json();
      console.log("Search results:", data);
  
      displayResults(data); // Function to display results in the UI
    } catch (error) {
      console.error("Error performing search:", error.message);
    //   alert("Error fetching search results. Please try again.");
    }
  }


 // Display results in the table
  function displayResults(data) {
    const resultsTable = document.getElementById("resultsTable").querySelector("tbody");
    resultsTable.innerHTML = "";
  
    if (!data || data.length === 0) {
      resultsTable.innerHTML = "<tr><td colspan='3'>No results found</td></tr>";
      return;
    }
  
    data.forEach((item, index) => {
      const row = document.createElement("tr");
  
      const indexCell = document.createElement("td");
      indexCell.textContent = index + 1;
  
      const nameCell = document.createElement("td");
      nameCell.textContent = item.name || item.title; // Adjust based on API structure
  
      const detailsCell = document.createElement("td");
      detailsCell.textContent = item.details || "N/A"; // Adjust based on API structure
  
      row.appendChild(indexCell);
      row.appendChild(nameCell);
      row.appendChild(detailsCell);
  
      resultsTable.appendChild(row);
    });
  }


async function populateEmployeeDropdown() {
    try {
      const dropdown = document.getElementById("searchEmployeeDropDown");
      dropdown.innerHTML = "<option disabled selected>Select Employee</option>"; // Reset dropdown  

      if (!dropdown) {
        console.error("Dropdown element not found.");
        return;
      }
  
      const payload = {
        modelName: "User", // Correct model name for User
        search: "", // Empty search for fetching all employees
        roles: ["Employee"], // Filter by role
      };
  
      const response = await fetch(SEARCH_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${TOKEN}`, // Ensure TOKEN is valid
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch employees.");
      }
  
      const { data: employees } = await response.json();
  
      employees.forEach((employee) => {
        const option = document.createElement("option");
        option.value = employee._id; // Use actual ID field
        option.textContent = `${employee.name} (${employee.userId})`; // Use actual fields
        dropdown.appendChild(option);
      });
  
      console.log("Employee dropdown populated successfully.");
    } catch (error) {
      console.error("Error fetching employees:", error.message);
    }
  }
  
  
  // Call the function to populate the dropdown on page load
  document.addEventListener("DOMContentLoaded", populateEmployeeDropdown);
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
function normalizeString(str) {
    return str.toLowerCase().replace(/[^\w\s]/g, "").replace(/\s+/g, " ").trim();
}

function areEquivalent(str1, str2) {
    const norm1 = normalizeString(str1);
    const norm2 = normalizeString(str2);
    return norm1 === norm2;
}

// ==============================================================================
// ==============================================================================
// ==============================================================================
try{
    const dateInput = document.getElementById('visitDateEmp');
    const currentDate = new Date().toISOString().split('T')[0];
    dateInput.value = currentDate;
} catch(error){console.log(error)}
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
let cachedDoctor = [];
let cachedEmployee = [];
async function fetchUser() {
    try{
        const API = `${EMPLOYEE_API_GETALL}`;
        // -----------------------------------------------------------------------------------
        const response = await fetch(API,{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `${TOKEN}`,
            },
        });
        // -----------------------------------------------------------------------------------
        const r1 = await response.json();
        cachedDoctor = r1?.doctors;
        cachedEmployee = r1?.employees;
    } catch (error){console.log(error);}
    
    try{
        const selectElement = document.getElementById("selectAssignDoct");
        selectElement.innerHTML = '';
        const dummyOption = document.createElement("option");
        dummyOption.setAttribute("selected","" );
        dummyOption.setAttribute("disabled","" );
        dummyOption.value = '';
        dummyOption.textContent = `Select Doctor`;
        selectElement.appendChild(dummyOption);

        cachedDoctor.forEach((e) => {
            if (e?.status === "Active") {
                const newOption = document.createElement("option");
                newOption.value = e?._id;
                newOption.textContent = `${e?.name || "-"} (${e?.userId || '' })`;
                selectElement.appendChild(newOption);
            }
        });
    } catch(error){console.log(error)}
    try{
        cachedDoctor.forEach((e) => {

            if (e?.status === "Active") {
            const selectElement = document.getElementById("selectAreaDoc");
            const existingOptions = Array.from(selectElement.options);
            const areaValue = e?.area || "-";
        
            const alreadyExists = existingOptions.some((option) => {
                return areEquivalent(areaValue, option.value);
            });
            
            if (!alreadyExists) {
                const newOption = document.createElement("option");
                newOption.value = areaValue;
                newOption.textContent = areaValue;
                selectElement.appendChild(newOption);
            }
            }
        });
    } catch(error){console.log(error)}


    try{
        let a1 = document.getElementById("dropdownContent_my_shivaur_m2");
        let a2 = document.getElementById("dropdownContent_my_shivaur_m4");
        let a3 = document.getElementById("searchEmployeeDropDown");
        cachedEmployee.forEach(e=>{
            if(e?.status=="Active") {
                if(e?.userId.toLowerCase().includes("emp")){
                    let zz2 = document.createElement("div");
                    zz2.classList.add("checkbox-container_my_shivaur_m2");
                    zz2.innerHTML = `
                        <input type="checkbox" value="${e?._id}" class="assignee-checkbox_my_shivaur_m2">
                        <label class="checkbox-label_my_shivaur_m2">${e?.name} (${e?.userId})</label>
                    `;
                    a1.appendChild(zz2);
                } else if(e?.userId.toLowerCase().includes("mmg")){
                    let zz2 = document.createElement("div");
                    zz2.classList.add("checkbox-container_my_shivaur_m4");
                    zz2.innerHTML = `
                        <input type="checkbox" value="${e?._id}" class="assignee-checkbox_my_shivaur_m4">
                        <label class="checkbox-label_my_shivaur_m4">${e?.name} (${e?.userId})</label>
                    `;
                    a2.appendChild(zz2);
                }
                
                if((e?.userId.toLowerCase().includes("emp")) || (e?.userId.toLowerCase().includes("mmg"))){
                    let zz2 = document.createElement("option");
                    zz2.value = e?._id;
                    zz2.textContent = `${e?.name} (${e?.userId})`;
                    a3.appendChild(zz2);
                }
            }
        });
    } catch(error){console.log(error)}
}
fetchUser();
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
document.getElementById("selectAreaDoc").addEventListener("change", function(event) {
    event.target.options[0].textContent = "All Doctors";
    const selectedArea = event.target.value;
    const dropdown = document.getElementById("selectAssignDoct");
    // ------------------------------------------------------------
    dropdown.innerHTML = '';
    const dummyOption = document.createElement("option");
    dummyOption.setAttribute("selected","" );
    dummyOption.setAttribute("disabled","" );
    dummyOption.value = '';
    dummyOption.textContent = `Select Doctor (Visit)`;
    dropdown.appendChild(dummyOption);
    // ------------------------------------------------------------
    if (areEquivalent(selectedArea, "all")) {
        cachedDoctor.forEach((doc) => {
            if (doc?.status === "Active") {
                const newOption = document.createElement("option");
                newOption.value = doc?._id;
                newOption.textContent = `${doc?.name || "-"} (${doc?.userId || '' })`;
                dropdown.appendChild(newOption);
            }
        });
    } else {
        cachedDoctor.forEach((doc) => {
            if (doc?.status === "Active" && areEquivalent(doc?.area, selectedArea)) {                
                const newOption = document.createElement("option");
                newOption.value = doc?._id;
                newOption.textContent = `${doc?.name || "-"} (${doc?.userId || '' })`;
                dropdown.appendChild(newOption);
            }
        });
    }
});
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
let cachedProduct = [];
async function fetchProduct(){
    try{
        const API = `${PRODUCT_API_GETALL}`;
        // -----------------------------------------------------------------------------------
        const response = await fetch(API,{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `${TOKEN}`,
            },
        });
        const r1 = await response.json();        
        cachedProduct = r1?.data;
    } catch(error){console.log(error)}
    try{
        let a1 = document.getElementById("dropdownContent_my_shivaur_m");
        cachedProduct.forEach(e=>{
            let zz2 = document.createElement("div");
            zz2.classList.add("checkbox-container_my_shivaur_m");
            zz2.innerHTML = `
                <input type="checkbox" value="${e?._id}" class="assignee-checkbox_my_shivaur_m">
                <label class="checkbox-label_my_shivaur_m">${e?.name}</label>
            `;
            a1.appendChild(zz2);
        });
    } catch (error){console.log(error)}
}
fetchProduct();
// ==============================================================================
// ==============================================================================
let fff1 = "doctor_visit_create_form";
let fffform1 = document.getElementById(fff1)
fffform1.addEventListener("submit", async function(event) {
    event.preventDefault();
    try {
        loading_shimmer();
    } catch(error){console.log(error)}
    // -----------------------------------------------------------------------------------
    try {
        let visitDoctor = [document.getElementById("selectAssignDoct").value];
        let visitWorkingWith = document.getElementById("workingWithEmp").value;
        let visitDate = document.getElementById("visitDateEmp").value;
        let visitType = "Doctor";

        let visitProduct = [];    
        Array.from(document.getElementById("selectedAssignees_my_shivaur_m").children).forEach((e)=>{
            visitProduct.push(e.getAttribute('value'))
        });

        let assignedTo = [];
        ["selectedAssignees_my_shivaur_m2","selectedAssignees_my_shivaur_m4"].forEach(element => {
            Array.from(document.getElementById(element).children).forEach((e)=>{
                assignedTo.push(e.getAttribute('value'))
            });
        });
        if(visitWorkingWith!='Director'){
            assignedTo.push(localStorage.getItem("_id"));
        }
        // -----------------------------------------------------------------------------------
        let API = `${VISIT_API_CREATE}`;
        // -----------------------------------------------------------------------------------
        const response = await fetch(API, {
            method : 'POST',
            headers : {
                "Content-Type": "application/json",
                'Authorization': `${TOKEN}`,
            },
            body : JSON.stringify({visitDoctor, assignedTo, visitWorkingWith, visitDate, visitProduct, visitType}),
        });
        // -----------------------------------------------------------------------------------
        let r1 = await response?.json();
        
        status_popup(r1?.message, response?.ok);
        if(response?.ok){
            all_data_load_list();
        }
    } catch(error){
        console.log(error)
        // history.back();
    }
    // ----------------------------------------------------------------------------------------------------
    try{
        fffform1.reset();
        // document.getElementById("selectedAssignees_my_shivaur_m").innerHTML = '';
        remove_loading_shimmer();
    } catch(error){console.log(error)}
    try{
        ["selectedAssignees_my_shivaur_m2","selectedAssignees_my_shivaur_m4","selectedAssignees_my_shivaur_m"].forEach(element=>document.getElementById(element).innerHTML = '');
        ["assignee-checkbox_my_shivaur_m","assignee-checkbox_my_shivaur_m2","assignee-checkbox_my_shivaur_m4"].forEach(element => {Array.from(document.querySelectorAll(`.${element}`)).forEach(e=> e.removeAttribute("disabled"))});
    } catch(error){console.log(error)}
});
// ==============================================================================
// ==============================================================================


async function all_data_load_list(){
    try{
        loading_shimmer();
    } catch(error){console.log(error)}
    // -----------------------------------------------------------------------------------
    const vstFomCrd = document.getElementById("dynamic_emp_visit_render");
    vstFomCrd.innerHTML = '';
    // -----------------------------------------------------------------------------------
    try{
        let API = `${VISIT_API_GETALL}`;
        // -----------------------------------------------------------------------------------
        const response = await fetch(API, {
            method : 'GET',
            headers : {
                "Content-Type": "application/json",
                'Authorization': `${TOKEN}`,
            }
        });
        // -----------------------------------------------------------------------------------
        let r1 = await response.json();
        // console.log("r1 :- ",r1);
        let data = r1?.DoctorCreatedDate;
        // console.log("this is date :- ",data)

        if ( data!={} || data!={'':''} || data || data!='' || data!=null) {
            let oneTimeRunOnly = true;

            Object.entries(data).forEach(([date, visits], index) => {
                let temp1='';
                visits.forEach((visit, v_index) => {
                    let temp2='';
                    visit?.products.forEach(e=>{
                        temp2+=`<small class="badge rounded-pill bg-primary fw-noraml" style="margin-right:3px !important;">${e.name}</small>`;
                    });

                    let rmk = visit?.remark || 0;

                    temp1 += `
                        <div class="col-md-4"  data-id='${visit?._id}' >
                            <input type="checkbox" class="checkbox_child d-none hidden" style="display:none;" value='${visit?._id}' hidden> 
                            <div class="card shadow-sm">
                                <div class="card-header">
                                    <p class="fw-bold text-dark pb-0 mb-1 d-flex justify-content-between">
                                        <span class=" cursor-pointer" data-bs-toggle="modal" data-bs-target="#modal_I_FRAME" created-by="./view-doctor.html?id=${visit?.visitDoctor?._id}" >${visit?.visitDoctor?.name}</span>

                                        <span ${(visit?.countVisitFrequency == visit?.visitDoctor?.visitFrequency) ? `onclick="visitCompletedMarkFunction('${visit?._id}')"  data-bs-toggle="modal" data-bs-target="#modal_COMPLETE_VISIT"` : ` onclick="setNewDateScheduleFunction('${visit?._id}')" data-bs-toggle="modal" data-bs-target="#modal_EDIT_STATUS_FREQUENCY" `} class="${((visit?.status || "Pending" )=="Pending")? 'bg-warning' : 'bg-success'} text-white cursor-pointer " style="border-radius: 61px; font-size: 10px !important; height: 15px; width: 15px; " ></span>
                                    </p>
                                    <p class="m-0 mb-1 pt-0 small remark-three-dot-css-design"><b>Address</b> :- ${visit?.visitDoctor?.area}</p>

                                    <div class="remark-three-dot-css-design mb-1">
                                        <small title="Total Number Of Frequency" class="badge rounded-pill ${((visit?.status || "Pending" )=="Pending")? 'bg-warning text-dark' : 'bg-success text-light'} fw-noraml">${visit?.countVisitFrequency}<b> / </b>${visit?.visitDoctor?.visitFrequency}</small>
                                        ${((rmk.length<=0) && (visit?.createdBy?._id == localStorage.getItem("_id"))) ? `<small class="badge rounded-pill bg-danger fw-noraml cursor-pointer" data-bs-toggle="modal" data-bs-target="#modal_DELETE" onclick="individual_delete('${visit?._id}')" ><i class="bi bi-trash"></i></small>` : ``}
                                        <small class="badge rounded-pill bg-success fw-noraml">${visit?.visitWorkingWith}</small>
                                        ${temp2}
                                    </div>

                                    <hr class="mb-1 mt-3" >
                                    
                                    <p class="mt-0 mb-2 pt-0 small remark-three-dot-css-design">
                                        <b>Scheduled Date</b> :- <span class="">${visit?.visitDate || 'Select Next Visit Date'}</span>
                                        <br>
                                        <b>Assigned To</b> :- ${visit?.assignedTo.map(e=> `
                                                                <span class="cursor-pointer" data-bs-toggle="modal" data-bs-target="#modal_I_FRAME" created-by="./view-employee.html?id=${e?._id}" >${e.name}</span> 
                                                            `)}
                                    </p>
                                    <hr class="mb-3 mt-2" >
                                    
                                    <div class="mb-1 d-flex gap-2">
                                        <button class="btn w-100 btn-outline-secondary " type="button"  onclick="getSingleVisitDetailsFunction('${visit?._id}')"  data-bs-toggle="modal" data-bs-target="#modal_VISIT_DETAILS"  ><i class="bi bi-calendar-event me-1"></i> View All Details</button>
                                        <button type="button" class="w-100  ${((visit?.status || "Pending" )=="Pending")? 'btn-warning' : 'btn-success'}  btn-sm  border-0 px-2 " onclick="getSingleVisitFunction('${visit?._id}')"  data-bs-toggle="modal" data-bs-target="#modal_CHAT_BOX"  ><i class="ri-chat-2-line"></i> Check Remarks</button>
                                    </div>
                                            
                                    <div class="mb-1 d-flex gap-2">
                                        ${(visit?.countVisitFrequency == visit?.visitDoctor?.visitFrequency) ? `<button type="button" class="btn btn-outline-secondary w-100 ${visit?.status=="Success" ? 'd-none' : ''} " id="completeVisitBtn" onclick="visitCompletedMarkFunction('${visit?._id}')"    data-bs-toggle="modal" data-bs-target="#modal_COMPLETE_VISIT" ><i class="ri-bar-chart-fill"></i> Update Vist's Status</button>` : `${((visit?.visitDate ) ==  null )? `<button class="btn w-100 btn-outline-secondary " type="button" onclick="setNewDateScheduleFunction('${visit?._id}')" data-bs-toggle="modal" data-bs-target="#modal_NEXT_VISIT" >Schedule New Visit's Date</button>` : `<button class="btn w-100 btn-outline-secondary " type="button" onclick="setNewDateScheduleFunction('${visit?._id}')" data-bs-toggle="modal" data-bs-target="#modal_EDIT_STATUS_FREQUENCY" >Frequency Complete</button>`}`}
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                });

                // <i class="bi bi-pencil-fill float-end  px-2 cursor-pointer" data-bs-toggle="modal" data-bs-target="#modal_ALL_FREQUENCY_ON_ONE_CLICK"  onclick="allFreqOnOneClick('task${index}')"  ></i>

                let zzz1 = document.createElement("div");
                zzz1.classList.add("accordion","border","rounded","mb-1");
                zzz1.id = "accordionExample";
                zzz1.innerHTML += `
                    <div class="accordion-item border-0">
                        <div class="small bg-custom-primary p-3  ${oneTimeRunOnly ? '' : 'collapsed'} d-flex justify-content-between align-items-center" data-bs-toggle="collapse" data-bs-target="#task${index}" aria-expanded="  ${oneTimeRunOnly ? 'true' : 'false'}">
                            <b>${date}</b>
                            <button class="btn btn-warning " type="button" onclick="allFreqOnOneClick('task${index}')" data-bs-toggle="modal" data-bs-target="#modal_ALL_FREQUENCY_ON_ONE_CLICK">Submit All Frequency</button>
                        </div>
                    </div>
                    <div id="task${index}" class="accordion-collapse border-0 collapse  ${oneTimeRunOnly ? 'show' : ''}" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                        <div class="accordion-body">
                            <div class="row">${temp1}</div>
                        </div>
                    </div>
                `;
                vstFomCrd.appendChild(zzz1);

                oneTimeRunOnly = false;
            });
        } else {
            vstFomCrd.innerHTML = '<p class="text-center">Data not present</p>';
        }

    } catch(error){
        vstFomCrd.innerHTML = '<p class="text-center">Data not present</p>';
        console.log(error);
    }
    // ----------------------------------------------------------------------------------------------------
    try{
        remove_loading_shimmer();
        remarkFormDateLoadNew();
        iFrameRenderFunction();
    } catch(error){console.log(error)}
}
all_data_load_list();
objects_data_handler_function(all_data_load_list);
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
window.allFreqOnOneClick = function(iddd){
    document.getElementById("_hidden_id_of_date_selected").value = iddd;
}
// ==============================================================================
document.getElementById("all_edit_all_status_frequency").addEventListener("submit", async function(event){
    event.preventDefault();
    let iddd = document.getElementById("_hidden_id_of_date_selected").value;

    let allDataId =  (document.getElementById(iddd)).querySelectorAll("[data-id]");
    let arrIdvisit = [];
    for(let i = 0; i < allDataId.length; i++){
        arrIdvisit.push( allDataId[i].getAttribute("data-id") );
    }
    let allApiData = [];
    for(let i = 0; i < arrIdvisit.length; i++){
        let abz1 = fetch(`${VISIT_API_UPDATE}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${TOKEN}`,
            },
            body : JSON.stringify({
                '_id' : arrIdvisit[i],
                'frequencyStatus' : 'Complete',
            }),
        });
        allApiData.push(abz1);
    }
    await Promise.all(allApiData);
    all_data_load_list();
})

// ==============================================================================
// ==============================================================================
window.getSingleVisitDetailsFunction = async function getSingleVisitDetailsFunction(_id){
    try{
        loading_shimmer();
    } catch(error){console.log(error)}
    // -----------------------------------------------------------------------------------
    try{
        let API = `${VISIT_API_GETSINGLE}?_id=${_id}`;
        // -----------------------------------------------------------------------------------
        const response = await fetch(API,{
            method : 'GET',
            headers : {
                "Content-Type": "application/json",
                'Authorization': `${TOKEN}`,
            }
        });

        let r2 =( await response?.json())?.visit;

        let {assignedTo, createdAt, createdBy, status, updatedAt, visitDate, visitDoctor, visitProduct, visitType, visitWorkingWith, multiDateFrequencyArray} = r2;

        console.log("r2 :- ",r2);

        try{
            try{
                let classListChangeHeaderModal = document.getElementById("classListChangeHeaderModal");
                classListChangeHeaderModal.classList.remove( (((status || "Pending" )=="Pending")? 'bg-success' : 'bg-warning'),  (((status || "Pending" )=="Pending")? 'text-light' : 'text-dark'));
                classListChangeHeaderModal.classList.add( (((status || "Pending" )=="Pending")? 'bg-warning' : 'bg-success'),  (((status || "Pending" )=="Pending")? 'text-dark' : 'text-light'));
            } catch(error){console.log(error)}


            let singleVisitModelBody = document.getElementById("singleVisitModelBody");
            singleVisitModelBody.innerHTML = null;

            let childDivCard = document.createElement("div");
            childDivCard.classList.add("card", "mb-0");

            let t1_temp1 = ``;
            visitProduct.map((e,i)=>
                t1_temp1 += `<small class="badge rounded-pill bg-primary me-1"><i class="ri-capsule-fill"></i> ${e.name}</small>`
            );

            let t1_temp4 = ``;
            if ((assignedTo.length==1) && (assignedTo[0]._id==createdBy?._id)) {
                let t1_temp3 = ``;
                assignedTo.map(e=>t1_temp3+=`<span class="cursor-pointer" data-bs-toggle="modal" data-bs-target="#modal_I_FRAME" created-by="./view-employee.html?id=${e?._id}" id="modalCreatedBy">${e?.name} (<small><i>${e?.roles}</i></small>)</span>, `);
                
                t1_temp4 = `
                    <p class=" m-0 p-0 mb-2">
                        <strong>Created By & Assigned To:</strong> ${t1_temp3}
                    </p>
                `;
            } else {
                let t1_temp2 = ``;
                if(createdBy._id==localStorage.getItem("_id")){
                    t1_temp2 = `This Visit Is Created By You.`;
                } else {
                    t1_temp2 = `<span class="cursor-pointer" data-bs-toggle="modal" data-bs-target="#modal_I_FRAME" created-by="./view-employee.html?id=${createdBy?._id}" id="modalCreatedBy">${createdBy?.name} (<small><i>${createdBy?.roles}</i></small>)</span>`;
                }
                let t1_temp3 = ``;
                assignedTo.map(e=>t1_temp3+=`<span class="cursor-pointer" data-bs-toggle="modal" data-bs-target="#modal_I_FRAME" created-by="./view-employee.html?id=${e?._id}" id="modalCreatedBy">${e?.name} (<small><i>${e?.roles}</i></small>)</span>, `);
                
                t1_temp4 = `
                    <p class=" m-0 p-0 mb-1">
                        <strong>Created By:</strong> ${t1_temp2}
                    </p>
                    <p class=" m-0 p-0">
                        <strong>Assigned To:</strong> ${t1_temp3}
                    </p>
                `;
            }

            let t1_temp5 = '';
            multiDateFrequencyArray.forEach((e,i)=>{
                t1_temp5 += `
                    <div class="col-md-6">
                        <span>${i+1}). ${e}</span>
                    </div>
                `;
            })


            const [tempCreateDate, tempCreateTime] = createdAt.split(" ");

            let t1 = `
                <div class="card-header">
                    <p class="fw-bold text-dark pb-0 mb-0 mb-2 d-flex justify-content-between">
                        <span id="modalVisitName" class="fs-5 cursor-pointer" data-bs-toggle="modal" data-bs-target="#modal_I_FRAME" created-by="./view-doctor.html?id=${visitDoctor?._id}" >${visitDoctor?.name}</span>
                        <span id="modalVisitStatus" class="badge cursor-pointer ${((status || "Pending" )=="Pending")? 'bg-warning text-dark' : 'bg-success text-light'}   px-2 badge-status"  onclick="visitCompletedMarkFunction('${r2?._id}')" data-bs-toggle="modal" data-bs-target="#modal_COMPLETE_VISIT" style="border-radius: 50px; font-size: 0.75rem; height: 100%;">${status}</span>
                    </p>
                    <p class="mt-0 mb-0 pt-0 mb-2 small"><strong class="text-dark">Address:</strong> <span id="modalVisitAddress">${visitDoctor?.area}</span></p>
                    <div class="mb-2">
                        <small title="Total Number Of Frequency" class="badge rounded-pill ${((r2?.status || "Pending" )=="Pending")? 'bg-warning text-dark' : 'bg-success text-light'} fw-noraml">${r2?.countVisitFrequency}<b> / </b>${r2?.visitDoctor?.visitFrequency}</small>
                        ${((r2?.remark.length==0) && (r2?.createdBy?._id == localStorage.getItem("_id"))) ? `<small class="badge rounded-pill bg-danger fw-noraml" data-bs-toggle="modal" data-bs-target="#modal_DELETE" onclick="individual_delete('${r2?._id}')" ><i class="bi bi-trash"></i></small>` : ``}
                        <small class="badge rounded-pill bg-success"><i class="bi ${assignedTo.length>1 ? 'bi-people' : 'bi-person' } "></i> ${visitWorkingWith}</small>
                        ${t1_temp1}
                    </div>
                    <hr class="my-2 mt-3">
                    <div>${t1_temp4}</div>
                    <hr class="mt-2 mb-2">
                    <div>
                        <p class="small d-flex justify-content-between m-0 p-0 mb-1">
                            <span><strong>Visit Scheduled Date:</strong> <span id="modalVisitDate">${formatDate(visitDate || "Please Select Next Visit Date To Complete The Frequency" ) || "Please Select Next Visit Date To Complete The Frequency"}</span></span>
                        </p>
                        
                        <p class="small d-flex justify-content-between m-0 p-0">
                            <span><strong>Visit Created Date:</strong> <span id="modalVisitDate">${formatDate(tempCreateDate)} at ${formatTime(tempCreateTime)}</span></span>
                        </p>
                    </div>

                    <hr class="my-2">
                    <div class="row">
                        <div class="col-md-12" ><span><b>All Visit's Frequency Dates</b> (${(r2?.countVisitFrequency == r2?.visitDoctor?.visitFrequency) ? `This visit is completed` : `${r2?.countVisitFrequency} visit<small>(</small>s<small>)</small> completed out of ${r2?.visitDoctor?.visitFrequency} visits.`}) <b>:</b></span></div>
                        ${t1_temp5}
                    </div>

                    <hr class="my-2">
                    <div class="row mt-3">
                        <div class="col-md-6">
                            <button type="button" class="btn btn-sm btn-outline-secondary w-100" id="completeVisitBtn" onclick="visitCompletedMarkFunction('${r2?._id}')"    data-bs-toggle="modal" data-bs-target="#modal_COMPLETE_VISIT" ><i class="ri-bar-chart-fill"></i> Update Status</button>
                        </div>
                        <div class="col-md-6">
                            <button type="button" class="btn btn-sm  ${((status || "Pending" )=="Pending")? 'bg-warning text-dark' : 'bg-success text-light'} w-100" id="checkRemarksBtn" onclick="getSingleVisitFunction('${r2?._id}')"  data-bs-toggle="modal" data-bs-target="#modal_CHAT_BOX"><i class="ri-ball-pen-line"></i> Check Remarks</button>
                        </div>
                    </div>
                </div>
            `;
            childDivCard.innerHTML = `${t1}`;
            singleVisitModelBody.appendChild(childDivCard);

        } catch(error){
            console.log(error)
        }

    } catch(error){console.log(error)}
    // -----------------------------------------------------------------------------------
    try{
        remove_loading_shimmer();
        iFrameRenderFunction();
    } catch(error){console.log(error)}
}

// ==============================================================================
// ==============================================================================
function remarkFormDateLoadNew(){
    try{
        let arr1 = Array.from(document.querySelectorAll(".remark_form_user_new"))
        arr1.map(e=>{
            e.addEventListener("submit", async function(event){
                event.preventDefault();
                try{
                    loading_shimmer();
                } catch(error){console.log(error)}
                // -----------------------------------------------------------------------------------
                try{
                    let visitId = event.target.getAttribute("form-id");
                    let remarkText = event.target.querySelector("textarea").value;
                    let remarkDate = event.target.querySelector("input[type='date']").value;
                    let remarkTime = event.target.querySelector("input[type='time']").value;
                    
                    let API = `${REMARK_API_CREATE}`;
                    // -----------------------------------------------------------------------------------
                    const response = await fetch(API, {
                        method : 'POST',
                        headers : {
                            "Content-Type": "application/json",
                            'Authorization': `${TOKEN}`,
                        },
                        body : JSON.stringify({visitId, remarkText, remarkDate, remarkTime}),
                    });
                    // -----------------------------------------------------------------------------------
                    let r1 = await response?.json();              
                    status_popup(r1?.message, response?.ok);
                    if(response?.ok){
                        all_data_load_list();
                    }
                } catch(error){console.log(error)}
                // ----------------------------------------------------------------------------------------------------
                try{
                    remove_loading_shimmer();
                } catch(error){console.log(error)}
            })
        })
    } catch(error){console.log(error)}
}
// ==============================================================================
// ==============================================================================
window.getSingleVisitFunction = async function getSingleVisitFunction(_id){
    try{
        loading_shimmer();
    } catch(error){console.log(error)}
    // -----------------------------------------------------------------------------------
    try{
        let sending__id_rmk_check = localStorage.getItem("_id");
        let role_current_User = localStorage.getItem("roles");

        let API = `${VISIT_API_GETSINGLE}?_id=${_id}`;
        // -----------------------------------------------------------------------------------
        const response = await fetch(API,{
            method : 'GET',
            headers : {
                "Content-Type": "application/json",
                'Authorization': `${TOKEN}`,
            }
        });

        let r2 = (await response?.json())?.visit;
        let rmk = r2?.remark;

        let remark_box_display = document.getElementById("remark_box_display");
        remark_box_display.innerHTML =``;

        rmk.map(e=>{
            let data = {
                remarkText: e?.remarkText,
                photo: e?.createdBy?.image || 'https://via.placeholder.com/40',
                createdByRole: e?.createdBy?._id === sending__id_rmk_check ? "You" : e?.createdBy?.roles,
                createdById: e?.createdBy?._id,
                remarkDate: e?.remarkDate,
                remarkTime: e?.remarkTime
            };
            let cc1 = ( (e?.createdBy?._id==sending__id_rmk_check)? sentMessageDesign(data) : recivedMessageDesign(data) );
            remark_box_display.appendChild(cc1);
        });

        
        if(r2?.status=='Pending'){
            if(rmk.length<=2){
                all_data_load_list();
            }
            document.getElementById("statusReviewBtnFormModel").classList.add("d-none");
            
            let last_rmk = rmk[rmk.length-1]?.createdBy?._id;
            if((last_rmk != sending__id_rmk_check) || (role_current_User!="Employee") ){
                document.getElementById("waitReviewBtnFormModel").classList.add("d-none");

                let rmk_form = document.getElementById("sendReviewBtnFormModel");
                rmk_form.classList.remove("d-none");
                rmk_form.setAttribute("visit_id_form",`${r2?._id}`);

            } else {

                document.getElementById("waitReviewBtnFormModel").classList.remove("d-none");
                document.getElementById("sendReviewBtnFormModel").classList.add("d-none");
            }
        } else {    
            document.getElementById("statusReviewBtnFormModel").classList.remove("d-none");
            document.getElementById("sendReviewBtnFormModel").classList.add("d-none");
        }
        remark_box_display.parentElement.style.scrollBehavior = "smooth";
        remark_box_display.parentElement.scrollTop = remark_box_display.parentElement.scrollHeight;
    } catch(error){console.log(error)}
    // -----------------------------------------------------------------------------------
    try{
        remove_loading_shimmer();
        iFrameRenderFunction();
    } catch(error){console.log(error)}
}
// ==============================================================================
function sentMessageDesign({ remarkText, photo, createdByRole, createdById, remarkDate, remarkTime}){
    let d1 = document.createElement("div");
    d1.classList.add("d-flex", "justify-content-end", "align-items-start", "mb-4");
    d1.innerHTML= `
        <div class="d-flex flex-column align-items-end position-relative">
            <div class="p-3 bg-primary text-white rounded-start rounded-end shadow-sm" style="min-width: 85%;">${remarkText}</div>
            <div class="text-muted small mt-1 text-end">${formatDate(remarkDate)}, ${formatTime(remarkTime)}</div>
        </div>
        <div class="d-flex flex-column align-items-center ms-2"  data-bs-toggle="modal" data-bs-target="#modal_I_FRAME" created-by="./view-employee.html?id=${createdById}" >
            <img src="${photo}" alt="Profile" class="rounded-circle border border-primary" style="width: 40px; height: 40px;" created-by="./view-employee.html?id=${createdById}" />
            <span class="text-muted small mt-1" created-by="./view-employee.html?id=${createdById}" >${createdByRole}</span>
        </div>
    `;
    return d1;
}
function recivedMessageDesign({ remarkText, photo, createdByRole, createdById, remarkDate, remarkTime}){
    let d1 = document.createElement("div");
    d1.classList.add("d-flex", "align-items-start", "mb-4");
    d1.innerHTML= `
        <div class="d-flex flex-column align-items-center me-2"  data-bs-toggle="modal" data-bs-target="#modal_I_FRAME" created-by="./view-employee.html?id=${createdById}" >
            <img src="${photo}" alt="Profile" class="rounded-circle border border-primary" style="width: 40px; height: 40px;" created-by="./view-employee.html?id=${createdById}" />
            <span class="text-muted small mt-1" created-by="./view-employee.html?id=${createdById}" >${createdByRole}</span>
        </div>
        <div>
            <div class="p-3 bg-secondary text-white rounded-start rounded-end shadow-sm" style="max-width: 85%;">${remarkText}</div>
            <div class="text-muted small mt-1">${formatDate(remarkDate)}, ${formatTime(remarkTime)}</div>
        </div>
    `;
    return d1;
}
// ==============================================================================
// ==============================================================================
let rmk_form_evt_lsnr = document.getElementById("sendReviewBtnFormModel")
rmk_form_evt_lsnr.addEventListener("submit", async function(event){
    event.preventDefault();
    let visitId = rmk_form_evt_lsnr.getAttribute("visit_id_form");
    let remarkText = rmk_form_evt_lsnr.querySelector("input").value.trim();
    if(remarkText==''){
        return;
    }
    try{
        let API = `${REMARK_API_CREATE}`;
        // -----------------------------------------------------------------------------------
        const response = await fetch(API, {
            method : 'POST',
            headers : {
                "Content-Type": "application/json",
                'Authorization': `${TOKEN}`,
            },
            body : JSON.stringify({visitId, remarkText}),
        });
        // -----------------------------------------------------------------------------------
        let r1 = await response?.json();              
        status_popup(r1?.message, response?.ok);
        rmk_form_evt_lsnr.reset();
        if(response?.ok){
            await getSingleVisitFunction(visitId);
        }

    } catch(error){console.log(error)}
})
// ==============================================================================
// ==============================================================================
window.visitCompletedMarkFunction = function visitCompletedMarkFunction(_id){
    document.getElementById("_id_visit_status_hidden").value = _id;
    console.log("id :- ",_id)
}
document.getElementById("edit_status").addEventListener("submit", async function(event){
    event.preventDefault();
    try{
        loading_shimmer();
        Array.from(document.querySelectorAll(".btn-close")).map(e=>e.click());
    } catch(error){console.log(error)}
    // -----------------------------------------------------------------------------------
    try{
        let _id = document.getElementById("_id_visit_status_hidden").value;
        const clickedButton = event.submitter;

        let status;
        if (clickedButton.classList.contains("btn-secondary")) {
            status = "Pending";
        } else if (clickedButton.classList.contains("btn-primary")) {
            status = "Success";
        }
        // -----------------------------------------------------------------------------------
        let API = `${VISIT_API_UPDATE}`;
        // -----------------------------------------------------------------------------------
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
        if(response?.ok){
            all_data_load_list();
            console.log("this is done brother");
        }
    } catch(error){
        console.log(error);
    }
    // -----------------------------------------------------------------------------------
    try{
        remove_loading_shimmer();
    } catch(error){console.log(error)}

});
// ==============================================================================
// ==============================================================================
window.setNewDateScheduleFunction = function setNewDateScheduleFunction(visitId){
    document.getElementById("_id_schedule_date_hidden").value = visitId;
    document.getElementById("_hidden_id_model").value = visitId;
}
const nextVisitFormDate = document.getElementById("NEXT_VISIT_FORM_DATE");
nextVisitFormDate.addEventListener("submit", async function(event){
    event.preventDefault();
    try{
        loading_shimmer();
        Array.from(document.querySelectorAll(".btn-close")).map(e=>e.click());
    } catch(error){console.log(error)}
    // -----------------------------------------------------------------------------------
    try{
        let _id = document.getElementById("_id_schedule_date_hidden").value;
        let visitDate = event.target.querySelector("input[type='date']").value;
        let API = `${VISIT_API_UPDATE}`;
        // -----------------------------------------------------------------------------------
        const response = await fetch(API, {
            method : 'POST',
            headers : {
                "Content-Type": "application/json",
                'Authorization': `${TOKEN}`,
            },
            body : JSON.stringify({_id, visitDate}),
        });
        // -----------------------------------------------------------------------------------
        let r1 = await response?.json();
        
        status_popup(r1?.message, response?.ok);
        if(response?.ok){
            all_data_load_list();
        }
    } catch(error){
        console.log(error);
    }
    // -----------------------------------------------------------------------------------
    try{
        remove_loading_shimmer();
    } catch(error){console.log(error)}

})
// ==============================================================================
// ==============================================================================
document.getElementById("edit_status_frequency").addEventListener("submit", async function(event) {
    event.preventDefault();
    try{
        loading_shimmer();
    } catch(error){console.log(error)}
    // -----------------------------------------------------------------------------------

    const _id = document.getElementById("_hidden_id_model").value;
    const clickedButton = event.submitter;

    let frequencyStatus;
    if (clickedButton.classList.contains("btn-secondary")) {
        frequencyStatus = "In Complete";
    } else if (clickedButton.classList.contains("btn-primary")) {
        frequencyStatus = "Complete";
    }

    try{
        let API = `${VISIT_API_UPDATE}`;
        const response = await fetch(API, {
            method : 'POST',
            headers : {
                "Content-Type": "application/json",
                'Authorization': `${TOKEN}`,
            },
            body : JSON.stringify({_id, frequencyStatus}),
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






// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
window.toggleDropdown_my_shivaur_m = function assignee_drop_down_checkbox() {
    // --------------------
    // --------------------
    // this is for product
    // --------------------
    // --------------------
            
    const dropdownContent_my_shivaur_m = document.getElementById("dropdownContent_my_shivaur_m");
    const selectedAssignees_my_shivaur_m = document.getElementById("selectedAssignees_my_shivaur_m");
    const checkboxes_my_shivaur_m = document.querySelectorAll(".assignee-checkbox_my_shivaur_m");
  
    // Function to toggle dropdown visibility
    // window.toggleDropdown_my_shivaur_m = function toggleDropdown_my_shivaur_m() {
      dropdownContent_my_shivaur_m.classList.toggle("show_my_shivaur_m");
    // }
  
    // Close dropdown if clicked outside
    window.addEventListener("click", function (event) {
      if (!event.target.matches('.dropdown-btn_my_shivaur_m')) {
        dropdownContent_my_shivaur_m.classList.remove("show_my_shivaur_m");
      }
    });
  
    // Function to update selected assignees display
    function updateSelectedAssignees_my_shivaur_m() {
        // Clear the display area
        selectedAssignees_my_shivaur_m.innerHTML = "";
    
        // Loop through each checkbox and add selected ones to display
        checkboxes_my_shivaur_m.forEach((checkbox) => {
            if (checkbox.checked) {
            const label = checkbox.nextElementSibling.textContent; // Get the label text
            const tag = document.createElement("span");
            tag.classList.add("tag_my_shivaur_m");
            tag.textContent = label; // Display the label text
            tag.setAttribute("value", checkbox.value);
            selectedAssignees_my_shivaur_m.appendChild(tag);
            }
        });
        document.getElementsByClassName("dropdown-btn_my_shivaur_m")[0].click();
    }
  
    // Attach event listeners to all checkboxes for selection
    checkboxes_my_shivaur_m.forEach((checkbox) => {
      checkbox.addEventListener("change", updateSelectedAssignees_my_shivaur_m);
    });
}

window.toggleDropdown_my_shivaur_m2 = function assignee_drop_down_checkbox2() {
    // --------------------
    // this is for EMPLOYEE
    // --------------------
        
    const dropdownContent_my_shivaur_m = document.getElementById("dropdownContent_my_shivaur_m2");
    const selectedAssignees_my_shivaur_m = document.getElementById("selectedAssignees_my_shivaur_m2");
    const checkboxes_my_shivaur_m = document.querySelectorAll(".assignee-checkbox_my_shivaur_m2");

    // window.toggleDropdown_my_shivaur_m2 = function toggleDropdown_my_shivaur_m2() {
        dropdownContent_my_shivaur_m.classList.toggle("show_my_shivaur_m2");
    // }
    
    window.addEventListener("click", function (event) {
        if (!event.target.matches('.dropdown-btn_my_shivaur_m2')) {
            dropdownContent_my_shivaur_m.classList.remove("show_my_shivaur_m2");
        }
    });

    function updateSelectedAssignees_my_shivaur_m() {
        selectedAssignees_my_shivaur_m.innerHTML = "";
    
        // Loop through each checkbox and add selected ones to display
        checkboxes_my_shivaur_m.forEach((checkbox) => {
            if (checkbox.checked) {
                const label = checkbox.nextElementSibling.textContent; // Get the label text
                const tag = document.createElement("span");
                tag.classList.add("tag_my_shivaur_m2");
                tag.textContent = label; // Display the label text
                tag.setAttribute("value", checkbox.value);
                selectedAssignees_my_shivaur_m.appendChild(tag);
            }
        });
        document.getElementsByClassName("dropdown-btn_my_shivaur_m2")[0].click();
    }
    
    checkboxes_my_shivaur_m.forEach((checkbox) => {
        checkbox.addEventListener("change", updateSelectedAssignees_my_shivaur_m);
    });
}

/* ========================================================= */

window.toggleDropdown_my_shivaur_m4 = function assignee_drop_down_checkbox4() {
    // --------------------
    // this is for MANAGER
    // --------------------
            
    const dropdownContent_my_shivaur_m = document.getElementById("dropdownContent_my_shivaur_m4");
    const selectedAssignees_my_shivaur_m = document.getElementById("selectedAssignees_my_shivaur_m4");
    const checkboxes_my_shivaur_m = document.querySelectorAll(".assignee-checkbox_my_shivaur_m4");
    
    // window.toggleDropdown_my_shivaur_m4 = function toggleDropdown_my_shivaur_m4() {
        dropdownContent_my_shivaur_m.classList.toggle("show_my_shivaur_m4");
    // }
    
    window.addEventListener("click", function (event) {
        if (!event.target.matches('.dropdown-btn_my_shivaur_m4')) {
            dropdownContent_my_shivaur_m.classList.remove("show_my_shivaur_m4");
        }
    });
    
    function updateSelectedAssignees_my_shivaur_m() {
        
        selectedAssignees_my_shivaur_m.innerHTML = "";
    
        // Loop through each checkbox and add selected ones to display
        checkboxes_my_shivaur_m.forEach((checkbox) => {
            if (checkbox.checked) {
                const label = checkbox.nextElementSibling.textContent; // Get the label text
                const tag = document.createElement("span");
                tag.classList.add("tag_my_shivaur_m4");
                tag.textContent = label; // Display the label text
                tag.setAttribute("value", checkbox.value);
                selectedAssignees_my_shivaur_m.appendChild(tag);
            }
        });
        document.getElementsByClassName("dropdown-btn_my_shivaur_m4")[0].click();
    }
        

    checkboxes_my_shivaur_m.forEach((checkbox) => {
        checkbox.addEventListener("change", updateSelectedAssignees_my_shivaur_m);
    });
}