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
import { loading_shimmer, remove_loading_shimmer } from './loading_shimmer.js';
// -----------------------------------------------------------------------------
const basePath = "assets/sample_file_export_xlsx/";
// ==============================================================================
// ==============================================================================
console.log("attached broher")

const btn = document.getElementById("download_sample_file_btn")
btn.addEventListener('click', function(){
    downloadExcelFile(btn.getAttribute("modeltype"));
});



function downloadExcelFile(fileName) {
    try{
        loading_shimmer();
    } catch(error){console.log(error)}
    // ----------------------------------------------------------------------------------------------------
    try{
        // Construct the file URL
        const fileUrl = `${basePath}${fileName}.xlsx`;

        console.log("fiel :- ",fileUrl)

        // Create an anchor element and trigger download
        const anchor = document.createElement("a");
        anchor.href = fileUrl;
        anchor.download = `${fileName}.xlsx`;
        document.body.appendChild(anchor);
        anchor.click();

        // Cleanup
        document.body.removeChild(anchor);
    } catch(error){
        console.log(error);
    }
    // ----------------------------------------------------------------------------------------------------
    try{
        remove_loading_shimmer();
    } catch(error){console.log(error)}
  }