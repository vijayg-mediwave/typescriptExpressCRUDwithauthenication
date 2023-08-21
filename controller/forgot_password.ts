import express, { Request, Response } from "express";
const router = express.Router();
import db from "../models";
const argon2 = require("argon2")
const { sendEmail } = require('../emails/sendEmails')

interface MailOptions {
  host?: string,
  from: string,
  to: string,
  subject: string,
  text: string,
}

//const otp = () => Math.floor(1000 + Math.random() * 9000).toString();

const generateToken = () => {
  let text = '';
  const charset = 'abcdefghijklmnopqrstuvwxyz0123456789';
  for (var i = 0; i < 36; i++)
    text += charset.charAt(Math.floor(Math.random() * charset.length));
  return text;
}

router.post('/', async (req: Request, res: Response, next) => {
  const { email } = req.body;

  try {
    const user = await db.User.findOne({
      where: { email },
      attributes: ['id', 'Password_reset',]
    });


    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const token = generateToken()
    if (token) {
      user.Password_reset = token
    }
    await user.save()

    // Send reset email
    const mailOptions: MailOptions = {
      from: 'vijay_g@mindwaveventures.com',
      to: req.body.email,
      subject: 'Rest Password',
      text: `click this link to change your password ${process.env.BASE_URL}/forgot-password/reset-password/${user.id}?${token}`,
    };

    await sendEmail(mailOptions);

    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    next(error);
  }
});



router.post('/reset-password/:userid?', async (req: Request, res: Response, next) => {
  try {
    const user = await db.User.findOne({
      where: {
        id: req.params.userid
      },
      attributes: ['id', 'name', 'email', 'password', 'Password_reset']
    })

    if (!user) {
      return res.status(403).send({
        "msg": "user not exist"
      })
    }

    const passwordHash = await argon2.hash(req.body.password);

    if (req.body.password) {
      user.password = passwordHash
      user.Password_reset = ''
    }

    await user.save()
    res.send("password reset sucessfully.");
  } catch (error) {
    next(error)
  }

})

module.exports = router