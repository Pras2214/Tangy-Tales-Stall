const { Client } = require("whatsapp-web.js");
// const qrcode = require("qrcode-terminal");

const client = new Client();

client.on("ready", () => {
    console.log("Client is ready!");
});

// Event fired when the client has authenticated successfully
client.on("authenticated", (session) => {
    console.log("Client is authenticated!", session);
});

// Event fired when the client encounters an error
client.on("auth_failure", (msg) => {
    console.error("Authentication failure:", msg);
});

// Event fired when the client is disconnected
client.on("disconnected", (reason) => {
    console.log("Client was logged out", reason);
});

// Initialize the client
client.initialize();


// // Example function to send a message to a specified number
async function sendMessage(number,message) {
    try {
        // Specify the recipient's phone number with country code (e.g., "+1234567890")
        const phoneNumber = '+917990688967';

        // Send the message
        await client.sendMessage(phoneNumber, 'Hello, this is a test message!');
        console.log('Message sent successfully!');
    } catch (error) {
        console.error('Error sending message:', error);
    }
}

module.exports = sendMessage;


// // Call the function to send a message
// sendMessage();
