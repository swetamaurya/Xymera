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
import { TOKEN, IMPORT_API } from './apis.js';
// -----------------------------------------------------------------------------
import { status_popup } from './status_popup.js';
import { loading_shimmer, remove_loading_shimmer } from './loading_shimmer.js';
// -----------------------------------------------------------------------------
import { forGloablDelete_js, pagination_data_handler_function } from './pagination.js';
// ==============================================================================
// ==============================================================================

// let table_data_reload;
export function objects_data_handler_function(table_data_function){
    pagination_data_handler_function(table_data_function);
}

console.log("attached broher")

const form = document.getElementById("import_excel_file_form");
form.addEventListener("submit", async function (event) {
    event.preventDefault();
    try{
        loading_shimmer();
    } catch(error){console.log(error)}
    try{
        document.querySelectorAll(".btn-close").forEach(e=>e.click());
    } catch(error){
        console.log(error)
    }
    // ----------------------------------------------------------------------------------------------------
    try{
        const formdata = new FormData();
        let f1 = document.getElementById("fileInputImport").files[0];
        formdata.append("file",f1);
        formdata.append("role", form.getAttribute("modeltype"));

        const response = await fetch(`${IMPORT_API}`, {
            method: 'POST',
            headers: {
                'Authorization': `${TOKEN}`,
            },
            body: formdata,
        });

        const r1 = await response.json();
        status_popup(r1?.message, response?.ok);
        
        if (response?.ok){
            forGloablDelete_js();
        }
    } catch(error){
        console.log(error)
    }
    // ----------------------------------------------------------------------------------------------------
    try{
        remove_loading_shimmer();
    } catch(error){console.log(error)}
});

document.addEventListener("DOMContentLoaded", () => {
    const dropZone = document.getElementById("dropZone");
    const fileInput = document.getElementById("fileInputImport");

    // Open file dialog when clicking on the drag-drop zone
    dropZone.addEventListener("click", () => {
        fileInput.click();
    });

    // Handle file input change
    fileInput.addEventListener("change", (event) => {
        handleFiles(event.target.files);
    });

    // Drag over event
    dropZone.addEventListener("dragover", (event) => {
        event.preventDefault();
        dropZone.classList.add("drag-over");
    });

    // Drag leave event
    dropZone.addEventListener("dragleave", () => {
        dropZone.classList.remove("drag-over");
    });

    // Drop event
    dropZone.addEventListener("drop", (event) => {
        event.preventDefault();
        dropZone.classList.remove("drag-over");
        const files = event.dataTransfer.files;

        // Update the file input's files property
        const dataTransfer = new DataTransfer(); // Create a new DataTransfer object
        for (const file of files) {
            dataTransfer.items.add(file); // Add each file to the DataTransfer object
        }
        fileInput.files = dataTransfer.files; // Set the files to the file input

        handleFiles(files);
    });

    // Handle file processing
    function handleFiles(files) {
        try {
            dropZone.querySelector("p").innerText = files[0].name; // Display the file name in the drop zone
        } catch (error) {
            console.log(error);
        }
        console.log("Files selected or dropped:", files);
        // Implement further processing of files here
    }
});

