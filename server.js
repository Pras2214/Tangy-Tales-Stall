const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    }
});

let currentQR = null;
let isClientReady = false;

client.on("ready", () => {
    isClientReady = true;
    currentQR = null; // Clear QR code when connected
    console.log("Client is ready!");
});

client.on('qr', (qr) => {
    currentQR = qr;
    qrcode.generate(qr, { small: true });
});

// Event fired when the client has authenticated successfully
client.on("authenticated", (session) => {
    console.log("Client is authenticated!");
});

// Event fired when the client encounters an error
client.on("auth_failure", (msg) => {
    console.error("Authentication failure:", msg);
});

// Event fired when the client is disconnected
client.on("disconnected", (reason) => {
    console.log("Client was logged out", reason);
    isClientReady = false;
});

// Initialize the client
client.initialize();

const waitForClientReady = () => {
    return new Promise((resolve) => {
        if (isClientReady) {
            resolve();
        } else {
            const checkInterval = setInterval(() => {
                if (isClientReady) {
                    clearInterval(checkInterval);
                    resolve();
                }
            }, 500);
        }
    });
};


// // Example function to send a message to a specified number
async function sendMessage(number, message) {
    try {
        // Specify the recipient's phone number with country code (e.g., "+1234567890")
        // whatsapp-web.js expects number@c.us
        const chatId = number + "@c.us";

        await waitForClientReady();

        // Send the message
        await client.sendMessage(chatId, message);
        console.log('Message sent successfully to', number);
    } catch (error) {
        console.error('Error sending message:', error);
    }
}

const getQrCode = () => currentQR;
const getClientStatus = () => isClientReady;

module.exports = { sendMessage, getQrCode, getClientStatus };
