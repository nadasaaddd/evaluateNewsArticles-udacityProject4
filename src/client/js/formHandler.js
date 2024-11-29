// Replace checkForName with a function that checks the URL
import { isValidUrl } from "./urlChecker";

const serverURL = "http://localhost:8000/api/analyze";

// const form = document.getElementById("urlForm");

// form.addEventListener("submit", handleSubmit);
function initializeFormHandler() {
  const form = document.getElementById("urlForm");
  if (form) {
    form.addEventListener("submit", handleSubmit);
  }
}

function handleSubmit(event) {
  event.preventDefault();

  // Get the URL from the input field
  const formText = document.getElementById("name").value;

  // Check if the URL is valid
  if (isValidUrl(formText)) {
    console.log("Valid URL submitted:", formText);

    // Send the URL to the server
    sendUrlToServer(formText);
  } else {
    alert("Please enter a valid URL.");
  }
}

// Function to send data to the server
async function sendUrlToServer(url) {
  try {
    const response = await fetch(serverURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: url }),
    });

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Response from server:", data);

    // Handle the server response and update the UI
    updateUI(data);
  } catch (error) {
    console.error("Error sending URL to server:", error);
    alert("There was an error processing your request. Please try again.");
  }
}

// Function to update the UI with the server response
function updateUI(data) {
  const resultDiv = document.getElementById("results");
  resultDiv.innerHTML = `
        <h3>Analysis Results:</h3>
        <p><strong>Entities:</strong> ${
          data.entities?.map((e) => e.entityId).join(", ") || "None"
        }</p>
        <p><strong>Topics:</strong> ${
          data.topics?.map((t) => t.label).join(", ") || "None"
        }</p>
        <p><strong>Summary:</strong> ${data.summary || "N/A"}</p>
    `;
}

// Export the handleSubmit function
export { handleSubmit, initializeFormHandler };
