// if (!localStorage.getItem("token")) {
//     localStorage.clear();
//     window.location.href = 'login.html';
// }
// // -----------------------------------------------------------------------------
// import { TOKEN, EMPLOYEE_API_GETALL, TRACK_COVERAGE_API_EMPLOYEE } from './global/apis.js';
// // -----------------------------------------------------------------------------
// // import { status_popup } from './global/status_popup.js';
// import { loading_shimmer, remove_loading_shimmer } from './global/loading_shimmer.js';
// import { validateForm1 } from './global/validation.js';
// // ==============================================================================
// // ==============================================================================

// let cachedEmployee = [];
// // Fetch employee data
// async function fetchUser() {
//     try {
//         const API = `${EMPLOYEE_API_GETALL}`;
//         const response = await fetch(API, {
//             method: "GET",
//             headers: {
//                 "Content-Type": "application/json",
//                 'Authorization': `${TOKEN}`,
//             },
//         });
//         const r1 = await response.json();
//         cachedEmployee = r1?.employees;

//         const selectElement = document.getElementById("slt_emp_option");
//         cachedEmployee.forEach(e => {
//             if (e?.userId.toLowerCase().includes("emp") && e?.status === "Active") {
//                 const option = document.createElement("option");
//                 option.value = e?._id;
//                 option.textContent = `${e?.name} (${e?.userId})`;
//                 selectElement.appendChild(option);
//             }
//         });
//     } catch (error) {
//         console.error("Error fetching employees:", error);
//     }
// }
// fetchUser();


// document.addEventListener("DOMContentLoaded", async () => {
//     const API = `${TRACK_COVERAGE_API_EMPLOYEE}`;

//     try {
//         loading_shimmer();
//         const response = await fetch(API, {
//             method: "GET",
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `${TOKEN}`,
//             },
//         });
//         const data = await response.json();

//         const { coverage, chartData, visits, doctors, chemists } = data.summary;

//         // Populate table
//         populateTable(visits);

//         // Populate dropdowns
//         populateDropdown("doctorChemistSelect", [...doctors, ...chemists]);

//         // Update coverage summary
//         updateCoverageSummary(coverage);

//         // Update donut chart
//         updateDonutChart(chartData);
//     } catch (error) {
//         console.error("Error loading default data:", error);
//     } finally {
//         remove_loading_shimmer();
//     }
// });


// document.getElementById("slt_emp_option").addEventListener("change", async function () {
//     const empid = this.value; // Get the selected employee ID
//     const API = `${TRACK_COVERAGE_API_EMPLOYEE}?employeeId=${empid}&preference=All`;

//     try {
//         loading_shimmer();
//         const response = await fetch(API, {
//             method: "GET",
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `${TOKEN}`,
//             },
//         });
//         const data = await response.json();

//         const { doctors, chemists } = data.summary;

//         // Populate the Doctor/Chemist dropdown
//         updateDropdown(doctors, chemists);
//     } catch (error) {
//         console.error("Error fetching Doctor/Chemist data:", error);
//     } finally {
//         remove_loading_shimmer();
//     }
// });

// // Handle form submission
// document.getElementById("coverage_form_track").addEventListener("submit", async function (event) {
//     event.preventDefault();

//     const empid = document.getElementById("slt_emp_option").value;
//     const fromDate = document.getElementById("fromDateId").value;
//     const toDate = document.getElementById("toDateId").value;
//     const preference = document.querySelector("input[name='inlineRadioOptions']:checked").value;

//     const API = `${TRACK_COVERAGE_API_EMPLOYEE}?employeeId=${empid}&from=${fromDate}&to=${toDate}&preference=${preference}`;

//     try {
//         loading_shimmer();
//         const response = await fetch(API, {
//             method: "GET",
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `${TOKEN}`,
//             },
//         });
//         const data = await response.json();

//         const { coverage, chartData, visits, doctors, chemists } = data.summary;

//         // Populate table
//         populateTable(visits);

//         // Populate dropdowns
//         populateDropdown("doctorChemistSelect", [...doctors, ...chemists]);

//         // Update coverage summary
//         updateCoverageSummary(coverage);

//         // Update donut chart
//         updateDonutChart(chartData);
//     } catch (error) {
//         console.error("Error fetching search data:", error);
//     } finally {
//         remove_loading_shimmer();
//     }
// });



// // Initialize a placeholder chart
// let chart;
// initializeChart();

// function initializeChart() {

//     const placeholderData = [
//         { value: 0, name: 'No Data Available' }
//     ];

//     chart = echarts.init(document.querySelector("#donutChart"));
//     chart.setOption({
//         title: {
//             // text: "Employee Task Coverage",
//             left: 'center',
//             textStyle: { fontSize: 18 }
//         },
//         tooltip: { trigger: 'item' },
//         legend: { show: false },
//         series: [{
//             name: 'Task Distribution',
//             type: 'pie',
//             radius: ['40%', '70%'],
//             label: { show: true, formatter: '{b}' },
//             data: placeholderData
//         }]
//     });
// }


 

//  // Populate the table with visit details
// const populateTable = (visits) => {
    
//     const tableBody2 = document.querySelector("#model_statisBackdrop tbody");
//     tableBody2.innerHTML = "";
//     visits.forEach((visit, i) => {
//         const isDoctor = visit.roles.includes("Doctor");
//         const iconClass = isDoctor ? "text-primary" : "text-warning";

//         const row = document.createElement("tr");
//         row.innerHTML = `
//             <td>${visit.visitDate || "N/A"}</td>
//             <td><i class="bi bi-disc-fill ${iconClass} me-1"></i> ${visit.name} (${visit.userId})</td>
//             <td class="modelVstFreqAll">${visit.frequency || 0}</td>
//             <td class="modelMchdFreqAll" >${visit.matchedFrequency || 0}</td>
//             <td class="modelVstPrctAll">${visit.percentage || "0%"}</td>
//         `;
//         tableBody2.appendChild(row);
//     });
//     try{
//         let aa1 = document.querySelectorAll(".modelVstFreqAll");
//         let aa2 = document.querySelectorAll(".modelMchdFreqAll");
//         const elements = document.querySelectorAll('.modelVstPrctAll');


//         let bb1 = 0;
//         aa1.forEach(e=> bb1 += Number(e.innerText) );

//         let bb2 = 0;
//         aa2.forEach(e=> bb2 += Number(e.innerText) );

//         let total = 0;
//         elements.forEach(element => {
//             const value = parseInt(element.textContent.replace('%', ''), 10);
//             total += value;
//         });

//         // Output the total
//         console.log('Total:', total + '%');

        
//         const row = document.createElement("tr");
//         row.classList.add("bg-primary", "text-white", "fw-bold");
//         row.innerHTML = `
//             <td colspan="2">Total</td>
//             <td>${bb1}</td>
//             <td>${bb2}</td>
//             <td>${total} %</td>
//         `;
//         tableBody2.appendChild(row);

//     } catch(error){console.log(error)}
    
                 


//     const tableBody1 = document.querySelector("#coverageTable tbody");
//     tableBody1.innerHTML = "";

//     for(let i = 0; i<=visits.length; i++){
//         let visit = visits[i];
        
//         const isDoctor = visit.roles.includes("Doctor");
//         const iconClass = isDoctor ? "text-primary" : "text-warning"; // Blue for Doctor, Yellow for Chemist

//         const row = document.createElement("tr");
//         row.innerHTML = `
//             <td>${visit.visitDate || "N/A"}</td>
//             <td><i class="bi bi-disc-fill ${iconClass} me-1"></i> ${visit.name} (${visit.userId})</td>
//             <td>${visit.frequency || 0}</td>
//             <td>${visit.matchedFrequency || 0}</td>
//             <td>${visit.percentage || "0%"}</td>
//         `;
//         tableBody1.appendChild(row);
//         if(i==9){
//             console.log("brother")
//             break;
//         }
//     }
// };


// // Populate the dropdown
// const populateDropdown = (selectId, items) => {
//     const dropdown = document.getElementById(selectId);
//     dropdown.innerHTML = `<option selected disabled value="">Select Doctor/Chemist</option>`;
//     items.forEach((item) => {
//         const option = document.createElement("option");
//         option.value = item.id;
//         option.textContent = `${item.name} (${item.userId})`;
//         dropdown.appendChild(option);
//     });
// };

// // Update coverage summary
// const updateCoverageSummary = (coverage) => {
//     document.getElementById("totalTasks").innerText = coverage.totalTasks || "0";
//     document.getElementById("doctorVisitScheduleCount").innerText = coverage.doctorVisitScheduleCount || "0";
//     document.getElementById("doctorVisitCompletedCount").innerText = coverage.doctorVisitCompletedCount || "0";
//     document.getElementById("chemistVisitScheduleCount").innerText = coverage.chemistVisitScheduleCount || "0";
//     document.getElementById("chemistVisitCompletedCount").innerText = coverage.chemistVisitCompletedCount || "0";
//     document.getElementById("doctorFrequency").innerText = coverage.doctorFrequency || "0";
//     document.getElementById("chemistFrequency").innerText = coverage.chemistFrequency || "0";
// };

// // Update donut chart
// const updateDonutChart = (chartData) => {
//     const chart = echarts.init(document.querySelector("#donutChart"));

//     chart.setOption({
//         title: {
//             // text: "Employee Task Coverage",
//             left: "center",
//             textStyle: { fontSize: 18 },
//         },
//         tooltip: {
//             trigger: "item",
//             formatter: "{b}: {c} ({d}%)",
//         },
//         legend: {
//             top: "5%",
//             left: "center",
//             data: chartData.labels,
//         },
//         series: [
//             {
//                 name: "Task Distribution",
//                 type: "pie",
//                 radius: ["40%", "70%"],
//                 label: {
//                     show: true,
//                     formatter: "{b}: {c}",
//                 },
//                 data: chartData.labels.map((label, index) => ({
//                     value: chartData.datasets[0].data[index],
//                     name: label,
//                 })),
//             },
//         ],
//     });
// };

 
 

// const updateDropdown = (doctors, chemists) => {
//     const doctorChemistSelect = document.getElementById("doctorChemistSelect");

//     // Clear existing options
//     doctorChemistSelect.innerHTML = `<option selected disabled value="">Select Doctor/Chemist</option>`;

//     // Populate with doctors and chemists
//     [...doctors, ...chemists].forEach((item) => {
//         const option = document.createElement("option");
//         option.value = item.id;
//         option.textContent = `${item.name} ${item?.userId}`;
//         doctorChemistSelect.appendChild(option);
        
//     });
// };


// // document.addEventListener("DOMContentLoaded", () => {
// //     const coverageForm = document.getElementById("coverage_form_track");
// //     const coverageTable = document.getElementById("coverageTable").querySelector("tbody");
// //     const empNameSpan = document.getElementById("emp_name_span_tag");
// //     const totalTasksEl = document.getElementById("totalTasks");
// //     const doctorVisitScheduleCountEl = document.getElementById("doctorVisitScheduleCount");
// //     const doctorVisitCompletedCountEl = document.getElementById("doctorVisitCompletedCount");
// //     const chemistVisitScheduleCountEl = document.getElementById("chemistVisitScheduleCount");
// //     const chemistVisitCompletedCountEl = document.getElementById("chemistVisitCompletedCount");
// //     const doctorFrequencyEl = document.getElementById("doctorFrequency");
// //     const chemistFrequencyEl = document.getElementById("chemistFrequency");
// //     const doctorChemistSelect = document.getElementById("doctorChemistSelect");
// //     const pillsTabContent = document.getElementById("pills-tabContent");
  
// //     // Function to update the summary data
// //     const updateSummary = (summary) => {
// //       empNameSpan.textContent = summary.employeeName || "N/A";
// //       totalTasksEl.textContent = summary.coverage.totalTasks || 0;
// //       doctorVisitScheduleCountEl.textContent = summary.coverage.doctorVisitScheduleCount || 0;
// //       doctorVisitCompletedCountEl.textContent = summary.coverage.doctorVisitCompletedCount || 0;
// //       chemistVisitScheduleCountEl.textContent = summary.coverage.chemistVisitScheduleCount || 0;
// //       chemistVisitCompletedCountEl.textContent = summary.coverage.chemistVisitCompletedCount || 0;
// //       doctorFrequencyEl.textContent = summary.coverage.doctorFrequency || "0";
// //       chemistFrequencyEl.textContent = summary.coverage.chemistFrequency || "0";
// //     };
  
// //     // Function to update the table dynamically
// //     const updateTable = (visitDetails) => {
// //       coverageTable.innerHTML = ""; // Clear existing rows
  
// //       let totalFreq = 0;
// //       let totalMatchedFreq = 0;
  
// //       visitDetails.forEach((visit) => {
// //         const row = document.createElement("tr");
// //         row.innerHTML = `
// //           <td>${visit.visitDate}</td>
// //           <td>
// //             <i class="bi bi-disc-fill ${
// //               visit.type === "Doctor" ? "text-primary" : "text-warning"
// //             } me-1"></i> ${visit.name}
// //           </td>
// //           <td>${visit.frequency}</td>
// //           <td>${visit.matchedFrequency}</td>
// //           <td>${visit.percentage}</td>
// //         `;
  
// //         totalFreq += parseInt(visit.frequency || 0, 10);
// //         totalMatchedFreq += parseInt(visit.matchedFrequency || 0, 10);
  
// //         coverageTable.appendChild(row);
// //       });
  
// //       // Add total row
// //       const totalRow = document.createElement("tr");
// //       totalRow.className = "bg-primary text-white fw-bold";
// //       totalRow.innerHTML = `
// //         <td colspan="2">Total</td>
// //         <td>${totalFreq}</td>
// //         <td>${totalMatchedFreq}</td>
// //         <td>${((totalMatchedFreq / totalFreq) * 100 || 0).toFixed(2)}%</td>
// //       `;
// //       coverageTable.appendChild(totalRow);
// //     };
  
// //     // Function to fetch data and update UI
// //     const fetchCoverageData = async () => {
// //       const empId = document.getElementById("slt_emp_option").value || "";
// //       const fromDate = document.getElementById("fromDateId").value || "";
// //       const toDate = document.getElementById("toDateId").value || "";
// //       const preference = document.querySelector('input[name="inlineRadioOptions"]:checked').value || "All";
  
// //       try {
// //         const response = await fetch(
// //           `/api/coverage?employeeId=${empId}&from=${fromDate}&to=${toDate}&preference=${preference}`
// //         );
// //         const data = await response.json();
  
// //         if (response.ok) {
// //           updateSummary(data.summary);
// //           updateTable(data.visitDetails);
  
// //           // Populate doctor/chemist dropdown
// //           doctorChemistSelect.innerHTML = `<option selected disabled value="">Select Doctor/Chemist</option>`;
// //           const items =
// //             preference === "Doctor" ? data.summary.doctors : preference === "Chemist" ? data.summary.chemists : [...data.summary.doctors, ...data.summary.chemists];
// //           items.forEach((item) => {
// //             const option = document.createElement("option");
// //             option.value = item._id;
// //             option.textContent = `${item.name} (${item.userId})`;
// //             doctorChemistSelect.appendChild(option);
// //           });
// //         } else {
// //           alert(data.message || "Failed to fetch data");
// //         }
// //       } catch (error) {
// //         console.error("Error fetching coverage data:", error);
// //       }
// //     };
  
// //     // Event listener for form submission
// //     coverageForm.addEventListener("submit", (event) => {
// //       event.preventDefault();
// //       fetchCoverageData();
// //     });
  
// //     // Fetch initial data on page load
// //     fetchCoverageData();
// //   });
  
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
import { TOKEN, EMPLOYEE_API_GETALL, TRACK_COVERAGE_API_EMPLOYEE } from './global/apis.js';
import { loading_shimmer, remove_loading_shimmer } from './global/loading_shimmer.js';
import { validateForm1 } from './global/validation.js';
// ==============================================================================

let cachedEmployee = [];

// Fetch employee data
async function fetchUser() {
    try {
        const API = `${EMPLOYEE_API_GETALL}`;
        const response = await fetch(API, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `${TOKEN}`,
            },
        });
        const r1 = await response.json();
        cachedEmployee = r1?.employees;

        const selectElement = document.getElementById("slt_emp_option");
        selectElement.innerHTML = '';
        let lll1 = document.createElement("option");
        lll1.value = "";
        lll1.setAttribute("disabled", "");
        lll1.setAttribute("selected","");
        lll1.textContent="Select An Employee";
        selectElement.appendChild(lll1);
        cachedEmployee.forEach(e => {
            if (e?.userId.toLowerCase().includes("emp") && e?.status === "Active") {
                const option = document.createElement("option");
                option.value = e?._id;
                option.textContent = `${e?.name} (${e?.userId})`;
                selectElement.appendChild(option);
            }
        });
    } catch (error) {
        console.error("Error fetching employees:", error);
    }
}
// fetchUser();

// Initialize Chart
let chart;
function initializeChart() {
    const placeholderData = [
        { value: 0, name: 'No Data Available' }
    ];

    chart = echarts.init(document.querySelector("#donutChart"));
    chart.setOption({
        title: {
            left: 'center',
            textStyle: { fontSize: 18 }
        },
        tooltip: { trigger: 'item' },
        legend: { show: false },
        series: [{
            name: 'Task Distribution',
            type: 'pie',
            radius: ['40%', '70%'],
            label: { show: true, formatter: '{b}' },
            data: placeholderData
        }]
    });
}

initializeChart();

// Update Donut Chart
function updateDonutChart(chartData) {
    chart.setOption({
        tooltip: { trigger: "item", formatter: "{b}: {c} ({d}%)" },
        legend: { top: "5%", left: "center", data: chartData.labels },
        series: [
            {
                name: "Task Distribution",
                type: "pie",
                radius: ["40%", "70%"],
                data: chartData.labels.map((label, index) => ({
                    value: chartData.datasets[0].data[index],
                    name: label,
                })),
            },
        ],
    });
}

 
const populateMainTable = (visits, limit = 10) => {
    // Main table body
    const tableBody1 = document.querySelector("#coverageTable tbody");

    // Clear previous table content
    tableBody1.innerHTML = "";

    let totalFrequency = 0;
    let totalMatchedFrequency = 0;

    visits.slice(0, limit).forEach((visit) => {
        const isDoctor = visit.roles.includes("Doctor");
        const iconClass = isDoctor ? "text-primary" : "text-warning";

        // Accumulate totals
        totalFrequency += parseInt(visit.frequency || 0, 10);
        totalMatchedFrequency += parseInt(visit.matchedFrequency || 0, 10);

        const rowHTML = `
    <td>${visit.visitDate || "Not Scheduled"}</td>
    <td><i class="bi bi-disc-fill ${iconClass} me-1"></i> ${visit.name} (${visit.userId})</td>
    <td>${visit.frequency || 0}</td>
    <td>${visit.matchedFrequency || 0}</td>
    <td>${visit.frequency > 0 ? ((visit.matchedFrequency / visit.frequency) * 100).toFixed(2) + "%" : "0%"}</td>
`;

    

        // Append row to main table
        const mainRow = document.createElement("tr");
        mainRow.innerHTML = rowHTML;
        tableBody1.appendChild(mainRow);
    });

    if (visits.length === 0) {
        const noDataHTML = `
            <td colspan="5" class="text-center">No data available</td>
        `;

        // Append "No data" row to main table
        const noDataRowMain = document.createElement("tr");
        noDataRowMain.innerHTML = noDataHTML;
        tableBody1.appendChild(noDataRowMain);
    } else {
        // Calculate total percentage
        const totalPercentage =
    totalFrequency > 0
        ? ((totalMatchedFrequency / totalFrequency) * 100).toFixed(2) + "%"
        : "0%";


        const totalRowHTML = `
            <td colspan="2">Total</td>
            <td>${totalFrequency}</td>
            <td>${totalMatchedFrequency}</td>
            <td>${totalPercentage}</td>
        `;

        // Append totals row to main table
        const totalRowMain = document.createElement("tr");
        totalRowMain.classList.add("bg-primary", "text-white", "fw-bold");
        totalRowMain.innerHTML = totalRowHTML;
        tableBody1.appendChild(totalRowMain);
    }
};

const populateModalTable = (visits) => {
    // Modal table body
    const modalTableBody = document.querySelector("#model_statisBackdrop tbody");

    // Clear previous table content
    modalTableBody.innerHTML = "";

    let totalFrequency = 0;
    let totalMatchedFrequency = 0;

    visits.forEach((visit) => {
        const isDoctor = visit.roles.includes("Doctor");
        const iconClass = isDoctor ? "text-primary" : "text-warning";

        // Accumulate totals
        totalFrequency += parseInt(visit.frequency || 0, 10);
        totalMatchedFrequency += parseInt(visit.matchedFrequency || 0, 10);

        const rowHTML = `
    <td>${visit.visitDate || "Not Scheduled"}</td>
    <td><i class="bi bi-disc-fill ${iconClass} me-1"></i> ${visit.name} (${visit.userId})</td>
    <td>${visit.frequency || 0}</td>
    <td>${visit.matchedFrequency || 0}</td>
    <td>${visit.frequency > 0 ? ((visit.matchedFrequency / visit.frequency) * 100).toFixed(2) + "%" : "0%"}</td>
`;


        // Append row to modal table
        const modalRow = document.createElement("tr");
        modalRow.innerHTML = rowHTML;
        modalTableBody.appendChild(modalRow);
    });

    if (visits.length === 0) {
        const noDataHTML = `
            <td colspan="5" class="text-center">No data available</td>
        `;

        // Append "No data" row to modal table
        const noDataRowModal = document.createElement("tr");
        noDataRowModal.innerHTML = noDataHTML;
        modalTableBody.appendChild(noDataRowModal);
    } else {
        // Calculate total percentage
        const totalPercentage =
    totalFrequency > 0
        ? ((totalMatchedFrequency / totalFrequency) * 100).toFixed(2) + "%"
        : "0%";


        const totalRowHTML = `
            <td colspan="2">Total</td>
            <td>${totalFrequency}</td>
            <td>${totalMatchedFrequency}</td>
            <td>${totalPercentage}</td>
        `;

        // Append totals row to modal table
        const totalRowModal = document.createElement("tr");
        totalRowModal.classList.add("bg-primary", "text-white", "fw-bold");
        totalRowModal.innerHTML = totalRowHTML;
        modalTableBody.appendChild(totalRowModal);
    }
};

// Event listener for the "View Complete Data" button
document.querySelector("#viewCompleteDataButton").addEventListener("click", async () => {
    try {
        loading_shimmer();

        // Fetch data
        const empid = document.getElementById("slt_emp_option").value;
        const fromDate = document.getElementById("fromDateId").value;
        const toDate = document.getElementById("toDateId").value;
        const preference = document.querySelector("input[name='inlineRadioOptions']:checked").value;
        const doctorChemistId = document.getElementById("doctorChemistSelect").value;

        const formatDate = (date) => {
            if (!date) return null;
            const [year, month, day] = date.split("-");
            return `${day}-${month}-${year}`;
        };

        const formattedFromDate = formatDate(fromDate);
        const formattedToDate = formatDate(toDate);

        const API = `${TRACK_COVERAGE_API_EMPLOYEE}?employeeId=${empid}&from=${formattedFromDate || ""}&to=${formattedToDate || ""}&preference=${preference}&doctorChemistId=${doctorChemistId || ""}`;

        const response = await fetch(API, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `${TOKEN}`,
            },
        });

        const data = await response.json();

        if (response.ok && data.summary) {
            const { visits } = data.summary;

            // Show all rows in modal table
            populateModalTable(visits);
        } else {
            alert("No data found for the selected criteria.");
        }
    } catch (error) {
        console.error("Error fetching data for modal:", error);
    } finally {
        remove_loading_shimmer();
    }
});

// Initial population with 10 rows in the main table
document.addEventListener("DOMContentLoaded", () => {
    const initialVisits = []; // Replace with actual initial data
    populateMainTable(initialVisits);
});



let cachedDoctors = []; // Cache for all doctors
let cachedChemists = []; // Cache for all chemists
// Populate Dropdown
const populateDropdown = (selectId, selectedValue = "") => {
    const dropdown = document.getElementById(selectId);

    // Save the currently selected value
    const currentValue = selectedValue || dropdown.value;

    // Clear existing options
    dropdown.innerHTML = `<option selected disabled value="">Select Doctor/Chemist</option>`;

    // Use the cached list to populate the dropdown
    const combinedItems = [...cachedDoctors, ...cachedChemists];
    combinedItems.forEach((item) => {
        const option = document.createElement("option");
        option.value = item.id;
        option.textContent = `${item.name} (${item.userId})`;

        // Retain the selected doctor/chemist
        if (item.id === currentValue) {
            option.selected = true;
        }

        dropdown.appendChild(option);
    });

    // Ensure the selected value remains visible if it's not in the list
    if (!combinedItems.some(item => item.id === currentValue) && currentValue) {
        const selectedOption = document.createElement("option");
        selectedOption.value = currentValue;
        selectedOption.textContent = `Selected (${currentValue})`;
        selectedOption.selected = true;
        dropdown.appendChild(selectedOption);
    }
};



// Fetch and Update Data
const fetchAndUpdateData = async () => {
    const empid = document.getElementById("slt_emp_option").value;
    const fromDate = document.getElementById("fromDateId").value;
    const toDate = document.getElementById("toDateId").value;
    const preference = document.querySelector("input[name='inlineRadioOptions']:checked").value;
    const doctorChemistSelect = document.getElementById("doctorChemistSelect");

    const selectedDoctorChemistId = doctorChemistSelect.value;

    const formatDate = (date) => {
        if (!date) return null;
        const [year, month, day] = date.split("-");
        return `${day}-${month}-${year}`;
    };

    const formattedFromDate = formatDate(fromDate);
    const formattedToDate = formatDate(toDate);
    const API = `${TRACK_COVERAGE_API_EMPLOYEE}?employeeId=${empid}&from=${formattedFromDate || ""}&to=${formattedToDate || ""}&preference=${preference}&doctorChemistId=${selectedDoctorChemistId || ""}`;

    try {
        loading_shimmer();
        const response = await fetch(API, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `${TOKEN}`,
            },
        });

        const data = await response.json();

        if (response.ok && data.summary) {
            const { coverage, chartData, visits, doctors, chemists } = data.summary;

            // Update the table
            populateMainTable(visits);

            // Cache the full list of doctors and chemists if not already cached
            if (doctors.length > 0) cachedDoctors = doctors;
            if (chemists.length > 0) cachedChemists = chemists;

            // Populate the dropdown using cached lists
            populateDropdown("doctorChemistSelect", selectedDoctorChemistId);

            // Update other UI components
            updateCoverageSummary(coverage);
            updateDonutChart(chartData);
        } else {
            alert("No data found for the selected criteria.");
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    } finally {
        remove_loading_shimmer();
    }
};

// Fetch and Update Data
const fetchAndUpdateData2 = async () => {
    const empid = document.getElementById("slt_emp_option").value;
    const fromDate = document.getElementById("fromDateId").value;
    const toDate = document.getElementById("toDateId").value;
    const preference = document.querySelector("input[name='inlineRadioOptions']:checked").value;
    const doctorChemistSelect = document.getElementById("doctorChemistSelect");

    const selectedDoctorChemistId = doctorChemistSelect.value;

    const formatDate = (date) => {
        if (!date) return null;
        const [year, month, day] = date.split("-");
        return `${day}-${month}-${year}`;
    };

    const formattedFromDate = formatDate(fromDate);
    const formattedToDate = formatDate(toDate);
    const API = `${TRACK_COVERAGE_API_EMPLOYEE}?employeeId=${empid}&from=${formattedFromDate || ""}&to=${formattedToDate || ""}&preference=${preference}&doctorChemistId=${selectedDoctorChemistId || ""}`;

    try {
        loading_shimmer();
        const response = await fetch(API, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `${TOKEN}`,
            },
        });

        const data = await response.json();

        if (response.ok && data.summary) {
            const { coverage, chartData, visits, doctors, chemists } = data.summary;

            // Update the table
            populateMainTable(visits);

            // Update other UI components
            updateCoverageSummary(coverage);
            updateDonutChart(chartData);
        } else {
            alert("No data found for the selected criteria.");
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    } finally {
        remove_loading_shimmer();
    }
};



// Update Coverage Summary
const updateCoverageSummary = (coverage) => {
    document.getElementById("totalTasks").innerText = coverage.totalTasks || "0";
    document.getElementById("doctorVisitScheduleCount").innerText = coverage.doctorVisitScheduleCount || "0";
    document.getElementById("doctorVisitCompletedCount").innerText = coverage.doctorVisitCompletedCount || "0";
    document.getElementById("chemistVisitScheduleCount").innerText = coverage.chemistVisitScheduleCount || "0";
    document.getElementById("chemistVisitCompletedCount").innerText = coverage.chemistVisitCompletedCount || "0";
    document.getElementById("doctorFrequency").innerText = coverage.doctorFrequency || "0";
    document.getElementById("chemistFrequency").innerText = coverage.chemistFrequency || "0";
};



// Add Event Listeners
// document.getElementById("slt_emp_option").addEventListener("change", fetchAndUpdateData);
// document.getElementById("fromDateId").addEventListener("change", fetchAndUpdateData);
// document.getElementById("toDateId").addEventListener("change", fetchAndUpdateData);

// const radioButtons = document.querySelectorAll("input[name='inlineRadioOptions']");
// radioButtons.forEach((radio) => {
//     radio.addEventListener("change", fetchAndUpdateData);
// });

// document.getElementById("coverage_form_track").addEventListener("submit", function (event) {
//     event.preventDefault(); // Prevent form submission
//     fetchAndUpdateData(); // Fetch and update data
// });

// Reset Form and Fetch Default Data

document.getElementById("coverage_form_track").addEventListener("reset", async function () {
    document.getElementById("doctorChemistSelect").innerHTML = `<option selected disabled value="">Select Doctor/Chemist</option>`;
    document.getElementById("slt_emp_option").value = "";
    document.getElementById("fromDateId").value = "";
    document.getElementById("toDateId").value = "";
    document.querySelector("input[name='inlineRadioOptions'][value='All']").checked = true;

    // Re-fetch all data
    await fetchAndUpdateData();
});


// Event Listeners
document.getElementById("slt_emp_option").addEventListener("change", fetchAndUpdateData);
document.getElementById("fromDateId").addEventListener("change", fetchAndUpdateData);
document.getElementById("toDateId").addEventListener("change", fetchAndUpdateData);
document.querySelectorAll("input[name='inlineRadioOptions']").forEach(radio => {
    radio.addEventListener("change", fetchAndUpdateData);
});

// Initialization
fetchUser();
initializeChart();
fetchAndUpdateData();

// Listen for dropdown changes
document.getElementById("doctorChemistSelect").addEventListener("change", fetchAndUpdateData2);
