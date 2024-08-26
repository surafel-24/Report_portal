const kafka = require('kafka-node');
const client = require('../config/kafka.config');
const Consumer = kafka.Consumer;
const dynamicTableService = require('../services/dynamicTableService');

const consumer = new Consumer(client, [{ topic: 'db-filters' }], { autoCommit: true });

consumer.on('message', async (message) => {
    try {
        const { dbType, dbName, tableName, query } = JSON.parse(message.value);
        const result = await dynamicTableService.filterData(dbType, dbName, tableName, query);
        console.log('Filtered data:', result);
        // You can store or aggregate the result here
    } catch (error) {
        console.error('Error processing message:', error);
    }
});

consumer.on('error', (error) => {
    console.error('Kafka Consumer error:', error);
});
