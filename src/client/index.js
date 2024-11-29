// Import JavaScript files
import { handleSubmit } from "./js/formHandler";
import { isValidUrl } from "./js/urlChecker";

// Import SCSS files for styling
import "./styles/resets.scss";
import "./styles/base.scss";
import "./styles/footer.scss";
import "./styles/form.scss";
import "./styles/header.scss";

// Attach the handleSubmit function to the form submission
document.getElementById("urlForm").addEventListener("submit", handleSubmit);
// Check if service workers are supported by the browser
if ("serviceWorker" in navigator) {
  // Wait until the window to load
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log(
          "Service Worker registered with scope:",
          registration.scope
        );
      })
      .catch((error) => {
        console.log("Service Worker registration failed:", error);
      });
  });
}

// Export functions
export { handleSubmit, isValidUrl };
