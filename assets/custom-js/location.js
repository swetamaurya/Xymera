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
// Import APIs and functions
import { TOKEN, EMPLOYEE_API_GETALL, LOCATION_API_GETSINGLE, LOCATION_API_GET_IP } from './global/apis.js';

let cachedEmployee = [];
let map;
let userMarkers = {}; // To store markers for each user
let adminMarker = null; // To store Admin's marker
let reverseGeoCache = {}; // For caching reverse geocoding results
let locationUpdateInterval;

// Icons for Admin and Employees
const adminIcon = L.icon({
    iconUrl: './assets/img/560199.png', // Red for Admin
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [0, -41],
    shadowSize: [41, 41]
});

const employeeIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png', // Blue for Employees
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [0, -41],
    shadowSize: [41, 41]
});

document.addEventListener("DOMContentLoaded", () => {
    map = L.map("map").setView([20.5937, 78.9629], 5);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors"
    }).addTo(map);

    fetchUsers();
    fetchAndSaveCurrentLocation(); // Fetch Admin's location
    locationUpdateInterval = setInterval(fetchAndSaveCurrentLocation, 5000); // Update every 30s
});

// Fetch Users for Dropdown
async function fetchUsers() {
    try {
        const response = await fetch(EMPLOYEE_API_GETALL, {
            method: "GET",
            headers: { "Content-Type": "application/json", "Authorization": TOKEN }
        });
        const result = await response.json();
        cachedEmployee = result?.employees?.filter(user => user?.status === "Active") || [];
        populateEmployeeOptions();
    } catch (error) {
        console.error("Error fetching employees:", error);
    }
}

function populateEmployeeOptions() {
    const employeeSelect = document.getElementById("slt_emp_option");
    if (!employeeSelect) return;

    employeeSelect.innerHTML = '<option value="">Select User</option>';
    cachedEmployee.forEach(user => {
        const option = document.createElement("option");
        option.value = user._id;
        option.textContent = `${user.name} (${user.userId})`;
        employeeSelect.appendChild(option);
    });
}

// Fetch and Save Admin Location
function fetchAndSaveCurrentLocation() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            const userId = localStorage.getItem("_id");
            if (userId) {
                await saveCurrentLocation(latitude, longitude, userId);
            }
        }, (error) => {
            console.error("Geolocation failed:", error.message);
        });
    }
}

async function saveCurrentLocation(lat, lon, userId) {
    try {
        const response = await fetch(LOCATION_API_GET_IP, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": TOKEN },
            body: JSON.stringify({ latitude: lat, longitude: lon, userId })
        });
        const result = await response.json();
        if (result.success) {
            addMarkerForLocation(result.location);
            updateMapBounds();
        }
    } catch (error) {
        console.error("Error saving location:", error);
    }
}

// Add Marker with Slight Offset for Employees
async function addMarkerForLocation(location) {
    const { latitude, longitude, name, userId, image } = location;

    if (!latitude || !longitude) return;

    // Avoid Overlap: Add slight offset for employees
    const offset = userId !== localStorage.getItem("_id") ? 0.0001 : 0; 
    const adjustedLat = parseFloat(latitude) + offset;
    const adjustedLon = parseFloat(longitude) + offset;

    const isAdmin = userId === localStorage.getItem("_id");
    const markerIcon = isAdmin ? adminIcon : employeeIcon;

    let address = reverseGeoCache[`${adjustedLat},${adjustedLon}`] || await fetchAddressFromCoords(adjustedLat, adjustedLon);
    reverseGeoCache[`${adjustedLat},${adjustedLon}`] = address;

    // Content for the Tooltip or Popup
    const tooltipContent = `
        <div style="text-align: center;">
            <img src="${image || 'default.png'}" alt="${name}" 
                 style="width: 50px; height: 50px; border-radius: 50%; margin-bottom: 5px;">
            <br><b>${name}</b><br>
            ${address || "Address not available"}
        </div>
    `;

    // Update or Create Marker
    if (isAdmin) {
        if (adminMarker) map.removeLayer(adminMarker);
        adminMarker = L.marker([adjustedLat, adjustedLon], { icon: adminIcon }).addTo(map)
            .bindTooltip(tooltipContent, { direction: "top", offset: L.point(0, -10) });
    } else {
        if (userMarkers[userId]) map.removeLayer(userMarkers[userId]);
        userMarkers[userId] = L.marker([adjustedLat, adjustedLon], { icon: markerIcon }).addTo(map)
            .bindTooltip(tooltipContent, { direction: "top", offset: L.point(0, -10) });
    }
    updateMapBounds();
}


// Update Map Bounds Dynamically
function updateMapBounds() {
    const bounds = [];
    if (adminMarker) bounds.push(adminMarker.getLatLng());
    Object.values(userMarkers).forEach(marker => bounds.push(marker.getLatLng()));
    if (bounds.length) map.fitBounds(bounds);
}

// Fetch Single User Location
async function fetchAndDisplaySingleUserLocation(userId) {
    try {
        const response = await fetch(`${LOCATION_API_GETSINGLE}?userId=${userId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json", "Authorization": TOKEN }
        });
        const result = await response.json();
        if (result.success && result.location) {
            addMarkerForLocation(result.location);
        }
    } catch (error) {
        console.error("Error fetching user location:", error);
    }
}

// Reverse Geocoding
async function fetchAddressFromCoords(lat, lon) {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
        const data = await response.json();
        return data.display_name || "Address not available";
    } catch (error) {
        console.error("Error fetching address:", error);
        return "Address not available";
    }
}

// Dropdown Change Event
document.getElementById("slt_emp_option")?.addEventListener("change", (event) => {
    const selectedUserId = event.target.value;
    if (selectedUserId) {
        fetchAndDisplaySingleUserLocation(selectedUserId);
    }
});


// Fetch and Display All User Locations
// async function fetchAndDisplayAllUserLocations() {
//     loading_shimmer(); // Show shimmer while fetching all locations
//     try {
//         const response = await fetch(LOCATION_API_GETALL, {
//             method: "GET",
//             headers: { "Content-Type": "application/json", "Authorization": TOKEN }
//         });

//         const result = await response.json();
//         if (result.success && result.locations.length > 0) {
//             result.locations.forEach((location) => {
//                 addMarkerForLocation(location);
//                         })
//             status_popup("All locations displayed successfully!", true);
//         } else {
//             console.log("No locations available.");
//             status_popup("No locations found to display.", false);
//         }
//     } catch (error) {
//         console.error("Error fetching all locations:", error);
//         status_popup("Error fetching locations. Please try again later.", false);
//     } finally {
//         remove_loading_shimmer(); // Remove shimmer after location fetch
//     }
// }


 

 
// Fetch and Display Single User Location
