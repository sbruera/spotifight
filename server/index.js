const dotenv = require("dotenv");
const port = 5000;
const app = require('./app');
const mongoose = require('mongoose');

dotenv.config();

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
  })
  .then(() => {
    console.log('DB Connection Successful');
  });


app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
