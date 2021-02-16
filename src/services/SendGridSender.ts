import SenderAbstract from './SenderAbstract';
import { IMessage } from '../model/message';

export default class SendGridSender extends SenderAbstract {
  send(message: IMessage) {
    const data = JSON.stringify({
      personalizations: [
        {
          to: [{ email: message.recipientEmail, name: message.recipientName }],
          subject: message.subject,
        },
      ],
      content: [{ type: 'text/plain', value: message.messageText }],
      from: { email: this.fromEmail, name: this.fromName },
    });

    const options = {
      hostname: 'api.sendgrid.com',
      port: 443,
      path: '/v3/mail/send',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
    };

    return this.createPromise(options, data);
  }
}
