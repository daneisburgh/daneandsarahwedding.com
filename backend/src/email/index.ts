import aws from 'aws-sdk';
import EmailTemplate from 'email-templates';
import nodemailer from 'nodemailer';
import path from 'path';

import Email from '../database/models/email';
import User from '../database/models/user';

const { APP_NAME, NODE_ENV } = process.env;
const sendEmail = NODE_ENV !== 'development';

export default async function (template: string, user: User, params: object) {
    try {
        const emailTemplate = new EmailTemplate({
            message: { from: `"Dane & Sarah" hello@${APP_NAME}.com` },
            transport: nodemailer.createTransport({
                SES: new aws.SES({ apiVersion: '2010-12-01' })
            }),
            juice: true,
            juiceResources: {
                preserveImportant: true,
                webResources: { relativeTo: path.resolve(__dirname, 'emails') }
            },
            preview: !sendEmail,
            send: sendEmail
        });

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