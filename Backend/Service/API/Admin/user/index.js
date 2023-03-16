const config = require("../../../../config/config");
// const pgcon = require("../../../../pgConnection/pgCon");
const moment = require('moment');
const { readfile_ } = require("../../../readfile");
const pg = config.connectionString_pg();
const bcrypt = require('bcryptjs')

const get_user_admin = async ({ }, { email, role, user_id, subdistrict_id, division_id, subdivision_id }) => {
    try {
        let sql
        if (!(+role == 1)) {
            return { code: true, status: 400, message: "คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้", data: [] };
        }
        sql = await pg.select('user_master.*', 'division_master.subdistrict_id', 'subdivision_master.*', 'employee.*', 'user_profile.*').from('user_master')
            .innerJoin('user_profile', 'user_profile.user_pro_id', '=', 'user_master.user_pro_id')
            .innerJoin('employee', 'employee.user_id', '=', 'user_master.user_id')
            .innerJoin('subdivision_master', 'subdivision_master.subdivision_id', '=', 'employee.subdivision_id')
            .innerJoin('division_master', 'division_master.division_id', '=', 'subdivision_master.division_id')
            .where('user_master.del_flag', '=', `1`)
            .andWhere(`user_master.role_id`, '=', '2')
            .andWhere('division_master.division_id', '=', `${division_id}`)
        // const get_user = await pgcon.get(sql, config.connectionString());
        if (!sql) {
            return { code: true, status: 400, message: sql, data: [] };
        }
        const data = await sql.map(async e => {
            const img = await readfile_({ id: `user-${e.user_id}`, full_path: e.img_path }).then((e) => e[0]).catch(err => err);
            e.create_date = moment(e.create_date).format('YYYY-MM-DD HH:mm:ss');
            e.update_date = moment(e.update_date).format('YYYY-MM-DD HH:mm:ss');
            e.birthday = moment(e.birthday).format('YYYY-MM-DD HH:mm:ss');
            e.img_path = img
            delete e.password;
            return e;
        })
        return { code: false, status: 200, message: "success", data: await Promise.all(data) };

    } catch (error) {
        return { code: true, status: 400, message: error.message, data: [] };
    }
}
const insert_user_admin = async ({ data }, { email, role }) => {
    try {
        if (+role !== 1) {
            return { code: true, status: 400, message: "คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้", data: [] };
        }
        if (!data.birthday || !data.email || !data.emp_name_position || !data.fristname || !data.gender || !data.img_path || !data.lastname || !data.password || !data.phone || !data.subdivision_name || !data.user_id || !data.user_pro_id) {
            return { code: true, status: 400, message: "ข้อมูลไม่ครบถ้วน", data: [] };
        }
        const hashedPassword = await bcrypt.hash(data.password, 10);

        const insert_user = await pg('user_master').insert({
            user_id: data.user_id,
            email: data.email,
            password: hashedPassword,
            img_path: data.img_path,
            del_flag: '1',
            user_pro_id: data.user_pro_id,
            line_token: null,
            create_date: pg.fn.now(),
            update_date: null,
            role_id: '2',
        })
        const insert_user_profile = await pg('user_profile').insert({
            user_pro_id: data.user_pro_id,
            fristname: data.fristname,
            lastname: data.lastname,
            birthday: moment(data.birthday, 'YYYY-MM-DD').format("YYYY-MM-DD"),
            gender: data.gender,
            phone: data.phone.split('-').join(''),

        })
        const insert_employee = await pg('employee').insert({
            emp_id: data.emp_id,
            emp_name_position: data.emp_name_position,
            subdivision_id: data.subdivision_name,
            user_id: data.user_id,
            create_date: pg.fn.now(),
            del_flag: '1'
        })

        if (!insert_user || !insert_user_profile || !insert_employee) {
            return { code: true, status: 400, message: insert_user || insert_user_profile || insert_employee, data: [] };
        }
        return { code: false, status: 200, message: "success", data: insert_user };

    } catch (error) {
        return { code: true, status: 400, message: error.message, data: [] };
    }
}
const update_user_admin = async ({ data }, { email, role }) => {
    try {
        if (+role !== 1) {
            return { code: true, status: 400, message: "คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้", data: [] };
        }
        if (!data.user_id || !data.subdivision_name || !data.user_pro_id || !data.emp_id) {
            return { code: true, status: 400, message: "ข้อมูลไม่ครบถ้วน", data: [] };
        }

        const update_user_profile = await pg('user_profile').where({ user_pro_id: data.user_pro_id }).update({
            fristname: data.fristname,
            lastname: data.lastname,
            birthday: moment(data.birthday, 'YYYY-MM-DD').format("YYYY-MM-DD"),
            gender: data.gender,
            phone: data.phone.split('-').join(''),
        })
        const update_user = await pg('user_master').where({ user_id: data.user_id }).update({
            update_date: pg.fn.now(),
        })
        const update_employee = await pg('employee').where({ emp_id: data.emp_id, }).update({
            emp_name_position: data.emp_name_position,
            subdivision_id: data.subdivision_name,
            update_date: pg.fn.now(),
        })

        if (!update_user || !update_user_profile || !update_employee) {
            return { code: true, status: 400, message: update_user || update_user_profile || update_employee, data: [] };
        }
        return { code: false, status: 200, message: "success", data: update_user };

    } catch (error) {
        return { code: true, status: 400, message: error.message, data: [] };
    }
}

const delete_user_admin = async ({ user_id }, { email, role }) => {
    try {
        if (+role !== 1) {
            return { code: true, status: 400, message: "คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้", data: [] };
        }
        try {
            const res = await pg("user_master").where({ user_id: user_id }).update({ del_flag: "0", update_date: pg.fn.now() });
            return { code: false, status: 200, message: "success", data: res };
        } catch (error) {
            return { code: true, status: 400, message: error.message, data: [] };
        }

    } catch (error) {
        return { code: true, status: 400, message: error.message, data: [] };
    }
}

const get_count_on_subdivision = async ({ }, { division_id, role }) => {
    try {
        if (+role !== 1) {
            return { code: true, status: 400, message: "คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้", data: [] };
        }
        const result = await pg.select('*').from('subdivision_master').where({ division_id: division_id });
        const total_user = await pg('subdivision_master as sm')
            .innerJoin('employee as em', 'sm.subdivision_id', '=', 'em.subdivision_id')
            .innerJoin('user_master as um ', 'um.user_id', '=', 'em.user_id')
            .where('sm.division_id', '=', division_id)
            .andWhere('um.role_id', '=', '2')
            .count('um.user_id')
        const data_ = await result.map(async e => {
            const result_ = await pg('user_master as um')
                .innerJoin('employee as em', 'um.user_id', '=', 'em.user_id')
                .where('em.subdivision_id', '=', e.subdivision_id)
                .andWhere('um.role_id', '=', '2')
                .count('um.user_id')
            if (!result_) {
                return { code: true, status: 400, message: result_, data: [] };
            }
            return { subdivision: e, user_conut: result_[0].count, total_user: total_user[0].count }

        })

        return { code: false, status: 200, message: "success", data: await Promise.all(data_) };

    } catch (error) {
        return { code: true, status: 400, message: error.message, data: [] };
    }
}
module.exports = { get_user_admin, insert_user_admin, update_user_admin, delete_user_admin, get_count_on_subdivision }