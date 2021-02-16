import https from 'https';
import { IncomingMessage } from 'http';

export default class SenderAbstract {
  apiKey: string;

  fromName: string;

  fromEmail: string;

  label: string;

  constructor(
    apiKey: string,
    fromName: string,
    fromEmail: string,
    label: string
  ) {
    this.apiKey = apiKey;
    this.fromName = fromName;
    this.fromEmail = fromEmail;
    this.label = label;
  }

  createPromise = (options: any, data: string) => {
    return new Promise((resolve, reject) => {
      const req = https.request(options, (res: IncomingMessage) => {
        let body = '';

        res.on('data', (d) => {
          process.stdout.write(`${d}\n`);
          body += d;
        });

        res.on('end', () => {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            resolve(res);
          } else {
            reject(body);
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.write(data);
      req.end();
    });
  };
}
