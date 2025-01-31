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
import { LEAVE_API_GETSINGLE, LEAVE_API_UPDATE, TOKEN  } from './global/apis.js';
// -----------------------------------------------------------------------------
import { loading_shimmer, remove_loading_shimmer } from './global/loading_shimmer.js';
import { start_hidder } from './global/hide_unhide_ROLES.js';
import { status_popup } from './global/status_popup.js';
import {} from './global/location_track.js';
// -----------------------------------------------------------------------------
// ==============================================================================
const id_param = new URLSearchParams(window.location.search).get("id");
// ==============================================================================
// ==============================================================================
async function editData(){
    try{
        loading_shimmer();
    } catch(error){console.log(error)}
    // -----------------------------------------------------------------------------------
    try{
        let leaveStatus = document.getElementById("leaveStatus");
        let leaveStart = document.getElementById("leaveStart");
        let leaveEnd = document.getElementById("leaveEnd");
        let noOfDays = document.getElementById("noOfDays");
        let halfDay = document.getElementById("halfDay");
        let leaveType = document.getElementById("leaveType");
        let leaveReason = document.getElementById("leaveReason");
        let approvalReason = document.getElementById("approvalReason");


        let API = `${LEAVE_API_GETSINGLE}?_id=${id_param}`;
        // -----------------------------------------------------------------------------------
        const response = await fetch(API,{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `${TOKEN}`,
            },
        });
        
        // -----------------------------------------------------------------------------------
        let r2 = (await response.json())?.leave;
        console.log(r2)

        // -----------------------------------------------------------------------------------
        leaveStatus.value = r2?.status;
        leaveStart.value = formatDateToISO(r2?.from);
        leaveEnd.value = formatDateToISO(r2?.to);
        halfDay.value = r2?.halfDay;
        noOfDays.value = r2?.noOfDays;
        leaveType.value = r2?.leaveType;
        leaveReason.value = r2?.reason;
        approvalReason.value = r2?.approveReason || '-';

    } catch(error){
        console.log(error)
        // localStorage.clear();
        // window.location.href = 'login.html';
    }
    // -----------------------------------------------------------------------------------
    try{
        remove_loading_shimmer();
        start_hidder();
    } catch(error){console.log(error)}
}
editData();

// ==============================================================================
// ==============================================================================

document.getElementById("leaveFormSubmit").addEventListener("submit", async function(event){
    event.preventDefault();
    try{
        loading_shimmer();
    } catch(error){console.log(error)}
    // -----------------------------------------------------------------------------------
    try{
        document.querySelector(".btn-success").setAttribute("disabled","");
        let from = document.getElementById("leaveStart").value;
        let to = document.getElementById("leaveEnd").value;
        let halfDay = document.getElementById("halfDay").value;
        let leaveType = document.getElementById("leaveType").value;
        let noOfDays = document.getElementById("noOfDays").value;
        let reason = document.getElementById("leaveReason").value;

        let status = document.getElementById("leaveStatus").value;
        let approveReason = document.getElementById("approvalReason").value;

        let _id = id_param;

        
        let API = `${LEAVE_API_UPDATE}`;
        // -----------------------------------------------------------------------------------
        const response = await fetch(API, {
            method : 'POST',
            headers : {
                "Content-Type": "application/json",
                'Authorization': `${TOKEN}`,
            },
            body : JSON.stringify({from, to, halfDay, leaveType, noOfDays, reason, _id, status, approveReason})
        });
        // -----------------------------------------------------------------------------------
        let r1 = await response?.json();
        status_popup(r1?.message, response?.ok);

        setTimeout(function(){
            window.location.href = 'leave-application.html';
        },400);
        
    } catch (error){
        console.log(error);
        status_popup("please, try again later !", false);
    }
    // -----------------------------------------------------------------------------------
    try{
        remove_loading_shimmer();
    } catch(error){console.log(error)}
});
// ==============================================================================

document.addEventListener('DOMContentLoaded', function () {
    const leaveStart = document.getElementById('leaveStart');
    const leaveEnd = document.getElementById('leaveEnd');
    const halfDay = document.getElementById('halfDay');
    const noOfDays = document.getElementById('noOfDays');

    function calculateLeaveDays() {
      const startDateValue = leaveStart.value;
      const endDateValue = leaveEnd.value;
      const halfDayValue = halfDay.value;
  
      if (!startDateValue || !endDateValue) {
          noOfDays.value = '';
        return;
      }
  
      const startDate = new Date(startDateValue);
      const endDate = new Date(endDateValue);
      
      if (startDate > endDate) {
        alert('Leave Start date cannot be after Leave End date.');
        noOfDays.value = '';
        return;
      }
      const diffTime = endDate - startDate;
      let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  
      if (halfDayValue === 'First Half' || halfDayValue === 'Second Half') {
        diffDays = diffDays - 0.5;
      } 
      else if (halfDayValue === 'Full Day') {} 
      else {}
      noOfDays.value = diffDays;
    }
    leaveStart.addEventListener('change', calculateLeaveDays);
    leaveEnd.addEventListener('change', calculateLeaveDays);
    halfDay.addEventListener('change', calculateLeaveDays);
});
  
function formatDateToISO(dateString) {
    // Regular expression to check if date is already in "yyyy-MM-dd" format
    const isoFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
    
    if (isoFormatRegex.test(dateString)) {
        return dateString; // Return as is if already formatted
    }

    // Otherwise, reformat the date
    const [day, month, year] = dateString.split('-');
    return `${year}-${month}-${day}`;
}