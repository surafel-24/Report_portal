const express = require('express');
const router = express.Router();
const dynamicTableService = require('../services/dynamicTableService');

router.post('/create',

  async function createTable(req, res) {
    const { dbType, dbName, tableName, columns } = req.body;
  
    // Log received data
    console.log(`Received Data:`, {
      dbType,
      dbName,
      tableName,
      columns
    });
  
    // Validate that columns is an array
    if (!Array.isArray(columns)) {
      console.error('Error: Columns parameter must be an array');
      return res.status(400).send('Columns parameter must be an array');
    }
  
    try {
      await dynamicTableService.createTable(dbType, dbName, tableName, columns);
      res.status(200).send('Table created successfully');
    } catch (error) {
      console.error('Error creating table:', error);
      res.status(500).send('Error creating table');
    }
  }
  
  //  async (req, res) => {
  //   try {
  //     const { dbName, tableName, columns } = req.body;
  //     // Validate request body
  //     if (!dbName || !tableName || !Array.isArray(columns) || columns.length === 0) {
  //       return res.status(400).json({ error: 'Invalid input' });
  //     }
  //     await dynamicTableService.createTable(dbName, tableName, columns);
  //     res.json({ message: 'Table created successfully' });
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ error: 'Failed to create table' });
  //   }
  // }
);

  // router.post('/create', async (req, res) => {
  //   try {
  //     const { dbType, dbName, tableName, columns } = req.body;
  //     if (!dbType || !dbName || !tableName || !Array.isArray(columns) || columns.length === 0) {
  //       return res.status(400).json({ error: 'Invalid input' });
  //     }
  //     await dynamicTableService.createTable(dbType, dbName, tableName, columns);
  //     res.json({ message: 'Table created successfully' });
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ error: 'Failed to create table' });
  //   }
  // });

router.post('/addColumn', async (req, res) => {
  try {
    const { tableName, columnName, columnType } = req.body;
    await dynamicTableService.addColumn(tableName, columnName, columnType);
    res.json({ message: 'Column added successfully' }); // Send a JSON response
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add column' });
  }
});

router.get('/data/:tableName', async (req, res) => {
  try {
    const { tableName } = req.params;
    const data = await dynamicTableService.getTableData(tableName);
    res.json(data); // Send a JSON response
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve table data' });
  }
});

// Insert data into a table
router.post('/tables/:dbType/:dbName/:tableName/insert', async (req, res) => {
  const { dbType, dbName, tableName } = req.params;
  const data = req.body;

  try {
      await dynamicTableService.insertData(dbType, dbName, tableName, data);
      res.status(200).json({ message: 'Data inserted successfully' });
  } catch (error) {
      console.error('Error inserting data:', error);
      res.status(500).json({ message: 'Error inserting data', error });
  }
});

module.exports = router;
