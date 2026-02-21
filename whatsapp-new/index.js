const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(express.json());

// Global error handlers to prevent crashes
process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('UNHANDLED REJECTION at:', promise, 'reason:', reason);
});

const PORT = process.env.PORT || 9031;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID || !VERIFY_TOKEN) {
    console.error('ERROR: Missing required environment variables in .env file.');
    console.error('Make sure WHATSAPP_TOKEN, PHONE_NUMBER_ID, and VERIFY_TOKEN are set.');
    process.exit(1);
}

// Verification endpoint for Meta
app.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    }
});

// Incoming message handler
app.post('/webhook', async (req, res) => {
    const body = req.body;

    if (body.object) {
        console.log('--- Incoming Webhook Payload ---');
        console.log(JSON.stringify(body, null, 2));
        console.log('-------------------------------');

        if (
            body.entry &&
            body.entry[0].changes &&
            body.entry[0].changes[0].value.messages &&
            body.entry[0].changes[0].value.messages[0]
        ) {
            const msg = body.entry[0].changes[0].value.messages[0];
            const from = msg.from; // sender's phone number
            const rawText = msg.text ? msg.text.body : '';
            const text = rawText.toLowerCase().trim();
            const timestamp = new Date().toLocaleString();

            console.log(`[${timestamp}] Message received from ${from}: "${rawText}"`);

            // Basic Agent Logic (If-Else Ladder)
            let replyMessage = "";
            if (text === "hi" || text === "hello") {
                replyMessage = "Hello there!";
            } else if (text === "help") {
                replyMessage = "Available commands:\n- hi/hello: Get a greeting\n- help: Show this menu\n- status: Check if I'm online";
            } else if (text === "status") {
                replyMessage = "I am online and ready to help you!";
            } else {
                replyMessage = "I'm sorry, I didn't quite catch that.";
            }

            try {
                await sendMessage(from, replyMessage);
            } catch (error) {
                console.error('Error sending message:', error.response ? error.response.data : error.message);
            }
        }
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
});

// Helper function to send message via WhatsApp Cloud API
async function sendMessage(to, text) {
    try {
        const url = `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`;
        const response = await axios.post(
            url,
            {
                messaging_product: "whatsapp",
                to: to,
                text: { body: text },
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${WHATSAPP_TOKEN}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
