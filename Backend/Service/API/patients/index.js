const config = require("../../../config/config");
// const pgcon = require("../../../pgConnection/pgCon");
// const pgcon_pg = require("../../../pgConnection/pgCon_for_kenx");
const moment = require('moment')
const { readfile_ } = require('../../readfile')
const { get_id } = require('../get-id')
moment.locale('th')
const pg = config.connectionString_pg();
const get_patient_all = async ({ }, { email, role, subdistrict_id }) => {
    console.log(email);
    try {
        // let sql = `
        // SELECT p_.*,up.*,ss.sub_id,ss.sub_name_in_thai,pro.pro_id,pro.pro_name_in_thai,dis.dis_id,dis.dis_name_in_thai, us.user_id , us.email FROM patient_master AS  p_
        //  INNER JOIN user_profile AS up ON up.user_pro_id = p_.user_pro_id
        //  INNER JOIN subdistricts AS ss ON ss.sub_id = p_.subdistrict_id
        //  INNER JOIN provinces AS pro ON pro.pro_id = p_.province_id
        //  INNER JOIN districts AS dis ON dis.dis_id = p_.district_id
        //  INNER JOIN user_master AS us ON us.email = p_.user_id
        //  WHERE  p_.del_flag = '1'  
        //  `

        // if (!(+role == 1 || +role == 2)) {
        //     sql += `AND us.email='${email}'`
        // }
        // if ((+role == 1 || +role == 2)) {
        //     sql += `AND p_.subdistrict_id='${subdistrict_id}'`
        // }
        // // INNER JOIN provinces AS pro ON pro.id = a.province_id
        // // INNER JOIN subdistricts AS sub ON sub.id = a.subdistrict_id
        // // INNER JOIN districts AS dis ON dis.id = a.district_id
        // const pat_master = await pgcon.get(sql, config.connectionString());
        // if (pat_master.code) {
        //     return { code: true, status: 400, message: pat_master.message, data: [] };
        // }
        // const data_ = await pat_master.data.map(async (a) => {
        //     const get_usertry = await pgcon.get(`SELECT um.user_pro_id as utpid,* FROM usertry_master  As um           
        //      INNER JOIN user_profile AS up ON up.user_pro_id = um.user_pro_id
        //     WHERE um.pat_id = '${a.pat_id}' AND um.del_flag='1'`, config.connectionString());
        //     if (get_usertry.code) {
        //         return { code: true, status: 400, message: get_usertry.message, data: [] };
        //     }
        //     const get_device = await pgcon.get(`SELECT * FROM device_master WHERE pat_id = '${a.pat_id}' AND del_flag='1'`, config.connectionString());
        //     if (get_device.code) {
        //         return { code: true, status: 400, message: get_device.message, data: [] };
        //     }
        //     const device_ = await get_device.data.map(e => {
        //         e.device_time = moment(e.device_time).format("YYYY-MM-DD HH:mm:ss");
        //         e.create_date = moment(e.create_date).format("YYYY-MM-DD HH:mm:ss");
        //         return e
        //     })
        //     const img_pat = await readfile_({ id: `pat-${a.pat_id}`, full_path: a.img_path }).then((e) => e[0]).catch(err => err);
        let query = pg
            .select(
                'p_.*',
                'up.*',
                'ss.sub_id',
                'ss.sub_name_in_thai',
                'pro.pro_id',
                'pro.pro_name_in_thai',
                'dis.dis_id',
                'dis.dis_name_in_thai',
                'us.user_id',
                'us.email'
            )
            .from('patient_master as p_')
            .innerJoin('user_profile as up', 'up.user_pro_id', 'p_.user_pro_id')
            .innerJoin('subdistricts as ss', 'ss.sub_id', 'p_.subdistrict_id')
            .innerJoin('provinces as pro', 'pro.pro_id', 'p_.province_id')
            .innerJoin('districts as dis', 'dis.dis_id', 'p_.district_id')
            .innerJoin('user_master as us', 'us.email', 'p_.user_id')
            .where('p_.del_flag', '1');

        if (!(+role == 1 || +role == 2)) {
            query = query.andWhere('us.email', email);
        }

        if (+role == 1 || +role == 2) {
            query = query.andWhere('p_.subdistrict_id', subdistrict_id);
        }

        const patMaster = await query.catch((err) => {
            return { code: true, status: 400, message: err.message, data: [] };
        });

        const data_ = await Promise.all(
            patMaster.map(async (a) => {
                const getUsertry = await pg
                    .select('um.user_pro_id as utpid', '*')
                    .from('usertry_master as um')
                    .innerJoin('user_profile as up', 'up.user_pro_id', 'um.user_pro_id')
                    .where('um.pat_id', a.pat_id)
                    .andWhere('um.del_flag', '1')
                    .catch((err) => {
                        return { code: true, status: 400, message: err.message, data: [] };
                    });

                const getDevice = await pg
                    .select('*')
                    .from('device_master')
                    .where('pat_id', a.pat_id)
                    .andWhere('del_flag', '1')
                    .catch((err) => {
                        return { code: true, status: 400, message: err.message, data: [] };
                    });

                const device_ = getDevice.map((e) => {
                    e.device_time = moment(e.device_time).format('YYYY-MM-DD HH:mm:ss');
                    e.create_date = moment(e.create_date).format('YYYY-MM-DD HH:mm:ss');
                    return e;
                });

                const imgPat = await readfile_({ id: `pat-${a.pat_id}`, full_path: a.img_path })
                    .then((e) => e[0])
                    .catch((err) => err);

                return {
                    pat_id: a.pat_id,
                    pat_fristname: a.fristname,
                    pat_lastname: a.lastname,
                    pat_sax: a.gender,
                    user_pro_id: a.user_pro_id,
                    pat_birthday_for_edit: moment(a.birthday).format("YYYY-MM-DD HH:mm:ss"),
                    pat_birthday: moment(a.birthday).format("LLLL"),
                    del_flag: a.pat_weight,
                    pat_weight: a.pat_weight,
                    pat_height: a.pat_height,
                    age: moment(new Date()).format("YYYY") - moment(a.birthday).format("YYYY"),
                    pat_phone: a.phone,
                    create_date: moment(a.create_date).format("LLLL"),
                    user_id: a.user_id,
                    img_path: imgPat,
                    address: {
                        member: a.member,
                        road: a.road,
                        alley: a.alley,
                        postal_code: a.postal_code,
                        province: { pro_id: a.pro_id, pro_name_in_thai: a.pro_name_in_thai },
                        district: { dis_id: a.dis_id, dis_name_in_thai: a.dis_name_in_thai },
                        subdistrict: { sub_id: a.sub_id, sub_name_in_thai: a.sub_name_in_thai }
                    },
                    device: device_,
                    disease: a.disease,
                    usertry: getUsertry

                }

            }));

        // data_.sort((a, b) => b.at_create_date - a.at_create_date)
        return { code: false, status: 200, message: "success", data: await Promise.all(data_) };

    } catch (error) {
        return { code: true, status: 400, message: error.message, data: [] };
    }
}
const add_patient = async ({ pat, device, usertry }, { email, role, subdistrict_id }) => {
    try {
        if (!pat.pat_id || !pat.disease || !pat.member || !pat.province_id || !pat.district_id || !pat.subdistrict_id || device.length < 1 || usertry.length < 1) {
            return { code: true, status: 400, message: "ข้อมูลไม่ครบถ้วน", data: [] };
        }
        if (pat.subdistrict_id != subdistrict_id) {
            return { code: true, status: 403, message: "ที่อยู่ของผู้ป่วยที่คุณสร้างไม่อยู่ในเขตของคุณ", data: [] };
        }
        const maxIdPro = await get_id({ table: 'user_profile', filed: 'user_pro_id' })

        const insertProfile = await pg('user_profile').insert({
            user_pro_id: maxIdPro.data + 1,
            fristname: pat.pat_fristname,
            lastname: pat.pat_lastname,
            birthday: moment(pat.pat_birthday, 'YYYY-MM-DD').format("YYYY-MM-DD"),
            gender: pat.pat_gender,
        }).returning('user_pro_id');

        if (!insertProfile[0]) {
            return { code: true, status: 400, message: 'Failed to insert user_profile', data: [] };
        }

        const insertPat = await pg('patient_master').insert({
            pat_id: pat.pat_id,
            pat_weight: pat.pat_weight,
            pat_height: pat.pat_height,
            create_by: pat.create_by || 0,
            img_path: 'resources/assets/patient-img',
            member: pat.member,
            road: pat.road,
            alley: pat.alley,
            postal_code: pat.postal_code ?? 0,
            province_id: pat.province_id,
            district_id: pat.district_id,
            subdistrict_id: pat.subdistrict_id,
            user_pro_id: insertProfile[0].user_pro_id,
            create_date: pg.fn.now(),
            update_date: null,
            del_flag: '1',
            disease: JSON.stringify(pat.disease),
            user_id: email,
        }).returning('pat_id');

        if (!insertPat[0]) {
            return { code: true, status: 400, message: 'Failed to insert patient_master', data: [] };
        }
        for (let i = 0; i < device.length; i++) {
            const dv = device[i];
            const table = 'device_master'
            const script = {
                device_name: dv.deive_name,
                device_time: moment(dv.deive_time).format("YYYY-MM-DD HH:mm:ss"),
                device_ip: dv.device_ip,
                latitude: dv.latitude,
                longgitude: dv.longitude,
                pat_id: pat.pat_id,
                create_date: moment().format("YYYY-MM-DDTHH:mm:ss"),
                del_flag: '1'

            }
            const r1 = await pg(table).insert(script);
            if (r1.rowaction == 0) {
                return { code: true, status: 400, message: r1.message, data: [] };
            }
        }
        for (let i = 0; i < usertry.length; i++) {
            const ut = usertry[i];
            const getMaxIdProfile = await pg('user_profile').max('user_pro_id as max_id');
            const getMaxId = await pg('usertry_master').max('ut_id as max_id');
            const userProfileData = {
                user_pro_id: getMaxIdProfile[0].max_id + 1,
                fristname: ut.ut_fristname,
                lastname: ut.ut_lastname,
                birthday: moment(ut.ut_birthday, 'DD/MM/YYYY').format('YYYY-MM-DD'),
                gender: ut.ut_gender,
                phone: ut.ut_phone
            };
            const insertProfile = await pg('user_profile').insert(userProfileData).returning('user_pro_id');
            if (!insertProfile || !insertProfile[0]) {
                return { code: true, status: 400, message: 'Failed to insert user profile', data: [] };
            }
            const usertryData = {
                ut_id: getMaxId[0].max_id + 1,
                ut_relationship: ut.ut_relationship,
                user_pro_id: insertProfile[0].user_pro_id,
                create_date: pg.fn.now(),
                update_date: null,
                del_flag: '1',
                pat_id: insertPat[0].pat_id
            };
            const insertUsertry = await pg('usertry_master').insert(usertryData).returning('ut_id');
            if (!insertUsertry || !insertUsertry[0]) {
                return { code: true, status: 400, message: 'Failed to insert usertry data', data: [] };
            }
        }


        return { code: false, status: 200, message: "success", data: { pat_id: insertPat[0].pat_id } };

    } catch (error) {
        return { code: true, status: 400, message: error.message, data: [] };
    }
}
const update_patient = async ({ pat, device, usertry }, { email, role }) => {
    console.log(pat, device, usertry);
    try {
        if (!pat.pat_id || !pat.disease || !pat.member || device.length < 1 || usertry.length < 1) {
            return { code: true, status: 400, message: "ข้อมูลไม่ครบถ้วน", data: [] };
        }
        for (let i = 0; i < usertry.length; i++) {
            const ut = usertry[i];
            const table = 'usertry_master'

            if (!ut.ut_id) {
                const max_id = await pg(table).max('ut_id');
                const get_maxid_pro_file = await pg('user_profile').max('user_pro_id');

                const r2 = await pg('user_profile').insert({
                    user_pro_id: get_maxid_pro_file[0].max + 1,
                    fristname: ut.ut_fristname,
                    lastname: ut.ut_lastname,
                    birthday: moment(ut.ut_birthday, 'YYYY-MM-DD').format("YYYY-MM-DD"),
                    gender: ut.ut_gender,
                    phone: ut.ut_phone,
                }).returning('user_pro_id')

                const r1 = await pg(table).insert({
                    ut_id: max_id[0].max + 1,
                    ut_relationship: ut.ut_relationship,
                    user_pro_id: r2[0].user_pro_id,
                    create_date: moment().format("YYYY-MM-DD HH:mm:ss"),
                    update_date: null,
                    del_flag: '1',
                    pat_id: pat.pat_id
                })
                if (!r2 || !r1) {
                    return { code: true, status: 400, message: r1 || r2, data: [] };
                }
            }
            if (ut.ut_id) {
                const dvv = await pg(table).where({ ut_id: ut.ut_id, del_flag: '1' });
                if (dvv.length > 0) {
                    const r1 = await pg(table).where({ ut_id: ut.ut_id }).update({
                        ut_relationship: ut.ut_relationship,
                        update_date: moment().format("YYYY-MM-DD HH:mm:ss"),
                    })
                    const r2 = await pg('user_profile').where({ user_pro_id: ut.user_pro_id }).update({
                        fristname: ut.ut_fristname,
                        lastname: ut.ut_lastname,
                        birthday: moment(ut.ut_birthday, 'YYYY-MM-DD').format('YYYY-MM-DD'),
                        gender: ut.ut_gender,
                        phone: ut.ut_phone,

                    })
                    if (!r1 || !r2) {
                        return { code: true, status: 400, message: r1 || r2, data: [] };
                    }
                }

            }




        }
        const update_pat = await pg('patient_master')
            .where('pat_id', pat.pat_id)
            .update({
                pat_weight: pat.pat_weight,
                pat_height: pat.pat_height,
                member: pat.member,
                road: pat.road,
                alley: pat.alley,
                update_date: pg.raw('now()'), // use the `now()` function as raw SQL
                disease: JSON.stringify(pat.disease),
            });

        if (!update_pat) {
            return { code: true, status: 400, message: 'Failed to update patient', data: [] };
        }
        // const insert_pat = await pgcon.execute(`UPDATE patient_master SET pat_weight='${pat.pat_weight}', pat_height='${pat.pat_height}',member='${pat.member}',road='${pat.road}',alley='${pat.alley}',update_date=now(),disease='${JSON.stringify(pat.disease)}' WHERE pat_id='${pat.pat_id}'`, config.connectionString());
        // if (insert_pat.code) {
        //     return { code: true, status: 400, message: insert_pat.message, data: [] };
        // }

        for (let i = 0; i < device.length; i++) {
            const dv = device[i];
            const table = 'device_master'
            const dvv = await pg(table).where({ device_ip: dv.device_ip, del_flag: '1' });
            if (dvv.length == 0) {
                const script = {
                    device_name: dv.deive_name,
                    device_time: moment(dv.deive_time).format("YYYY-MM-DD HH:mm:ss"),
                    device_ip: dv.device_ip,
                    pat_id: pat.pat_id,
                    latitude: dv.latitude,
                    longgitude: dv.longitude,
                    create_date: moment().format("YYYY-MM-DDTHH:mm:ss"),
                    del_flag: '1'
                }
                const r1 = await pg(table).insert(script)
                if (!r1) {
                    return { code: true, status: 400, message: r1, data: [] };
                }
            }
            if (dvv.length > 0) {
                const script = {
                    device_name: dv.deive_name,
                    device_time: moment(dv.deive_time).format("YYYY-MM-DD HH:mm:ss"),
                    latitude: dv.latitude,
                    longgitude: dv.longitude,
                    update_date: moment().format("YYYY-MM-DDTHH:mm:ss"),
                }
                const r1 = await pg(table).where({ pat_id: pat.pat_id }).update(script)
                if (!r1) {
                    return { code: true, status: 400, message: r1, data: [] };
                }
            }

        }
        return { code: false, status: 200, message: "success", data: 'success' };

    } catch (error) {
        return { code: true, status: 400, message: error.message, data: [] };
    }
}
const delete_patient = async ({ pat_id }, { email, role }) => {
    try {
        await pg('patient_master')
            .where({ pat_id: pat_id })
            .update({ del_flag: '0', update_date: pg.fn.now() });
        return { code: false, status: 200, message: "success", data: [] };
    } catch (error) {
        return { code: true, status: 400, message: error.message, data: [] };
    }
}
module.exports = {
    get_patient_all,
    add_patient,
    update_patient,
    delete_patient
}

