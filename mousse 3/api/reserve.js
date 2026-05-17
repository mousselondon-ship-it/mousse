import nodemailer from 'nodemailer';

// Gmail SMTP transporter using Google Workspace app password
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GOOGLE_EMAIL,       // hello@moussewine.co.uk
    pass: process.env.GOOGLE_APP_PASSWORD // 16-char app password from Google
  }
});

export default async function handler(req, res) {
  // Only accept POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, contact, day, selection, notes } = req.body;

  // Basic validation
  if (!name || !contact || !day || !selection) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Format the selection list nicely for the email
  const selectionLines = selection
    .split(' | ')
    .map(line => `• ${line}`)
    .join('\n');

  // Reference number
  const ref = 'MSS-' + Math.random().toString(36).slice(2, 7).toUpperCase();

  try {
    // Email to Mousse (you)
    await transporter.sendMail({
      from: `"Mousse Reservations" <${process.env.GOOGLE_EMAIL}>`,
      to: process.env.GOOGLE_EMAIL,
      subject: `New reservation — ${name} — ${day}`,
      text: `
New reservation received.

Ref: ${ref}
Name: ${name}
Contact: ${contact}
Collection: ${day}

Selection:
${selectionLines}

${notes ? `Notes: ${notes}` : ''}
      `.trim(),
    });

    // Confirmation email to customer (if they gave an email address)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(contact)) {
      await transporter.sendMail({
        from: `"Mousse" <${process.env.GOOGLE_EMAIL}>`,
        to: contact,
        subject: `Your Mousse reservation — ${ref}`,
        text: `
Hi ${name},

Thanks for reserving with Mousse. We'll have your bottles set aside.

Ref: ${ref}
Collection: ${day}

What you've reserved:
${selectionLines}

Just give us your name when you arrive — payment on collection.
If plans change, drop us a message at hello@moussewine.co.uk.

See you at the stall,
Mousse
        `.trim(),
      });
    }

    return res.status(200).json({ success: true, ref });

  } catch (error) {
    console.error('Email error:', error);
    return res.status(500).json({ error: 'Failed to send confirmation' });
  }
}
