const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use((req, res, next) => {

  // console.table({ token: req });

  res.setHeader('Access-Control-Allow-Origin', "*");
  res.setHeader(
      'Access-Control-Allow-Methods',
      'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
  }
  next();
});

require('./server/routes/router')(app);

const db = require('./server/src/models');

const Role = db.Role; 

// db.sequelize.sync();
db.sequelize.sync({ force: true }).then(() => {
   console.log("Drop and re-sync db.");
   initial();
});


app.use(bodyParser.urlencoded({ extended: false }));

const port = process.env.PORT || 3000;

app.listen(port, () => {
   console.log(`Server is running on PORT ${port}`);
});

function initial(){
   Role.create({
     id: 1,
     name: "USER"
   });
   
   Role.create({
     id: 2,
     name: "ADMIN"
   });
   
   Role.create({
     id: 3,
     name: "PM"
   });
} 