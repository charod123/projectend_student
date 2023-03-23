
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

const connectionDB_mssql_M = knex({
    client: 'mssql',
    connection: {
        server: '10.103.0.16', // replace with the actual server name
        post: 1433, // replace with the actual database name
        database: '61123250102', // replace with the actual database name
        user: 'student', // replace with the actual Windows user name
        password: 'Cs@2700',

    }
});

const connectionDB_pg_bang = knex({
    client: 'pg',
    connection: {
        host: 'bangsaothong.dtc.co.th', // replace with the actual server name
        post: 5432, // replace with the actual database name
        database: 'm0010_sos_p', // replace with the actual database name
        user: 'postgres', // replace with the actual Windows user name
        password: '!DTC@network01',
        // replace with the actual Windows user password
    }
});


// const connectionDB_sqlite = knex({
//     client: 'sqlite3', // or 'better-sqlite3'
//     connection: {
//         filename: "C:/Program Files/DB Browser for SQLite/projectend_.db"
//     }
// });

// '3048'
let chk = false
exports.secret = 'worldisfullofdevelopers'
// const ip = 'http://10.103.0.16/cs61/61123250102/backend:'
// const ip = 'http://202.149.117.35:'
const ip = chk == true ? 'http://202.149.117.35:' : 'http://localhost:'
const ip_produntion = 'ws://202.149.117.35:3000'
exports.ip_getimg = ip + '3003/'
exports.main_port = '3001'
exports.port_websocket = '3000'
// exports.send_background_notify = 'ws://10.103.0.16/cs61/61123250102/backend:3000'
// exports.send_background_notify = 'ws://202.149.117.35:3000'
exports.send_background_notify = chk == true ? 'ws://202.149.117.35:3000' : 'ws://localhost:3000'
exports.connectionString = () => {
    return connectionDB;
};
exports.connectionString_pg = () => {
    return connectionDB_pg_bang;
};
// exports.connectionString_sqlite = () => {
//     return connectionDB_sqlite;
// };
exports.connectionString_mssql = () => {
    return connectionDB_mssql;
};
