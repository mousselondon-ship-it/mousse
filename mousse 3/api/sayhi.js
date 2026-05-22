import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Notify Mousse
    await resend.emails.send({
      from: 'Mousse <hello@moussewines.co.uk>',
      to: process.env.NOTIFICATION_EMAIL,
      subject: 'Say Hi -- ' + name,
      replyTo: email,
      text: [
        'New message from moussewines.co.uk',
        '',
        'Name: ' + name,
        'Email: ' + email,
        '',
        'Message:',
        message,
      ].join('\n'),
    });

    // Confirmation to sender
    await resend.emails.send({
      from: 'Mousse <hello@moussewines.co.uk>',
      to: email,
      subject: "Thanks for getting in touch",
      text: [
        'Hi ' + name + ',',
        '',
        "Thanks for your message -- we'll get back to you soon.",
        '',
        'Mousse',
        'moussewines.co.uk',
      ].join('\n'),
    });

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Say Hi error:', error);
    return res.status(500).json({ error: 'Failed to send' });
  }
}
