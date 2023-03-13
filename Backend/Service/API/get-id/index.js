const config = require('../../../config/config');
const pg = config.connectionString_pg();
const get_id = async ({ filed, table }) => {
    try {
        const r1 = await pg(table).max(filed);
        return { code: false, message: 'success', data: r1[0].max ? r1[0].max + 1 : 1 }
    } catch (error) {
        return { code: true, message: error.message, data: [] }
    }
}
module.exports = { get_id }