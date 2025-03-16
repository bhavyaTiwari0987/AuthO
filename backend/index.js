// BACKEND: Node.js + Express with Auth0 & Nodemailer

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import jwt from "jsonwebtoken";
import axios from "axios";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
const SMTP_EMAIL = process.env.SMTP_EMAIL;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: SMTP_EMAIL,
    pass: SMTP_PASSWORD,
  },
});

app.post("/auth/callback", async (req, res) => {
  const { token } = req.body;
  if(!token)throw new Error("token is required!");

  try {
    const response = await axios.get(`https://${AUTH0_DOMAIN}/userinfo`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if(!response)throw new Error("Unable to authrorize token, try again later!");
    
    const userEmail = response.data.email;

    await transporter.sendMail({
      from: SMTP_EMAIL,
      to: userEmail,
      subject: "Your Auth Token",
      text: `Your authentication token is: ${token}`,
    });

    res.status(200).json({ message: "Token validated and email sent." });
  } catch (error) {
    res.status(400).json({ error: "Invalid token." });
  }
});

app.get("/", (req, res) =>{
  res.send('<h1>Oauth</h1>');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));