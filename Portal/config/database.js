// // // config/database.js   
      
// // module.exports = {
// //         development: {
// //             dialect: 'mysql',
// //             host: 'localhost',
// //             database: 'test',
// //             username: 'root',
// //             password: 'root'
// //         },
// //         test: {
// //           dialect: 'mysql', // or 'postgres'
// //           host: 'localhost',
// //           database: 'your_test_database',
// //           username: 'root', // or 'postgres'
// //           password: 'your_password'
// //         },
// //         production: {
// //           dialect: 'mysql', // or 'postgres'
// //           host: 'localhost',
// //           database: 'your_production_database',
// //           username: 'root', // or 'postgres'
// //           password: 'your_password'
// //         },

// //         development: {
// //             dialect: 'postgres',
// //             host: 'localhost',
// //             database: 'test',
// //             username: 'postgres',
// //             password: 'root'
// //         },
// //         test: {
// //           dialect: 'postgres', // or 'postgres'
// //           host: 'localhost',
// //           database: 'test',
// //           username: 'postgres', // or 'postgres'
// //           password: 'root'
// //         },
// //         production: {
// //           dialect: 'postgres', // or 'postgres'
// //           host: 'localhost',
// //           database: 'test',
// //           username: 'postgres', // or 'postgres'
// //           password: 'root'
// //         },

// //         mongodb: {
// //             development: {
// //               uri: 'mongodb://localhost:27017/report_portal'
// //             },
// //             test: {
// //               uri: 'mongodb://localhost:27017/report_portal'
// //             },
// //             production: {
// //               uri: 'mongodb://localhost:27017/report_portal'
// //             }
// //           }
   
// //     // mongodb: {
// //     //   uri: 'mongodb://localhost:27017/report_portal'
// //     // }
// //   };
// module.exports = {
//     mysql: {
//       development: {
//         dialect: 'mysql',
//         host: 'localhost',
//         database: 'test',
//         username: 'root',
//         password: 'root'
//       },
//       // other environments
//     },
//     postgres: {
//       development: {
//         dialect: 'postgres',
//         host: 'localhost',
//         database: 'test',
//         username: 'postgres',
//         password: 'root'
//       },
//       // other environments
//     },
//     mongodb: {
//       development: {
//         uri: 'mongodb://localhost:27017/report_portal'
//       },
//       // other environments
//     }
//   };
module.exports = {
  mysql: {
    development: {
      dialect: 'mysql',
      host: 'localhost',
      database: 'test',
      username: 'root',
      password: 'root'
    },
    test: {
      dialect: 'mysql',
      host: 'localhost',
      database: 'your_test_database',
      username: 'root',
      password: 'your_password'
    },
    production: {
      dialect: 'mysql',
      host: 'localhost',
      database: 'your_production_database',
      username: 'root',
      password: 'your_password'
    }
  },
  postgres: {
    development: {
      dialect: 'postgres',
      host: 'localhost',
      database: 'test',
      username: 'postgres',
      password: 'root'
   // uri: 'postgresql://postgres:root@localhost:5432/test'
    },
    test: {
      dialect: 'postgres',
      host: 'localhost',
      database: 'test',
      username: 'postgres',
      password: 'root'
    },
    production: {
      dialect: 'postgres',
      host: 'localhost',
      database: 'test',
      username: 'postgres',
      password: 'root'
    }
  },
  mongodb: {
    development: {
      uri: 'mongodb://localhost:27017/report_portal'
    },
    test: {
      uri: 'mongodb://localhost:27017/report_portal'
    },
    production: {
      uri: 'mongodb://localhost:27017/report_portal'
    }
  }
};
