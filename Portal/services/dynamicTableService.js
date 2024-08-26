// const Sequelize = require('sequelize');
// const mongoose = require('mongoose');
// const config = require('../config/database');

// // Function to create a database based on the selected dialect
// async function createDatabase(dialect, dbName) {
//   if (dialect === 'mongodb') {
//     // MongoDB does not need explicit database creation; it creates the database on the first operation
//     return;
//   } else if (dialect === 'postgres') {
//     const dbConfig = config.postgres.development;

//     // Connect to PostgreSQL server without specifying a database
//     const sequelize = new Sequelize({
//       dialect: 'postgres',
//       host: dbConfig.host,
//       username: dbConfig.username,
//       password: dbConfig.password,
//       database: 'postgres', // Connect to the default postgres database
//       logging: false // Disable logging
//     });

//     try {
//       // Attempt to create the target database
//       await sequelize.query(`CREATE DATABASE ${dbName};`);
//       console.log(`Database ${dbName} created successfully`);
//     } catch (error) {
//       if (error.original.code === '42P04') {
//         console.log(`Database ${dbName} already exists`);
//       } else {
//         console.error('Error creating database:', error);
//         throw error;
//       }
//     } finally {
//       await sequelize.close(); // Close the connection
//     }
//   } else {
//     // Handle other databases (e.g., MySQL)
//     const sequelize = new Sequelize(config[dialect].development.database, config[dialect].development.username, config[dialect].development.password, {
//       host: config[dialect].development.host,
//       dialect: dialect,
//     });

//     try {
//       await sequelize.query(`CREATE DATABASE IF NOT EXISTS ${dbName};`);
//       console.log(`Database ${dbName} created successfully`);
//     } catch (error) {
//       console.error('Error creating database:', error);
//       throw error;
//     } finally {
//       await sequelize.close(); // Close the connection
//     }
//   }
// }
// // Function to create a table in the chosen database
// async function createTable(dialect, dbName, tableName, columns) {

//   // Check if columns is an array
//   if (!Array.isArray(columns)) {
//     console.error('Error: Columns parameter must be an array');
//     throw new Error('Columns parameter must be an array');
//   }

//   const dbConfig = config[dialect];
//   if (!dbConfig || !dbConfig.development) {
//     throw new Error(`Configuration for ${dialect} not found`);
//   }

//   // Map frontend column types to SQL types
//   const typeMapping = {
//     'String': 'VARCHAR(255)', // Adjust size as needed
//     'Number': 'INT', // Adjust type as needed
//     'Date': 'DATE',
//     // Add more mappings as needed
//   };

//   if (dialect === 'mongodb') {
//     // MongoDB schema handling
//     const columnTypes = {
//       'String': String,
//       'Number': Number,
//       'Date': Date,
//       // Add other types as needed
//     };

//     const mongooseSchema = new mongoose.Schema(
//       columns.reduce((acc, col) => {
//         const type = columnTypes[col.type] || String; // Default to String type if type is unknown
//         acc[col.name] = { type: type };
//         return acc;
//       }, {})
//     );

//     const modelName = tableName.charAt(0).toUpperCase() + tableName.slice(1);
//     mongoose.model(modelName, mongooseSchema);

//     console.log(`MongoDB collection ${tableName} created successfully`);
//   } else {
//     // Create a new Sequelize instance with the database name specified
//     const sequelize = new Sequelize(dbName, dbConfig.development.username, dbConfig.development.password, {
//       host: dbConfig.development.host,
//       dialect: dialect,
//     });

//     // Construct the column definitions for SQL databases
//     const columnsStr = columns.map(col => {
//       if (!col.name || !col.type) {
//         throw new Error('Each column must have a name and type');
//       }
//       const sqlType = typeMapping[col.type] || 'VARCHAR(255)'; // Default to VARCHAR(255) if type is unknown
//       return `${col.name} ${sqlType}`;
//     }).join(', ');

//     const query = `CREATE TABLE IF NOT EXISTS ${tableName} (${columnsStr});`;

//     try {
//       await sequelize.query(query);
//       console.log(`Table ${tableName} created successfully`);
//     } catch (error) {
//       console.error('Error creating table:', error);
//       throw error;
//     }
//   }
// }



// async function insertData(dialect, dbName, tableName, data) {
//   if (dialect === 'mongodb') {
//       const mongoose = require('mongoose');
//       const modelName = tableName.charAt(0).toUpperCase() + tableName.slice(1);
//       const Model = mongoose.model(modelName);

//       try {
//           await Model.create(data);
//           console.log('Data inserted successfully into MongoDB');
//       } catch (error) {
//           console.error('Error inserting data into MongoDB:', error);
//           throw error;
//       }
//   } else {
//       const sequelize = new Sequelize(dbName, config[dialect].development.username, config[dialect].development.password, {
//           host: config[dialect].development.host,
//           dialect: dialect,
//       });

//       const columns = Object.keys(data).map(key => `${key}`).join(', ');
//       const values = Object.values(data).map(value => `'${value}'`).join(', ');

//       const query = `INSERT INTO ${tableName} (${columns}) VALUES (${values});`;

//       try {
//           await sequelize.query(query);
//           console.log('Data inserted successfully into SQL table');
//       } catch (error) {
//           console.error('Error inserting data into SQL table:', error);
//           throw error;
//       }
//   }
// }

// module.exports = {
//   createDatabase,
//   createTable,
//   insertData
// };

const {Sequelize, Op} = require('sequelize');
const { MongoClient } = require('mongodb');
const { mysql, postgres, mongodb } = require('../config/database');
const config = require('../config/database');

// Initialize Sequelize for MySQL and PostgreSQL
const mysqlSequelize = new Sequelize(mysql.development);
const postgresSequelize = new Sequelize(postgres.development);

const mongoUri = mongodb.development.uri;
let mongoClient;

MongoClient.connect(mongoUri, { useUnifiedTopology: true })
  .then(client => {
    mongoClient = client.db();
  })
  .catch(err => console.error('MongoDB connection error:', err));

module.exports = {
  // Get available databases based on type
  getDatabases: async (dbType) => {
    switch (dbType) {
      case 'mysql':
        return await mysqlSequelize.query("SHOW DATABASES;", { type: Sequelize.QueryTypes.SHOWTABLES });
      case 'postgres':
        return await postgresSequelize.query("SELECT datname FROM pg_database WHERE datistemplate = false;", { type: Sequelize.QueryTypes.SELECT });
      case 'mongodb':
        return await mongoClient.admin().listDatabases();
      default:
        throw new Error(`Unsupported database type: ${dbType}`);
    }
  },


  getTables: async (dbType, dbName) => {
    switch (dbType) {
      case 'mysql':
        const mysqlDbConnection = new Sequelize({ ...mysql.development, database: dbName });
        return await mysqlDbConnection.query("SHOW TABLES;", { type: Sequelize.QueryTypes.SHOWTABLES });
      case 'postgres':
        const postgresDbConnection = new Sequelize({ ...postgres.development, database: dbName });
        return await postgresDbConnection.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';", { type: Sequelize.QueryTypes.SELECT });
      case 'mongodb':
        const mongoDbConnection = mongoClient.db(dbName);
        return await mongoDbConnection.listCollections().toArray();
      default:
        throw new Error(`Unsupported database type: ${dbType}`);
    }
  },

// Get columns of a table
getColumns: async (dbType, dbName, tableName) => {
  switch (dbType) {
    case 'mysql':
      const mysqlDbConnection = new Sequelize({ ...mysql.development, database: dbName });
      const [mysqlColumns] = await mysqlDbConnection.query(`SHOW COLUMNS FROM ${tableName};`);
      return mysqlColumns.filter(col => !['id', 'created_at', 'updated_at'].includes(col.Field))
                         .map(col => ({ name: col.Field, type: col.Type }));

    case 'postgres':
      const postgresDbConnection = new Sequelize({ ...postgres.development, database: dbName });
      const postgresColumns = await postgresDbConnection.query(`
        SELECT column_name, data_type
        FROM information_schema.columns 
        WHERE table_name = '${tableName}' AND column_name NOT IN ('id', 'created_at', 'updated_at');
      `, { type: Sequelize.QueryTypes.SELECT });
      return postgresColumns.map(col => ({ name: col.column_name, type: col.data_type }));

    case 'mongodb':
      // MongoDB collections don’t have a strict schema, so no need to filter
      const mongoDbConnection = mongoClient.db(dbName);
      const collectionInfo = await mongoDbConnection.listCollections({ name: tableName }).toArray();
      return collectionInfo[0].options.validator ? Object.keys(collectionInfo[0].options.validator.$jsonSchema.properties) : [];

    default:
      throw new Error(`Unsupported database type: ${dbType}`);
  }
},

  // getColumns: async (dbType, dbName, tableName) => {
  //   switch (dbType) {
  //     case 'mysql':
  //       const mysqlDbConnection = new Sequelize({ ...mysql.development, database: dbName });
  //       return await mysqlDbConnection.query(`SHOW COLUMNS FROM ${tableName};`, { type: Sequelize.QueryTypes.DESCRIBE });
  //     case 'postgres':
  //       const postgresDbConnection = new Sequelize({ ...postgres.development, database: dbName });
  //       return await postgresDbConnection.query(`SELECT column_name FROM information_schema.columns WHERE table_name = '${tableName}';`, { type: Sequelize.QueryTypes.SELECT });
  //     case 'mongodb':
  //       const mongoDbConnection = mongoClient.db(dbName);
  //       const collection = mongoDbConnection.collection(tableName);
  //       const indexes = await collection.indexes(); // Gets the indexes which include field names
  //       return indexes.map(index => Object.keys(index.key));
  //     default:
  //       throw new Error(`Unsupported database type: ${dbType}`);
  //   }
  // },
  
  insertData: async (dbType, dbName, tableName, data) => {
    if (!dbType) {
      throw new Error('Unsupported database type: undefined');
    }
  
    switch (dbType) {
      case 'mysql':
        const mysqlDbConnection = new Sequelize({ ...mysql.development, database: dbName });
  
        const mysqlKeys = Object.keys(data).join(', ');
        const mysqlValues = Object.values(data).map(value => `'${value}'`).join(', ');
  
        await mysqlDbConnection.query(
          `INSERT INTO ${tableName} (${mysqlKeys}) VALUES (${mysqlValues});`
        );
        break;
  
      case 'postgres':
        const postgresDbConnection = new Sequelize({ ...postgres.development, database: dbName });
  
        const postgresKeys = Object.keys(data).join(', ');
        const postgresValues = Object.values(data).map(value => `'${value}'`).join(', ');
  
        await postgresDbConnection.query(
          `INSERT INTO ${tableName} (${postgresKeys}) VALUES (${postgresValues});`
        );
        break;
  
      case 'mongodb':
        const mongoDbConnection = mongoClient.db(dbName);
        const collection = mongoDbConnection.collection(tableName);
        await collection.insertOne(data);
        break;
  
      default:
        throw new Error(`Unsupported database type: ${dbType}`);
    }
  },
  

// Function to create a database based on the selected dialect
createDatabase: async (dialect, dbName) => {
  if (dialect === 'mongodb') {
    // MongoDB does not need explicit database creation; it creates the database on the first operation
    return;
  } else if (dialect === 'postgres') {
    const dbConfig = config.postgres.development;

    // Connect to PostgreSQL server without specifying a database
    const sequelize = new Sequelize({
      dialect: 'postgres',
      host: dbConfig.host,
      username: dbConfig.username,
      password: dbConfig.password,
      database: 'postgres', // Connect to the default postgres database
      logging: false // Disable logging
    });

    try {
      // Attempt to create the target database
      await sequelize.query(`CREATE DATABASE ${dbName};`);
      console.log(`Database ${dbName} created successfully`);
    } catch (error) {
      if (error.original.code === '42P04') {
        console.log(`Database ${dbName} already exists`);
      } else {
        console.error('Error creating database:', error);
        throw error;
      }
    } finally {
      await sequelize.close(); // Close the connection
    }
  } else {
    // Handle other databases (e.g., MySQL)
    const sequelize = new Sequelize(config[dialect].development.database, config[dialect].development.username, config[dialect].development.password, {
      host: config[dialect].development.host,
      dialect: dialect,
    });

    try {
      await sequelize.query(`CREATE DATABASE IF NOT EXISTS ${dbName};`);
      console.log(`Database ${dbName} created successfully`);
    } catch (error) {
      console.error('Error creating database:', error);
      throw error;
    } finally {
      await sequelize.close(); // Close the connection
    }
  }
},
// Function to create a table in the chosen database
createTable: async (dialect, dbName, tableName, columns) => {

  // Check if columns is an array
  if (!Array.isArray(columns)) {
    console.error('Error: Columns parameter must be an array');
    throw new Error('Columns parameter must be an array');
  }

  const dbConfig = config[dialect];
  if (!dbConfig || !dbConfig.development) {
    throw new Error(`Configuration for ${dialect} not found`);
  }

  // Map frontend column types to SQL types
  const typeMapping = {
    'String': 'VARCHAR(255)', // Adjust size as needed
    'Number': 'INT', // Adjust type as needed
    'Date': 'DATE',
    // Add more mappings as needed
  };

  if (dialect === 'mongodb') {
    // MongoDB schema handling
    const columnTypes = {
      'String': String,
      'Number': Number,
      'Date': Date,
      // Add other types as needed
    };

    const mongooseSchema = new mongoose.Schema(
      columns.reduce((acc, col) => {
        const type = columnTypes[col.type] || String; // Default to String type if type is unknown
        acc[col.name] = { type: type };
        return acc;
      }, {})
    );

    const modelName = tableName.charAt(0).toUpperCase() + tableName.slice(1);
    mongoose.model(modelName, mongooseSchema);

    console.log(`MongoDB collection ${tableName} created successfully`);
  } else {
    // Create a new Sequelize instance with the database name specified
    const sequelize = new Sequelize(dbName, dbConfig.development.username, dbConfig.development.password, {
      host: dbConfig.development.host,
      dialect: dialect,
    });

    // Construct the column definitions for SQL databases
    const columnsStr = columns.map(col => {
      if (!col.name || !col.type) {
        throw new Error('Each column must have a name and type');
      }
      const sqlType = typeMapping[col.type] || 'VARCHAR(255)'; // Default to VARCHAR(255) if type is unknown
      return `${col.name} ${sqlType}`;
    }).join(', ');

    const query = `CREATE TABLE IF NOT EXISTS ${tableName} (${columnsStr});`;

    try {
      await sequelize.query(query);
      console.log(`Table ${tableName} created successfully`);
    } catch (error) {
      console.error('Error creating table:', error);
      throw error;
    }
  }
},
// filterData: async ({ dbType, dbName, tableName, filters }) => {
//   let query = `SELECT * FROM ${tableName} WHERE `;
//   filters.forEach((filter, index) => {
//     query += `${filter.column} ${filter.condition} '${filter.value}'`;
//     if (index < filters.length - 1) query += ' AND ';
//   });

filterData: async (dbType, dbName, tableName, query) => {
  if (!query || !query.conditions) {
    throw new Error('No filter conditions provided.');
  }

  switch (dbType) {
    case 'mysql':
      const mysqlConnection = new Sequelize({ /* MySQL config */ });
      const whereClause = query.conditions.reduce((acc, condition) => {
        if (!condition.column || !condition.operator || !condition.value) {
          throw new Error('Invalid condition structure');
        }
        acc[condition.column] = {
          [Op[condition.operator]]: condition.value
        };
        return acc;
      }, {});

      return await mysqlConnection.query(
        `SELECT * FROM ${tableName} WHERE ${Object.keys(whereClause).map(key => `${key} ${whereClause[key]}`).join(' AND ')};`,
        { type: Sequelize.QueryTypes.SELECT }
      );

    case 'postgres':
      const postgresConnection = new Sequelize({ ...postgres.development, database: dbName });
      const postgresWhereClause = query.conditions.map(condition => `${condition.column} ${condition.operator} '${condition.value}'`).join(' AND ');
      return await postgresConnection.query(
        `SELECT * FROM ${tableName} WHERE ${postgresWhereClause};`,
        { type: Sequelize.QueryTypes.SELECT }
      );
      
    case 'mongodb':
      const mongoDbConnection = mongoClient.db(dbName);
      const collection = mongoDbConnection.collection(tableName);
      const mongoWhereClause = query.conditions.reduce((acc, condition) => {
        acc[condition.column] = { [`$${condition.operator.toLowerCase()}`]: condition.value };
        return acc;
      }, {});
      return await collection.find(mongoWhereClause).toArray();
      
    default:
      throw new Error(`Unsupported database type: ${dbType}`);
  }
}
};

// async function filterData(dbType, dbName, tableName, query) {
//   // Implement the logic to connect to the database based on dbType
//   // Execute the filtering operation using the query object
//   // Return the filtered data
// }

// module.exports = { filterData };
