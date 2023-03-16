// const { execute, get } = require("../../../pgconnection/pgCon");
const { connectionString, connectionString_pg } = require("../../../config/config");
const moment = require('moment');
const { readfile_ } = require("../../readfile");
const { sendnotify } = require("../../send_notify");
const fs = require('fs');
const path = require("path");
const pg = connectionString_pg();
const get_complain = async ({ }, { email, role, subdistrict_id }) => {
    try {

        let sql = pg('complain as c_')
            .select('pm.pat_id', pg.raw("concat(up.fristname,' ',up.lastname) as full_name"), 'c_.*')
            .leftJoin('patient_master as pm', 'pm.pat_id', 'c_.pat_id')
            .leftJoin('user_profile as up', 'up.user_pro_id', 'pm.user_pro_id')
            .innerJoin('device_master as dm', 'dm.device_ip', 'c_.device_id')
            .where('c_.del_flag', '1');

        if (+role === 3) {
            sql.andWhere('c_.user_id', email);
        }

        if (+role == 1 || +role == 2) {
            sql.andWhere('pm.subdistrict_id', subdistrict_id);
        }

        const pat_master = await sql;
        // const pat_master = await pg.raw(sql)

        // const pat_master = await get(sql, connectionString());
        if (!pat_master) {
            return { code: true, status: 400, message: pat_master, data: [] };
        }
        const data_ = await pat_master.map(async e => {
            const img_ = await readfile_({ id: `cp-${e.cp_id}`, full_path: e.img_path }).then((e) => e).catch(err => err);
            e.cp_update_date = moment(e.cp_update_date).format("YYYY-MM-DD HH:mm:ss");
            e.cp_create_date = moment(e.cp_create_date).format("YYYY-MM-DD HH:mm:ss");
            e.img_path = img_
            return e
        })

        // data_.sort((a, b) => b.at_create_date - a.at_create_date)
        return { code: false, status: 200, message: "success", data: await Promise.all(data_) };

    } catch (error) {
        return { code: true, status: 400, message: error.message, data: [] };
    }
}
const create_complain = async ({ cp_type_id, cp_title, cp_detail, cp_tel, pat_id, img_path, device_id }, { user_id, email, role }) => {
    console.log(pat_id);
    try {
        // const get_com = await get(`SELECT cp_id FROM complain WHERE user_id='${email}' AND del_flag ='1'`, connectionString());
        const get_sub_pat = await pg.select('subdistrict_id').from('patient_master').where({ user_id: user_id, del_flag: '1' })
        // const get_sub_pat = await get(`SELECT subdistrict_id FROM patient_master WHERE user_id='${user_id}' AND del_flag ='1'`, connectionString());
        if (+role === 3) {
            if (!(cp_type_id || cp_title || cp_detail || cp_tel || img_path)) {
                return { code: true, status: 400, message: "ข้อมูลไม่ครบถ้วน", data: [] };
            }
            const get_maxid_com = await pg('complain').max('cp_id')
            // const get_maxid_com = await get(`SELECT MAX(cp_id) FROM complain`, connectionString());
            const pat_master = await pg('complain').insert({
                cp_id: get_maxid_com[0].max + 1,
                cp_type_id: cp_type_id,
                cp_title: cp_title,
                cp_detail: cp_detail,
                cp_tel: cp_tel,
                cp_create_date: moment().format('YYYY-MM-DD HH:mm:ss'),
                pat_id: !pat_id ? null : pat_id,
                user_id: email,
                del_flag: '1',
                cp_status: '1',
                img_path: img_path,
                cp_detail_after: '',
                create_by: email,
                device_id: !device_id ? null : device_id
            }).returning('cp_id')

            //     get(`
            //     INSERT INTO complain VALUES ('${get_maxid_com[0].max + 1}','${cp_type_id}','${cp_title}','${cp_detail}','${cp_tel}',NULL,now(),${!pat_id ? null : pat_id},'${email}','1','1','${img_path}',NULL,'${email}',${!device_id ? null : device_id}) RETURNING cp_id
            //  `, connectionString());

            if (!pat_master) {
                return { code: true, status: 400, message: pat_master, data: [] };
            }
            if (get_sub_pat.length > 0) {

                const get_token = await pg('user_master')
                    .select('user_master.line_token')
                    .innerJoin('employee', 'employee.user_id', '=', 'user_master.user_id')
                    .innerJoin('subdivision_master', 'subdivision_master.subdivision_id', '=', 'employee.subdivision_id')
                    .innerJoin('division_master', 'division_master.division_id', '=', 'subdivision_master.division_id')
                    .where('user_master.role_id', '=', '2')
                    .andWhere('division_master.subdistrict_id', '=', `${get_sub_pat[0].subdistrict_id}`)
                    .andWhere('user_master.del_flag', '=', '1')
                    .andWhere('subdivision_master.del_flag', '=', '1');

                // const get_token = await get(`SELECT um.line_token FROM user_master um
                // INNER JOIN employee e ON e.user_id = um.user_id
                // INNER JOIN subdivision_master sm ON sm.subdivision_id=e.subdivision_id
                // INNER JOIN division_master dm ON dm.division_id=sm.division_id 
                // WHERE um.role_id = '2' AND dm.subdistrict_id = '${get_sub_pat[0].subdistrict_id}' AND um.del_flag ='1' AND sm.del_flag ='1'`, connectionString());
                if (!get_token) {
                    return { code: true, status: 400, message: get_token, data: [] };
                }
                if (!get_token[0].line_token) {
                    return { code: false, status: 200, message: "success", data: pat_master };
                } else {
                    for (let i = 0; i < get_token.length; i++) {
                        const data = get_token[i];
                        const stickerId = 10979917
                        const package_id = 6325
                        sendnotify({ token: data.line_token, stickerId, package_id })
                    }
                    return { code: false, status: 200, message: "success", data: pat_master };
                }
            }

            return { code: false, status: 200, message: "success", data: pat_master };

        }
    } catch (error) {
        return { code: true, status: 400, message: error.message, data: [] };
    }
}
const update_status_complain = async ({ cp_id, cp_detail_after, cp_status }, { email, role }) => {
    console.log(email);
    try {
        if (+role === 1 || +role === 2) {
            const get_status = await pg.select('cp_status').from('complain').where({ cp_id: cp_id })
            // const get_status = await get(`SELECT cp_status FROM  complain  WHERE cp_id = '${cp_id}' `, connectionString());
            if (!get_status) {
                return { code: true, status: 400, message: get_status, data: [] };
            }
            if (!cp_id || !cp_status) {
                return { code: true, status: 400, message: "ข้อมูลไม่ครบถ้วน", data: [] };
            }
            const pat_master = await pg('complain').update({
                cp_update_date: moment().format('YYYY-MM-DD HH:mm:ss'),
                cp_status: cp_status,
                cp_detail_after: cp_status == 3 ? `${cp_detail_after}` : null,

            }).where({ cp_id: cp_id, del_flag: '1' })
            // execute(`UPDATE  complain SET cp_status = '${get_status[0].cp_status == 1 ? 2 : 3}' ,cp_update_date=now(), cp_detail_after=${get_status[0].cp_status == 2 ? `${cp_detail_after}` : null} WHERE cp_id = '${cp_id}' AND del_flag = '1'`, connectionString());

            if (!pat_master) {
                return { code: true, status: 400, message: pat_master, data: [] };
            }
            return { code: false, status: 200, message: "success", data: pat_master };
        }
    } catch (error) {
        return { code: true, status: 400, message: error.message, data: [] };
    }
}
const get_type_complain = async ({ }, { email, role }) => {
    try {
        const path_ = path.join(__dirname, '../../../resources/assets/complain_type.json')
        fs.readFile(path_, (err, data) => {
            if (err) {
                console.error(err);
            }

            console.log(data); // check that data was read successfully
            return resolve(data);
        });


        // data_.sort((a, b) => b.at_create_date - a.at_create_date)
        return { code: false, status: 200, message: "success", data: pat_master };

    } catch (error) {
        return { code: true, status: 400, message: error.message, data: [] };
    }
}

const delete_complain = async ({ cp_id }, { email, role }) => {
    try {
        if (!cp_id) {
            return { code: false, status: 404, message: "ข้อมูลไม่ครบถ้วน", data: [] };
        }
        if (cp_id) {

            const get_status = await pg.select('user_id').from('complain').where({ cp_id: cp_id })
            // const get_status = await get(`SELECT user_id FROM complain  WHERE cp_id = '${cp_id}' `, connectionString());
            if (get_status[0].user_id == email) {
                const delete_ = await pg('complain').update({ del_flag: '0' }).where({ cp_id: cp_id })
                // const delete_ = await execute(`UPDATE complain SET del_flag ='0'  WHERE cp_id = '${cp_id}' `, connectionString());
                if (delete_.code) {
                    return { code: true, status: 400, message: delete_.message, data: [] };
                }
                return { code: false, status: 200, message: "success", data: delete_ };
            }
            return { code: false, status: 404, message: "คุณไม่มีลบคำร้องของผู้อื่น", data: [] };
        }

    } catch (error) {
        return { code: true, status: 400, message: error.message, data: [] };
    }
}
const get_count_title = async ({ }, { email, role, subdistrict_id }) => {
    try {
        let query = pg
            .select([
                pg.raw("CASE WHEN c.cp_status = '1' THEN COUNT(c.cp_id) ELSE 0 END AS cp1"),
                pg.raw("CASE WHEN c.cp_status = '2' THEN COUNT(c.cp_id) ELSE 0 END AS cp2"),
                pg.raw("CASE WHEN c.cp_status = '3' THEN COUNT(c.cp_id) ELSE 0 END AS cp3"),
                pg.raw("COUNT(c.cp_id) AS total")
            ])
            .from('complain as c')
            .leftJoin('patient_master', 'patient_master.pat_id', '=', 'c.pat_id')
            .where('c.del_flag', '=', '1')

        if (+role === 3) {
            query = query.andWhere('c.user_id', '=', email).groupBy('c.cp_status');
        }

        if (+role == 1 || +role == 2) {
            query = query.andWhere('patient_master.subdistrict_id', '=', subdistrict_id).groupBy('c.cp_status');
        }

        const get_status = await query;

        if (!get_status) {
            return { code: false, status: 400, message: "มีข้อผิดพลาด" + get_status, data: [] };
        }

        return { code: false, status: 200, message: "success", data: get_status };
    } catch (error) {
        return { code: true, status: 400, message: error.message, data: [] };
    }

}
module.exports = {
    get_complain,
    create_complain,
    update_status_complain,
    get_type_complain,
    delete_complain,
    get_count_title
}
