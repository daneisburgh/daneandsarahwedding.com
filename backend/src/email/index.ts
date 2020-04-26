import EmailTemplate from 'email-templates';
import nodemailer from 'nodemailer';
import path from 'path';

import Email from '../database/models/email';
import User from '../database/models/user';

const transport = nodemailer.createTransport({
    host: 'email-smtp.us-east-1.amazonaws.com',
    port: 587,
    auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD
    }
});

const emailTemplate = new EmailTemplate({
    message: { from: `hello@${process.env.APP_NAME}.com` },
    transport,
    juice: true,
    juiceResources: {
        preserveImportant: true,
        webResources: { relativeTo: path.resolve('emails') }
    }
});

export = async function(user: User, template: string) {
    try {
        const result = await emailTemplate.send({
            template,
            message: { to: user.email },
            locals: {
                user,
                clientUrl: process.env.CLIENT_URL
            }
        });

        try {
            await Email.create({
                template,
                username: user.username,
                text: result.originalMessage.text
            });
        } catch (error) {
            console.error(error);
            throw new Error('Cannot save email data');
        }
    } catch (error) {
        console.error(error);
        throw new Error('Cannot send email');
    }
}