import axios from "axios";

const urloffline = "http://localhost:3000/gem";
const url ="https://piweb-back.onrender.com/gem"


export async function gemini(trans) {
    try {
        const res = await axios.post(
            `${url}/gemini`,
            {
                text: 'give me a response without any * or special caractere i want a simple text now answer this :' + trans
            }
        );

        const rep = res.data.answer;
        return rep;
    } catch (error) {
        console.error("Error fetching data from the Gemini API:", error);
        return null; // Return null or handle the error appropriately
    }
}

export async function sendEmailToAdmin(userEmail, message, clientName) {
    try {
        const apiUrl = `${url}/sendemail`;
        const apiPayload = {
            userEmail: userEmail,
            message: message,
            clientName: clientName
        };
        const response = await axios.post(apiUrl, apiPayload);
        if (response.data.success) {
            console.log('Email sent successfully');
            return true;
        } else {
            console.error('Failed to send email:', response.data.message);
            return false;
        }
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}