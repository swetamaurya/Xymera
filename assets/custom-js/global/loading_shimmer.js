export async function loading_shimmer() {
  // Inject FontAwesome CSS
  (function () {
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
    link.crossOrigin = "anonymous";
    document.head.appendChild(link);
  })();

  // Inject CSS styles
  (function () {
    var style = document.createElement("style");
    style.innerHTML = `
        .overlay_loading_shimmer {
            position: fixed;
            left: 0;
            top: 0;
            width: 100vw;
            height: 100vh;
            background-color: rgba(0, 0, 0, 0.7);
            z-index: 9;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .shimmer-container {
            position: relative;
            width: 150px;
            height: 150px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }

        .loading-circle {
            width: 80px;
            height: 80px;
            border: 8px solid rgba(255, 255, 255, 0.3);
            border-top: 8px solid #0d6efd;
            border-radius: 50%;
            animation: spin 1.5s linear infinite;
            margin-bottom: 20px;
        }

        .shimmer-text {
            font-size: 18px;
            color: white;
            font-weight: bold;
            text-align: center;
        }

        @keyframes spin {
            0% {
                transform: rotate(0deg);
            }
            100% {
                transform: rotate(360deg);
            }
        }
        `;
    document.head.appendChild(style);
  })();

  // Create and display shimmer loading element
  const shimmerPopup = document.createElement("div");
  shimmerPopup.innerHTML = `
        <div class="shimmer-container">
            <div class="loading-circle"></div>
            <div class="shimmer-text">PLEASE WAIT</div>
        </div>
    `;
  shimmerPopup.classList.add("overlay_loading_shimmer");
  shimmerPopup.id = "overlay_loading_shimmer";
  document.body.appendChild(shimmerPopup);
}

// To remove the shimmer manually, add this function
export function remove_loading_shimmer() {
  const shimmer = document.getElementById("overlay_loading_shimmer");
  if (shimmer) {
    document.body.removeChild(shimmer);
  }
}
