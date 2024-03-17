// // script.js

// document.addEventListener("DOMContentLoaded", function() {
//     const form = document.getElementById("myForm");
  
//     form.addEventListener("submit", function(event) {
//       event.preventDefault(); // Prevent default form submission behavior
  
//       // Fetch form data
//       const formData = new FormData(form);
  
//       // Convert form data to JSON object
//       const jsonData = {};
//       for (const [key, value] of formData.entries()) {
//         jsonData[key] = value;
//       }
  
//       // Send form data to the server using fetch API
//       fetch("/submit-form", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify(jsonData)
//       })
//       .then(response => {
//         if (!response.ok) {
//           throw new Error("Network response was not ok");
//         }
//         // Reset form fields after successful submission
//         form.reset();
//         alert("Form submitted successfully!");
//       })
//       .catch(error => {
//         console.error("Error:", error);
//         alert("An error occurred while submitting the form");
//       });
//     });
//   });
  