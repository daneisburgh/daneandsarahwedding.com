import aws from 'aws-sdk';
import EmailTemplate from 'email-templates';
import nodemailer from 'nodemailer';
import path from 'path';

const { APP_EMAIL, NODE_ENV, API_KEY, REGION } = process.env;
const sendEmail = NODE_ENV !== 'development';
const ses = new aws.SES({ region: REGION });

export default async function (event: any) {
    const { apiKey, template, user, locals } = event;

    if (apiKey !== API_KEY) {
        throw new Error('Invalid API key');
    } else {
        const emailTemplate = new EmailTemplate({
            message: { from: `"Dane & Sarah" ${APP_EMAIL}` },
            transport: nodemailer.createTransport({ SES: ses }),
            juice: true,
            juiceResources: {
                preserveImportant: true,
                webResources: { relativeTo: path.resolve(__dirname, 'emails') }
            },
            preview: !sendEmail,
            send: sendEmail
        });

        await emailTemplate.send({
            template: path.resolve(__dirname, 'emails', template),
            message: { to: user.email },
            locals: {
                user,
                ...locals
            }
        });
    }
}