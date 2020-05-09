import EmailTemplate from 'email-templates';
import nodemailer from 'nodemailer';
import path from 'path';

import Email from '../database/models/email';
import User from '../database/models/user';

const { APP_NAME, SMTP_USERNAME, SMTP_PASSWORD } = process.env;

const transport = nodemailer.createTransport({
    host: 'email-smtp.us-east-1.amazonaws.com',
    port: 587,
    auth: {
        user: SMTP_USERNAME,
        pass: SMTP_PASSWORD
    }
});

const emailTemplate = new EmailTemplate({
    message: { from: `hello@${APP_NAME}.com` },
    transport,
    juice: true,
    juiceResources: {
        preserveImportant: true,
        webResources: { relativeTo: path.resolve(__dirname, 'emails') }
    }
});

export default async function (template: string, user: User, params: object) {
    try {
        const result = await emailTemplate.send({
            template: path.resolve(__dirname, 'emails', template),
            message: { to: user.email },
            locals: {
                user,
                ...params
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