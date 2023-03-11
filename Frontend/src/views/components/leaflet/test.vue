<template>
  <div style="grid-template-columns: 1fr 4fr 1fr; display: grid; width: 100%; height: 100%; "
        :style="  $store.state.theme == 'light'
                  ? 'background-color: #F6F7F9;  '
                  : 'background-color: #414141 ;'">
        <div style=" width: 100%; height: 100%;padding: 10px; "
           :style="  $store.state.theme == 'light'
                  ? 'background-color: #fff;  '
                  : 'background-color: #414141 ;'">
          <div style="  border-bottom:1px solid #F6F7F9;  height: 10%;">
            <div style="display: flex;">
              <div>
                <img style="width: 54px; height: 48px;" src="../page/StreetPage/sosimage.png"
                  alt="">
              </div>
              <div style="font-weight: bold; display: flex; align-items: center; margin-left: 5px;">
                {{$store.state.language == 'th' ? "SOS แจ้งเหตุฉุกเฉิน " : "Sos  Emergency"}}
              </div>
            </div>
            <div style="font-size: 14px; display: flex; justify-content: center;"
            :style="  $store.state.theme == 'light'
                  ? 'color:#3C3C3E;  '
                  : 'color:#fff;'">
              {{$moment(tempdatesos).format("LLLL")}}

            </div>
          </div>
          <div>
            <div style="padding-top: 10px; display: flex;">
              <div>
                <img style="width: 33px; height: 33px;" src="../page/StreetPage/control.png" alt="">
              </div>
              <div style="display:flex; align-items:center; margin-left : 10px">
                PTZ Controller
              </div>
            </div>


            <div style="grid-template-columns: 1fr 2fr 1fr; display:grid;width: 100%; height: 100%; padding-top: 10px;">
              <div>
                <div style="display:grid; justify-content: center;">
                  <Slider v-model="zoomval" orientation="vertical" />
                </div>
                <div style="display:grid; justify-content: center; font-size: 10px; color:#D9D9D9; padding-top: 10px;">
                  Zoom
                </div>
              </div>
              <div style="width: 100%; height: 100%">
                <div style="display: flex; width: 100%">
                  <div class="control-btn"
                  :style="  $store.state.theme == 'light'
                  ? 'color: #fff;  '
                  : 'color: #5F6165 ;'">

                    <i class="bx bx-caret-up" style="font-size: 28px; transform: rotate(315deg)"></i>
                  </div>
                  <div class="control-btn"
                  :style="  $store.state.theme == 'light'
                  ? 'color: #fff;  '
                  : 'color: #5F6165 ;'">
                    <i class="bx bx-caret-up" style="font-size: 28px"></i>
                  </div>
                  <div class="control-btn"
                   :style="  $store.state.theme == 'light'
                  ? 'color: #fff;  '
                  : 'color: #5F6165 ;'">
                    <i class="bx bx-caret-up" style="font-size: 28px; transform: rotate(45deg)"></i>
                  </div>
                </div>
                <div style="
                  display: flex;
                  width: 100%;
                  align-items: center;
                  justify-content: center;
                ">

                  <div class="control-btn"
                   :style="  $store.state.theme == 'light'
                  ? 'color: #fff;  '
                  : 'color: #5F6165 ;'">
                    <i class="bx bx-caret-up bx-rotate-270" style="font-size: 28px"></i>
                  </div>
                  <div class="control-btn-c"
                  :style="  $store.state.theme == 'light'
                  ? 'color: #fff;  '
                  : 'color: #5F6165 ;'">
                    <i class="bx bx-circle" style="font-size: 20px"></i>
                  </div>
                  <div class="control-btn"
                  :style="  $store.state.theme == 'light'
                  ? 'color: #fff;  '
                  : 'color: #5F6165 ;'">
                    <i class="bx bx-caret-up bx-rotate-90" style="font-size: 28px"></i>
                  </div>
                </div>
                <div style="display: flex; width: 100%">
                  <div class="control-btn"
                   :style="  $store.state.theme == 'light'
                  ? 'color: #fff;  '
                  : 'color: #5F6165 ;'">
                    <i class="bx bx-caret-up" style="font-size: 28px; transform: rotate(225deg)"></i>
                  </div>
                  <div class="control-btn"
                   :style="  $store.state.theme == 'light'
                  ? 'color: #fff;  '
                  : 'color: #5F6165 ;'">
                    <i class="bx bx-caret-up bx-rotate-180" style="font-size: 28px"></i>
                  </div>
                  <div class="control-btn"
                   :style="  $store.state.theme == 'light'
                  ? 'color: #fff;  '
                  : 'color: #5F6165 ;'">
                    <i class="bx bx-caret-up" style="font-size: 28px; transform: rotate(135deg)"></i>
                  </div>
                </div>
              </div>
              <div style="display:grid; justify-content: center; font-size: 10px; color:#D9D9D9; ">
                <div style="display:grid; justify-content: center;">
                  <Slider v-model="focusval" orientation="vertical" />
                </div>
                <div style="display:grid; justify-content: center; font-size: 10px; color:#D9D9D9; padding-top: 10px;">
                  Focus
                </div>
              </div>
            </div>



          </div>
        </div>
        <div style=" width: 100%; height: 100%;">
          <div style="width: 100%; height: calc(100%); display: flex; padding: 10px 20px 10px 20px ">
            <div style="width: 100%; height: calc(100%)">
              <div style="
                    width: calc(100%);
                    height: calc(100% / 2);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                  ">
                <iframe id="cam1" src="" class="embed" style="width: 100%; height: 100%; background-color: black"
                  allowfullscreen=""></iframe>
              </div>
              <div style="
                    width: calc(100%);
                    height: calc(100% / 2);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                  ">
                <iframe id="cam2" class="embed" src="" style="width: 100%; height: 100%; background-color: black"
                  allowfullscreen=""></iframe>
              </div>
            </div>
            <div style="width: 100%; height: calc(100%)">
              <div style="
                    width: calc(100%);
                    height: calc(100% / 2);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                  ">
                <iframe id="cam3" class="embed" src="" style="width: 100%; height: 100%; background-color: black"
                  allowfullscreen=""></iframe>
              </div>
              <div style="
                    width: calc(100%);
                    height: calc(100% / 2);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                  ">
                <iframe id="cam4" class="embed" src="" style="width: 100%; height: 100%; background-color: black"
                  allowfullscreen=""></iframe>
              </div>
            </div>
          </div>
        </div>
        <div style="background: #fff; width: 100%; height: 100%; padding: 10px 10px 10px 0px; overflow-y: auto"
        :style="  $store.state.theme == 'light'
                  ? 'background: #fff;  '
                  : 'background: #414141 ;'">
          <div style="display: flex; ">
            <img style="width: 20px; height: 20px;" src="../page/StreetPage/dotgreen.png" alt="">
            <div style=" font-weight: bold; font-size: 16px; margin-left: 10px;"
            :style="  $store.state.theme == 'light'
                  ? 'color: #000;  '
                  : 'color: #fff ;'">
               {{$store.state.language == 'th' ? "จุดติดตั้ง" : "Installation"}}
            </div>
          </div>
          <div style="  padding-top: 10px ;">
            <div style=" padding: 10px; border-radius: 10px;"
            :style="  $store.state.theme == 'light'
                  ? 'background-color: #F6F7F9;  '
                  : 'background-color: rgba(255, 255, 255, 0.1);'">
              {{temp_pole}}<br>
              {{temp_installation}}<br>
              {{temp_detail}}
            </div>
          </div>
          <div style="display: flex; padding-top: 10px ;">
            <img style="width: 20px; height: 20px;" src="../page/StreetPage/dotgreen.png" alt="">
            <div style=" font-weight: bold; font-size: 16px; margin-left: 10px;"
            :style="  $store.state.theme == 'light'
                  ? 'color: #000; margin-bottom:6px '
                  : 'color: #fff ; margin-bottom:6px'">
                {{$store.state.language == 'th' ? "กรอกข้อมูลผู้แจ้งเหตุ" : "Enter Information"}}
            </div>
          </div>
          <div style="padding-top: 10px;">
            <div style="font-size: 12px; "
             :style="  $store.state.theme == 'light'
                  ? 'color: #000;margin-bottom:6px '
                  : 'color: #fff ;margin-bottom:6px'">
               {{$store.state.language == 'th' ? "เลขบัตรประจำตัวประชาชน" : "ID Card"}}
            </div>
            <div style="
                  width: 100%;
                  display: flex;
                  align-items: center;
                  justify-content: center;


            ">

                <span  style="width: 100%;" class="p-input-icon-left">
                  <i class='bx bxs-pencil'></i>
                  <input :disabled="dis_id_card"  type="text" v-model="select_id_card" class="p-inputtext"
                    :placeholder="$store.state.language == 'th' ? 'เลขบัตรประจำตัวประชาชน' : 'Enter ID Card'"
                    style=" width: 100%;  border-top-left-radius: 10px; border-bottom-left-radius: 10px; height: 40px;  "
                    oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(5, this.maxLength);"
                    onkeydown="javascript: return event.keyCode === 8 ||
            event.keyCode === 46 ? true : !isNaN(Number(event.key))" maxLength="13">

                </span>
                <Button @click="search()" class="bx bx-search-alt-2" style="
                                background: #BBBCC1;
                                border: 1px solid #ffffff10;
                                border-bottom-right-radius: 10px;
                                border-top-right-radius: 10px;
                                color: #fff;
                                font-size: 15px;
                                height: 40px;
                                padding: 10px;
                              " />

            </div>
            <div style="margin-bottom: 10px">
                    <span v-if="ck_id_card == true" class="text-danger" style="font-size: 12px">
                      {{ $store.state.language == 'th' ? 'กรุณากรอกข้อมูล' : 'Please fill out the information completely'
                      }}
                    </span>
                  </div>
            <div style="font-size: 12px; margin-bottom:6px  ">
              {{$store.state.language == 'th' ? 'ชื่อจริงนาม-สกุลผู้แจ้ง' : 'Firstname-Lastname'}}
            </div>
            <div style="
                  width: 100%;
                  display: flex;
                  align-items: center;
                  justify-content: center;


                ">
              <InputText :disabled="dis_fullname" class="p-inputtext-sm"
                :placeholder="$store.state.language == 'th' ? 'ชื่อ-นามสกุลผู้แจ้ง' : 'Enter Firstname'"
                v-model="select_fullname"
                style="width: 100%; border-radius: 10px; background-color: #F6F7F9;  height: 40px;" type="text" />
            </div>
            <div style="margin-bottom: 10px">
                    <span v-if="ck_fullname == true" class="text-danger" style="font-size: 12px">
                      {{ $store.state.language == 'th' ? 'กรุณากรอกข้อมูล' : 'Please fill out the information completely'
                      }}
                    </span>
                  </div>
            <div style="font-size: 12px; margin-bottom:6px ">
            {{$store.state.language == 'th' ? 'หมายเลขติดต่อกลับ' : 'Contact Number'}}
            </div>
            <div style="
                  width: 100%;
                  display: flex;
                  align-items: center;
                  justify-content: center;


                ">
              <InputText :disabled="dis_tel" class="p-inputtext-sm"
                :placeholder="$store.state.language == 'th' ? 'กรอกหมายเลขติดต่อกลับ' : 'Enter Telephone Number'"
                v-model="select_tel"
                style="width: 100%; border-radius: 10px; background-color: #F6F7F9;  height: 40px;" type="text"
                />
            </div>
            <div style="margin-bottom: 10px">
                    <span v-if="ck_tel == true" class="text-danger" style="font-size: 12px">
                      {{ $store.state.language == 'th' ? 'กรุณากรอกข้อมูล' : 'Please fill out the information completely'
                      }}
                    </span>
                  </div>
            <div style="font-size: 12px; margin-bottom:6px">
              {{$store.state.language == 'th' ? "รายละเอียดเพิ่มเติม" : "Detail"}}

            </div>
            <div style="">
              <Textarea :disabled="dis_detail"
                style=" width: 100%; border-radius: 2px; border-radius: 10px; background-color: #F6F7F9; "
                v-model="select_area" rows="3" cols="30" />
            </div>
            <div>
              <div style="font-size: 12px; padding-top: 10px;">
                {{$store.state.language == "th" ? "ลักษณะเหตุ": "Warning Level"}}
              </div>
              <div style="
                    display: flex;
                    justify-content: start;
                    align-items: center;
                    height: 100%;
                    grid-template-columns: 1fr  1fr;
                    padding-top: 10px;
                  ">
                <div style="height: 100%; width: 100%;" class="field-radiobutton">
                  <RadioButton inputId="city3" name="city" value="1" v-model="ck_warning" />
                  <label style="margin-left: 10px; font-size: 14px; "
                  :style="  $store.state.theme == 'light'
                  ? 'color: #000;  '
                  : 'color: #fff ;'"
                   for="city3">{{$store.state.language
                  == "th" ? "ไม่ด่วน": "Unurgent"}}</label>
                </div>
                <div style="height: 100%; width: 100%; " class="field-radiobutton">
                  <RadioButton inputId="city4" name="city" value="2" v-model="ck_warning" />
                  <label style="margin-left: 10px; font-size: 14px; "
                  :style="  $store.state.theme == 'light'
                  ? 'color: #000;  '
                  : 'color: #fff ;'"
                  for="city4">{{$store.state.language
                  == "th" ? "เหตุด่วน": "urgent"}}</label>
                </div>
              </div>
              <div style="font-size: 12px; padding-top: 10px;">

                {{$store.state.language == "th" ? "ส่งเรื่องต่อไปที่": "Sent To"}}
              </div>
              <div style="
                width: 100%;
                padding-top: 10px;
                display: grid;
                grid-template-columns: 1fr 1fr;
              ">
                <div style="width: 100%;">
                  <div>
                    <Checkbox name="ck_noti_temp3" :binary="true" v-model="ck_firefighter" />
                    <label style="margin-left: 5px; font-size: 14px;" for="checkOption2">{{$store.state.language == "th"
                    ? "ดับเพลิง": "Fire Fighter"}}</label>
                  </div>
                  <div>
                    <Checkbox name="ck_noti_temp3" :binary="true" v-model="ck_rescuer" />
                    <label style="margin-left: 5px; font-size: 14px;" for="checkOption2">{{$store.state.language == "th"
                    ? "หน่วยกู้ภัย": "Rescuer"}}</label>
                  </div>
                  <div>
                    <Checkbox name="ck_noti_temp3" :binary="true" v-model="ck_etc" />
                    <label style="margin-left: 5px; font-size: 14px;" for="checkOption2">{{$store.state.language == "th"
                    ? "อื่นๆ": "etc"}}</label>
                  </div>
                </div>
                <div style="width: 100%;">
                  <div style="width: 100%; display: flex; ">
                    <div>
                      <Checkbox name="ck_noti_temp3" :binary="true" v-model="ck_public" />
                    </div>
                    <div style="margin-left: 5px;">
                    <label style=" font-size: 14px;" for="checkOption2">{{$store.state.language == "th"
                    ? "แพทย์ฉุกเฉิน": "Public health agency"}}</label>
                    </div>
                  </div>
                  <div>
                    <Checkbox name="ck_noti_temp3" :binary="true" v-model="ck_police" />
                    <label style="margin-left: 5px; font-size: 14px;" for="checkOption2">{{$store.state.language == "th"
                    ? "ตำรวจ": "Police"}}</label>
                  </div>
                </div>
              </div>
            </div>
            <div style="padding-top: 20px; width: 100%;">
              <Button @click="callFinish()" :label="$store.state.language == 'th' ? 'บันทึก': 'Save'" style="
                  background: #02EABC;
                  border: 1px solid #ffffff10;
                  color: #fff;
                  height: 60px;
                  box-shadow: 0px 4px 20px 4px rgba(0, 0, 0, 0.04);
                  border-radius: 20px;
                  width: 100%;
                " />

            </div>
          </div>
        </div>

      </div>
</template>

<script>
export default {

}
</script>

<style>

</style>