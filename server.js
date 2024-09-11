const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const multer = require('multer');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const upload = multer();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.REACT_APP_EMAIL,
    pass: process.env.REACT_APP_PASS,
  },
});

app.post('/send-email', upload.single('attachments'), (req, res) => {
  const { to, subject, html } = req.body;
  const attachment = req.file;

  const mailOptions = {
    from: process.env.REACT_APP_EMAIL,
    to,
    subject,
    html,
    attachments: attachment ? [
      {
        filename: attachment.originalname,
        content: attachment.buffer
      }
    ] : []
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error:", error);
      res.status(500).send("Error sending email: " + error.message);
    } else {
      console.log("Email sent:", info.response);
      res.status(200).send("Email sent successfully");
    }
  });
});

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});