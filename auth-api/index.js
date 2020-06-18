const express = require('express');
const bodyParser = require('body-parser');

const db = require('./server/src/models');



const app = express();

// db.sequelize.sync();
db.sequelize.sync({ force: true }).then(() => {
   console.log("Drop and re-sync db.");
   // run();
});

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

const port = process.env.PORT || 8000;

// when a random route is inputed
app.get('*', (req, res) => res.status(200).send({
   message: 'Welcome to this API.'
}));

app.listen(port, () => {
   console.log(`Server is running on PORT ${port}`);
});