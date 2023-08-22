require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');

const router = require('./routes/route');
const app = express();
app.set('view engine', 'ejs');
mongoose.set('strictQuery', false);

mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connection to MongoDB: ", err);
  })


app.listen(3001, () => {
  console.log("Server started");
})

app.use(express.urlencoded({ extended: true }));
app.use(express.json())

app.use(session({
  secret: process.env.SESSION_SECRET,
  cookie: { sameSite: 'strict' },
  saveUninitialized: true,
  resave: false
}))

app.use((req, res, next) => {
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate');
  res.header('Expires', '0');
  res.header('Pragma', 'no-cache');
  next();
})


app.use('/', router);