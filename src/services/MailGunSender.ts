import SenderAbstract from './SenderAbstract';
import { IMessage } from '../model/message';

export default class MailGunSender extends SenderAbstract {
  send(message: IMessage) {
    const data = JSON.stringify({
      from: `${this.fromName} <${this.fromEmail}>`,
      to: `${message.recipientName} <${message.recipientEmail}>`,
      subject: message.subject,
      text: message.messageText,
    });

    const options = {
      host: `api.mailgun.net`,
      endpoint: '/v3/messages',
      protocol: 'https:',
      port: 443,
      auth: ['api', this.apiKey].join(':'),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': data.length,
        Authorization: `Bearer ${this.apiKey}`,
      },
    };

    return this.createPromise(options, data);
  }
}
