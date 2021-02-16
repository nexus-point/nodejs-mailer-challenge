import { model, Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  recipientName: string;
  recipientEmail: string;
  subject: string;
  messageText: string;
}

const MessageSchema = new Schema({
  recipientName: {
    type: String,
    required: [true, 'Recipient name is required'],
  },
  recipientEmail: {
    type: String,
    required: [true, 'Recipient email is required'],
  },
  subject: { type: String, required: [true, 'Subject is required'] },
  messageText: { type: String, required: [true, 'Message Text is required'] },
});

const Message = model<IMessage>('Message', MessageSchema);

export default Message;
