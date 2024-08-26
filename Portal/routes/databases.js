const express = require('express');
const router = express.Router();
// const dynamicDatabaseService = require('../services/dynamicDatabaseService');
const dynamicTableService = require('../services/dynamicTableService');


// router.post('/create', async (req, res) => {
//   try {
//     const { dbName } = req.body;
//     await dynamicDatabaseService.createDatabase(dbName);
//     res.json({ message: 'Database created successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Failed to create database' });
//   }
// });
router.post('/create', async (req, res) => {
  const { dialect, dbName } = req.body;

  try {
    await dynamicTableService.createDatabase(dialect, dbName);
    res.status(200).json({ message: `Database ${dbName} created successfully` });
  } catch (error) {
    console.error('Error creating database:', error);
    res.status(500).json({ error: 'Error creating database' });
  }
});

// Get available databases
router.get('/', async (req, res) => {
  try {
    const { type } = req.query;
    const databases = await dynamicTableService.getDatabases(type);
    res.json(databases);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Get available tables in a database
router.post('/:dbName/tables', async (req, res) => {
  const { dbType, dbName } = req.body;
  
  try {
    const tables = await dynamicTableService.getTables(dbType, dbName);
    res.json(tables);
  } catch (error) {
    console.error('Error fetching tables:', error);
    res.status(500).json({ error: 'Failed to fetch tables' });
  }
});
// // Get columns of a table
router.post('/:dbName/tables/:tableName/columns', async (req, res) => {
  const { dbType, dbName, tableName } = req.body;
  
  try {
    const columns = await dynamicTableService.getColumns(dbType, dbName, tableName);
    res.json(columns);
  } catch (error) {
    console.error('Error fetching columns:', error);
    res.status(500).json({ error: 'Failed to fetch columns' });
  }
});

// Insert data into a table
router.post('/:dbName/tables/:tableName/insert', async (req, res) => {
  const { dbType, dbName, tableName, data } = req.body;

  try {
    const result = await dynamicTableService.insertData(dbType, dbName, tableName, data);
    res.json({ success: true, result });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'Failed to insert data' });
  }
});

router.post('/filter', async (req, res) => {
  try {
    const data = await dynamicTableService.filterData(req.body);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// router.post('/:dbName/tables/:tableName/filter', async (req, res) => {
//   const { dbType, query } = req.body;
//   const { dbName, tableName } = req.params;

//   try {
//     const data = await dynamicTableService.filterData(dbType, dbName, tableName, query);
//     res.json(data);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });
// router.post('/:dbName/tables/:tableName/filter', async (req, res) => {
//   const { dbType, query } = req.body;
//   const { dbName, tableName } = req.params;

//   try {
//     const data = await dynamicTableService.filterData(dbType, dbName, tableName, query);
//     res.json(data);
//   } catch (error) {
//     console.error('Error filtering data:', error.message);
//     res.status(500).json({ error: error.message });
//   }
// });

 
module.exports = router;
