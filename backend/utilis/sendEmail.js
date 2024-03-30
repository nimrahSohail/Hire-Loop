const nodeMailer=require('nodemailer');

const sendEmail=async(options)=>{
    const transporter=nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        service:process.env.SMPT_Service,
        auth:{
            user:process.env.SMPT_Mail,
            pass:process.env.SMPT_Password
        }
    })
    const mailOptions={
        from:process.env.SMPT_Mail,
        to:options.email,
        subject:options.subject,
        text:options.message
    }

    await transporter.sendMail(mailOptions);
}

module.exports=sendEmail;