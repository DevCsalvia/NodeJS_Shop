const nodemailer = require("nodemailer");

module.exports = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

// const mailOptions = {
//   from: "devcsalvia@gmail.com",
//   to: "devcsalvia@gmail.com",
//   subject: "Letter through node.js",
//   text: "Letter content",
// };
//
// transporter.sendMail(mailOptions, (err) => {
//   console.log(err);
// });
