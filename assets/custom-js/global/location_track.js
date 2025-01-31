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
import { LOCATION_API_GET_IP, TOKEN } from './apis.js';
// ==============================================================================
// ==============================================================================
setInterval(fetchAndSaveCurrentLocation, 4400);

// Fetch and Save Admin Location
function fetchAndSaveCurrentLocation() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            const userId = localStorage.getItem("_id");
            if (userId) {
                // await saveCurrentLocation(latitude, longitude, userId);
                try {
                    const API = `${LOCATION_API_GET_IP}`;
                    // -----------------------------------------------------------------------------
                    const response = await fetch(API, {
                        method: "POST",
                        headers: { 
                            "Content-Type": "application/json", 
                            "Authorization": TOKEN 
                        },
                        body: JSON.stringify({ latitude, longitude, userId})
                    });
                } catch (error) {
                    console.error("Error saving location:", error);
                }
            }
        }, (error) => {
            console.error("Geolocation failed:", error.message);
            // alert("please try again later.")
        });
    } else {
        // alert("please, allow location permission.");
        console.log("permission denied, unable to fetch the location.")
    }
}

// async function saveCurrentLocation(lat, lon, userId) {
//     try {
//         const API = `${LOCATION_API_GET_IP}`;
//
//         const response = await fetch(API, {
//             method: "POST",
//             headers: { 
//                 "Content-Type": "application/json", 
//                 "Authorization": TOKEN 
//             },
//             body: JSON.stringify({ 
//                 latitude: lat, 
//                 longitude: lon,
//                 userId 
//             })
//         });
//     } catch (error) {
//         console.error("Error saving location:", error);
//     }
// }