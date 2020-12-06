const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongojs = require('mongojs');
const db = mongojs('mongodb+srv://tijana:tiksi123456@rasadnik-d4pvx.mongodb.net/Rasadnik?retryWrites=true&w=majority', ['poljoprivrednici', 'admini', 'zahtevi', 'preduzeca', 'narudzbine', 'prodavnica', 'komentari', 'ocene', 'rasadnici', 'sadnice', 'magacini']);
const cors = require("cors");



const app = express();
app.use(cors({ origin: "*" }))
/*
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
*/

const PORT = 4000;
app.listen(PORT, () => console.log('Server is running on port', PORT));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/', require('./routes/index'));


const nodemailer = require('nodemailer')


setInterval(() => {

  db.rasadnici.find((err, rasadnici) => {
    if (err) console.log(err)
    rasadnici.forEach(element => {


      let novi = Number(new Date().getTime() - element.poslednjeAzuriranje)
      let broj = Number(Math.trunc(novi / (60 * 60 * 1000)))

      if (broj >= 1) {
        db.rasadnici.findAndModify({
          query: { _id: mongojs.ObjectId(element._id) },
          update: {
            $inc: { kolicinaVode: (-1) * broj, temperatura: (-0.5) * broj },
            $set: { poslednjeAzuriranje: new Date().getTime() }
          },
          new: true
        }, (err, data) => {
          if (err) console.log(err)

          db.poljoprivrednici.findOne({ username: data.poljoprivrednik }, (err, data1) => {
            if (err) console.log(err)

            if (data.temperatura < 12 || data.kolicinaVode < 75) {
              async function main() {


                // create reusable transporter object using the default SMTP transport
                let transporter = nodemailer.createTransport({
                  service: 'gmail',
                  auth: {
                    user: 'piaporuka@gmail.com',
                    pass: 'piaprojekat'
                  },
                });

                // send mail with defined transport object
                let mailOptions = {
                  from: '"Sluzba za odrzavanje rasadnika" <piaporuka@gmail.com>', // sender address
                  to: `${data1.email}`, // list of receivers-staviti polj kome saljemo
                  subject: "Rasadnici", // Subject line
                  text: `Rasadnik sa nazivom ${element.naziv} zahteva odrzavanje.`, // plain 
                }

                trans.sendMail(mailOptions, function (err, data) {
                  if (err) console.log(err);
                })

              }

            }
          })
        });
      }
    })
  });

}, 15 * 1000)


setInterval(() => {
  db.rasadnici.find((err, rasadnici) => {
    if (err) console.log(err)
    rasadnici.forEach(element => {
      if ((element.kolicinaVode < 75 || element.temperatura < 12) && element.emailPoslat == 0) {

        db.poljoprivrednici.findOne({ username: element.poljoprivrednik }, (err, data1) => {
          if (err) console.log(err)

          let trans = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'piaporuka@gmail.com',
              pass: 'piaprojekat'
            }
          })

          let mailOptions = {
            from: '"Sluzba za odrzavanje rasadnika" <piaporuka@gmail.com>', // sender address
            to: `${data1.email}`, // list of receivers-staviti polj kome saljemo
            subject: "Rasadnici", // Subject line
            text: `Rasadnik sa nazivom ${element.naziv} zahteva odrzavanje.`, // plain 
          }

          trans.sendMail(mailOptions, function (err, data) {
            if (err) console.log(err);
            else {

              element.emailPoslat = 1;
              db.rasadnici.findAndModify({
                query: { _id: mongojs.ObjectId(element._id) },
                update: {
                  $set: { emailPoslat: 1 }
                },
                new: true
              }, (err, data) => {


              });
            }
          })
        })
      }
    })
  })
}, 5 * 1000)