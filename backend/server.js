const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({ origin: '*' }));

app.post('/send-email', async (req, res) => {
    const { name, email, message } = req.body;

    // Step 1: Send a notification email to your email address
    const transporterForNotification = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const notificationMailOptions = {
        from: process.env.EMAIL_USER,
        to: 'arorasam2109@gmail.com', // Replace with your actual email address
        subject: 'New Contact Form Submission',
        html: `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong> ${message}</p>
    `,
    };

    try {
        await transporterForNotification.sendMail(notificationMailOptions);
        console.log('Notification email sent successfully');
    } catch (error) {
        console.error('Error sending notification email:', error);
    }

    // Step 2: Send a thank you email to the user
    const transporterForUser = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const userMailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Thank you for contacting us',
        html: `
      <p>Dear ${name},</p>
      <p>Thank you for contacting us. We appreciate your message:</p>
      <p>${message}</p>
      <p>We will get back to you as soon as possible.</p>
    `,
    };

    try {
        await transporterForUser.sendMail(userMailOptions);
        console.log('Thank you email sent to the user successfully');
    } catch (error) {
        console.error('Error sending thank you email to the user:', error);
    }

    res.status(200).send('Message sent successfully');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
