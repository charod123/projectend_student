const config = require('../config/config')
const ms = config.connectionString_pg();

async function schema() {
  const user_profile = await ms.schema.hasTable('user_profile').then(function (exists) {
    if (!exists) {
      return ms.schema.createTable('user_profile', function (t) {
        t.integer('user_pro_id').primary();
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
        t.integer('cp_id').primary();
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
        t.integer('content_id').primary();
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
        t.integer('cd_id').primary();
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
        t.integer('dis_id').primary();
        t.integer('code');
        t.string('dis_name_in_thai', 150).notNullable();
        t.integer('province_id').notNullable();

      });
    }
  });

  const division_master = await ms.schema.hasTable('division_master').then(function (exists) {
    if (!exists) {
      return ms.schema.createTable('division_master', function (t) {
        t.integer('division_id').primary();
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
        t.integer('emp_id').primary();
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
        t.integer('main_menu_id').primary();
        t.string('main_menu_name', 255).notNullable();
        t.timestamp('create_date').defaultTo(ms.fn.now()).notNullable();
        t.timestamp('update_date').defaultTo(ms.fn.now());
        t.string('del_flag', 1).notNullable();
        t.integer('division_id');
      });
    }
  });




  const notification = await ms.schema.hasTable('notification').then(function (exists) {
    if (!exists) {
      return ms.schema.createTable('notification', function (t) {
        t.integer('ni_id').primary();
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
        t.text('internal_division')
        
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
        t.integer('priority_id').primary();
        t.string('priority_name_th', 100).notNullable();
        t.string('del_flag', 1).notNullable();
      });
    }
  });




  const priority_config = await ms.schema.hasTable('priority_config').then(function (exists) {
    if (!exists) {
      return ms.schema.createTable('priority_config', function (t) {
        t.integer('priority_id').primary();
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
        t.integer('pro_id').primary();
        t.integer('code')
        t.string('pro_name_in_thai', 150).notNullable();
      });
    }
  });




  const subdistricts = await ms.schema.hasTable('subdistricts').then(function (exists) {
    if (!exists) {
      return ms.schema.createTable('subdistricts', function (t) {
        t.integer('sub_id').primary();
        t.integer('code')
        t.string('sub_name_in_thai', 150).notNullable();
        t.string('latitude', 20)
        t.string('longitude', 20);
        t.integer('district_id').notNullable();
        t.string('zip_code')
      });
    }
  });


  const subdivision_master = await ms.schema.hasTable('subdivision_master').then(function (exists) {
    if (!exists) {
      return ms.schema.createTable('subdivision_master', function (t) {
        t.integer('subdivision_id').primary();
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
        t.integer('task_id').primary();
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
        t.text('recommend');
        t.unique(['task_id', 'user_id', 'subdivision_id']);
      });
    }
  });

  const task_type = await ms.schema.hasTable('task_type').then(function (exists) {
    if (!exists) {
      return ms.schema.createTable('task_type', function (t) {
        t.integer('task_type_id').primary();
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
        t.integer('user_id').primary();
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
        t.integer('ut_id').primary();
        t.string('ut_relationship', 20).notNullable();
        t.integer('user_pro_id').notNullable();
        t.timestamp('create_date').defaultTo(ms.fn.now()).notNullable();
        t.timestamp('update_date').defaultTo(ms.fn.now());
        t.string('del_flag', 1).notNullable();
        t.integer('pat_id').notNullable();
      });
    }
  });
  // const inset = await ms('districts').insert({ dis_id: 171, code: 017, dis_name_in_thai: 'เขต ห้วยขวาง', province_id: 1 })

}
schema()

