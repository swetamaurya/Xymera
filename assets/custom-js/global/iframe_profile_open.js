import { loading_shimmer, remove_loading_shimmer } from "./loading_shimmer.js";

function iFrameRenderHandler(event) {
    try {
        loading_shimmer();
    } catch (error) {
        console.log(error);
    }
    // -----------------------------------------------------------------------------------
    try {
        // Get the profile ID from the clicked element
        let profile__src = event.target.getAttribute("created-by");
        const iframe = document.getElementById('myIframe');
        
        // Set the iframe source
        iframe.src = `${profile__src}`;
        
        // Wait for the iframe to load
        iframe.onload = function () {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            const allElements = iframeDoc.querySelectorAll('body *');
            const mainElement = iframeDoc.getElementById('main');

            if (mainElement) {
                // Modify styles and content of the iframe
                mainElement.style.setProperty('margin-top', '0px', 'important');
                mainElement.querySelector(".pagetitle h1").innerText = "View Profile";
                
                const secondaryButton = mainElement.querySelector(".btn-secondary");
                if (secondaryButton) {
                    secondaryButton.remove();
                }

                // Remove all elements except #main and its children
                allElements.forEach(el => {
                    if (!mainElement.contains(el) && el !== mainElement) {
                        el.remove();
                    }
                });
            } else {
                alert("data not found");
            }
        };
    } catch (error) {
        console.log(error);
    }
    // -----------------------------------------------------------------------------------
    try {
        remove_loading_shimmer();
    } catch (error) {
        console.log(error);
    }
}

// Function to add the event listener
export function iFrameRenderFunction() {
    let zzz2 = document.querySelectorAll('[data-bs-target="#modal_I_FRAME"]');
    zzz2.forEach(element => {
        element.addEventListener("click", iFrameRenderHandler);
    });
}

// Function to clear the event listener
export function clearIFrameRenderEventListener() {
    let zzz2 = document.querySelectorAll('[data-bs-target="#modal_I_FRAME"]');
    zzz2.forEach(element => {
        element.removeEventListener("click", iFrameRenderHandler);
    });
}

