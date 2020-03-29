const fs = require('fs');
const StaticFileHandler = require('serverless-aws-static-file-handler');

const clientDirectory = `${__dirname}/www`;
const fileHandler = new StaticFileHandler(clientDirectory);

export default async function (event: any, context: object) {
    try {
        const filePath = event.pathParameters.filePath;

        if (fs.existsSync(`${clientDirectory}/${filePath}`)) {
            return fileHandler.get(event, context);
        } else {
            throw Error(`File not found: ${filePath}`);
        }
    } catch (error) {
        console.error(error);
        event.pathParameters = { file: ['index.html'] };
        return fileHandler.get(event, context);
    }
}