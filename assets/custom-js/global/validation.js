
import { status_popup } from './status_popup.js';
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------


// ____________________________VALIDATION-1 DETAILS___________________________________
// -----------------------------------------------------------------------------------
// Add Employee ( add-employee.js )
// Edit Employee ( edit-employee.js )
// -----------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------
export function validateForm1() {
    let isValid = true; // Flag to check if the form is valid
    const requiredFields = document.querySelectorAll("[required]");
    requiredFields.forEach((field) => {
        const formGroup = field.closest(".apply-validation-div");
        if (!formGroup) {
            console.error("Validation container not found for field:", field);
            isValid = false;
            return;
        }
        const errorSpan = formGroup.querySelector(".text-danger.vldtn-err-msg-spn");

        // Check for empty value
        if (field.value.trim() === "") {
            isValid = false;

            if (!errorSpan) {
                const errorMessage = document.createElement("span");
                errorMessage.className = "text-danger vldtn-err-msg-spn ";
                errorMessage.innerText = "This is Required";
                formGroup.querySelector("label").appendChild(errorMessage);
            }
            // Additional validation for input types "number" and "tel"
            if ((field.type === "number" || field.type === "tel") && isNaN(field.value)) {
                isValid = false;

                // Add error message if not already present
                if (!errorSpan) {
                    const errorMessage = document.createElement("span");
                    errorMessage.className = "text-danger vldtn-err-msg-spn ";
                    errorMessage.innerText = "Only numeric values are allowed";
                    formGroup.querySelector("label").appendChild(errorMessage);
                }
            }
        } else {
            // Remove error message if field is valid
            if (errorSpan) {
                errorSpan.remove();
            }

            // Additional validation for input types "number" and "tel"
            if ((field.type === "number" || field.type === "tel") && isNaN(field.value)) {
                isValid = false;

                // Add error message if not already present
                if (!errorSpan) {
                    const errorMessage = document.createElement("span");
                    errorMessage.className = "text-danger vldtn-err-msg-spn ";
                    errorMessage.innerText = "Only numeric values are allowed";
                    formGroup.querySelector("label").appendChild(errorMessage);
                }
            }
        }
    });
    try{
        if(!isValid){
            status_popup("Please, Insert All And Correct Details", false);
        }
    } catch (error){
        console.log(error)
    }
    return isValid;
}
// ______________________________________________________________________________
// ==============================================================================
// ______________________________________________________________________________
// ==============================================================================



