// Looking to send emails in production? Check out our Email API/SMTP product!
import { MailtrapClient } from "mailtrap";

const TOKEN = "f532bfe015a449bcda13d4904280cde4";

const client = new MailtrapClient({
    token: TOKEN,
});

const sender = {
    email: "hello@demomailtrap.com",
    name: "Mailtrap Test",
};
const recipients = [
    {
        email: "mohandurga7401@gmail.com",
    }
];

client
    .send({
        from: sender,
        to: recipients,
        subject: "You are awesome!",
        html: "Congrats for sending test email with Mailtrap!",
        category: "Integration Test",
    })
    .then(console.log, console.error);