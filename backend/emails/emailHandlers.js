import { mailtrapClient, sender } from "../lib/mailtrap.js";
import { createCommentNotificationEmailTemplate, createConnectionAcceptedEmailTemplate, createWelcomeEmailTemplate } from "./emailTemplates.js";

//  send welcome email
export const sendWelcomeEmail = async (email, name, profileUrl) => {
    const recipient = [{ email }]
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Welcome to Unlinked",
            html: createWelcomeEmailTemplate(name, profileUrl),
            category: "Welcome Email"
        })
        console.log('Welcome Email Sent Successfully', response);
    } catch (error) {
        throw error
    }
}

//  send comment notification email
export const sendCommendNotificationEmail = async (recipientEmail, recipientName, commenterName, commentContent, postUrl) => {
    const recipient = [{ email: recipientEmail }]
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "New Comment on Your Post",
            html: createCommentNotificationEmailTemplate(recipientName, commenterName, postUrl, commentContent),
            category: "Comment Notification"
        })
        console.log('Comment Notification Email Sent Successfully', response);
    } catch (error) {
        throw error
    }
}

//  send connection accepted email
export const sendConnectionAcceptedEmail = async (senderEmail, senderName, recipientName, profileUrl) => {
	const recipient = [{ email: senderEmail }];

	try {
		const response = await mailtrapClient.send({
			from: sender,
			to: recipient,
			subject: `${recipientName} accepted your connection request`,
			html: createConnectionAcceptedEmailTemplate(senderName, recipientName, profileUrl),
			category: "connection_accepted",
		});
	} catch (error) {}
};
