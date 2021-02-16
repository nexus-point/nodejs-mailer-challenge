import { describe, it } from 'mocha';
import { expect } from 'chai';
import * as dotenv from 'dotenv';
import SendGridSender from '../src/services/SendGridSender';
import Message, { IMessage } from '../src/model/message';

dotenv.config();

if (
  !process.env.API_KEY_SENDGRID ||
  !process.env.FROM_NAME_SENDGRID ||
  !process.env.FROM_EMAIL_SENDGRID
) {
  process.exit(1);
}

const sender = new SendGridSender(
  process.env.API_KEY_SENDGRID,
  process.env.FROM_NAME_SENDGRID,
  process.env.FROM_EMAIL_SENDGRID,
  'sendgrid'
);

const message: IMessage = new Message({
  recipientName: 'nexus',
  recipientEmail: 'contact+challenge@nexuspoint.dev',
  subject: 'hello',
  messageText: 'This is a test message',
});

describe('SendGridSender', () => {
  it('sent should = true', async () => {
    const sent = await sender
      .send(message)
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
    expect(sent).to.equal(true);
  });
});
