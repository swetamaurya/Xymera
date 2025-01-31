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
import { TOKEN, EXPORT_API } from './apis.js';
// -----------------------------------------------------------------------------
import { r_arr1, u_arr1, disableBtns } from './checkbox.js';
import { status_popup } from './status_popup.js';
import { loading_shimmer, remove_loading_shimmer } from './loading_shimmer.js';
// ==============================================================================
// ==============================================================================

console.log("attached broher")

const ebmf = document.getElementById("download_excel_multiple_file");
ebmf.addEventListener('click', function(){
    console.log("brother this si ")
    exportFunction();
});


// Delete selected employees
let exportVariable_globalFunction2;
function exportFunction() {
    if(r_arr1().length<=0){
        return;
    }
    exportVariable_globalFunction2 = document.getElementById("exportButton")
    exportVariable_globalFunction2.addEventListener("click",deleteEventFunction);
}

async function deleteEventFunction(event) {
    event.preventDefault();
    try{
        loading_shimmer();
    } catch(error){console.log(error)}
    try{
        exportVariable_globalFunction2.removeEventListener("click",deleteEventFunction);
    } catch(error){console.log(error)}
    // ----------------------------------------------------------------------------------------------------

    const selectedIds = r_arr1();
    const modelName = document.getElementById("download_excel_multiple_file").getAttribute("modelName");
    console.log("Model Name:", modelName);

    if (selectedIds.length > 0) {
        try {
            const response = await fetch(`${EXPORT_API}?modelName=${modelName}`, {
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
                disableBtns();
                remove_loading_shimmer();
            } catch(error){console.log(error)}
            // ----------------------------------------------------------------------------------------------------

            const success = response.ok;
            status_popup(success ? "Data Exported Successfully!" : "Please try again later", success);


            if (response.ok) {
                // Convert response to ArrayBuffer (if it's in bytes)
                const arrayBuffer = await response.arrayBuffer();
            
                // Create a Blob from the ArrayBuffer (with MIME type for XLSX)
                const blob = new Blob([arrayBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            
                // Create a temporary download link
                const link = document.createElement('a');
                const url = window.URL.createObjectURL(blob);
                
                // Set the href of the link to the Blob URL
                link.href = url;
            
                // Set the filename for the download
                link.download = 'exported_file.xlsx';
            
                // Trigger the click event to download the file
                link.click();
            
                // Clean up the Blob URL after download
                window.URL.revokeObjectURL(url);
            } else {
                console.error('Failed to fetch the file');
            }
            
        } catch (error) {
            console.error("Error deleting data:", error);
            status_popup("Please try again later", false);
        }
    }
    // ----------------------------------------------------------------------------------------------------
    try{
        remove_loading_shimmer();
    } catch(error){console.log(error)}
}