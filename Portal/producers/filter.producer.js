const kafka = require('kafka-node');
const client = require('../config/kafka.config');
const Producer = kafka.Producer;
const producer = new Producer(client);

producer.on('ready', () => {
    console.log('Kafka Producer is connected and ready.');
});

producer.on('error', (error) => {
    console.error('Kafka Producer error:', error);
});

async function publishFilterOperation(dbType, dbName, tableName, query) {
    const payloads = [
        { topic: 'db-filters', messages: JSON.stringify({ dbType, dbName, tableName, query }) }
    ];
    producer.send(payloads, (err, data) => {
        if (err) {
            console.error('Error publishing filter operation:', err);
        }
    });
}

module.exports = { publishFilterOperation };
