const express = require('express');
const nodemailer = require('nodemailer');

const app = express();
app.use(express.json());

const transporter = nodemailer.createTransport({
    name: 'test.com',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'dropinnotifier@gmail.com',
      pass: 'moxn camx rqei jqox',
    }
});

app.post('/send-slot-open-notification', (req, res) => {
    const { email } = req.body;
    
    const mailOptions = {
        from: 'dropinnotifier@gmail.com',
        to: email,
        subject: 'Spot Open!',
        text: 'A slot has opened up. Visit to book: https://cityofmarkham.perfectmind.com/Clients/BookMe4BookingPages/Classes?calendarId=491a603e-4043-4ab6-b04d-8fac51edbcfc&widgetId=6825ea71-e5b7-4c2a-948f-9195507ad90a&embed=False'
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
        console.log('Error: ' +  error);
        } else {
        console.log('Email sent: ' + info.response);
        }
    });
});


app.listen(3000, () => {
    console.log('server is running on port '+ 3000);
});
