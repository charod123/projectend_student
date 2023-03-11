const config = require('../config/config')
const ms = config.connectionString_mssql();

async function schema() {
  const user_profile = await ms.schema.hasTable('user_profile').then(function (exists) {
    if (!exists) {
      return ms.schema.createTable('user_profile', function (t) {
        t.increments('user_pro_id').primary();
        t.string('fristname', 100).notNullable();
        t.string('lastname', 100).notNullable();
        t.date('birthday');
        t.string('gender', 6).notNullable();
        t.string('phone', 10);
      });
    }
  });
  const complain = await ms.schema.hasTable('complain').then(function (exists) {
    if (!exists) {
      return ms.schema.createTable('complain', function (t) {
        t.increments('cp_id').primary();
        t.integer('cp_type_id').notNullable();
        t.string('cp_title', 255).notNullable();
        t.text('cp_detail');
        t.string('cp_tel', 10).notNullable();
        t.timestamp('cp_update_date').defaultTo(ms.fn.now()).notNullable();
        t.timestamp('cp_create_date').defaultTo(ms.fn.now());
        t.integer('pat_id');
        t.string('user_id', 32).notNullable();
        t.string('del_flag', 1).notNullable();
        t.string('cp_status', 1).notNullable();
        t.string('img_path', 255);
        t.string('create_by', 32).notNullable();
        t.text('cp_detail_after', 10);
        t.string('device_id', 32);
      });
    }
  });
  const content_diseases = await ms.schema.hasTable('content_diseases').then(function (exists) {
    if (!exists) {
      return ms.schema.createTable('content_diseases', function (t) {
        t.increments('content_id').primary();
        t.text('detail_on_edit');
        t.text('detail_on_show');
        t.integer('division_id');
        t.string('del_flag', 1).notNullable();
        t.timestamp('create_date').defaultTo(ms.fn.now()).notNullable();
        t.timestamp('update_date').defaultTo(ms.fn.now());
        t.string('sub_menu_name', 255);
        t.integer('main_menu_id')

      });
    }
  });
  const device_master = await ms.schema.hasTable('device_master').then(function (exists) {
    if (!exists) {
      return ms.schema.createTable('device_master', function (t) {
        t.string('device_name', 20).notNullable();
        t.string('device_type_id', 1);
        t.timestamp('device_time').defaultTo(ms.fn.now()).notNullable();
        t.string('device_ip', 30).notNullable();
        t.string('latitude', 100);
        t.string('longgitude', 100);
        t.timestamp('create_date').defaultTo(ms.fn.now()).notNullable();
        t.timestamp('update_date').defaultTo(ms.fn.now());
        t.integer('pat_id').notNullable();
        t.string('del_flag', 1).notNullable();

      });
    }
  });
  const disease_master = await ms.schema.hasTable('disease_master').then(function (exists) {
    if (!exists) {
      return ms.schema.createTable('disease_master', function (t) {
        t.increments('cd_id').primary();
        t.string('cd_name', 155).notNullable();
        t.string('del_flag', 1).notNullable();
        t.timestamp('create_date').defaultTo(ms.fn.now()).notNullable();
        t.timestamp('update_date').defaultTo(ms.fn.now());

      });
    }
  });

  const districts = await ms.schema.hasTable('districts').then(function (exists) {
    if (!exists) {
      return ms.schema.createTable('districts', function (t) {
        t.increments('dis_id').primary();
        t.integer('code');
        t.string('dis_name_in_thai', 150).notNullable();
        t.integer('province_id').notNullable();

      });
    }
  });

  const division_master = await ms.schema.hasTable('division_master').then(function (exists) {
    if (!exists) {
      return ms.schema.createTable('division_master', function (t) {
        t.increments('division_id').primary();
        t.string('division_name', 50).notNullable();
        t.string('del_flag', 1).notNullable();
        t.timestamp('create_date').defaultTo(ms.fn.now()).notNullable();
        t.timestamp('update_date').defaultTo(ms.fn.now());
        t.string('create_by', 50)
        t.string('tel', 40)
        t.string('email', 50)
        t.string('lat', 100).notNullable();
        t.string('long', 100).notNullable();
        t.integer('province_id').notNullable();
        t.integer('district_id').notNullable();
        t.integer('subdistrict_id').notNullable();

      });
    }
  });

  const employee = await ms.schema.hasTable('employee').then(function (exists) {
    if (!exists) {
      return ms.schema.createTable('employee', function (t) {
        t.increments('emp_id').primary();
        t.string('emp_name_position', 50).notNullable();
        t.integer('subdivision_id').notNullable();
        t.timestamp('create_date').defaultTo(ms.fn.now()).notNullable();
        t.timestamp('update_date').defaultTo(ms.fn.now());
        t.integer('user_id').notNullable();
        t.string('del_flag', 1).notNullable();

      });
    }
  });
  const main_menu = await ms.schema.hasTable('main_menu').then(function (exists) {
    if (!exists) {
      return ms.schema.createTable('main_menu', function (t) {
        t.increments('main_menu_id').primary();
        t.string('main_menu_name', 255).notNullable();
        t.integer('subdivision_id').notNullable();
        t.timestamp('create_date').defaultTo(ms.fn.now()).notNullable();
        t.timestamp('update_date').defaultTo(ms.fn.now());
        t.string('del_flag', 1).notNullable();

      });
    }
  });




  const notification = await ms.schema.hasTable('notification').then(function (exists) {
    if (!exists) {
      return ms.schema.createTable('notification', function (t) {
        t.increments('ni_id').primary();
        t.text('detail_deliver')
        t.string('del_flag', 1).notNullable();
        t.text('detail_patient')
        t.timestamp('time_event').defaultTo(ms.fn.now()).notNullable();
        t.timestamp('update_date').defaultTo(ms.fn.now())
        t.string('device_ip', 32).notNullable();
        t.string('status', 1).notNullable();
        t.string('lavel', 20)
        t.text('agency_more')
        t.string('ping_gsm', 3)
      });
    }
  });

  const patient_master = await ms.schema.hasTable('patient_master').then(function (exists) {
    if (!exists) {
      return ms.schema.createTable('patient_master', function (t) {
        t.integer('pat_id').primary();
        t.string('pat_weight', 4).notNullable();
        t.string('pat_height', 4).notNullable();
        t.string('create_by', 32).notNullable();
        t.string('img_path', 255);
        t.string('member', 5).notNullable();
        t.string('road', 10)
        t.string('alley', 20)
        t.string('postal_code', 5).notNullable();
        t.integer('province_id').notNullable();
        t.integer('district_id').notNullable();
        t.integer('subdistrict_id').notNullable();
        t.integer('user_pro_id')
        t.string('del_flag', 1).notNullable();
        t.string('user_id', 32).notNullable();
        t.text('disease').notNullable();
        t.timestamp('create_date').defaultTo(ms.fn.now()).notNullable();
        t.timestamp('update_date').defaultTo(ms.fn.now());
      });
    }
  });



  const priority = await ms.schema.hasTable('priority').then(function (exists) {
    if (!exists) {
      return ms.schema.createTable('priority', function (t) {
        t.increments('priority_id').primary();
        t.string('priority_name_th', 100).notNullable();
        t.string('del_flag', 1).notNullable();
      });
    }
  });




  const priority_config = await ms.schema.hasTable('priority_config').then(function (exists) {
    if (!exists) {
      return ms.schema.createTable('priority_config', function (t) {
        t.increments('priority_id').primary();
        t.string('can_read', 1).notNullable();
        t.string('can_delete', 1).notNullable();
        t.string('can_write', 1).notNullable();
        t.string('can_export', 1).notNullable();
        t.string('role_id', 1).notNullable();
      });
    }
  });


  const provinces = await ms.schema.hasTable('provinces').then(function (exists) {
    if (!exists) {
      return ms.schema.createTable('provinces', function (t) {
        t.increments('pro_id').primary();
        t.integer('code')
        t.string('pro_name_in_thai', 150).notNullable();
      });
    }
  });




  const subdistricts = await ms.schema.hasTable('subdistricts').then(function (exists) {
    if (!exists) {
      return ms.schema.createTable('subdistricts', function (t) {
        t.increments('sub_id').primary();
        t.integer('code')
        t.string('sub_name_in_thai', 150).notNullable();
        t.string('latitude', 20)
        t.string('longitude', 20);
        t.integer('district_id').notNullable();
        t.integer('zip_code')
      });
    }
  });


  const subdivision_master = await ms.schema.hasTable('subdivision_master').then(function (exists) {
    if (!exists) {
      return ms.schema.createTable('subdivision_master', function (t) {
        t.increments('subdivision_id').primary();
        t.string('subdivision_name', 200).notNullable();
        t.string('create_by', 32)
        t.integer('division_id').notNullable();
        t.string('del_flag', 1).notNullable();
        t.timestamp('create_date').defaultTo(ms.fn.now()).notNullable();
        t.timestamp('update_date').defaultTo(ms.fn.now());
      });
    }
  });

  const task = await ms.schema.hasTable('task').then(function (exists) {
    if (!exists) {
      return ms.schema.createTable('task', function (t) {
        t.increments('task_id').primary();
        t.string('task_title', 255).notNullable();
        t.text('task_detail')
        t.timestamp('start_date').defaultTo(ms.fn.now()).notNullable();
        t.timestamp('end_date').defaultTo(ms.fn.now());
        t.text('detail_end_json')
        t.text('detail_end_html')
        t.string('opener_task', 32)
        t.string('status', 1).notNullable();
        t.string('file_path', 255)
        t.integer('task_type_id').notNullable();
        t.timestamp('create_date').defaultTo(ms.fn.now()).notNullable();
        t.timestamp('update_date').defaultTo(ms.fn.now());
        t.string('del_flag', 2).notNullable();
        t.integer('subdivision_id').notNullable();
        t.string('user_id', 32).notNullable();
        t.string('person_responsible', 32)
        t.text('remark')
        t.string('real_work', 2).notNullable();
        t.unique(['task_id', 'user_id', 'subdivision_id']);
      });
    }
  });

  const task_type = await ms.schema.hasTable('task_type').then(function (exists) {
    if (!exists) {
      return ms.schema.createTable('task_type', function (t) {
        t.increments('task_type_id').primary();
        t.string('task_type_name', 255).notNullable();
        t.string('create_by', 32).notNullable();
        t.timestamp('create_date').defaultTo(ms.fn.now()).notNullable();
        t.timestamp('update_date').defaultTo(ms.fn.now());
        t.string('del_flag', 1).notNullable();
      });
    }
  });

  const user_master = await ms.schema.hasTable('user_master').then(function (exists) {
    if (!exists) {
      return ms.schema.createTable('user_master', function (t) {
        t.increments('user_id').primary();
        t.string('email', 50).notNullable();
        t.string('password', 200).notNullable();
        t.string('img_path', 255);
        t.string('del_flag', 1).notNullable();
        t.integer('user_pro_id').notNullable();
        t.string('line_token', 250);
        t.timestamp('create_date').defaultTo(ms.fn.now()).notNullable();
        t.timestamp('update_date').defaultTo(ms.fn.now());
        t.string('role_id', 1).notNullable();
        t.integer('province_id')
        t.integer('district_id')
        t.integer('subdistrict_id')

      });
    }
  });

  const usertry_master = await ms.schema.hasTable('usertry_master').then(function (exists) {
    if (!exists) {
      return ms.schema.createTable('usertry_master', function (t) {
        t.increments('ut_id').primary();
        t.string('ut_relationship', 20).notNullable();
        t.integer('user_pro_id').notNullable();
        t.timestamp('create_date').defaultTo(ms.fn.now()).notNullable();
        t.timestamp('update_date').defaultTo(ms.fn.now());
        t.string('del_flag', 1).notNullable();
        t.integer('pat_id').notNullable();
      });
    }
  });
  const inset = await ms('districts').insert({ dis_id: 171, code: 017, dis_name_in_thai: 'เขต ห้วยขวาง', province_id: 1 })
  // const res = await ms('districts').insert([
  //   { dis_id: 410, code: 04, dis_name_in_thai: 'เขต บางรัก', province_id: 1 },
  //   { dis_id: 510, code: 05, dis_name_in_thai: 'เขต บางเขน', province_id: 1 },
  //   { dis_id: 610, code: 06, dis_name_in_thai: 'เขต บางกะปิ', province_id: 1 },
  //   { dis_id: 710, code: 07, dis_name_in_thai: 'เขต ปทุมวัน', province_id: 1 },
  //   { dis_id: 810, code: 08, dis_name_in_thai: 'เขต ป้อมปราบศัตรูพ่าย', province_id: 1 },
  //   { dis_id: 910, code: 09, dis_name_in_thai: 'เขต พระโขนง', province_id: 1 },
  //   { dis_id: 101, code: 010, dis_name_in_thai: 'เขต มีนบุรี', province_id: 1 },
  //   { dis_id: 111, code: 011, dis_name_in_thai: 'เขต ลาดกระบัง', province_id: 1 },
  //   { dis_id: 121, code: 012, dis_name_in_thai: 'เขต ยานนาวา', province_id: 1 },
  //   { dis_id: 131, code: 013, dis_name_in_thai: 'เขต สัมพันธวงศ์', province_id: 1 },
  //   { dis_id: 141, code: 014, dis_name_in_thai: 'เขต พญาไท', province_id: 1 },
  //   { dis_id: 151, code: 015, dis_name_in_thai: 'เขต ธนบุรี', province_id: 1 },
  //   { dis_id: 161, code: 016, dis_name_in_thai: 'เขต บางกอกใหญ่', province_id: 1 },
  // ])
  // { dis_id: 171, code: 017, dis_name_in_thai: 'เขต ห้วยขวาง', province_id: 1 },
  // { dis_id: 181, code: 018, dis_name_in_thai: 'เขต คลองสาน', province_id: 1 },
  // { dis_id: 191, code: 019, dis_name_in_thai: 'เขต ตลิ่งชัน', province_id: 1 },
  // { dis_id: 201, code: 020, dis_name_in_thai: 'เขต บางกอกน้อย', province_id: 1 },
  // { dis_id: 211, code: 021, dis_name_in_thai: 'เขต บางขุนเทียน', province_id: 1 },
  // { dis_id: 221, code: 022, dis_name_in_thai: 'เขต ภาษีเจริญ', province_id: 1 },
  // { dis_id: 231, code: 023, dis_name_in_thai: 'เขต หนองแขม', province_id: 1 },
  // { dis_id: 241, code: 024, dis_name_in_thai: 'เขต ราษฎร์บูรณะ', province_id: 1 },
  // { dis_id: 251, code: 025, dis_name_in_thai: 'เขต บางพลัด', province_id: 1 },
  // { dis_id: 261, code: 026, dis_name_in_thai: 'เขต ดินแดง', province_id: 1 },
  // { dis_id: 271, code: 027, dis_name_in_thai: 'เขต บึงกุ่ม', province_id: 1 },
  // { dis_id: 281, code: 028, dis_name_in_thai: 'เขต สาทร', province_id: 1 },
  // { dis_id: 291, code: 029, dis_name_in_thai: 'เขต บางซื่อ', province_id: 1 },
  // { dis_id: 301, code: 030, dis_name_in_thai: 'เขต จตุจักร', province_id: 1 },
  // { dis_id: 311, code: 031, dis_name_in_thai: 'เขต บางคอแหลม', province_id: 1 },
  // { dis_id: 321, code: 032, dis_name_in_thai: 'เขต ประเวศ', province_id: 1 },
  // { dis_id: 331, code: 033, dis_name_in_thai: 'เขต คลองเตย', province_id: 1 },
  // { dis_id: 341, code: 034, dis_name_in_thai: 'เขต สวนหลวง', province_id: 1 },
  // { dis_id: 351, code: 035, dis_name_in_thai: 'เขต จอมทอง', province_id: 1 },
  // { dis_id: 361, code: 036, dis_name_in_thai: 'เขต ดอนเมือง', province_id: 1 },
  // { dis_id: 371, code: 037, dis_name_in_thai: 'เขต ราชเทวี', province_id: 1 },
  // { dis_id: 381, code: 038, dis_name_in_thai: 'เขต ลาดพร้าว', province_id: 1 },
  // { dis_id: 391, code: 039, dis_name_in_thai: 'เขต วัฒนา', province_id: 1 },
  // { dis_id: 401, code: 040, dis_name_in_thai: 'เขต บางแค', province_id: 1 },
  // { dis_id: 411, code: 041, dis_name_in_thai: 'เขต หลักสี่', province_id: 1 },
  // { dis_id: 421, code: 042, dis_name_in_thai: 'เขต สายไหม', province_id: 1 },
  // { dis_id: 431, code: 043, dis_name_in_thai: 'เขต คันนายาว', province_id: 1 },
  // { dis_id: 441, code: 044, dis_name_in_thai: 'เขต สะพานสูง', province_id: 1 },
  // { dis_id: 451, code: 045, dis_name_in_thai: 'เขต วังทองหลาง', province_id: 1 },
  // { dis_id: 461, code: 046, dis_name_in_thai: 'เขต คลองสามวา', province_id: 1 },
  // { dis_id: 471, code: 047, dis_name_in_thai: 'เขต บางนา', province_id: 1 },
  // { dis_id: 481, code: 048, dis_name_in_thai: 'เขต ทวีวัฒนา', province_id: 1 },
  // { dis_id: 491, code: 049, dis_name_in_thai: 'เขต ทุ่งครุ', province_id: 1 },
  // { dis_id: 501, code: 050, dis_name_in_thai: 'เขต บางบอน', province_id: 1 },
  // { dis_id: 511, code: 101, dis_name_in_thai: 'เมืองสมุทรปราการ', province_id: 2 },
  // { dis_id: 521, code: 102, dis_name_in_thai: 'บางบ่อ', province_id: 2 },
  // { dis_id: 531, code: 103, dis_name_in_thai: 'บางพลี', province_id: 2 },
  // { dis_id: 541, code: 104, dis_name_in_thai: 'พระประแดง', province_id: 2 },
  // { dis_id: 551, code: 105, dis_name_in_thai: 'พระสมุทรเจดีย์', province_id: 2 },
  // { dis_id: 561, code: 106, dis_name_in_thai: 'บางเสาธง', province_id: 2 },
  // { dis_id: 571, code: 201, dis_name_in_thai: 'เมืองนนทบุรี', province_id: 3 },
  // { dis_id: 581, code: 202, dis_name_in_thai: 'บางกรวย', province_id: 3 },
  // { dis_id: 591, code: 203, dis_name_in_thai: 'บางใหญ่', province_id: 3 },
  // { dis_id: 601, code: 204, dis_name_in_thai: 'บางบัวทอง', province_id: 3 },
  // { dis_id: 611, code: 205, dis_name_in_thai: 'ไทรน้อย', province_id: 3 },
  // { dis_id: 621, code: 206, dis_name_in_thai: 'ปากเกร็ด', province_id: 3 },
  // { dis_id: 631, code: 301, dis_name_in_thai: 'เมืองปทุมธานี', province_id: 4 },
  // { dis_id: 641, code: 302, dis_name_in_thai: 'คลองหลวง', province_id: 4 },
  // { dis_id: 651, code: 303, dis_name_in_thai: 'ธัญบุรี', province_id: 4 },
  // { dis_id: 661, code: 304, dis_name_in_thai: 'หนองเสือ', province_id: 4 },
  // { dis_id: 671, code: 305, dis_name_in_thai: 'ลาดหลุมแก้ว', province_id: 4 },
  // { dis_id: 681, code: 306, dis_name_in_thai: 'ลำลูกกา', province_id: 4 },
  // { dis_id: 691, code: 307, dis_name_in_thai: 'สามโคก', province_id: 4 },
  // { dis_id: 701, code: 401, dis_name_in_thai: 'พระนครศรีอยุธยา', province_id: 5 },
  // { dis_id: 711, code: 402, dis_name_in_thai: 'ท่าเรือ', province_id: 5 },
  // { dis_id: 721, code: 403, dis_name_in_thai: 'นครหลวง', province_id: 5 },
  // { dis_id: 731, code: 404, dis_name_in_thai: 'บางไทร', province_id: 5 },
  // { dis_id: 741, code: 405, dis_name_in_thai: 'บางบาล', province_id: 5 },
  // { dis_id: 751, code: 406, dis_name_in_thai: 'บางปะอิน', province_id: 5 },
  // { dis_id: 761, code: 407, dis_name_in_thai: 'บางปะหัน', province_id: 5 },
  // { dis_id: 771, code: 408, dis_name_in_thai: 'ผักไห่', province_id: 5 },
  // { dis_id: 781, code: 409, dis_name_in_thai: 'ภาชี', province_id: 5 },
  // { dis_id: 791, code: 410, dis_name_in_thai: 'ลาดบัวหลวง', province_id: 5 },
  // { dis_id: 801, code: 411, dis_name_in_thai: 'วังน้อย', province_id: 5 },
  // { dis_id: 811, code: 412, dis_name_in_thai: 'เสนา', province_id: 5 },
  // { dis_id: 821, code: 413, dis_name_in_thai: 'บางซ้าย', province_id: 5 },
  // { dis_id: 831, code: 414, dis_name_in_thai: 'อุทัย', province_id: 5 },
  // { dis_id: 841, code: 415, dis_name_in_thai: 'มหาราช', province_id: 5 },
  // { dis_id: 851, code: 416, dis_name_in_thai: 'บ้านแพรก', province_id: 5 },
  // { dis_id: 861, code: 501, dis_name_in_thai: 'เมืองอ่างทอง', province_id: 6 },
  // { dis_id: 871, code: 502, dis_name_in_thai: 'ไชโย', province_id: 6 },
  // { dis_id: 881, code: 503, dis_name_in_thai: 'ป่าโมก', province_id: 6 },
  // { dis_id: 210, code: 02, dis_name_in_thai: 'เขต ดุสิต', province_id: 1 },
  // { dis_id: 310, code: 03, dis_name_in_thai: 'เขต หนองจอก', province_id: 1 },
  // { dis_id: 891, code: 504, dis_name_in_thai: 'โพธิ์ทอง', province_id: 6 },
  // { dis_id: 901, code: 505, dis_name_in_thai: 'แสวงหา', province_id: 6 },
  // { dis_id: 911, code: 506, dis_name_in_thai: 'วิเศษชัยชาญ', province_id: 6 },
  // { dis_id: 921, code: 507, dis_name_in_thai: 'สามโก้', province_id: 6 },
  // { dis_id: 931, code: 601, dis_name_in_thai: 'เมืองลพบุรี', province_id: 7 },
  // { dis_id: 941, code: 602, dis_name_in_thai: 'พัฒนานิคม', province_id: 7 },
  // { dis_id: 951, code: 603, dis_name_in_thai: 'โคกสำโรง', province_id: 7 },
  // { dis_id: 961, code: 604, dis_name_in_thai: 'ชัยบาดาล', province_id: 7 },
  // { dis_id: 971, code: 605, dis_name_in_thai: 'ท่าวุ้ง', province_id: 7 },
  // { dis_id: 981, code: 606, dis_name_in_thai: 'บ้านหมี่', province_id: 7 },
  // { dis_id: 991, code: 607, dis_name_in_thai: 'ท่าหลวง', province_id: 7 },
  // { dis_id: 100, code: 1608, dis_name_in_thai: 'สระโบสถ์', province_id: 7 },
  // { dis_id: 101, code: 1609, dis_name_in_thai: 'โคกเจริญ', province_id: 7 },
  // { dis_id: 102, code: 1610, dis_name_in_thai: 'ลำสนธิ', province_id: 7 },
  // { dis_id: 103, code: 1611, dis_name_in_thai: 'หนองม่วง', province_id: 7 },
  // { dis_id: 104, code: 1701, dis_name_in_thai: 'เมืองสิงห์บุรี', province_id: 8 },
  // { dis_id: 105, code: 1702, dis_name_in_thai: 'บางระจัน', province_id: 8 },
  // { dis_id: 106, code: 1703, dis_name_in_thai: 'ค่ายบางระจัน', province_id: 8 },
  // { dis_id: 107, code: 1704, dis_name_in_thai: 'พรหมบุรี', province_id: 8 },
  // { dis_id: 108, code: 1705, dis_name_in_thai: 'ท่าช้าง', province_id: 8 },
  // { dis_id: 109, code: 1706, dis_name_in_thai: 'อินทร์บุรี', province_id: 8 },
  // { dis_id: 110, code: 1801, dis_name_in_thai: 'เมืองชัยนาท', province_id: 9 },
  // { dis_id: 111, code: 1802, dis_name_in_thai: 'มโนรมย์', province_id: 9 },
  // { dis_id: 112, code: 1803, dis_name_in_thai: 'วัดสิงห์', province_id: 9 },
  // { dis_id: 113, code: 1804, dis_name_in_thai: 'สรรพยา', province_id: 9 },
  // { dis_id: 114, code: 1805, dis_name_in_thai: 'สรรคบุรี', province_id: 9 },
  // { dis_id: 115, code: 1806, dis_name_in_thai: 'หันคา', province_id: 9 },
  // { dis_id: 116, code: 1807, dis_name_in_thai: 'หนองมะโมง', province_id: 9 },
  // { dis_id: 117, code: 1808, dis_name_in_thai: 'เนินขาม', province_id: 9 },
  // { dis_id: 118, code: 1901, dis_name_in_thai: 'เมืองสระบุรี', province_id: 10 },
  // { dis_id: 119, code: 1902, dis_name_in_thai: 'แก่งคอย', province_id: 10 },
  // { dis_id: 120, code: 1903, dis_name_in_thai: 'หนองแค', province_id: 10 },
  // { dis_id: 121, code: 1904, dis_name_in_thai: 'วิหารแดง', province_id: 10 },
  // { dis_id: 122, code: 1905, dis_name_in_thai: 'หนองแซง', province_id: 10 },
  // { dis_id: 123, code: 1906, dis_name_in_thai: 'บ้านหมอ', province_id: 10 },
  // { dis_id: 124, code: 1907, dis_name_in_thai: 'ดอนพุด', province_id: 10 },
  // { dis_id: 125, code: 1908, dis_name_in_thai: 'หนองโดน', province_id: 10 },
  // { dis_id: 126, code: 1909, dis_name_in_thai: 'พระพุทธบาท', province_id: 10 },
  // { dis_id: 127, code: 1910, dis_name_in_thai: 'เสาไห้', province_id: 10 },
  // { dis_id: 128, code: 1911, dis_name_in_thai: 'มวกเหล็ก', province_id: 10 },
  // { dis_id: 129, code: 1912, dis_name_in_thai: 'วังม่วง', province_id: 10 },
  // { dis_id: 130, code: 1913, dis_name_in_thai: 'เฉลิมพระเกียรติ', province_id: 10 },
  // { dis_id: 131, code: 2001, dis_name_in_thai: 'เมืองชลบุรี', province_id: 11 },
  // { dis_id: 132, code: 2002, dis_name_in_thai: 'บ้านบึง', province_id: 11 },
  // { dis_id: 133, code: 2003, dis_name_in_thai: 'หนองใหญ่', province_id: 11 },
  // { dis_id: 134, code: 2004, dis_name_in_thai: 'บางละมุง', province_id: 11 },
  // { dis_id: 135, code: 2005, dis_name_in_thai: 'พานทอง', province_id: 11 },
  // { dis_id: 136, code: 2006, dis_name_in_thai: 'พนัสนิคม', province_id: 11 },
  // { dis_id: 137, code: 2007, dis_name_in_thai: 'ศรีราชา', province_id: 11 },
  // { dis_id: 138, code: 2008, dis_name_in_thai: 'เกาะสีชัง', province_id: 11 },
  // { dis_id: 139, code: 2009, dis_name_in_thai: 'สัตหีบ', province_id: 11 },
  // { dis_id: 140, code: 2010, dis_name_in_thai: 'บ่อทอง', province_id: 11 },
  // { dis_id: 141, code: 2011, dis_name_in_thai: 'เกาะจันทร์', province_id: 11 },
  // { dis_id: 142, code: 2101, dis_name_in_thai: 'เมืองระยอง', province_id: 12 },
  // { dis_id: 143, code: 2102, dis_name_in_thai: 'บ้านฉาง', province_id: 12 },
  // { dis_id: 144, code: 2103, dis_name_in_thai: 'แกลง', province_id: 12 },
  // { dis_id: 145, code: 2104, dis_name_in_thai: 'วังจันทร์', province_id: 12 },
  // { dis_id: 146, code: 2105, dis_name_in_thai: 'บ้านค่าย', province_id: 12 },
  // { dis_id: 147, code: 2106, dis_name_in_thai: 'ปลวกแดง', province_id: 12 },
  // { dis_id: 148, code: 2107, dis_name_in_thai: 'เขาชะเมา', province_id: 12 },
  // { dis_id: 149, code: 2108, dis_name_in_thai: 'นิคมพัฒนา', province_id: 12 },
  // { dis_id: 150, code: 2201, dis_name_in_thai: 'เมืองจันทบุรี', province_id: 13 },
  // { dis_id: 151, code: 2202, dis_name_in_thai: 'ขลุง', province_id: 13 },
  // { dis_id: 152, code: 2203, dis_name_in_thai: 'ท่าใหม่', province_id: 13 },
  // { dis_id: 153, code: 2204, dis_name_in_thai: 'โป่งน้ำร้อน', province_id: 13 },
  // { dis_id: 154, code: 2205, dis_name_in_thai: 'มะขาม', province_id: 13 },
  // { dis_id: 155, code: 2206, dis_name_in_thai: 'แหลมสิงห์', province_id: 13 },
  // { dis_id: 156, code: 2207, dis_name_in_thai: 'สอยดาว', province_id: 13 },
  // { dis_id: 157, code: 2208, dis_name_in_thai: 'แก่งหางแมว', province_id: 13 },
  // { dis_id: 158, code: 2209, dis_name_in_thai: 'นายายอาม', province_id: 13 },
  // { dis_id: 159, code: 2210, dis_name_in_thai: 'เขาคิชฌกูฏ', province_id: 13 },
  // { dis_id: 160, code: 2301, dis_name_in_thai: 'เมืองตราด', province_id: 14 },
  // { dis_id: 161, code: 2302, dis_name_in_thai: 'คลองใหญ่', province_id: 14 },
  // { dis_id: 162, code: 2303, dis_name_in_thai: 'เขาสมิง', province_id: 14 },
  // { dis_id: 163, code: 2304, dis_name_in_thai: 'บ่อไร่', province_id: 14 },
  // { dis_id: 164, code: 2305, dis_name_in_thai: 'แหลมงอบ', province_id: 14 },
  // { dis_id: 165, code: 2306, dis_name_in_thai: 'เกาะกูด', province_id: 14 },
  // { dis_id: 166, code: 2307, dis_name_in_thai: 'เกาะช้าง', province_id: 14 },
  // { dis_id: 167, code: 2401, dis_name_in_thai: 'เมืองฉะเชิงเทรา', province_id: 15 },
  // { dis_id: 168, code: 2402, dis_name_in_thai: 'บางคล้า', province_id: 15 },
  // { dis_id: 169, code: 2403, dis_name_in_thai: 'บางน้ำเปรี้ยว', province_id: 15 },
  // { dis_id: 170, code: 2404, dis_name_in_thai: 'บางปะกง', province_id: 15 },
  // { dis_id: 171, code: 2405, dis_name_in_thai: 'บ้านโพธิ์', province_id: 15 },
  // { dis_id: 172, code: 2406, dis_name_in_thai: 'พนมสารคาม', province_id: 15 },
  // { dis_id: 173, code: 2407, dis_name_in_thai: 'ราชสาส์น', province_id: 15 },
  // { dis_id: 174, code: 2408, dis_name_in_thai: 'สนามชัยเขต', province_id: 15 },
  // { dis_id: 175, code: 2409, dis_name_in_thai: 'แปลงยาว', province_id: 15 },
  // { dis_id: 176, code: 2410, dis_name_in_thai: 'ท่าตะเกียบ', province_id: 15 },
  // { dis_id: 177, code: 2411, dis_name_in_thai: 'คลองเขื่อน', province_id: 15 },
  // { dis_id: 178, code: 2501, dis_name_in_thai: 'เมืองปราจีนบุรี', province_id: 16 },
  // { dis_id: 179, code: 2502, dis_name_in_thai: 'กบินทร์บุรี', province_id: 16 },
  // { dis_id: 180, code: 2503, dis_name_in_thai: 'นาดี', province_id: 16 },
  // { dis_id: 181, code: 2506, dis_name_in_thai: 'บ้านสร้าง', province_id: 16 },
  // { dis_id: 182, code: 2507, dis_name_in_thai: 'ประจันตคาม', province_id: 16 },
  // { dis_id: 183, code: 2508, dis_name_in_thai: 'ศรีมหาโพธิ', province_id: 16 },
  // { dis_id: 184, code: 2509, dis_name_in_thai: 'ศรีมโหสถ', province_id: 16 },
  // { dis_id: 185, code: 2601, dis_name_in_thai: 'เมืองนครนายก', province_id: 17 },
  // { dis_id: 186, code: 2602, dis_name_in_thai: 'ปากพลี', province_id: 17 },
  // { dis_id: 187, code: 2603, dis_name_in_thai: 'บ้านนา', province_id: 17 },
  // { dis_id: 188, code: 2604, dis_name_in_thai: 'องครักษ์', province_id: 17 },
  // { dis_id: 189, code: 2701, dis_name_in_thai: 'เมืองสระแก้ว', province_id: 18 },
  // { dis_id: 190, code: 2702, dis_name_in_thai: 'คลองหาด', province_id: 18 },
  // { dis_id: 191, code: 2703, dis_name_in_thai: 'ตาพระยา', province_id: 18 },
  // { dis_id: 192, code: 2704, dis_name_in_thai: 'วังน้ำเย็น', province_id: 18 },
  // { dis_id: 193, code: 2705, dis_name_in_thai: 'วัฒนานคร', province_id: 18 },
  // { dis_id: 194, code: 2706, dis_name_in_thai: 'อรัญประเทศ', province_id: 18 },
  // { dis_id: 195, code: 2707, dis_name_in_thai: 'เขาฉกรรจ์', province_id: 18 },
  // { dis_id: 196, code: 2708, dis_name_in_thai: 'โคกสูง', province_id: 18 },
  // { dis_id: 197, code: 2709, dis_name_in_thai: 'วังสมบูรณ์', province_id: 18 },
  // { dis_id: 198, code: 3001, dis_name_in_thai: 'เมืองนครราชสีมา', province_id: 19 },
  // { dis_id: 199, code: 3002, dis_name_in_thai: 'ครบุรี', province_id: 19 },
  // { dis_id: 200, code: 3003, dis_name_in_thai: 'เสิงสาง', province_id: 19 },
  // { dis_id: 201, code: 3004, dis_name_in_thai: 'คง', province_id: 19 },
  // { dis_id: 202, code: 3005, dis_name_in_thai: 'บ้านเหลื่อม', province_id: 19 },
  // { dis_id: 203, code: 3006, dis_name_in_thai: 'จักราช', province_id: 19 },
  // { dis_id: 204, code: 3007, dis_name_in_thai: 'โชคชัย', province_id: 19 },
  // { dis_id: 205, code: 3008, dis_name_in_thai: 'ด่านขุนทด', province_id: 19 },
  // { dis_id: 206, code: 3009, dis_name_in_thai: 'โนนไทย', province_id: 19 },
  // { dis_id: 207, code: 3010, dis_name_in_thai: 'โนนสูง', province_id: 19 },
  // { dis_id: 208, code: 3011, dis_name_in_thai: 'ขามสะแกแสง', province_id: 19 },
  // { dis_id: 209, code: 3012, dis_name_in_thai: 'บัวใหญ่', province_id: 19 },
  // { dis_id: 210, code: 3013, dis_name_in_thai: 'ประทาย', province_id: 19 },
  // { dis_id: 211, code: 3014, dis_name_in_thai: 'ปักธงชัย', province_id: 19 },
  // { dis_id: 212, code: 3015, dis_name_in_thai: 'พิมาย', province_id: 19 },
  // { dis_id: 213, code: 3016, dis_name_in_thai: 'ห้วยแถลง', province_id: 19 },
  // { dis_id: 214, code: 3017, dis_name_in_thai: 'ชุมพวง', province_id: 19 },
  // { dis_id: 215, code: 3018, dis_name_in_thai: 'สูงเนิน', province_id: 19 },
  // { dis_id: 216, code: 3019, dis_name_in_thai: 'ขามทะเลสอ', province_id: 19 },
  // { dis_id: 217, code: 3020, dis_name_in_thai: 'สีคิ้ว', province_id: 19 },
  // { dis_id: 218, code: 3021, dis_name_in_thai: 'ปากช่อง', province_id: 19 },
  // { dis_id: 219, code: 3022, dis_name_in_thai: 'หนองบุญมาก', province_id: 19 },
  // { dis_id: 220, code: 3023, dis_name_in_thai: 'แก้งสนามนาง', province_id: 19 },
  // { dis_id: 221, code: 3024, dis_name_in_thai: 'โนนแดง', province_id: 19 },
  // { dis_id: 222, code: 3025, dis_name_in_thai: 'วังน้ำเขียว', province_id: 19 },
  // { dis_id: 223, code: 3026, dis_name_in_thai: 'เทพารักษ์', province_id: 19 },
  // { dis_id: 224, code: 3027, dis_name_in_thai: 'เมืองยาง', province_id: 19 },
  // { dis_id: 225, code: 3028, dis_name_in_thai: 'พระทองคำ', province_id: 19 },
  // { dis_id: 226, code: 3029, dis_name_in_thai: 'ลำทะเมนชัย', province_id: 19 },
  // { dis_id: 227, code: 3030, dis_name_in_thai: 'บัวลาย', province_id: 19 },
  // { dis_id: 228, code: 3031, dis_name_in_thai: 'สีดา', province_id: 19 },
  // { dis_id: 229, code: 3032, dis_name_in_thai: 'เฉลิมพระเกียรติ', province_id: 19 },
  // { dis_id: 230, code: 3101, dis_name_in_thai: 'เมืองบุรีรัมย์', province_id: 20 },
  // { dis_id: 231, code: 3102, dis_name_in_thai: 'คูเมือง', province_id: 20 },
  // { dis_id: 232, code: 3103, dis_name_in_thai: 'กระสัง', province_id: 20 },
  // { dis_id: 233, code: 3104, dis_name_in_thai: 'นางรอง', province_id: 20 },
  // { dis_id: 234, code: 3105, dis_name_in_thai: 'หนองกี่', province_id: 20 },
  // { dis_id: 235, code: 3106, dis_name_in_thai: 'ละหานทราย', province_id: 20 },
  // { dis_id: 236, code: 3107, dis_name_in_thai: 'ประโคนชัย', province_id: 20 },
  // { dis_id: 237, code: 3108, dis_name_in_thai: 'บ้านกรวด', province_id: 20 },
  // { dis_id: 238, code: 3109, dis_name_in_thai: 'พุทไธสง', province_id: 20 },
  // { dis_id: 239, code: 3110, dis_name_in_thai: 'ลำปลายมาศ', province_id: 20 },
  // { dis_id: 240, code: 3111, dis_name_in_thai: 'สตึก', province_id: 20 },
  // { dis_id: 241, code: 3112, dis_name_in_thai: 'ปะคำ', province_id: 20 },
  // { dis_id: 242, code: 3113, dis_name_in_thai: 'นาโพธิ์', province_id: 20 },
  // { dis_id: 243, code: 3114, dis_name_in_thai: 'หนองหงส์', province_id: 20 },
  // { dis_id: 244, code: 3115, dis_name_in_thai: 'พลับพลาชัย', province_id: 20 },
  // { dis_id: 245, code: 3116, dis_name_in_thai: 'ห้วยราช', province_id: 20 },
  // { dis_id: 246, code: 3117, dis_name_in_thai: 'โนนสุวรรณ', province_id: 20 },
  // { dis_id: 247, code: 3118, dis_name_in_thai: 'ชำนิ', province_id: 20 },
  // { dis_id: 248, code: 3119, dis_name_in_thai: 'บ้านใหม่ไชยพจน์', province_id: 20 },
  // { dis_id: 249, code: 3120, dis_name_in_thai: 'โนนดินแดง', province_id: 20 },
  // { dis_id: 250, code: 3121, dis_name_in_thai: 'บ้านด่าน', province_id: 20 },
  // { dis_id: 251, code: 3122, dis_name_in_thai: 'แคนดง', province_id: 20 },
  // { dis_id: 252, code: 3123, dis_name_in_thai: 'เฉลิมพระเกียรติ', province_id: 20 },
  // { dis_id: 253, code: 3201, dis_name_in_thai: 'เมืองสุรินทร์', province_id: 21 },
  // { dis_id: 254, code: 3202, dis_name_in_thai: 'ชุมพลบุรี', province_id: 21 },
  // { dis_id: 255, code: 3203, dis_name_in_thai: 'ท่าตูม', province_id: 21 },
  // { dis_id: 256, code: 3204, dis_name_in_thai: 'จอมพระ', province_id: 21 },
  // { dis_id: 257, code: 3205, dis_name_in_thai: 'ปราสาท', province_id: 21 },
  // { dis_id: 258, code: 3206, dis_name_in_thai: 'กาบเชิง', province_id: 21 },
  // { dis_id: 259, code: 3207, dis_name_in_thai: 'รัตนบุรี', province_id: 21 },
  // { dis_id: 260, code: 3208, dis_name_in_thai: 'สนม', province_id: 21 },
  // { dis_id: 261, code: 3209, dis_name_in_thai: 'ศีขรภูมิ', province_id: 21 },
  // { dis_id: 262, code: 3210, dis_name_in_thai: 'สังขะ', province_id: 21 },
  // { dis_id: 263, code: 3211, dis_name_in_thai: 'ลำดวน', province_id: 21 },
  // { dis_id: 264, code: 3212, dis_name_in_thai: 'สำโรงทาบ', province_id: 21 },
  // { dis_id: 265, code: 3213, dis_name_in_thai: 'บัวเชด', province_id: 21 },
  // { dis_id: 266, code: 3214, dis_name_in_thai: 'พนมดงรัก', province_id: 21 },
  // { dis_id: 267, code: 3215, dis_name_in_thai: 'ศรีณรงค์', province_id: 21 },
  // { dis_id: 268, code: 3216, dis_name_in_thai: 'เขวาสินรินทร์', province_id: 21 },
  // { dis_id: 269, code: 3217, dis_name_in_thai: 'โนนนารายณ์', province_id: 21 },
  // { dis_id: 270, code: 3301, dis_name_in_thai: 'เมืองศรีสะเกษ', province_id: 22 },
  // { dis_id: 271, code: 3302, dis_name_in_thai: 'ยางชุมน้อย', province_id: 22 },
  // { dis_id: 272, code: 3303, dis_name_in_thai: 'กันทรารมย์', province_id: 22 },
  // { dis_id: 273, code: 3304, dis_name_in_thai: 'กันทรลักษ์', province_id: 22 },
  // { dis_id: 274, code: 3305, dis_name_in_thai: 'ขุขันธ์', province_id: 22 },
  // { dis_id: 275, code: 3306, dis_name_in_thai: 'ไพรบึง', province_id: 22 },
  // { dis_id: 276, code: 3307, dis_name_in_thai: 'ปรางค์กู่', province_id: 22 },
  // { dis_id: 277, code: 3308, dis_name_in_thai: 'ขุนหาญ', province_id: 22 },
  // { dis_id: 278, code: 3309, dis_name_in_thai: 'ราษีไศล', province_id: 22 },
  // { dis_id: 279, code: 3310, dis_name_in_thai: 'อุทุมพรพิสัย', province_id: 22 },
  // { dis_id: 280, code: 3311, dis_name_in_thai: 'บึงบูรพ์', province_id: 22 },
  // { dis_id: 281, code: 3312, dis_name_in_thai: 'ห้วยทับทัน', province_id: 22 },
  // { dis_id: 282, code: 3313, dis_name_in_thai: 'โนนคูณ', province_id: 22 },
  // { dis_id: 283, code: 3314, dis_name_in_thai: 'ศรีรัตนะ', province_id: 22 },
  // { dis_id: 284, code: 3315, dis_name_in_thai: 'น้ำเกลี้ยง', province_id: 22 },
  // { dis_id: 285, code: 3316, dis_name_in_thai: 'วังหิน', province_id: 22 },
  // { dis_id: 286, code: 3317, dis_name_in_thai: 'ภูสิงห์', province_id: 22 },
  // { dis_id: 287, code: 3318, dis_name_in_thai: 'เมืองจันทร์', province_id: 22 },
  // { dis_id: 288, code: 3319, dis_name_in_thai: 'เบญจลักษ์', province_id: 22 },
  // { dis_id: 289, code: 3320, dis_name_in_thai: 'พยุห์', province_id: 22 },
  // { dis_id: 290, code: 3321, dis_name_in_thai: 'โพธิ์ศรีสุวรรณ', province_id: 22 },
  // { dis_id: 291, code: 3322, dis_name_in_thai: 'ศิลาลาด', province_id: 22 },
  // { dis_id: 292, code: 3401, dis_name_in_thai: 'เมืองอุบลราชธานี', province_id: 23 },
  // { dis_id: 293, code: 3402, dis_name_in_thai: 'ศรีเมืองใหม่', province_id: 23 },
  // { dis_id: 294, code: 3403, dis_name_in_thai: 'โขงเจียม', province_id: 23 },
  // { dis_id: 295, code: 3404, dis_name_in_thai: 'เขื่องใน', province_id: 23 },
  // { dis_id: 296, code: 3405, dis_name_in_thai: 'เขมราฐ', province_id: 23 },
  // { dis_id: 297, code: 3407, dis_name_in_thai: 'เดชอุดม', province_id: 23 },
  // { dis_id: 298, code: 3408, dis_name_in_thai: 'นาจะหลวย', province_id: 23 },
  // { dis_id: 299, code: 3409, dis_name_in_thai: 'น้ำยืน', province_id: 23 },
  // { dis_id: 300, code: 3410, dis_name_in_thai: 'บุณฑริก', province_id: 23 },
  // { dis_id: 301, code: 3411, dis_name_in_thai: 'ตระการพืชผล', province_id: 23 },
  // { dis_id: 302, code: 3412, dis_name_in_thai: 'กุดข้าวปุ้น', province_id: 23 },
  // { dis_id: 303, code: 3414, dis_name_in_thai: 'ม่วงสามสิบ', province_id: 23 },
  // { dis_id: 304, code: 3415, dis_name_in_thai: 'วารินชำราบ', province_id: 23 },
  // { dis_id: 305, code: 3419, dis_name_in_thai: 'พิบูลมังสาหาร', province_id: 23 },
  // { dis_id: 306, code: 3420, dis_name_in_thai: 'ตาลสุม', province_id: 23 },
  // { dis_id: 307, code: 3421, dis_name_in_thai: 'โพธิ์ไทร', province_id: 23 },
  // { dis_id: 308, code: 3422, dis_name_in_thai: 'สำโรง', province_id: 23 },
  // { dis_id: 309, code: 3424, dis_name_in_thai: 'ดอนมดแดง', province_id: 23 },
  // { dis_id: 310, code: 3425, dis_name_in_thai: 'สิรินธร', province_id: 23 },
  // { dis_id: 311, code: 3426, dis_name_in_thai: 'ทุ่งศรีอุดม', province_id: 23 },
  // { dis_id: 312, code: 3429, dis_name_in_thai: 'นาเยีย', province_id: 23 },
  // { dis_id: 313, code: 3430, dis_name_in_thai: 'นาตาล', province_id: 23 },
  // { dis_id: 314, code: 3431, dis_name_in_thai: 'เหล่าเสือโก้ก', province_id: 23 },
  // { dis_id: 315, code: 3432, dis_name_in_thai: 'สว่างวีระวงศ์', province_id: 23 },
  // { dis_id: 316, code: 3433, dis_name_in_thai: 'น้ำขุ่น', province_id: 23 },
  // { dis_id: 317, code: 3501, dis_name_in_thai: 'เมืองยโสธร', province_id: 24 },
  // { dis_id: 318, code: 3502, dis_name_in_thai: 'ทรายมูล', province_id: 24 },
  // { dis_id: 319, code: 3503, dis_name_in_thai: 'กุดชุม', province_id: 24 },
  // { dis_id: 320, code: 3504, dis_name_in_thai: 'คำเขื่อนแก้ว', province_id: 24 },
  // { dis_id: 321, code: 3505, dis_name_in_thai: 'ป่าติ้ว', province_id: 24 },
  // { dis_id: 322, code: 3506, dis_name_in_thai: 'มหาชนะชัย', province_id: 24 },
  // { dis_id: 323, code: 3507, dis_name_in_thai: 'ค้อวัง', province_id: 24 },
  // { dis_id: 324, code: 3508, dis_name_in_thai: 'เลิงนกทา', province_id: 24 },
  // { dis_id: 325, code: 3509, dis_name_in_thai: 'ไทยเจริญ', province_id: 24 },
  // { dis_id: 326, code: 3601, dis_name_in_thai: 'เมืองชัยภูมิ', province_id: 25 },
  // { dis_id: 327, code: 3602, dis_name_in_thai: 'บ้านเขว้า', province_id: 25 },
  // { dis_id: 328, code: 3603, dis_name_in_thai: 'คอนสวรรค์', province_id: 25 },
  // { dis_id: 329, code: 3604, dis_name_in_thai: 'เกษตรสมบูรณ์', province_id: 25 },
  // { dis_id: 330, code: 3605, dis_name_in_thai: 'หนองบัวแดง', province_id: 25 },
  // { dis_id: 331, code: 3606, dis_name_in_thai: 'จัตุรัส', province_id: 25 },
  // { dis_id: 332, code: 3607, dis_name_in_thai: 'บำเหน็จณรงค์', province_id: 25 },
  // { dis_id: 333, code: 3608, dis_name_in_thai: 'หนองบัวระเหว', province_id: 25 },
  // { dis_id: 334, code: 3609, dis_name_in_thai: 'เทพสถิต', province_id: 25 },
  // { dis_id: 335, code: 3610, dis_name_in_thai: 'ภูเขียว', province_id: 25 },
  // { dis_id: 336, code: 3611, dis_name_in_thai: 'บ้านแท่น', province_id: 25 },
  // { dis_id: 337, code: 3612, dis_name_in_thai: 'แก้งคร้อ', province_id: 25 },
  // { dis_id: 338, code: 3613, dis_name_in_thai: 'คอนสาร', province_id: 25 },
  // { dis_id: 339, code: 3614, dis_name_in_thai: 'ภักดีชุมพล', province_id: 25 },
  // { dis_id: 340, code: 3615, dis_name_in_thai: 'เนินสง่า', province_id: 25 },
  // { dis_id: 341, code: 3616, dis_name_in_thai: 'ซับใหญ่', province_id: 25 },
  // { dis_id: 342, code: 3701, dis_name_in_thai: 'เมืองอำนาจเจริญ', province_id: 26 },
  // { dis_id: 343, code: 3702, dis_name_in_thai: 'ชานุมาน', province_id: 26 },
  // { dis_id: 344, code: 3703, dis_name_in_thai: 'ปทุมราชวงศา', province_id: 26 },
  // { dis_id: 345, code: 3704, dis_name_in_thai: 'พนา', province_id: 26 },
  // { dis_id: 346, code: 3705, dis_name_in_thai: 'เสนางคนิคม', province_id: 26 },
  // { dis_id: 347, code: 3706, dis_name_in_thai: 'หัวตะพาน', province_id: 26 },
  // { dis_id: 348, code: 3707, dis_name_in_thai: 'ลืออำนาจ', province_id: 26 },
  // { dis_id: 349, code: 3801, dis_name_in_thai: 'บึงกาฬ', province_id: 27 },
  // { dis_id: 350, code: 3802, dis_name_in_thai: 'พรเจริญ', province_id: 27 },
  // { dis_id: 351, code: 3803, dis_name_in_thai: 'โซ่พิสัย', province_id: 27 },
  // { dis_id: 352, code: 3804, dis_name_in_thai: 'เซกา', province_id: 27 },
  // { dis_id: 353, code: 3805, dis_name_in_thai: 'ปากคาด', province_id: 27 },
  // { dis_id: 354, code: 3806, dis_name_in_thai: 'บึงโขงหลง', province_id: 27 },
  // { dis_id: 355, code: 3807, dis_name_in_thai: 'ศรีวิไล', province_id: 27 },
  // { dis_id: 356, code: 3808, dis_name_in_thai: 'บุ่งคล้า', province_id: 27 },
  // { dis_id: 357, code: 3901, dis_name_in_thai: 'เมืองหนองบัวลำภู', province_id: 28 },
  // { dis_id: 358, code: 3902, dis_name_in_thai: 'นากลาง', province_id: 28 },
  // { dis_id: 359, code: 3903, dis_name_in_thai: 'โนนสัง', province_id: 28 },
  // { dis_id: 360, code: 3904, dis_name_in_thai: 'ศรีบุญเรือง', province_id: 28 },
  // { dis_id: 361, code: 3905, dis_name_in_thai: 'สุวรรณคูหา', province_id: 28 },
  // { dis_id: 362, code: 3906, dis_name_in_thai: 'นาวัง', province_id: 28 },
  // { dis_id: 363, code: 4001, dis_name_in_thai: 'เมืองขอนแก่น', province_id: 29 },
  // { dis_id: 364, code: 4002, dis_name_in_thai: 'บ้านฝาง', province_id: 29 },
  // { dis_id: 365, code: 4003, dis_name_in_thai: 'พระยืน', province_id: 29 },
  // { dis_id: 366, code: 4004, dis_name_in_thai: 'หนองเรือ', province_id: 29 },
  // { dis_id: 367, code: 4005, dis_name_in_thai: 'ชุมแพ', province_id: 29 },
  // { dis_id: 368, code: 4006, dis_name_in_thai: 'สีชมพู', province_id: 29 },
  // { dis_id: 369, code: 4007, dis_name_in_thai: 'น้ำพอง', province_id: 29 },
  // { dis_id: 370, code: 4008, dis_name_in_thai: 'อุบลรัตน์', province_id: 29 },
  // { dis_id: 371, code: 4009, dis_name_in_thai: 'กระนวน', province_id: 29 },
  // { dis_id: 372, code: 4010, dis_name_in_thai: 'บ้านไผ่', province_id: 29 },
  // { dis_id: 373, code: 4011, dis_name_in_thai: 'เปือยน้อย', province_id: 29 },
  // { dis_id: 374, code: 4012, dis_name_in_thai: 'พล', province_id: 29 },
  // { dis_id: 375, code: 4013, dis_name_in_thai: 'แวงใหญ่', province_id: 29 },
  // { dis_id: 376, code: 4014, dis_name_in_thai: 'แวงน้อย', province_id: 29 },
  // { dis_id: 377, code: 4015, dis_name_in_thai: 'หนองสองห้อง', province_id: 29 },
  // { dis_id: 378, code: 4016, dis_name_in_thai: 'ภูเวียง', province_id: 29 },
  // { dis_id: 379, code: 4017, dis_name_in_thai: 'มัญจาคีรี', province_id: 29 },
  // { dis_id: 380, code: 4018, dis_name_in_thai: 'ชนบท', province_id: 29 },
  // { dis_id: 381, code: 4019, dis_name_in_thai: 'เขาสวนกวาง', province_id: 29 },
  // { dis_id: 382, code: 4020, dis_name_in_thai: 'ภูผาม่าน', province_id: 29 },
  // { dis_id: 383, code: 4021, dis_name_in_thai: 'ซำสูง', province_id: 29 },
  // { dis_id: 384, code: 4022, dis_name_in_thai: 'โคกโพธิ์ไชย', province_id: 29 },
  // { dis_id: 385, code: 4023, dis_name_in_thai: 'หนองนาคำ', province_id: 29 },
  // { dis_id: 386, code: 4024, dis_name_in_thai: 'บ้านแฮด', province_id: 29 },
  // { dis_id: 387, code: 4025, dis_name_in_thai: 'โนนศิลา', province_id: 29 },
  // { dis_id: 388, code: 4026, dis_name_in_thai: 'เวียงเก่า', province_id: 29 },
  // { dis_id: 389, code: 4101, dis_name_in_thai: 'เมืองอุดรธานี', province_id: 30 },
  // { dis_id: 390, code: 4102, dis_name_in_thai: 'กุดจับ', province_id: 30 },
  // { dis_id: 391, code: 4103, dis_name_in_thai: 'หนองวัวซอ', province_id: 30 },
  // { dis_id: 392, code: 4104, dis_name_in_thai: 'กุมภวาปี', province_id: 30 },
  // { dis_id: 393, code: 4105, dis_name_in_thai: 'โนนสะอาด', province_id: 30 },
  // { dis_id: 394, code: 4106, dis_name_in_thai: 'หนองหาน', province_id: 30 },
  // { dis_id: 395, code: 4107, dis_name_in_thai: 'ทุ่งฝน', province_id: 30 },
  // { dis_id: 396, code: 4108, dis_name_in_thai: 'ไชยวาน', province_id: 30 },
  // { dis_id: 397, code: 4109, dis_name_in_thai: 'ศรีธาตุ', province_id: 30 },
  // { dis_id: 398, code: 4110, dis_name_in_thai: 'วังสามหมอ', province_id: 30 },
  // { dis_id: 399, code: 4111, dis_name_in_thai: 'บ้านดุง', province_id: 30 },
  // { dis_id: 400, code: 4117, dis_name_in_thai: 'บ้านผือ', province_id: 30 },
  // { dis_id: 401, code: 4118, dis_name_in_thai: 'น้ำโสม', province_id: 30 },
  // { dis_id: 402, code: 4119, dis_name_in_thai: 'เพ็ญ', province_id: 30 },
  // { dis_id: 403, code: 4120, dis_name_in_thai: 'สร้างคอม', province_id: 30 },
  // { dis_id: 404, code: 4121, dis_name_in_thai: 'หนองแสง', province_id: 30 },
  // { dis_id: 405, code: 4122, dis_name_in_thai: 'นายูง', province_id: 30 },
  // { dis_id: 406, code: 4123, dis_name_in_thai: 'พิบูลย์รักษ์', province_id: 30 },
  // { dis_id: 407, code: 4124, dis_name_in_thai: 'กู่แก้ว', province_id: 30 },
  // { dis_id: 408, code: 4125, dis_name_in_thai: 'ประจักษ์ศิลปาคม', province_id: 30 },
  // { dis_id: 409, code: 4201, dis_name_in_thai: 'เมืองเลย', province_id: 31 },
  // { dis_id: 410, code: 4202, dis_name_in_thai: 'นาด้วง', province_id: 31 },
  // { dis_id: 411, code: 4203, dis_name_in_thai: 'เชียงคาน', province_id: 31 },
  // { dis_id: 412, code: 4204, dis_name_in_thai: 'ปากชม', province_id: 31 },
  // { dis_id: 413, code: 4205, dis_name_in_thai: 'ด่านซ้าย', province_id: 31 },
  // { dis_id: 414, code: 4206, dis_name_in_thai: 'นาแห้ว', province_id: 31 },
  // { dis_id: 415, code: 4207, dis_name_in_thai: 'ภูเรือ', province_id: 31 },
  // { dis_id: 416, code: 4208, dis_name_in_thai: 'ท่าลี่', province_id: 31 },
  // { dis_id: 417, code: 4209, dis_name_in_thai: 'วังสะพุง', province_id: 31 },
  // { dis_id: 418, code: 4210, dis_name_in_thai: 'ภูกระดึง', province_id: 31 },
  // { dis_id: 419, code: 4211, dis_name_in_thai: 'ภูหลวง', province_id: 31 },
  // { dis_id: 420, code: 4212, dis_name_in_thai: 'ผาขาว', province_id: 31 },
  // { dis_id: 421, code: 4213, dis_name_in_thai: 'เอราวัณ', province_id: 31 },
  // { dis_id: 422, code: 4214, dis_name_in_thai: 'หนองหิน', province_id: 31 },
  // { dis_id: 423, code: 4301, dis_name_in_thai: 'เมืองหนองคาย', province_id: 32 },
  // { dis_id: 424, code: 4302, dis_name_in_thai: 'ท่าบ่อ', province_id: 32 },
  // { dis_id: 425, code: 4305, dis_name_in_thai: 'โพนพิสัย', province_id: 32 },
  // { dis_id: 426, code: 4307, dis_name_in_thai: 'ศรีเชียงใหม่', province_id: 32 },
  // { dis_id: 427, code: 4308, dis_name_in_thai: 'สังคม', province_id: 32 },
  // { dis_id: 428, code: 4314, dis_name_in_thai: 'สระใคร', province_id: 32 },
  // { dis_id: 429, code: 4315, dis_name_in_thai: 'เฝ้าไร่', province_id: 32 },
  // { dis_id: 430, code: 4316, dis_name_in_thai: 'รัตนวาปี', province_id: 32 },
  // { dis_id: 431, code: 4317, dis_name_in_thai: 'โพธิ์ตาก', province_id: 32 },
  // { dis_id: 432, code: 4401, dis_name_in_thai: 'เมืองมหาสารคาม', province_id: 33 },
  // { dis_id: 433, code: 4402, dis_name_in_thai: 'แกดำ', province_id: 33 },
  // { dis_id: 434, code: 4403, dis_name_in_thai: 'โกสุมพิสัย', province_id: 33 },
  // { dis_id: 435, code: 4404, dis_name_in_thai: 'กันทรวิชัย', province_id: 33 },
  // { dis_id: 436, code: 4405, dis_name_in_thai: 'เชียงยืน', province_id: 33 },
  // { dis_id: 437, code: 4406, dis_name_in_thai: 'บรบือ', province_id: 33 },
  // { dis_id: 438, code: 4407, dis_name_in_thai: 'นาเชือก', province_id: 33 },
  // { dis_id: 439, code: 4408, dis_name_in_thai: 'พยัคฆภูมิพิสัย', province_id: 33 },
  // { dis_id: 440, code: 4409, dis_name_in_thai: 'วาปีปทุม', province_id: 33 },
  // { dis_id: 441, code: 4410, dis_name_in_thai: 'นาดูน', province_id: 33 },
  // { dis_id: 442, code: 4411, dis_name_in_thai: 'ยางสีสุราช', province_id: 33 },
  // { dis_id: 443, code: 4412, dis_name_in_thai: 'กุดรัง', province_id: 33 },
  // { dis_id: 444, code: 4413, dis_name_in_thai: 'ชื่นชม', province_id: 33 },
  // { dis_id: 445, code: 4501, dis_name_in_thai: 'เมืองร้อยเอ็ด', province_id: 34 },
  // { dis_id: 446, code: 4502, dis_name_in_thai: 'เกษตรวิสัย', province_id: 34 },
  // { dis_id: 447, code: 4503, dis_name_in_thai: 'ปทุมรัตต์', province_id: 34 },
  // { dis_id: 448, code: 4504, dis_name_in_thai: 'จตุรพักตรพิมาน', province_id: 34 },
  // { dis_id: 449, code: 4505, dis_name_in_thai: 'ธวัชบุรี', province_id: 34 },
  // { dis_id: 450, code: 4506, dis_name_in_thai: 'พนมไพร', province_id: 34 },
  // { dis_id: 451, code: 4507, dis_name_in_thai: 'โพนทอง', province_id: 34 },
  // { dis_id: 452, code: 4508, dis_name_in_thai: 'โพธิ์ชัย', province_id: 34 },
  // { dis_id: 453, code: 4509, dis_name_in_thai: 'หนองพอก', province_id: 34 },
  // { dis_id: 454, code: 4510, dis_name_in_thai: 'เสลภูมิ', province_id: 34 },
  // { dis_id: 455, code: 4511, dis_name_in_thai: 'สุวรรณภูมิ', province_id: 34 },
  // { dis_id: 456, code: 4512, dis_name_in_thai: 'เมืองสรวง', province_id: 34 },
  // { dis_id: 457, code: 4513, dis_name_in_thai: 'โพนทราย', province_id: 34 },
  // { dis_id: 458, code: 4514, dis_name_in_thai: 'อาจสามารถ', province_id: 34 },
  // { dis_id: 459, code: 4515, dis_name_in_thai: 'เมยวดี', province_id: 34 },
  // { dis_id: 460, code: 4516, dis_name_in_thai: 'ศรีสมเด็จ', province_id: 34 },
  // { dis_id: 461, code: 4517, dis_name_in_thai: 'จังหาร', province_id: 34 },
  // { dis_id: 462, code: 4518, dis_name_in_thai: 'เชียงขวัญ', province_id: 34 },
  // { dis_id: 463, code: 4519, dis_name_in_thai: 'หนองฮี', province_id: 34 },
  // { dis_id: 464, code: 4520, dis_name_in_thai: 'ทุ่งเขาหลวง', province_id: 34 },
  // { dis_id: 465, code: 4601, dis_name_in_thai: 'เมืองกาฬสินธุ์', province_id: 35 },
  // { dis_id: 466, code: 4602, dis_name_in_thai: 'นามน', province_id: 35 },
  // { dis_id: 467, code: 4603, dis_name_in_thai: 'กมลาไสย', province_id: 35 },
  // { dis_id: 468, code: 4604, dis_name_in_thai: 'ร่องคำ', province_id: 35 },
  // { dis_id: 469, code: 4605, dis_name_in_thai: 'กุฉินารายณ์', province_id: 35 },
  // { dis_id: 470, code: 4606, dis_name_in_thai: 'เขาวง', province_id: 35 },
  // { dis_id: 471, code: 4607, dis_name_in_thai: 'ยางตลาด', province_id: 35 },
  // { dis_id: 472, code: 4608, dis_name_in_thai: 'ห้วยเม็ก', province_id: 35 },
  // { dis_id: 473, code: 4609, dis_name_in_thai: 'สหัสขันธ์', province_id: 35 },
  // { dis_id: 474, code: 4610, dis_name_in_thai: 'คำม่วง', province_id: 35 },
  // { dis_id: 475, code: 4611, dis_name_in_thai: 'ท่าคันโท', province_id: 35 },
  // { dis_id: 476, code: 4612, dis_name_in_thai: 'หนองกุงศรี', province_id: 35 },
  // { dis_id: 477, code: 4613, dis_name_in_thai: 'สมเด็จ', province_id: 35 },
  // { dis_id: 478, code: 4614, dis_name_in_thai: 'ห้วยผึ้ง', province_id: 35 },
  // { dis_id: 479, code: 4615, dis_name_in_thai: 'สามชัย', province_id: 35 },
  // { dis_id: 480, code: 4616, dis_name_in_thai: 'นาคู', province_id: 35 },
  // { dis_id: 481, code: 4617, dis_name_in_thai: 'ดอนจาน', province_id: 35 },
  // { dis_id: 482, code: 4618, dis_name_in_thai: 'ฆ้องชัย', province_id: 35 },
  // { dis_id: 483, code: 4701, dis_name_in_thai: 'เมืองสกลนคร', province_id: 36 },
  // { dis_id: 484, code: 4702, dis_name_in_thai: 'กุสุมาลย์', province_id: 36 },
  // { dis_id: 485, code: 4703, dis_name_in_thai: 'กุดบาก', province_id: 36 },
  // { dis_id: 486, code: 4704, dis_name_in_thai: 'พรรณานิคม', province_id: 36 },
  // { dis_id: 487, code: 4705, dis_name_in_thai: 'พังโคน', province_id: 36 },
  // { dis_id: 488, code: 4706, dis_name_in_thai: 'วาริชภูมิ', province_id: 36 },
  // { dis_id: 489, code: 4707, dis_name_in_thai: 'นิคมน้ำอูน', province_id: 36 },
  // { dis_id: 490, code: 4708, dis_name_in_thai: 'วานรนิวาส', province_id: 36 },
  // { dis_id: 491, code: 4709, dis_name_in_thai: 'คำตากล้า', province_id: 36 },
  // { dis_id: 492, code: 4710, dis_name_in_thai: 'บ้านม่วง', province_id: 36 },
  // { dis_id: 493, code: 4711, dis_name_in_thai: 'อากาศอำนวย', province_id: 36 },
  // { dis_id: 494, code: 4712, dis_name_in_thai: 'สว่างแดนดิน', province_id: 36 },
  // { dis_id: 495, code: 4713, dis_name_in_thai: 'ส่องดาว', province_id: 36 },
  // { dis_id: 496, code: 4714, dis_name_in_thai: 'เต่างอย', province_id: 36 },
  // { dis_id: 497, code: 4715, dis_name_in_thai: 'โคกศรีสุพรรณ', province_id: 36 },
  // { dis_id: 498, code: 4716, dis_name_in_thai: 'เจริญศิลป์', province_id: 36 },
  // { dis_id: 499, code: 4717, dis_name_in_thai: 'โพนนาแก้ว', province_id: 36 },
  // { dis_id: 500, code: 4718, dis_name_in_thai: 'ภูพาน', province_id: 36 },
  // { dis_id: 501, code: 4801, dis_name_in_thai: 'เมืองนครพนม', province_id: 37 },
  // { dis_id: 502, code: 4802, dis_name_in_thai: 'ปลาปาก', province_id: 37 },
  // { dis_id: 503, code: 4803, dis_name_in_thai: 'ท่าอุเทน', province_id: 37 },
  // { dis_id: 504, code: 4804, dis_name_in_thai: 'บ้านแพง', province_id: 37 },
  // { dis_id: 505, code: 4805, dis_name_in_thai: 'ธาตุพนม', province_id: 37 },
  // { dis_id: 506, code: 4806, dis_name_in_thai: 'เรณูนคร', province_id: 37 },
  // { dis_id: 507, code: 4807, dis_name_in_thai: 'นาแก', province_id: 37 },
  // { dis_id: 508, code: 4808, dis_name_in_thai: 'ศรีสงคราม', province_id: 37 },
  // { dis_id: 509, code: 4809, dis_name_in_thai: 'นาหว้า', province_id: 37 },
  // { dis_id: 510, code: 4810, dis_name_in_thai: 'โพนสวรรค์', province_id: 37 },
  // { dis_id: 511, code: 4811, dis_name_in_thai: 'นาทม', province_id: 37 },
  // { dis_id: 512, code: 4812, dis_name_in_thai: 'วังยาง', province_id: 37 },
  // { dis_id: 513, code: 4901, dis_name_in_thai: 'เมืองมุกดาหาร', province_id: 38 },
  // { dis_id: 514, code: 4902, dis_name_in_thai: 'นิคมคำสร้อย', province_id: 38 },
  // { dis_id: 515, code: 4903, dis_name_in_thai: 'ดอนตาล', province_id: 38 },
  // { dis_id: 516, code: 4904, dis_name_in_thai: 'ดงหลวง', province_id: 38 },
  // { dis_id: 517, code: 4905, dis_name_in_thai: 'คำชะอี', province_id: 38 },
  // { dis_id: 518, code: 4906, dis_name_in_thai: 'ว่านใหญ่', province_id: 38 },
  // { dis_id: 519, code: 4907, dis_name_in_thai: 'หนองสูง', province_id: 38 },
  // { dis_id: 520, code: 5001, dis_name_in_thai: 'เมืองเชียงใหม่', province_id: 39 },
  // { dis_id: 521, code: 5002, dis_name_in_thai: 'จอมทอง', province_id: 39 },
  // { dis_id: 522, code: 5003, dis_name_in_thai: 'แม่แจ่ม', province_id: 39 },
  // { dis_id: 523, code: 5004, dis_name_in_thai: 'เชียงดาว', province_id: 39 },
  // { dis_id: 524, code: 5005, dis_name_in_thai: 'ดอยสะเก็ด', province_id: 39 },
  // { dis_id: 525, code: 5006, dis_name_in_thai: 'แม่แตง', province_id: 39 },
  // { dis_id: 526, code: 5007, dis_name_in_thai: 'แม่ริม', province_id: 39 },
  // { dis_id: 527, code: 5008, dis_name_in_thai: 'สะเมิง', province_id: 39 },
  // { dis_id: 528, code: 5009, dis_name_in_thai: 'ฝาง', province_id: 39 },
  // { dis_id: 529, code: 5010, dis_name_in_thai: 'แม่อาย', province_id: 39 },
  // { dis_id: 530, code: 5011, dis_name_in_thai: 'พร้าว', province_id: 39 },
  // { dis_id: 531, code: 5012, dis_name_in_thai: 'สันป่าตอง', province_id: 39 },
  // { dis_id: 532, code: 5013, dis_name_in_thai: 'สันกำแพง', province_id: 39 },
  // { dis_id: 533, code: 5014, dis_name_in_thai: 'สันทราย', province_id: 39 },
  // { dis_id: 534, code: 5015, dis_name_in_thai: 'หางดง', province_id: 39 },
  // { dis_id: 535, code: 5016, dis_name_in_thai: 'ฮอด', province_id: 39 },
  // { dis_id: 536, code: 5017, dis_name_in_thai: 'ดอยเต่า', province_id: 39 },
  // { dis_id: 537, code: 5018, dis_name_in_thai: 'อมก๋อย', province_id: 39 },
  // { dis_id: 538, code: 5019, dis_name_in_thai: 'สารภี', province_id: 39 },
  // { dis_id: 539, code: 5020, dis_name_in_thai: 'เวียงแหง', province_id: 39 },
  // { dis_id: 540, code: 5021, dis_name_in_thai: 'ไชยปราการ', province_id: 39 },
  // { dis_id: 541, code: 5022, dis_name_in_thai: 'แม่วาง', province_id: 39 },
  // { dis_id: 542, code: 5023, dis_name_in_thai: 'แม่ออน', province_id: 39 },
  // { dis_id: 543, code: 5024, dis_name_in_thai: 'ดอยหล่อ', province_id: 39 },
  // { dis_id: 544, code: 5025, dis_name_in_thai: 'กัลยาณิวัฒนา', province_id: 39 },
  // { dis_id: 545, code: 5101, dis_name_in_thai: 'เมืองลำพูน', province_id: 40 },
  // { dis_id: 546, code: 5102, dis_name_in_thai: 'แม่ทา', province_id: 40 },
  // { dis_id: 547, code: 5103, dis_name_in_thai: 'บ้านโฮ่ง', province_id: 40 },
  // { dis_id: 548, code: 5104, dis_name_in_thai: 'ลี้', province_id: 40 },
  // { dis_id: 549, code: 5105, dis_name_in_thai: 'ทุ่งหัวช้าง', province_id: 40 },
  // { dis_id: 550, code: 5106, dis_name_in_thai: 'ป่าซาง', province_id: 40 },
  // { dis_id: 551, code: 5107, dis_name_in_thai: 'บ้านธิ', province_id: 40 },
  // { dis_id: 552, code: 5108, dis_name_in_thai: 'เวียงหนองล่อง', province_id: 40 },
  // { dis_id: 553, code: 5201, dis_name_in_thai: 'เมืองลำปาง', province_id: 41 },
  // { dis_id: 554, code: 5202, dis_name_in_thai: 'แม่เมาะ', province_id: 41 },
  // { dis_id: 555, code: 5203, dis_name_in_thai: 'เกาะคา', province_id: 41 },
  // { dis_id: 556, code: 5204, dis_name_in_thai: 'เสริมงาม', province_id: 41 },
  // { dis_id: 557, code: 5205, dis_name_in_thai: 'งาว', province_id: 41 },
  // { dis_id: 558, code: 5206, dis_name_in_thai: 'แจ้ห่ม', province_id: 41 },
  // { dis_id: 559, code: 5207, dis_name_in_thai: 'วังเหนือ', province_id: 41 },
  // { dis_id: 560, code: 5208, dis_name_in_thai: 'เถิน', province_id: 41 },
  // { dis_id: 561, code: 5209, dis_name_in_thai: 'แม่พริก', province_id: 41 },
  // { dis_id: 562, code: 5210, dis_name_in_thai: 'แม่ทะ', province_id: 41 },
  // { dis_id: 563, code: 5211, dis_name_in_thai: 'สบปราบ', province_id: 41 },
  // { dis_id: 564, code: 5212, dis_name_in_thai: 'ห้างฉัตร', province_id: 41 },
  // { dis_id: 565, code: 5213, dis_name_in_thai: 'เมืองปาน', province_id: 41 },
  // { dis_id: 566, code: 5301, dis_name_in_thai: 'เมืองอุตรดิตถ์', province_id: 42 },
  // { dis_id: 567, code: 5302, dis_name_in_thai: 'ตรอน', province_id: 42 },
  // { dis_id: 568, code: 5303, dis_name_in_thai: 'ท่าปลา', province_id: 42 },
  // { dis_id: 569, code: 5304, dis_name_in_thai: 'น้ำปาด', province_id: 42 },
  // { dis_id: 570, code: 5305, dis_name_in_thai: 'ฟากท่า', province_id: 42 },
  // { dis_id: 571, code: 5306, dis_name_in_thai: 'บ้านโคก', province_id: 42 },
  // { dis_id: 572, code: 5307, dis_name_in_thai: 'พิชัย', province_id: 42 },
  // { dis_id: 573, code: 5308, dis_name_in_thai: 'ลับแล', province_id: 42 },
  // { dis_id: 574, code: 5309, dis_name_in_thai: 'ทองแสนขัน', province_id: 42 },
  // { dis_id: 575, code: 5401, dis_name_in_thai: 'เมืองแพร่', province_id: 43 },
  // { dis_id: 576, code: 5402, dis_name_in_thai: 'ร้องกวาง', province_id: 43 },
  // { dis_id: 577, code: 5403, dis_name_in_thai: 'ลอง', province_id: 43 },
  // { dis_id: 578, code: 5404, dis_name_in_thai: 'สูงเม่น', province_id: 43 },
  // { dis_id: 579, code: 5405, dis_name_in_thai: 'เด่นชัย', province_id: 43 },
  // { dis_id: 580, code: 5406, dis_name_in_thai: 'สอง', province_id: 43 },
  // { dis_id: 581, code: 5407, dis_name_in_thai: 'วังชิ้น', province_id: 43 },
  // { dis_id: 582, code: 5408, dis_name_in_thai: 'หนองม่วงไข่', province_id: 43 },
  // { dis_id: 583, code: 5501, dis_name_in_thai: 'เมืองน่าน', province_id: 44 },
  // { dis_id: 584, code: 5502, dis_name_in_thai: 'แม่จริม', province_id: 44 },
  // { dis_id: 585, code: 5503, dis_name_in_thai: 'บ้านหลวง', province_id: 44 },
  // { dis_id: 586, code: 5504, dis_name_in_thai: 'นาน้อย', province_id: 44 },
  // { dis_id: 587, code: 5505, dis_name_in_thai: 'ปัว', province_id: 44 },
  // { dis_id: 588, code: 5506, dis_name_in_thai: 'ท่าวังผา', province_id: 44 },
  // { dis_id: 589, code: 5507, dis_name_in_thai: 'เวียงสา', province_id: 44 },
  // { dis_id: 590, code: 5508, dis_name_in_thai: 'ทุ่งช้าง', province_id: 44 },
  // { dis_id: 591, code: 5509, dis_name_in_thai: 'เชียงกลาง', province_id: 44 },
  // { dis_id: 592, code: 5510, dis_name_in_thai: 'นาหมื่น', province_id: 44 },
  // { dis_id: 593, code: 5511, dis_name_in_thai: 'สันติสุข', province_id: 44 },
  // { dis_id: 594, code: 5512, dis_name_in_thai: 'บ่อเกลือ', province_id: 44 },
  // { dis_id: 595, code: 5513, dis_name_in_thai: 'สองแคว', province_id: 44 },
  // { dis_id: 596, code: 5514, dis_name_in_thai: 'ภูเพียง', province_id: 44 },
  // { dis_id: 597, code: 5515, dis_name_in_thai: 'เฉลิมพระเกียรติ', province_id: 44 },
  // { dis_id: 598, code: 5601, dis_name_in_thai: 'เมืองพะเยา', province_id: 45 },
  // { dis_id: 599, code: 5602, dis_name_in_thai: 'จุน', province_id: 45 },
  // { dis_id: 600, code: 5603, dis_name_in_thai: 'เชียงคำ', province_id: 45 },
  // { dis_id: 601, code: 5604, dis_name_in_thai: 'เชียงม่วน', province_id: 45 },
  // { dis_id: 602, code: 5605, dis_name_in_thai: 'ดอกคำใต้', province_id: 45 },
  // { dis_id: 603, code: 5606, dis_name_in_thai: 'ปง', province_id: 45 },
  // { dis_id: 604, code: 5607, dis_name_in_thai: 'แม่ใจ', province_id: 45 },
  // { dis_id: 605, code: 5608, dis_name_in_thai: 'ภูซาง', province_id: 45 },
  // { dis_id: 606, code: 5609, dis_name_in_thai: 'ภูกามยาว', province_id: 45 },
  // { dis_id: 607, code: 5701, dis_name_in_thai: 'เมืองเชียงราย', province_id: 46 },
  // { dis_id: 608, code: 5702, dis_name_in_thai: 'เวียงชัย', province_id: 46 },
  // { dis_id: 609, code: 5703, dis_name_in_thai: 'เชียงของ', province_id: 46 },
  // { dis_id: 610, code: 5704, dis_name_in_thai: 'เทิง', province_id: 46 },
  // { dis_id: 611, code: 5705, dis_name_in_thai: 'พาน', province_id: 46 },
  // { dis_id: 612, code: 5706, dis_name_in_thai: 'ป่าแดด', province_id: 46 },
  // { dis_id: 613, code: 5707, dis_name_in_thai: 'แม่จัน', province_id: 46 },
  // { dis_id: 614, code: 5708, dis_name_in_thai: 'เชียงแสน', province_id: 46 },
  // { dis_id: 615, code: 5709, dis_name_in_thai: 'แม่สาย', province_id: 46 },
  // { dis_id: 616, code: 5710, dis_name_in_thai: 'แม่สรวย', province_id: 46 },
  // { dis_id: 617, code: 5711, dis_name_in_thai: 'เวียงป่าเป้า', province_id: 46 },
  // { dis_id: 618, code: 5712, dis_name_in_thai: 'พญาเม็งราย', province_id: 46 },
  // { dis_id: 619, code: 5713, dis_name_in_thai: 'เวียงแก่น', province_id: 46 },
  // { dis_id: 620, code: 5714, dis_name_in_thai: 'ขุนตาล', province_id: 46 },
  // { dis_id: 621, code: 5715, dis_name_in_thai: 'แม่ฟ้าหลวง', province_id: 46 },
  // { dis_id: 622, code: 5716, dis_name_in_thai: 'แม่ลาว', province_id: 46 },
  // { dis_id: 623, code: 5717, dis_name_in_thai: 'เวียงเชียงรุ้ง', province_id: 46 },
  // { dis_id: 624, code: 5718, dis_name_in_thai: 'ดอยหลวง', province_id: 46 },
  // { dis_id: 625, code: 5801, dis_name_in_thai: 'เมืองแม่ฮ่องสอน', province_id: 47 },
  // { dis_id: 626, code: 5802, dis_name_in_thai: 'ขุนยวม', province_id: 47 },
  // { dis_id: 627, code: 5803, dis_name_in_thai: 'ปาย', province_id: 47 },
  // { dis_id: 628, code: 5804, dis_name_in_thai: 'แม่สะเรียง', province_id: 47 },
  // { dis_id: 629, code: 5805, dis_name_in_thai: 'แม่ลาน้อย', province_id: 47 },
  // { dis_id: 630, code: 5806, dis_name_in_thai: 'สบเมย', province_id: 47 },
  // { dis_id: 631, code: 5807, dis_name_in_thai: 'ปางมะผ้า', province_id: 47 },
  // { dis_id: 632, code: 6001, dis_name_in_thai: 'เมืองนครสวรรค์', province_id: 48 },
  // { dis_id: 633, code: 6002, dis_name_in_thai: 'โกรกพระ', province_id: 48 },
  // { dis_id: 634, code: 6003, dis_name_in_thai: 'ชุมแสง', province_id: 48 },
  // { dis_id: 635, code: 6004, dis_name_in_thai: 'หนองบัว', province_id: 48 },
  // { dis_id: 636, code: 6005, dis_name_in_thai: 'บรรพตพิสัย', province_id: 48 },
  // { dis_id: 637, code: 6006, dis_name_in_thai: 'เก้าเลี้ยว', province_id: 48 },
  // { dis_id: 638, code: 6007, dis_name_in_thai: 'ตาคลี', province_id: 48 },
  // { dis_id: 639, code: 6008, dis_name_in_thai: 'ท่าตะโก', province_id: 48 },
  // { dis_id: 640, code: 6009, dis_name_in_thai: 'ไพศาลี', province_id: 48 },
  // { dis_id: 641, code: 6010, dis_name_in_thai: 'พยุหะคีรี', province_id: 48 },
  // { dis_id: 642, code: 6011, dis_name_in_thai: 'ลาดยาว', province_id: 48 },
  // { dis_id: 643, code: 6012, dis_name_in_thai: 'ตากฟ้า', province_id: 48 },
  // { dis_id: 644, code: 6013, dis_name_in_thai: 'แม่วงก์', province_id: 48 },
  // { dis_id: 645, code: 6014, dis_name_in_thai: 'แม่เปิน', province_id: 48 },
  // { dis_id: 646, code: 6015, dis_name_in_thai: 'ชุมตาบง', province_id: 48 },
  // { dis_id: 647, code: 6101, dis_name_in_thai: 'เมืองอุทัยธานี', province_id: 49 },
  // { dis_id: 648, code: 6102, dis_name_in_thai: 'ทัพทัน', province_id: 49 },
  // { dis_id: 649, code: 6103, dis_name_in_thai: 'สว่างอารมณ์', province_id: 49 },
  // { dis_id: 650, code: 6104, dis_name_in_thai: 'หนองฉาง', province_id: 49 },
  // { dis_id: 651, code: 6105, dis_name_in_thai: 'หนองขาหย่าง', province_id: 49 },
  // { dis_id: 652, code: 6106, dis_name_in_thai: 'บ้านไร่', province_id: 49 },
  // { dis_id: 653, code: 6107, dis_name_in_thai: 'ลานสัก', province_id: 49 },
  // { dis_id: 654, code: 6108, dis_name_in_thai: 'ห้วยคต', province_id: 49 },
  // { dis_id: 655, code: 6201, dis_name_in_thai: 'เมืองกำแพงเพชร', province_id: 50 },
  // { dis_id: 656, code: 6202, dis_name_in_thai: 'ไทรงาม', province_id: 50 },
  // { dis_id: 657, code: 6203, dis_name_in_thai: 'คลองลาน', province_id: 50 },
  // { dis_id: 658, code: 6204, dis_name_in_thai: 'ขาณุวรลักษบุรี', province_id: 50 },
  // { dis_id: 659, code: 6205, dis_name_in_thai: 'คลองขลุง', province_id: 50 },
  // { dis_id: 660, code: 6206, dis_name_in_thai: 'พรานกระต่าย', province_id: 50 },
  // { dis_id: 661, code: 6207, dis_name_in_thai: 'ลานกระบือ', province_id: 50 },
  // { dis_id: 662, code: 6208, dis_name_in_thai: 'ทรายทองวัฒนา', province_id: 50 },
  // { dis_id: 663, code: 6209, dis_name_in_thai: 'ปางศิลาทอง', province_id: 50 },
  // { dis_id: 664, code: 6210, dis_name_in_thai: 'บึงสามัคคี', province_id: 50 },
  // { dis_id: 665, code: 6211, dis_name_in_thai: 'โกสัมพีนคร', province_id: 50 },
  // { dis_id: 666, code: 6301, dis_name_in_thai: 'เมืองตาก', province_id: 51 },
  // { dis_id: 667, code: 6302, dis_name_in_thai: 'บ้านตาก', province_id: 51 },
  // { dis_id: 668, code: 6303, dis_name_in_thai: 'สามเงา', province_id: 51 },
  // { dis_id: 669, code: 6304, dis_name_in_thai: 'แม่ระมาด', province_id: 51 },
  // { dis_id: 670, code: 6305, dis_name_in_thai: 'ท่าสองยาง', province_id: 51 },
  // { dis_id: 671, code: 6306, dis_name_in_thai: 'แม่สอด', province_id: 51 },
  // { dis_id: 672, code: 6307, dis_name_in_thai: 'พบพระ', province_id: 51 },
  // { dis_id: 673, code: 6308, dis_name_in_thai: 'อุ้มผาง', province_id: 51 },
  // { dis_id: 674, code: 6309, dis_name_in_thai: 'วังเจ้า', province_id: 51 },
  // { dis_id: 675, code: 6401, dis_name_in_thai: 'เมืองสุโขทัย', province_id: 52 },
  // { dis_id: 676, code: 6402, dis_name_in_thai: 'บ้านด่านลานหอย', province_id: 52 },
  // { dis_id: 677, code: 6403, dis_name_in_thai: 'คีรีมาศ', province_id: 52 },
  // { dis_id: 678, code: 6404, dis_name_in_thai: 'กงไกรลาศ', province_id: 52 },
  // { dis_id: 679, code: 6405, dis_name_in_thai: 'ศรีสัชนาลัย', province_id: 52 },
  // { dis_id: 680, code: 6406, dis_name_in_thai: 'ศรีสำโรง', province_id: 52 },
  // { dis_id: 681, code: 6407, dis_name_in_thai: 'สวรรคโลก', province_id: 52 },
  // { dis_id: 682, code: 6408, dis_name_in_thai: 'ศรีนคร', province_id: 52 },
  // { dis_id: 683, code: 6409, dis_name_in_thai: 'ทุ่งเสลี่ยม', province_id: 52 },
  // { dis_id: 684, code: 6501, dis_name_in_thai: 'เมืองพิษณุโลก', province_id: 53 },
  // { dis_id: 685, code: 6502, dis_name_in_thai: 'นครไทย', province_id: 53 },
  // { dis_id: 686, code: 6503, dis_name_in_thai: 'ชาติตระการ', province_id: 53 },
  // { dis_id: 687, code: 6504, dis_name_in_thai: 'บางระกำ', province_id: 53 },
  // { dis_id: 688, code: 6505, dis_name_in_thai: 'บางกระทุ่ม', province_id: 53 },
  // { dis_id: 689, code: 6506, dis_name_in_thai: 'พรหมพิราม', province_id: 53 },
  // { dis_id: 690, code: 6507, dis_name_in_thai: 'วัดโบสถ์', province_id: 53 },
  // { dis_id: 691, code: 6508, dis_name_in_thai: 'วังทอง', province_id: 53 },
  // { dis_id: 692, code: 6509, dis_name_in_thai: 'เนินมะปราง', province_id: 53 },
  // { dis_id: 693, code: 6601, dis_name_in_thai: 'เมืองพิจิตร', province_id: 54 },
  // { dis_id: 694, code: 6602, dis_name_in_thai: 'วังทรายพูน', province_id: 54 },
  // { dis_id: 695, code: 6603, dis_name_in_thai: 'โพธิ์ประทับช้าง', province_id: 54 },
  // { dis_id: 696, code: 6604, dis_name_in_thai: 'ตะพานหิน', province_id: 54 },
  // { dis_id: 697, code: 6605, dis_name_in_thai: 'บางมูลนาก', province_id: 54 },
  // { dis_id: 698, code: 6606, dis_name_in_thai: 'โพทะเล', province_id: 54 },
  // { dis_id: 699, code: 6607, dis_name_in_thai: 'สามง่าม', province_id: 54 },
  // { dis_id: 700, code: 6608, dis_name_in_thai: 'ทับคล้อ', province_id: 54 },
  // { dis_id: 701, code: 6609, dis_name_in_thai: 'สากเหล็ก', province_id: 54 },
  // { dis_id: 702, code: 6610, dis_name_in_thai: 'บึงนาราง', province_id: 54 },
  // { dis_id: 703, code: 6611, dis_name_in_thai: 'ดงเจริญ', province_id: 54 },
  // { dis_id: 704, code: 6612, dis_name_in_thai: 'วชิรบารมี', province_id: 54 },
  // { dis_id: 705, code: 6701, dis_name_in_thai: 'เมืองเพชรบูรณ์', province_id: 55 },
  // { dis_id: 706, code: 6702, dis_name_in_thai: 'ชนแดน', province_id: 55 },
  // { dis_id: 707, code: 6703, dis_name_in_thai: 'หล่มสัก', province_id: 55 },
  // { dis_id: 708, code: 6704, dis_name_in_thai: 'หล่มเก่า', province_id: 55 },
  // { dis_id: 709, code: 6705, dis_name_in_thai: 'วิเชียรบุรี', province_id: 55 },
  // { dis_id: 710, code: 6706, dis_name_in_thai: 'ศรีเทพ', province_id: 55 },
  // { dis_id: 711, code: 6707, dis_name_in_thai: 'หนองไผ่', province_id: 55 },
  // { dis_id: 712, code: 6708, dis_name_in_thai: 'บึงสามพัน', province_id: 55 },
  // { dis_id: 713, code: 6709, dis_name_in_thai: 'น้ำหนาว', province_id: 55 },
  // { dis_id: 714, code: 6710, dis_name_in_thai: 'วังโป่ง', province_id: 55 },
  // { dis_id: 715, code: 6711, dis_name_in_thai: 'เขาค้อ', province_id: 55 },
  // { dis_id: 716, code: 7001, dis_name_in_thai: 'เมืองราชบุรี', province_id: 56 },
  // { dis_id: 717, code: 7002, dis_name_in_thai: 'จอมบึง', province_id: 56 },
  // { dis_id: 718, code: 7003, dis_name_in_thai: 'สวนผึ้ง', province_id: 56 },
  // { dis_id: 719, code: 7004, dis_name_in_thai: 'ดำเนินสะดวก', province_id: 56 },
  // { dis_id: 720, code: 7005, dis_name_in_thai: 'บ้านโป่ง', province_id: 56 },
  // { dis_id: 721, code: 7006, dis_name_in_thai: 'บางแพ', province_id: 56 },
  // { dis_id: 722, code: 7007, dis_name_in_thai: 'โพธาราม', province_id: 56 },
  // { dis_id: 723, code: 7008, dis_name_in_thai: 'ปากท่อ', province_id: 56 },
  // { dis_id: 724, code: 7009, dis_name_in_thai: 'วัดเพลง', province_id: 56 },
  // { dis_id: 725, code: 7010, dis_name_in_thai: 'บ้านคา', province_id: 56 },
  // { dis_id: 726, code: 7101, dis_name_in_thai: 'เมืองกาญจนบุรี', province_id: 57 },
  // { dis_id: 727, code: 7102, dis_name_in_thai: 'ไทรโยค', province_id: 57 },
  // { dis_id: 728, code: 7103, dis_name_in_thai: 'บ่อพลอย', province_id: 57 },
  // { dis_id: 729, code: 7104, dis_name_in_thai: 'ศรีสวัสดิ์', province_id: 57 },
  // { dis_id: 730, code: 7105, dis_name_in_thai: 'ท่ามะกา', province_id: 57 },
  // { dis_id: 731, code: 7106, dis_name_in_thai: 'ท่าม่วง', province_id: 57 },
  // { dis_id: 732, code: 7107, dis_name_in_thai: 'ทองผาภูมิ', province_id: 57 },
  // { dis_id: 733, code: 7108, dis_name_in_thai: 'สังขละบุรี', province_id: 57 },
  // { dis_id: 734, code: 7109, dis_name_in_thai: 'พนมทวน', province_id: 57 },
  // { dis_id: 735, code: 7110, dis_name_in_thai: 'เลาขวัญ', province_id: 57 },
  // { dis_id: 736, code: 7111, dis_name_in_thai: 'ด่านมะขามเตี้ย', province_id: 57 },
  // { dis_id: 737, code: 7112, dis_name_in_thai: 'หนองปรือ', province_id: 57 },
  // { dis_id: 738, code: 7113, dis_name_in_thai: 'ห้วยกระเจา', province_id: 57 },
  // { dis_id: 739, code: 7201, dis_name_in_thai: 'เมืองสุพรรณบุรี', province_id: 58 },
  // { dis_id: 740, code: 7202, dis_name_in_thai: 'เดิมบางนางบวช', province_id: 58 },
  // { dis_id: 741, code: 7203, dis_name_in_thai: 'ด่านช้าง', province_id: 58 },
  // { dis_id: 742, code: 7204, dis_name_in_thai: 'บางปลาม้า', province_id: 58 },
  // { dis_id: 743, code: 7205, dis_name_in_thai: 'ศรีประจันต์', province_id: 58 },
  // { dis_id: 744, code: 7206, dis_name_in_thai: 'ดอนเจดีย์', province_id: 58 },
  // { dis_id: 745, code: 7207, dis_name_in_thai: 'สองพี่น้อง', province_id: 58 },
  // { dis_id: 746, code: 7208, dis_name_in_thai: 'สามชุก', province_id: 58 },
  // { dis_id: 747, code: 7209, dis_name_in_thai: 'อู่ทอง', province_id: 58 },
  // { dis_id: 748, code: 7210, dis_name_in_thai: 'หนองหญ้าไซ', province_id: 58 },
  // { dis_id: 749, code: 7301, dis_name_in_thai: 'เมืองนครปฐม', province_id: 59 },
  // { dis_id: 750, code: 7302, dis_name_in_thai: 'กำแพงแสน', province_id: 59 },
  // { dis_id: 751, code: 7303, dis_name_in_thai: 'นครชัยศรี', province_id: 59 },
  // { dis_id: 752, code: 7304, dis_name_in_thai: 'ดอนตูม', province_id: 59 },
  // { dis_id: 753, code: 7305, dis_name_in_thai: 'บางเลน', province_id: 59 },
  // { dis_id: 754, code: 7306, dis_name_in_thai: 'สามพราน', province_id: 59 },
  // { dis_id: 755, code: 7307, dis_name_in_thai: 'พุทธมณฑล', province_id: 59 },
  // { dis_id: 756, code: 7401, dis_name_in_thai: 'เมืองสมุทรสาคร', province_id: 60 },
  // { dis_id: 757, code: 7402, dis_name_in_thai: 'กระทุ่มแบน', province_id: 60 },
  // { dis_id: 758, code: 7403, dis_name_in_thai: 'บ้านแพ้ว', province_id: 60 },
  // { dis_id: 759, code: 7501, dis_name_in_thai: 'เมืองสมุทรสงคราม', province_id: 61 },
  // { dis_id: 760, code: 7502, dis_name_in_thai: 'บางคนที', province_id: 61 },
  // { dis_id: 761, code: 7503, dis_name_in_thai: 'อัมพวา', province_id: 61 },
  // { dis_id: 762, code: 7601, dis_name_in_thai: 'เมืองเพชรบุรี', province_id: 62 },
  // { dis_id: 763, code: 7602, dis_name_in_thai: 'เขาย้อย', province_id: 62 },
  // { dis_id: 764, code: 7603, dis_name_in_thai: 'หนองหญ้าปล้อง', province_id: 62 },
  // { dis_id: 765, code: 7604, dis_name_in_thai: 'ชะอำ', province_id: 62 },
  // { dis_id: 766, code: 7605, dis_name_in_thai: 'ท่ายาง', province_id: 62 },
  // { dis_id: 767, code: 7606, dis_name_in_thai: 'บ้านลาด', province_id: 62 },
  // { dis_id: 768, code: 7607, dis_name_in_thai: 'บ้านแหลม', province_id: 62 },
  // { dis_id: 769, code: 7608, dis_name_in_thai: 'แก่งกระจาน', province_id: 62 },
  // { dis_id: 770, code: 7701, dis_name_in_thai: 'เมืองประจวบคีรีขันธ์', province_id: 63 },
  // { dis_id: 771, code: 7702, dis_name_in_thai: 'กุยบุรี', province_id: 63 },
  // { dis_id: 772, code: 7703, dis_name_in_thai: 'ทับสะแก', province_id: 63 },
  // { dis_id: 773, code: 7704, dis_name_in_thai: 'บางสะพาน', province_id: 63 },
  // { dis_id: 774, code: 7705, dis_name_in_thai: 'บางสะพานน้อย', province_id: 63 },
  // { dis_id: 775, code: 7706, dis_name_in_thai: 'ปราณบุรี', province_id: 63 },
  // { dis_id: 776, code: 7707, dis_name_in_thai: 'หัวหิน', province_id: 63 },
  // { dis_id: 777, code: 7708, dis_name_in_thai: 'สามร้อยยอด', province_id: 63 },
  // { dis_id: 778, code: 8001, dis_name_in_thai: 'เมืองนครศรีธรรมราช', province_id: 64 },
  // { dis_id: 779, code: 8002, dis_name_in_thai: 'พรหมคีรี', province_id: 64 },
  // { dis_id: 780, code: 8003, dis_name_in_thai: 'ลานสกา', province_id: 64 },
  // { dis_id: 781, code: 8004, dis_name_in_thai: 'ฉวาง', province_id: 64 },
  // { dis_id: 782, code: 8005, dis_name_in_thai: 'พิปูน', province_id: 64 },
  // { dis_id: 783, code: 8006, dis_name_in_thai: 'เชียรใหญ่', province_id: 64 },
  // { dis_id: 784, code: 8007, dis_name_in_thai: 'ชะอวด', province_id: 64 },
  // { dis_id: 785, code: 8008, dis_name_in_thai: 'ท่าศาลา', province_id: 64 },
  // { dis_id: 786, code: 8009, dis_name_in_thai: 'ทุ่งสง', province_id: 64 },
  // { dis_id: 787, code: 8010, dis_name_in_thai: 'นาบอน', province_id: 64 },
  // { dis_id: 788, code: 8011, dis_name_in_thai: 'ทุ่งใหญ่', province_id: 64 },
  // { dis_id: 789, code: 8012, dis_name_in_thai: 'ปากพนัง', province_id: 64 },
  // { dis_id: 790, code: 8013, dis_name_in_thai: 'ร่อนพิบูลย์', province_id: 64 },
  // { dis_id: 791, code: 8014, dis_name_in_thai: 'สิชล', province_id: 64 },
  // { dis_id: 792, code: 8015, dis_name_in_thai: 'ขนอม', province_id: 64 },
  // { dis_id: 793, code: 8016, dis_name_in_thai: 'หัวไทร', province_id: 64 },
  // { dis_id: 794, code: 8017, dis_name_in_thai: 'บางขัน', province_id: 64 },
  // { dis_id: 795, code: 8018, dis_name_in_thai: 'ถ้ำพรรณรา', province_id: 64 },
  // { dis_id: 796, code: 8019, dis_name_in_thai: 'จุฬาภรณ์', province_id: 64 },
  // { dis_id: 797, code: 8020, dis_name_in_thai: 'พระพรหม', province_id: 64 },
  // { dis_id: 798, code: 8021, dis_name_in_thai: 'นบพิตำ', province_id: 64 },
  // { dis_id: 799, code: 8022, dis_name_in_thai: 'ช้างกลาง', province_id: 64 },
  // { dis_id: 800, code: 8023, dis_name_in_thai: 'เฉลิมพระเกียรติ', province_id: 64 },
  // { dis_id: 801, code: 8101, dis_name_in_thai: 'เมืองกระบี่', province_id: 65 },
  // { dis_id: 802, code: 8102, dis_name_in_thai: 'เขาพนม', province_id: 65 },
  // { dis_id: 803, code: 8103, dis_name_in_thai: 'เกาะลันตา', province_id: 65 },
  // { dis_id: 804, code: 8104, dis_name_in_thai: 'คลองท่อม', province_id: 65 },
  // { dis_id: 805, code: 8105, dis_name_in_thai: 'อ่าวลึก', province_id: 65 },
  // { dis_id: 806, code: 8106, dis_name_in_thai: 'ปลายพระยา', province_id: 65 },
  // { dis_id: 807, code: 8107, dis_name_in_thai: 'ลำทับ', province_id: 65 },
  // { dis_id: 808, code: 8108, dis_name_in_thai: 'เหนือคลอง', province_id: 65 },
  // { dis_id: 809, code: 8201, dis_name_in_thai: 'เมืองพังงา', province_id: 66 },
  // { dis_id: 810, code: 8202, dis_name_in_thai: 'เกาะยาว', province_id: 66 },
  // { dis_id: 811, code: 8203, dis_name_in_thai: 'กะปง', province_id: 66 },
  // { dis_id: 812, code: 8204, dis_name_in_thai: 'ตะกั่วทุ่ง', province_id: 66 },
  // { dis_id: 813, code: 8205, dis_name_in_thai: 'ตะกั่วป่า', province_id: 66 },
  // { dis_id: 814, code: 8206, dis_name_in_thai: 'คุระบุรี', province_id: 66 },
  // { dis_id: 815, code: 8207, dis_name_in_thai: 'ทับปุด', province_id: 66 },
  // { dis_id: 816, code: 8208, dis_name_in_thai: 'ท้ายเหมือง', province_id: 66 },
  // { dis_id: 817, code: 8301, dis_name_in_thai: 'เมืองภูเก็ต', province_id: 67 },
  // { dis_id: 818, code: 8302, dis_name_in_thai: 'กะทู้', province_id: 67 },
  // { dis_id: 819, code: 8303, dis_name_in_thai: 'ถลาง', province_id: 67 },
  // { dis_id: 820, code: 8401, dis_name_in_thai: 'เมืองสุราษฎร์ธานี', province_id: 68 },
  // { dis_id: 821, code: 8402, dis_name_in_thai: 'กาญจนดิษฐ์', province_id: 68 },
  // { dis_id: 822, code: 8403, dis_name_in_thai: 'ดอนสัก', province_id: 68 },
  // { dis_id: 823, code: 8404, dis_name_in_thai: 'เกาะสมุย', province_id: 68 },
  // { dis_id: 824, code: 8405, dis_name_in_thai: 'เกาะพะงัน', province_id: 68 },
  // { dis_id: 825, code: 8406, dis_name_in_thai: 'ไชยา', province_id: 68 },
  // { dis_id: 826, code: 8407, dis_name_in_thai: 'ท่าชนะ', province_id: 68 },
  // { dis_id: 827, code: 8408, dis_name_in_thai: 'คีรีรัฐนิคม', province_id: 68 },
  // { dis_id: 828, code: 8409, dis_name_in_thai: 'บ้านตาขุน', province_id: 68 },
  // { dis_id: 829, code: 8410, dis_name_in_thai: 'พนม', province_id: 68 },
  // { dis_id: 830, code: 8411, dis_name_in_thai: 'ท่าฉาง', province_id: 68 },
  // { dis_id: 831, code: 8412, dis_name_in_thai: 'บ้านนาสาร', province_id: 68 },
  // { dis_id: 832, code: 8413, dis_name_in_thai: 'บ้านนาเดิม', province_id: 68 },
  // { dis_id: 833, code: 8414, dis_name_in_thai: 'เคียนซา', province_id: 68 },
  // { dis_id: 834, code: 8415, dis_name_in_thai: 'เวียงสระ', province_id: 68 },
  // { dis_id: 835, code: 8416, dis_name_in_thai: 'พระแสง', province_id: 68 },
  // { dis_id: 836, code: 8417, dis_name_in_thai: 'พุนพิน', province_id: 68 },
  // { dis_id: 837, code: 8418, dis_name_in_thai: 'ชัยบุรี', province_id: 68 },
  // { dis_id: 838, code: 8419, dis_name_in_thai: 'วิภาวดี', province_id: 68 },
  // { dis_id: 839, code: 8501, dis_name_in_thai: 'เมืองระนอง', province_id: 69 },
  // { dis_id: 840, code: 8502, dis_name_in_thai: 'ละอุ่น', province_id: 69 },
  // { dis_id: 841, code: 8503, dis_name_in_thai: 'กะเปอร์', province_id: 69 },
  // { dis_id: 842, code: 8504, dis_name_in_thai: 'กระบุรี', province_id: 69 },
  // { dis_id: 843, code: 8505, dis_name_in_thai: 'สุขสำราญ', province_id: 69 },
  // { dis_id: 844, code: 8601, dis_name_in_thai: 'เมืองชุมพร', province_id: 70 },
  // { dis_id: 845, code: 8602, dis_name_in_thai: 'ท่าแซะ', province_id: 70 },
  // { dis_id: 846, code: 8603, dis_name_in_thai: 'ปะทิว', province_id: 70 },
  // { dis_id: 847, code: 8604, dis_name_in_thai: 'หลังสวน', province_id: 70 },
  // { dis_id: 848, code: 8605, dis_name_in_thai: 'ละแม', province_id: 70 },
  // { dis_id: 849, code: 8606, dis_name_in_thai: 'พะโต๊ะ', province_id: 70 },
  // { dis_id: 850, code: 8607, dis_name_in_thai: 'สวี', province_id: 70 },
  // { dis_id: 851, code: 8608, dis_name_in_thai: 'ทุ่งตะโก', province_id: 70 },
  // { dis_id: 852, code: 9001, dis_name_in_thai: 'เมืองสงขลา', province_id: 71 },
  // { dis_id: 853, code: 9002, dis_name_in_thai: 'สทิงพระ', province_id: 71 },
  // { dis_id: 854, code: 9003, dis_name_in_thai: 'จะนะ', province_id: 71 },
  // { dis_id: 855, code: 9004, dis_name_in_thai: 'นาทวี', province_id: 71 },
  // { dis_id: 856, code: 9005, dis_name_in_thai: 'เทพา', province_id: 71 },
  // { dis_id: 857, code: 9006, dis_name_in_thai: 'สะบ้าย้อย', province_id: 71 },
  // { dis_id: 858, code: 9007, dis_name_in_thai: 'ระโนด', province_id: 71 },
  // { dis_id: 859, code: 9008, dis_name_in_thai: 'กระแสสินธุ์', province_id: 71 },
  // { dis_id: 860, code: 9009, dis_name_in_thai: 'รัตภูมิ', province_id: 71 },
  // { dis_id: 861, code: 9010, dis_name_in_thai: 'สะเดา', province_id: 71 },
  // { dis_id: 862, code: 9011, dis_name_in_thai: 'หาดใหญ่', province_id: 71 },
  // { dis_id: 863, code: 9012, dis_name_in_thai: 'นาหม่อม', province_id: 71 },
  // { dis_id: 864, code: 9013, dis_name_in_thai: 'ควนเนียง', province_id: 71 },
  // { dis_id: 865, code: 9014, dis_name_in_thai: 'บางกล่ำ', province_id: 71 },
  // { dis_id: 866, code: 9015, dis_name_in_thai: 'สิงหนคร', province_id: 71 },
  // { dis_id: 867, code: 9016, dis_name_in_thai: 'คลองหอยโข่ง', province_id: 71 },
  // { dis_id: 868, code: 9101, dis_name_in_thai: 'เมืองสตูล', province_id: 72 },
  // { dis_id: 869, code: 9102, dis_name_in_thai: 'ควนโดน', province_id: 72 },
  // { dis_id: 870, code: 9103, dis_name_in_thai: 'ควนกาหลง', province_id: 72 },
  // { dis_id: 871, code: 9104, dis_name_in_thai: 'ท่าแพ', province_id: 72 },
  // { dis_id: 872, code: 9105, dis_name_in_thai: 'ละงู', province_id: 72 },
  // { dis_id: 873, code: 9106, dis_name_in_thai: 'ทุ่งหว้า', province_id: 72 },
  // { dis_id: 874, code: 9107, dis_name_in_thai: 'มะนัง', province_id: 72 },
  // { dis_id: 875, code: 9201, dis_name_in_thai: 'เมืองตรัง', province_id: 73 },
  // { dis_id: 876, code: 9202, dis_name_in_thai: 'กันตัง', province_id: 73 },
  // { dis_id: 877, code: 9203, dis_name_in_thai: 'ย่านตาขาว', province_id: 73 },
  // { dis_id: 878, code: 9204, dis_name_in_thai: 'ปะเหลียน', province_id: 73 },
  // { dis_id: 879, code: 9205, dis_name_in_thai: 'สิเกา', province_id: 73 },
  // { dis_id: 880, code: 9206, dis_name_in_thai: 'ห้วยยอด', province_id: 73 },
  // { dis_id: 881, code: 9207, dis_name_in_thai: 'วังวิเศษ', province_id: 73 },
  // { dis_id: 882, code: 9208, dis_name_in_thai: 'นาโยง', province_id: 73 },
  // { dis_id: 883, code: 9209, dis_name_in_thai: 'รัษฎา', province_id: 73 },
  // { dis_id: 884, code: 9210, dis_name_in_thai: 'หาดสำราญ', province_id: 73 },
  // { dis_id: 885, code: 9301, dis_name_in_thai: 'เมืองพัทลุง', province_id: 74 },
  // { dis_id: 886, code: 9302, dis_name_in_thai: 'กงหรา', province_id: 74 },
  // { dis_id: 887, code: 9303, dis_name_in_thai: 'เขาชัยสน', province_id: 74 },
  // { dis_id: 888, code: 9304, dis_name_in_thai: 'ตะโหมด', province_id: 74 },
  // { dis_id: 889, code: 9305, dis_name_in_thai: 'ควนขนุน', province_id: 74 },
  // { dis_id: 890, code: 9306, dis_name_in_thai: 'ปากพะยูน', province_id: 74 },
  // { dis_id: 891, code: 9307, dis_name_in_thai: 'ศรีบรรพต', province_id: 74 },
  // { dis_id: 892, code: 9308, dis_name_in_thai: 'ป่าบอน', province_id: 74 },
  // { dis_id: 893, code: 9309, dis_name_in_thai: 'บางแก้ว', province_id: 74 },
  // { dis_id: 894, code: 9310, dis_name_in_thai: 'ป่าพยอม', province_id: 74 },
  // { dis_id: 895, code: 9311, dis_name_in_thai: 'ศรีนครินทร์', province_id: 74 },
  // { dis_id: 896, code: 9401, dis_name_in_thai: 'เมืองปัตตานี', province_id: 75 },
  // { dis_id: 897, code: 9402, dis_name_in_thai: 'โคกโพธิ์', province_id: 75 },
  // { dis_id: 898, code: 9403, dis_name_in_thai: 'หนองจิก', province_id: 75 },
  // { dis_id: 899, code: 9404, dis_name_in_thai: 'ปะนาเระ', province_id: 75 },
  // { dis_id: 900, code: 9405, dis_name_in_thai: 'มายอ', province_id: 75 },
  // { dis_id: 901, code: 9406, dis_name_in_thai: 'ทุ่งยางแดง', province_id: 75 },
  // { dis_id: 902, code: 9407, dis_name_in_thai: 'สายบุรี', province_id: 75 },
  // { dis_id: 903, code: 9408, dis_name_in_thai: 'ไม้แก่น', province_id: 75 },
  // { dis_id: 904, code: 9409, dis_name_in_thai: 'ยะหริ่ง', province_id: 75 },
  // { dis_id: 905, code: 9410, dis_name_in_thai: 'ยะรัง', province_id: 75 },
  // { dis_id: 906, code: 9411, dis_name_in_thai: 'กะพ้อ', province_id: 75 },
  // { dis_id: 907, code: 9412, dis_name_in_thai: 'แม่ลาน', province_id: 75 },
  // { dis_id: 908, code: 9501, dis_name_in_thai: 'เมืองยะลา', province_id: 76 },
  // { dis_id: 909, code: 9502, dis_name_in_thai: 'เบตง', province_id: 76 },
  // { dis_id: 910, code: 9503, dis_name_in_thai: 'บันนังสตา', province_id: 76 },
  // { dis_id: 911, code: 9504, dis_name_in_thai: 'ธารโต', province_id: 76 },
  // { dis_id: 912, code: 9505, dis_name_in_thai: 'ยะหา', province_id: 76 },
  // { dis_id: 913, code: 9506, dis_name_in_thai: 'รามัน', province_id: 76 },
  // { dis_id: 914, code: 9507, dis_name_in_thai: 'กาบัง', province_id: 76 },
  // { dis_id: 915, code: 9508, dis_name_in_thai: 'กรงปีนัง', province_id: 76 },
  // { dis_id: 916, code: 9601, dis_name_in_thai: 'เมืองนราธิวาส', province_id: 77 },
  // { dis_id: 917, code: 9602, dis_name_in_thai: 'ตากใบ', province_id: 77 },
  // { dis_id: 918, code: 9603, dis_name_in_thai: 'บาเจาะ', province_id: 77 },
  // { dis_id: 919, code: 9604, dis_name_in_thai: 'ยี่งอ', province_id: 77 },
  // { dis_id: 920, code: 9605, dis_name_in_thai: 'ระแงะ', province_id: 77 },
  // { dis_id: 921, code: 9606, dis_name_in_thai: 'รือเสาะ', province_id: 77 },
  // { dis_id: 922, code: 9607, dis_name_in_thai: 'ศรีสาคร', province_id: 77 },
  // { dis_id: 923, code: 9608, dis_name_in_thai: 'แว้ง', province_id: 77 },
  // { dis_id: 924, code: 9609, dis_name_in_thai: 'สุคิริน', province_id: 77 },
  // { dis_id: 925, code: 9610, dis_name_in_thai: 'สุไหงโก-ลก', province_id: 77 },
  // { dis_id: 926, code: 9611, dis_name_in_thai: 'สุไหงปาดี', province_id: 77 },
  // { dis_id: 927, code: 9612, dis_name_in_thai: 'จะแนะ', province_id: 77 },
  // { dis_id: 928, code: 9613, dis_name_in_thai: 'เจาะไอร้อง', province_id: 77 },
  // { dis_id: 1, code: 1001, dis_name_in_thai: 'เขต พระนคร', province_id: 1 },

  // { dis_id: 920, code: 9605, dis_name_in_thai: 'ระแงะ', province_id: 77 },
  // ])

}
schema()

