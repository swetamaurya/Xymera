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
import { LEAVE_API_CREATE, TOKEN,  } from './global/apis.js';
// -----------------------------------------------------------------------------
import { loading_shimmer, remove_loading_shimmer } from './global/loading_shimmer.js';
import { } from './global/hide_unhide_ROLES.js';
import { status_popup } from './global/status_popup.js';
import {} from './global/location_track.js';
// -----------------------------------------------------------------------------
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
        
        let API = `${LEAVE_API_CREATE}`;
        // -----------------------------------------------------------------------------------
        const response = await fetch(API, {
            method : 'POST',
            headers : {
                "Content-Type": "application/json",
                'Authorization': `${TOKEN}`,
            },
            body : JSON.stringify({from, to, halfDay, leaveType, noOfDays, reason})
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
  