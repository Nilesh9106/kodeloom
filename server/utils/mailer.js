const { createTransport } = require('nodemailer');

const sendMail = async (to, subject, text, html) => {
    const transporter = createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAILID,
        pass: process.env.PASSWORD
      }
    });
    const mailOptions = {
      from: process.env.EMAILID,
      to: to,
      subject: subject,
      text: text,
      html: html
    };
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Message sent: ', info.messageId);
      return { message: 'Email sent successfully', status: true };
    } catch (error) {
      console.log('Error sending email: ', error);
      return { message: 'Error sending email', status: false };
    }
  };

const sendVerificationMail = (to, token) => {
    const subject = 'Email Verification - Kodeloom';
    const text = `Click on the link to verify your email`;
    const html = `<html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f0f0f0;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 20px;
            }
            .content {
                font-size: 16px;
                line-height: 1.5;
                color: #333333;
            }
            .button {
                display: inline-block;
                background-color: #007bff;
                color: white;
                border-radius:10px;
                padding: 10px 20px;
                text-decoration: none;
                width: 120px;
                text-align: center;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="content">
                <div style="display:flex; justify-content:center;"><img src="https://kodeloom.vercel.app/KodeLoom.png" alt="tweepspace" width="100px" height="100px" style="border-radius: 10px;" ></div>
                <h1 class="heading">Welcome to Kodeloom!</h1>
                <p>Thank you for signing up with us. To complete your registration, please verify your email address by clicking the button below.</p>
                <p><a href=${process.env.SITEURL}/verifyEmail/${token} class="button">Verify Email</a></p>
                <p>If you did not sign up with us, please ignore this email.</p><br>
                <p>If you found any trouble in verification, try copy and paste below link in browser.</p>
                <p>${process.env.SITEURL}/verifyEmail/${token}</p>
                <br>
                <p>Feel free to contact us on our <a href="mailto:${process.env.EMAILID}?subject=Feedback">email</a>
                 if you have any questions.</p>
                <p>Best regards,</p>
                <p>Kodeloom Team</p>
            </div>
        </div>
    </body>
    </html>`;
    return sendMail(to, subject, text, html);
  };

  const sendTaskAssignMail = (to, task) => {
    const subject = 'Task Assigned - Kodeloom';
    const text = `You have been assigned a task`;
    const html = `<html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f0f0f0;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 20px;
            }
            .content {
                font-size: 16px;
                line-height: 1.5;
                color: #333333;
            }
            .button {
                display: inline-block;
                background-color: #007bff;
                color: white;
                border-radius:10px;
                padding: 10px 20px;
                text-decoration: none;
                width: 120px;
                text-align: center;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="content">
                <div style="display:flex; justify-content:center;"><img src="https://kodeloom.vercel.app/KodeLoom.png" alt="tweepspace" width="100px" height="100px" style="border-radius: 10px;" ></div>
                <h1 class="heading">Task Assigned</h1>
                <p>You have been assigned a task. Here are the details:</p>
                <div style="border: 1px solid #000; padding: 10px; margin: 10px; border-radius: 5px;">
                  <p><strong>Task Name:</strong> ${task.name}</p>
                  <p><strong>Project:</strong> ${task.project.name}</p>
                  <p><strong>Due Date:</strong> ${task.dueDate}</p>
                  <p><strong>Description:</strong> ${task.description}</p>
                  <p><a href=${process.env.SITEURL}/dashboard/p/${task.project._id} class="button" style="background-color: #4CAF50; border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer;">View Task</a></p>
                </div>
                <br>
                <p>Best regards,</p>
                <p>Kodeloom Team</p>
            </div>
        </div>
    </body>
    </html>`;
    return sendMail(to, subject, text, html);
  }

const sendInviteMail = (to,project,role)=>{
    const subject = 'Invitation to join project - Kodeloom';
    const text = `You have been invited to join a project`;
    const html = `<html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f0f0f0;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 20px;
            }
            .content {
                font-size: 16px;
                line-height: 1.5;
                color: #333333;
            }
            .button {
                display: inline-block;
                background-color: #007bff;
                color: white;
                border-radius:10px;
                padding: 10px 20px;
                text-decoration: none;
                width: 120px;
                text-align: center;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="content">
                <div style="display:flex; justify-content:center;"><img src="https://kodeloom.vercel.app/KodeLoom.png" alt="tweepspace" width="100px" height="100px" style="border-radius: 10px;" ></div>
                <h1 class="heading">Invitation to join project</h1>
                <p>You have been invited to join a project. Here are the details:</p>
                <div style="border: 1px solid #000; padding: 10px; margin: 10px; border-radius: 5px;">
                  <p><strong>Project Name:</strong> ${project.name}</p>
                  <p><strong>Project Description:</strong> ${project.description}</p>
                  <p><strong>Role :</strong> ${role.toUpperCase()}</p>
                  <p><a href=${process.env.SITEURL}/dashboard/invites class="button" style="background-color: #4CAF50; border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer;">View Invites</a></p>
                </div>
                <br>
                <p>Best regards,</p>
                <p>Kodeloom Team</p>
            </div>
        </div>
    </body>
    </html>`;
    return sendMail(to, subject, text, html);
}

module.exports = {
    sendMail,
    sendVerificationMail,
    sendTaskAssignMail,
    sendInviteMail
}