import nodemailer from 'nodemailer';

interface MailOptions {
  host?: string,
  from: string,
  to: string,
  subject: string,
  text: string, // Corrected to string type
}

const sendEmail = async (mailOptions: MailOptions) => {    
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'vijay_g@mindwaveventures.com', // Your email id
              pass: 'nylyeabpctbuzdpo' // Your password
            }
          });

        await transporter.sendMail(mailOptions);

        console.log("Email sent successfully");
    } catch (error) {
        console.log(error, "Email not sent");
    }
};

module.exports ={sendEmail};
