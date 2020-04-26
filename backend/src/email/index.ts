import EmailTemplate from 'email-templates';
import nodemailer from 'nodemailer';
import path from 'path';

import Email from '../database/models/email';
import User from '../database/models/user';

const from = `hello@${process.env.DOMAIN_NAME}`;
const transport = nodemailer.createTransport({
    host: 'email-smtp.us-east-1.amazonaws.com',
    port: 587,
    auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD
    }
});

const emailTemplate = new EmailTemplate({
    message: { from },
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
            locals: { name: user.name }
        });

        try {
            await Email.create({
                template,
                username: user.username,
                text: result.originalMessage.text
            });
        } catch (error) {

        }
    } catch (error) {
        console.error(error);
        throw new Error('Cannot send email');
    }
}