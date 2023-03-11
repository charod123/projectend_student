const moment = require('moment');

// const { Pool, Client } = require('pg')

exports.execute = async (table, script, connectionstring) => {
  let temp_con = JSON.parse(JSON.stringify(connectionstring));

  // script = script.trim();

  try {
    // var pool = new Pool(temp_con);
    // const client = await pool.connect();
    try {
      const res = await client.query(script);

      console.log(
        moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
        `Execute action: ${res.rowCount ? res.rowCount : 0} row(s)`
      );

      return {
        code: false,
        rowaction: res.rowCount || 0,
      };
    } catch (e) {
      if (e.code === "23505" || e.code === "42P04") {
        return {
          code: false,
          rowaction: 0,
        };
      } else {
        console.log(
          moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
          `${script} : error code : ${e.code} err.message : ${e.message}`
        );
        return {
          code: true,
          message: e.message,
        };
      }
    } finally {
      client.release();
    }
  } catch (error) {
    console.log(
      moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
      `${script} : error code : ${error.code} err.message : ${error.message}`
    );
    return {
      code: true,
      message: error.message,
    };
  }
};
exports.insert = async (table, script, pg) => {
  try {
    try {
      const inset = await pg(table).insert(script).returning('*')
      console.log(
        moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
        `Execute action: ${inset.rowCount ? inset.rowCount : 0} row(s)`
      );

      return { code: false, rowaction: inset.rowCount, data: inset };
    } catch (e) {
      if (e.code === "23505" || e.code === "42P04") {
        return {
          code: false,
          rowaction: 0,
        };
      } else {
        console.log(
          moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
          `${script} : error code : ${e.code} err.message : ${e.message}`
        );
        return {
          code: true,
          message: e.message,
        };
      }
    } finally {
      // pg.release();
    }
  } catch (error) {
    console.log(
      moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
      `${script} : error code : ${error.code} err.message : ${error.message}`
    );
    return {
      code: true,
      message: error.message,
    };
  }
};
exports.get = async (table, filed, script, pg) => {

  try {

    try {
      const select = await pg.select(filed).from(table).where(script)

      return { code: false, data: select.rows };
    } catch (e) {
      console.log(
        moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
        `${script} : error code : ${e.code} err.message : ${e.message}`
      );
      return {
        code: true,
        message: e.message,
      };
    } finally {
      // client.release();
    }
  } catch (error) {
    console.log(
      moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
      `${script} : error code : ${error.code} err.message : ${error.message}`
    );
    return {
      code: true,
      message: error.message,
    };
  }
};

// exports.get = async (script, connectionstring) => {
//   //get data
//   let temp_con = JSON.parse(JSON.stringify(connectionstring))



//   script = script.replace(/^\s+|\s+$/g, '');

//   try {
//     var pool = new Pool(temp_con)
//     const client = await pool.connect()
//     try {
//       const res = await client.query(script)
//       return { code: false, data: res.rows }

//     } catch (e) {
//       console.log(moment().format('YYYY-MM-DD HH:mm:ss.SSS'), script + ' : error code : ' + e.code + ' err.message : ' + e.message)
//       return {
//         code: true,
//         message: e.message
//       }
//     } finally {
//       client.release()
//     }
//   } catch (error) {
//     console.log(moment().format('YYYY-MM-DD HH:mm:ss.SSS'), script + ' : error code : ' + error.code + ' err.message : ' + error.message)
//     return {
//       code: true,
//       message: error.message
//     }
//   }
// }
// exports.get = async (script, connectionstring) => {
//   let temp_con = JSON.parse(JSON.stringify(connectionstring));

//   script = script.trim();

//   try {
//     var pool = new Pool(temp_con);
//     const client = await pool.connect();
//     try {
//       const res = await client.query(script);
//       return { code: false, data: res.rows };
//     } catch (e) {
//       console.log(
//         moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
//         `${script} : error code : ${e.code} err.message : ${e.message}`
//       );
//       return {
//         code: true,
//         message: e.message,
//       };
//     } finally {
//       client.release();
//     }
//   } catch (error) {
//     console.log(
//       moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
//       `${script} : error code : ${error.code} err.message : ${error.message}`
//     );
//     return {
//       code: true,
//       message: error.message,
//     };
//   }
// };
exports.upsert = async (dbname, insert, update, connectionString) => {
  // 1 by 1 upsert
  var arr = [];
  var script = '';
  var temp = '';

  try {
    //debugger;
    arr = insert.split('VALUES')
    temp = arr[1].replace(/^\s+|\s+$/g, '');
    arr[1] = temp.substring(1, temp.length - 1);
    insert = arr[0] + " SELECT " + arr[1];

    var script = " WITH upsert AS (" + update + "  RETURNING *)";
    script += " " + insert + " ";
    script += " WHERE NOT EXISTS (SELECT * FROM upsert)";

    let r = await this.execute(dbname, script, connectionString)
    return r;

  } catch (ex) {
    console.log(moment().format('YYYY-MM-DD HH:mm:ss.SSS'), 'setUpsertScript : ' + ex)
    return { code: true, message: ex }
  }

};


exports.getOne = async (dbname, script, connectionstring) => {
  //get data
  let temp_con = JSON.parse(JSON.stringify(connectionstring));
  if (dbname != null) {
    temp_con.database = dbname;
  }
  try {
    var pool = new Pool(temp_con);
    const client = await pool.connect();
    try {
      const res = await client.query(script);
      return { code: false, data: res.rowCount > 0 ? res.rows[0] : {} };
    } catch (e) {
      console.log(
        script + " : error code : " + e.code + " err.message : " + e.message
      );
      return {
        code: e.code,
        message: e.message,
      };
    } finally {
      client.release();
    }
  } catch (error) {
    console.log(
      script +
      " : error code : " +
      error.code +
      " err.message : " +
      error.message
    );
    return {
      code: error.code,
      message: error.message,
    };
  }
};

exports.excutewithparams = async (query, params, db_name, connection) => {
  let connectionString = connection;
  if (db_name) {
    connectionString.database = db_name;
  }
  const client = new Client(connectionString);
  await client.connect();
  try {
    const res = await client.query(query, params);
    await client.end();
    return { code: false, rowCount: res.rowCount };
  } catch (err) {
    await client.end();
    console.log(err.stack);
    return { code: err.rrcode, message: err.message };
  }
};

exports.inserttransactionwithData = async (
  arr_insert,
  arr_data,
  db_name,
  connection
) => {
  let connectionString = connection;
  if (db_name) {
    connectionString.database = db_name;
  }
  var pool = new Pool(connectionString);
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (let index = 0; index < arr_insert.length; index++) {
      let res = await client.query(arr_insert[index], arr_data[index]);
    }
    await client.query("COMMIT");
    return { code: false };
  } catch (e) {
    await client.query("ROLLBACK");
    console.log(e.stack);
    return { code: true, message: e.message };
  } finally {
    client.release();
  }
};