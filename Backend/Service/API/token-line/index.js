// const pgcon = require("../../../pgconnection/pgCon");
const config = require("../../../config/config");
const pg = config.connectionString_pg();
const update_token_line = async ({ token }, { email, role }) => {
    try {
        if (!token) {
            return { code: true, status: 400, message: "ข้อมูลไม่ครบถ้วน", data: [] };
        }
        const result = await pg('user_master')
            .where('email', email)
            .update({ line_token: token });

        if (!result) {
            return { code: true, status: 400, message: result.message, data: [] };
        }

        return { code: false, status: 200, message: "success", data: result };

    } catch (error) {
        return { code: true, status: 400, message: error.message, data: [] };
    }
};
module.exports = {
    update_token_line
}
