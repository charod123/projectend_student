const { execute, get } = require("../../../pgconnection/pgCon");
const { connectionString, connectionString_pg } = require("../../../config/config");
const moment = require('moment');
const pg = connectionString_pg();
const get_content_on_show = async ({ }, { email, role, subdistrict_id, user_id, division_id }) => {
    try {
        const result = await pg.select('*').from('main_menu as mm')
        .innerJoin('division_master AS dm', 'dm.division_id', 'mm.division_id')
        .where('dm.subdistrict_id', '=', `${subdistrict_id}`)
        .andWhere('mm.del_flag', '=', '1');
        if (!result) {
            return { code: true, status: 400, message: result, data: [] };
        }
        const data = result.map(async e => {
            const res = await pg.select('*').from('content_diseases').where('main_menu_id', '=', `${e.main_menu_id}`).andWhere('del_flag', '=', '1');
            e.sub_menu = res
            return e
        })

        return { code: false, status: 200, message: "success", data: await Promise.all(data) };


    } catch (error) {
        return { code: true, status: 400, message: error.message, data: [] };
    }
}
const get_content = async ({ }, { email, role, subdistrict_id, user_id, division_id }) => {
    try {
        if (+role == 2 || +role == 1) {
            const result = await pg.select('*')
                .from('main_menu as m')
                .join('content_diseases as cd', 'cd.main_menu_id', '=', 'm.main_menu_id')
                .join('division_master as dm', 'dm.division_id', '=', 'cd.division_id')
                .where('dm.division_id', '=', `${division_id}`)
                .andWhere('cd.del_flag', '=', '1');
            if (!result) {
                return { code: true, status: 400, message: result, data: [] };
            }

            return { code: false, status: 200, message: "success", data: result };
        }
        return { code: false, status: 403, message: "คุณไม่มีสิทธิ์บันทึกข้อมูลนี้", data: [] };


    } catch (error) {
        return { code: true, status: 400, message: error.message, data: [] };
    }
}
const create_content = async ({ detail_on_edit, detail_on_show, sub_menu_name, main_menu_id }, { email, role, division_id }) => {
    try {
        if (+role === 2 || +role === 1) {
            if (!(detail_on_edit || detail_on_show || division_id || sub_menu_name || main_menu_id)) {
                return { code: true, status: 400, message: "ข้อมูลไม่ครบถ้วน", data: [] };
            }
            const pat_master = await pg('content_diseases').insert({
                detail_on_edit,
                detail_on_show,
                create_date: pg.fn.now(),
                division_id,
                del_flag: '1',
                sub_menu_name,
                main_menu_id: main_menu_id
            });

            if (!pat_master) {
                return { code: true, status: 400, message: "Error inserting data", data: [] };
            }

            return { code: false, status: 200, message: "success", data: pat_master };
        }
        return { code: false, status: 403, message: "คุณไม่มีสิทธิ์บันทึกข้อมูลนี้", data: [] };
    } catch (error) {
        return { code: true, status: 400, message: error.message, data: [] };
    }
}
const update_content = async ({ content_id, detail_on_edit, detail_on_show, sub_menu_name, main_menu_id }, { email, role, division_id }) => {
    try {
        if (+role === 2 || +role === 1) {
            if (!(detail_on_edit || detail_on_show || division_id || sub_menu_name || main_menu_id)) {
                return { code: true, status: 400, message: "ข้อมูลไม่ครบถ้วน", data: [] };
            }
            const pat_master = await pg('content_diseases').update({
                detail_on_edit,
                detail_on_show,
                create_date: pg.fn.now(),
                division_id,
                del_flag: '1',
                sub_menu_name,
                main_menu_id: main_menu_id
            }).where({ content_id: content_id })

            if (!pat_master) {
                return { code: true, status: 400, message: "Error inserting data", data: [] };
            }

            return { code: false, status: 200, message: "success", data: pat_master };
        }

        return { code: false, status: 403, message: "คุณไม่มีสิทธิ์บันทึกข้อมูลนี้", data: [] };

    } catch (error) {
        return { code: true, status: 400, message: error.message, data: [] };
    }
}
const update_main_menu = async ({ main_menu_id, main_menu_name }, { email, role, subdistrict_id, user_id, division_id }) => {
    try {
        if (+role == 2 || +role == 1) {
            const result = await pg('main_menu')
                .update({
                    main_menu_name: main_menu_name,
                    update_date: pg.fn.now()
                }).where({ main_menu_id: main_menu_id })

            if (!result) {
                return { code: true, status: 400, message: result, data: [] };
            }

            return { code: false, status: 200, message: "success", data: result };
        }
        return { code: false, status: 403, message: "คุณไม่มีสิทธิ์บันทึกข้อมูลนี้", data: [] };


    } catch (error) {
        return { code: true, status: 400, message: error.message, data: [] };
    }
}
const create_main_menu = async ({ main_menu_id, main_menu_name }, { email, role, subdistrict_id, user_id, division_id }) => {
    try {
        if (+role == 2 || +role == 1) {
            const result = await pg('main_menu')
                .insert({
                    main_menu_id: main_menu_id,
                    main_menu_name: main_menu_name,
                    create_date: pg.fn.now(),
                    del_flag: '1',
                    division_id: division_id
                })

            if (!result) {
                return { code: true, status: 400, message: result, data: [] };
            }

            return { code: false, status: 200, message: "success", data: result };
        }
        return { code: false, status: 403, message: "คุณไม่มีสิทธิ์บันทึกข้อมูลนี้", data: [] };


    } catch (error) {
        return { code: true, status: 400, message: error.message, data: [] };
    }
}
const get_main_menu = async ({ }, { email, role, subdistrict_id, user_id, division_id }) => {
    try {
        if (+role == 2 || +role == 1) {
            const result = await pg.select('*').from('main_menu')
                .where({ 'division_id': division_id })
                .andWhere({ del_flag: '1' })
            if (!result) {
                return { code: true, status: 400, message: result, data: [] };
            }

            return { code: false, status: 200, message: "success", data: result };
        }
        return { code: false, status: 403, message: "คุณไม่มีสิทธิ์บันทึกข้อมูลนี้", data: [] };


    } catch (error) {
        return { code: true, status: 400, message: error.message, data: [] };
    }
}
const delete_main_menu = async ({ main_menu_id }, { email, role, subdistrict_id, user_id, division_id }) => {
    try {
        if (+role == 2 || +role == 1) {
            const result = await pg('main_menu')
                .update({
                    del_flag: '0'
                }).where({ main_menu_id: main_menu_id })

            if (!result) {
                return { code: true, status: 400, message: result, data: [] };
            }

            return { code: false, status: 200, message: "success", data: result };
        }
        return { code: false, status: 403, message: "คุณไม่มีสิทธิ์บันทึกข้อมูลนี้", data: [] };


    } catch (error) {
        return { code: true, status: 400, message: error.message, data: [] };
    }
}

module.exports = {
    get_content,
    create_content,
    update_content,
    create_main_menu,
    update_main_menu,
    get_main_menu,
    delete_main_menu,
    get_content_on_show
}
