const { publishFilterOperation } = require('../producers/filter.producer');

async function handleFilterRequest(req, res) {
    const { dbType, query } = req.body;
    const { dbName, tableName } = req.params;

    try {
        await publishFilterOperation(dbType, dbName, tableName, query);
        res.status(200).json({ message: 'Filter operation published successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { handleFilterRequest };
