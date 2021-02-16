import { describe, it } from 'mocha';
import { expect } from 'chai';
import * as dotenv from 'dotenv';
import MailGunSender from '../src/services/MailGunSender';
import Message, { IMessage } from '../src/model/message';

dotenv.config();

if (
  !process.env.API_KEY_MAILGUN ||
  !process.env.FROM_NAME_MAILGUN ||
  !process.env.FROM_EMAIL_MAILGUN
) {
  process.exit(1);
}

const sender = new MailGunSender(
  process.env.API_KEY_MAILGUN,
  process.env.FROM_NAME_MAILGUN,
  process.env.FROM_EMAIL_MAILGUN,
  'mailgun'
);

const message: IMessage = new Message({
  recipientName: 'nexus',
  recipientEmail: 'contact+challenge@nexuspoint.dev',
  subject: 'hello',
  messageText: 'This is a test message',
});

describe('MailGunSender', () => {
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
