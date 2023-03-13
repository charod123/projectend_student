
const knex = require("knex");

const connectionDB = {
    host: "127.0.0.1",
    port: 5432,
    user: "postgres",
    password: "charod",
    database: "projectend_",
}

const connectionDB_pg = knex({
    client: "pg",
    connection: {
        host: "127.0.0.1",
        port: 5432,
        user: "postgres",
        password: "charod",
        database: "projectend_",
    },
});


const connectionDB_sql = knex({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        port: 3306,
        user: 'your_database_user',
        password: 'your_database_password',
        database: 'myapp_test'
    }
});
const connectionDB_mssql = knex({
    client: 'mssql',
    connection: {
        server: 'LAPTOP-890SV5VE', // replace with the actual server name
        post: 1433, // replace with the actual database name
        database: 'projectend_', // replace with the actual database name
        user: 'charod', // replace with the actual Windows user name
        password: 'charod',
      // replace with the actual Windows user password
    }
});




const connectionDB_sqlite = knex({
    client: 'sqlite3', // or 'better-sqlite3'
    connection: {
        filename: "C:/Program Files/DB Browser for SQLite/projectend_.db"
    }
});


exports.secret = 'worldisfullofdevelopers'
const ip = 'http://localhost:'
exports.ip_getimg = ip + '3010/'
exports.port_websocket = '3048'
exports.send_background_notify = 'ws://localhost:3048'
exports.connectionString = () => {
    return connectionDB;
};
exports.connectionString_pg = () => {
    return connectionDB_mssql;
};
exports.connectionString_sqlite = () => {
    return connectionDB_sqlite;
};
exports.connectionString_mssql = () => {
    return connectionDB_mssql;
};
