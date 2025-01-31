export async function status_popup(message_you_want_to_show,status_true_or_false) {
    // Inject FontAwesome CSS
    (function () {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
        link.crossOrigin = "anonymous";
        document.head.appendChild(link);
    })();
  
    // Inject CSS styles
    (function () {
        const style = document.createElement("style");
        style.innerHTML = `
            /* Popup container */
            .overlay_message_curd_1_my {
            position: fixed;
            bottom: 20px;
            right: -400px; /* Start outside the screen */
            width: 350px;
            background-color: #fff; /* Set background to white */
            color: ${status_true_or_false ? "#50d050" : "#f44336"}; /* Success or Error Text Color */
            border-left: 10px solid ${status_true_or_false ? "#50d050" : "#f44336"}; /* Dynamic Border Color */
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
            padding: 10px 20px ;
            font-family: Arial, sans-serif;
            z-index: 9999;
            animation: slideIn 0.5s ease forwards;
            }
            .content_1_my {
                display: flex;
                align-items: center;
                gap: 15px;
            }
            .icon-circle {
                width: 40px;
                height: 40px;
                background-color: rgba(255, 255, 255, 0.2);
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 24px;
                border: 2px solid
            }
            .message-type_1_my {
                flex-grow: 1;
                font-size: 16px;
                line-height: 1.5;
                margin: 0;
                color:#000
            }
            .countdown-timer {
                font-size: 18px;
                font-weight: bold;
            }
            @keyframes slideIn {
                from {
                    right: -400px;
                }
                to {
                    right: 20px;
                }
            }
            @keyframes fadeOut {
                from {
                    opacity: 1;
                }
                to {
                    opacity: 0;
                }
            }
            /* Block all interactions during popup visibility */
            .no-interaction {
                pointer-events: none;
                user-select: none;
            }
        `;
        document.head.appendChild(style);
    })();
  
    // Main logic
    try {
      // Temporarily block interactions
        // document.body.classList.add("no-interaction");
    
        let countdown = 3;
    
        // Create the popup content
        const popup = document.createElement("div");
        popup.classList.add("overlay_message_curd_1_my");
        popup.innerHTML = `
            <div class="content_1_my">
            <div class="icon-circle">
                ${
                status_true_or_false
                    ? `<i class="fa fa-check"></i>` // Success Icon
                    : `<i class="fa fa-times"></i>` // Failure Icon
                }
            </div>
            <div class="message-type_1_my">${message_you_want_to_show}</div>
            <div class="countdown-timer d-none">${countdown}</div>
            </div>
        `;
    
        document.body.appendChild(popup);
    
        const timerElement = popup.querySelector(".countdown-timer");
    
        const interval = setInterval(() => {
            countdown -= 1;
            if (countdown <= 0) {
                popup.style.animation = "fadeOut 1s ease forwards";
                // document.body.classList.remove("no-interaction");
                document.body.removeChild(popup);
                
                clearInterval(interval);
            } else {
                timerElement.textContent = countdown;
            }
        }, 1000);
    } catch (error) {
        console.error("Error showing the popup:", error);
        // document.body.classList.remove("no-interaction");
    }
}