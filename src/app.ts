import express, { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import serverless from 'serverless-http';
import MailGunSender from './services/MailGunSender';
import SendGridSender from './services/SendGridSender';
import Message from './model/message';

dotenv.config();

if (
  !process.env.PORT ||
  !process.env.API_KEY_MAILGUN ||
  !process.env.API_KEY_SENDGRID ||
  !process.env.FROM_NAME_MAILGUN ||
  !process.env.FROM_EMAIL_MAILGUN ||
  !process.env.FROM_NAME_SENDGRID ||
  !process.env.FROM_EMAIL_SENDGRID
) {
  process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);

const senderMailGun = new MailGunSender(
  process.env.API_KEY_MAILGUN,
  process.env.FROM_NAME_MAILGUN,
  process.env.FROM_EMAIL_MAILGUN,
  'mailgun'
);
const senderSendGrid = new SendGridSender(
  process.env.API_KEY_SENDGRID,
  process.env.FROM_NAME_SENDGRID,
  process.env.FROM_EMAIL_SENDGRID,
  'sendgrid'
);

const senders = [senderSendGrid, senderMailGun];

const app = express();

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the mailer API! hello');
});

app.post('/send', async (req: Request, res: Response) => {
  try {
    const message = new Message(req.body);

    await message.validate();

    let errorMessage = '';

    for (const sender of senders) {
      const sent = sender
        .send(message)
        .then(() => {
          return true;
        })
        .catch((e) => {
          let err;
          if (typeof e === 'object' && e !== null) {
            err = JSON.stringify(e);
          } else {
            err = e;
          }
          errorMessage += `sender: ${sender.label} error: ${err}\n`;
          console.error(`sender: ${sender.label} error: ${err}`);
          return false;
        });

      if (sent) {
        res.status(200).send('email has been sent! ');
        return false;
      }
      if (sender === senders[senders.length - 1] && !sent) {
        res.status(500).send(`email has not been sent! ${errorMessage}`);
        return false;
      }
      return true;
    }
  } catch (e) {
    console.error(e.message);
    res.status(500).send(e.message);
  }
  return true;
});

app.listen(PORT, () =>
  console.log(`server is listening on ${PORT}, thanks for checking! hello`)
);

module.exports.handler = serverless(app);
