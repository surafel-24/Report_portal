const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { sequelize } = require('./models');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Import routes
const tableRoutes = require('./routes/tables');
const databaseRoutes = require('./routes/databases');
const filterRoutes = require('./routes/filter.routes');

app.use('/tables', tableRoutes);
app.use('/databases', databaseRoutes); 
app.use('/filter', filterRoutes);

// Sync models and start server
sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
});
