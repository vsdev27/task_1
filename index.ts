require("dotenv").config();

export var express = require('express');
export var bodyParser = require('body-parser');
export var mongoose = require('mongoose');
export var md5= require('md5')
export var jwt= require('jsonwebtoken')

export const app = express();
const port = process.env.PORT || 4000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const mongourl= (process.env.MONGO_URL)?.toString()
if (!mongourl) {
 throw new Error('Mongo url not provided');
}

app.listen(port, () => {
  console.log(`app is listening at port ${port}`);
});

mongoose.connect(mongourl)
 .then(() => {
   console.log(`database connected successfully!`);
 })
 .catch((error:any) => {
   console.log('mongo connection error', error);
 });
mongoose.pluralize(null);

require('./settings/url_setting')