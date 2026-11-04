require('dotenv').config({path:'.env.local'});
const nodemailer = require('nodemailer');
async function send(){
  const t = nodemailer.createTransport({
    service:'gmail',
    auth:{user:process.env.PERSONAL_EMAIL, pass:process.env.PERSONAL_EMAIL_PASS}
  });
  await t.sendMail({
    from:'NANIE AI VENUS <naniebsm@gmail.com>',
    to:'naniebsm@gmail.com',
    subject:'NANIE AI VENUS - Email Works! GOD NANIE!',
    text:'GOD NANIE! Your NANIE AI email works! COM8 D4 CLICK! 12:14 AM Dubai - Better than CHINNA! NIL AMOUNT WIN! Your main mail naniebsm@gmail.com connected to NANIE AI VENUS!'
  });
  console.log('Email sent to GOD NANIE!');
}
send();