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

/* ==================== JS Code ==================== */
import { TOKEN, DASHBOARD_API } from "./global/apis.js";
import { loading_shimmer, remove_loading_shimmer } from "./global/loading_shimmer.js";

// We'll keep these variables accessible so our update functions can see them:
let dashboardData = null; // Will store r1.data from the API

async function all_data_load_list() {
  try {
    loading_shimmer();
  } catch(error){
    console.log(error)
  }

  try {
    const API = `${DASHBOARD_API}`;
    const response = await fetch(API, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `${TOKEN}`,
      },
    });

    if (!response.ok || response.status !== 200) {
      throw new Error("Response not OK");
    }

    const r1 = await response.json();
    console.log("API Response:", r1);

    // Store the data object
    dashboardData = r1.data;

    renderLeaveTable(dashboardData.leave);
    // Initialize with "all" data for each card:
    updateDoctorVisitSchedule("all");
    updateDoctorVisitClosed("all");
    updateChemistVisitSchedule("all");
    updateChemistVisitClosed("all");
    updateTotalLeaves("all");
    updateTotalCoverage("all")

  } catch(error){
    console.log(error);
    // localStorage.clear();
    // window.location.href = 'login.html';
  }

  try{
    remove_loading_shimmer();
  } catch(error){
    console.log(error);
  }
}
all_data_load_list();

/* ========== Render the last 10 leaves in the table ========== */
function renderLeaveTable(leavesArray) {
  const tableBody = document.getElementById("leaveTableBody");
  if (!tableBody) return;

  // Clear any previous rows
  tableBody.innerHTML = "";

  // We only want the last 10 leaves
  const lastTenLeaves = leavesArray.slice(-10);

  // Create a row for each of these last 10
  lastTenLeaves.forEach((leaveObj) => {
    // Prepare the status badge
    let statusBadge = "";
    if (leaveObj.status === "Approved") {
      statusBadge = `<span class="badge bg-success">${leaveObj.status}</span>`;
    } else if (leaveObj.status === "Pending") {
      statusBadge = `<span class="badge bg-danger">${leaveObj.status}</span>`;
    } else {
      // Optionally handle other statuses
      statusBadge = `<span class="badge bg-secondary">${leaveObj.status}</span>`;
    }

    // Build the table row
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${leaveObj?.name.name}</td>
      <td>${leaveObj.noOfDays}</td>
      <td>${statusBadge}</td>
    `;

    tableBody.appendChild(tr);
  });
}
/* 
  ==================== EVENT LISTENERS FOR DROPDOWNS ====================
  For each card, we add a click listener on the dropdown items.
  We'll read the data-type (which card it is) and data-period (which time range).
*/
document.addEventListener("DOMContentLoaded", () => {
  const filters = document.querySelectorAll(".filter"); 
  filters.forEach(filter => {
    filter.addEventListener("click", (e) => {
      // If user clicked on an <a> with data-period, handle it
      const target = e.target.closest("a[data-period]");
      if (target) {
        e.preventDefault();
        const period = target.getAttribute("data-period");      // e.g. "all", "today", "thisWeek", ...
        const cardType = filter.getAttribute("data-type"); // e.g. "doctor-visit-schedule"
        
        switch (cardType) {
          case "doctor-visit-schedule":
            updateDoctorVisitSchedule(period);
            break;
          case "doctor-visit-closed":
            updateDoctorVisitClosed(period);
            break;
          case "chemist-visit-schedule":
            updateChemistVisitSchedule(period);
            break;
          case "chemist-visit-closed":
            updateChemistVisitClosed(period);
            break;
          case "chemist-visit-closed":
              updateChemistVisitClosed(period);
              break;
          case "total-leaves":
            updateTotalLeaves(period);
            break;
            case "total-coverage":
              updateTotalCoverage(period);
              break;
          default:
             break;
        }
      }
    });
  });
});

/* 
  ==================== UPDATE FUNCTIONS ====================
  Each function pulls the correct period data from dashboardData
  and sets the DOM with the new values/increments
*/

// Doctor’s visit schedule
function updateDoctorVisitSchedule(period) {
  if (!dashboardData) return;
  const obj = dashboardData["Doctor’s visit schedule"]?.[period];
  if (!obj) return; // safety check

  document.getElementById("doctorVisitScheduleCount").innerText = obj.value;
  document.getElementById("doctorVisitScheduleIncrement").innerText = obj.increment + "%";
}

// Doctor’s visit closed
function updateDoctorVisitClosed(period) {
  if (!dashboardData) return;
  const obj = dashboardData["Doctor’s visit closed"]?.[period];
  if (!obj) return;

  document.getElementById("doctorVisitCompletedCount").innerText = obj.value;
  document.getElementById("doctorVisitClosedIncrement").innerText = obj.increment + "%";
}

// Chemist’s visit schedule
function updateChemistVisitSchedule(period) {
  if (!dashboardData) return;
  const obj = dashboardData["Chemist’s visit schedule"]?.[period];
  if (!obj) return;

  document.getElementById("chemistVisitScheduleCount").innerText = obj.value;
  document.getElementById("chemistVisitScheduleIncrement").innerText = obj.increment + "%";
}

// Chemist’s visit closed
function updateChemistVisitClosed(period) {
  if (!dashboardData) return;
  const obj = dashboardData["Chemist’s visit closed"]?.[period];
  if (!obj) return;

  document.getElementById("chemistVisitCompletedCount").innerText = obj.value;
  document.getElementById("chemistVisitClosedIncrement").innerText = obj.increment + "%";
}


// Total leaves
function updateTotalLeaves(period) {
  if (!dashboardData) return;
  const obj = dashboardData["Total leaves"]?.[period];
  if (!obj) return;

  document.getElementById("totalLeavesCount").innerText = obj.value;
  document.getElementById("totalLeavesIncrement").innerText = obj.increment + "%";
}

// coverage
function updateTotalCoverage(period) {
  if (!dashboardData) return;
  const obj = dashboardData["Average company coverage"]?.[period];
  if (!obj) return;

  document.getElementById("averageCompanyCoverage").innerText = obj.value;
  document.getElementById("totalCoverageIncrement").innerText = obj.increment + "%";
}