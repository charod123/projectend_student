<template>
  <!-- v-if="sos_flag" -->
  <div   v-if="sos_flag" class="sos_box">
    <div v-if="sos_popup == true" class="sos_layout">
    <div class="soc_call" v-if="sos_call == true" style="background-color: ;"
    :style="  $store.state.theme == 'light'
                  ? 'background-color: #fff;  '
                  : 'background-color: #383838 ;'">
      <div style="height: 100%; width: 100%; ">
        <div style="display:grid; justify-content: center; height: 20%; ">
          <div style="display: grid; justify-content: center;">
            <img style="width: 80px; height: 75px;" src="../page/StreetPage/sosimage.png" alt="">

          </div>
          <div style="color:black; font-weight: bold; font-size: 24px;"
           :style="  $store.state.theme == 'light'
                  ? 'color: #000;  '
                  : 'color: #fff ;'">
            {{$store.state.language == 'th' ? "มีการแจ้งเหตุฉุกเฉิน" : "Emergency Calling"}}
          </div>
        </div>
        <div style="height: 55%; padding: 0 10px;  width: 100%;">
          <div  :style="  $store.state.theme == 'light'
                  ? 'border :5px solid #D9D9D9;  '
                  : 'border :5px solid #72767C;'"   id="mapsidemenu"></div>
        </div>
        <div style="height: 25%">
          <div style="
              width: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 10px;
            ">
            <div style="display: grid; grid-template-columns: 2fr 1fr; width: 100%">
              <div style="padding-left: 30px;">
                <div style="width: 100%; margin-top: 10px; color: #8C8C8C; "
                :style="  $store.state.theme == 'light'
                  ? 'color:#3C3C3E;  '
                  : 'color:#fff;'">
                  <i style="color: #00FFAE; font-size: 1.25em;" class="bx bxs-calendar-minus"></i> {{ temp_date }}
                </div>
                <div style="width: 100%; margin-top: 10px; color: #8C8C8C"
                :style="  $store.state.theme == 'light'
                  ? 'color:#3C3C3E;  '
                  : 'color:#fff;'">
                  <i style="color: #00FFAE; font-size: 1.25em;" class="bx bx-map"></i> {{ temp_installation }}
                </div>
                <div style="width: 100%; margin-top: 10px; color: #8C8C8C"
                :style="  $store.state.theme == 'light'
                  ? 'color:#3C3C3E;  '
                  : 'color:#fff;'">
                  <i style="color: #00FFAE; font-size: 1.25em;" class="bx bx-current-location"></i> {{ temp_detail }}
                </div>
                <div style="width: 100%; margin-top: 10px; color: #8C8C8C"
                :style="  $store.state.theme == 'light'
                  ? 'color:#3C3C3E;  '
                  : 'color:#fff;'">
                  <img style="width: 20px; height: 20px;" src="../page/StreetPage/Ring.png"
                    alt="">{{ temp_pole }}
                </div>
              </div>
              <div style="
                  width: 100%;
                  display: flex;
                  align-items: end;
                  justify-content: end;
                ">


              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
<!-- 
    <i style=" font-size: 20px; cursor:pointer;  "
                :style="  $store.state.theme == 'light'
                ? 'color:#000;  '
                : 'color:#fff;'"
                class='bx bx-x-circle'
                  @click="sidebar_on = false"></i> -->

    <div class="sos_box" v-if="sos_call == false && sos_call_recived == true">
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
    </div>
  </div>

  <!-- notify left bontom -->
  <div class="soc_minicall_sos" v-if="sos_recived.length > 0">
      <div style=" position: absolute;
  top: -50px;
  right: -80px;
  animation: shake 0.5s;">
        <img style="margin-right:16px;" src="../components/Group15.png" alt="">
      </div>
      <div style="height: 100%; width: 100%; padding-bottom: 15px;">

        <div style="height: 20%; display: flex; justify-content: center; align-items: center; font-size: 95%; font-weight: 700;">
              มีการแจ้งเหตุฉุกเฉิน
        </div>
        <div style="height:60%; width: 100%; ">
          <div style="border-radius: 6px;" id="mapsidemenumini"></div>
        </div>
        <div style="height: 20%;   padding-top: 4px; ">
            <div style="background-color: #fff;height: 100%; box-shadow: 0px 4px 16px rgba(217, 217, 217, 0.41); border-radius: 6px; display:flex ; padding: 10px;">
            <div style="width: 20%; display: flex; justify-content: center; align-items: center; height: 100%; ">
                <img  src="../page/SettingPage/Pin_alt.png" alt="">
              </div>
              <div style="width: 40%; display: grid; justify-content:  center; ">
                <div style="  font-size: 16px; height: 50%; "
                :style="  $store.state.theme == 'light'
                  ? 'color:#3C3C3E;  '
                  : 'color:#fff;'">
                  สีแยกบางนา
                </div>
                <div style=" font-size: 12px; height: 50%; "
                :style="  $store.state.theme == 'light'
                  ? 'color:#3C3C3E;  '
                  : 'color:#fff;'">
                  smartpole#1234
                </div>
              </div>
              <div style="width: 40%; padding:5px ;">

              </div>
            </div>
        </div>
      </div>
    </div>
    <!-- <div class="sos_noti" v-show="sos_recived.length > 0">
    <div class="sos_noti_popup">
      <div style="text-align: center">
        <div>{{$store.state.language == "th" ? "คำร้องเหตุด่วน": "Complaint"}}</div>
        <span style="font-size: 20px">{{ sos_recived.length }}</span>
      </div>
    </div>
  </div> -->
  <!--v-if="sidebar_preview == true" popup บันทึกรายการสำเร็จ -->
    <div v-if="sidebar_preview == true" style=" position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: #ffffff40;
        z-index: 2000;
        display: grid;
        justify-content: center;
        align-items: center;">
    <div style="padding: 20px;
        width: 784px;
        height: 70vh;
        border-radius: 20px;
        box-shadow: 0px 5px 15px 0px rgba(0, 0, 0, 0.6);"
         :style="  $store.state.theme == 'light'
                  ? 'background-color: #F6F7F9;  '
                  : 'background-color: #414141 ;'">
      <div style="
      width: 100%;
      height: 10%;
      display: flex;
      justify-content: center;
      align-items: center;
      box-shadow: rgb(0 227 159 / 6%) 2px 2px 10px;"
       :style="  $store.state.theme == 'light'
                  ? 'background-color: #fff;  '
                  : 'background: rgba(255, 255, 255, 0.1);'">
        <div
          style="font-size: 20px; font-weight: bold; width: 99%; display: flex; justify-content: center; align-items: center; color: #00FFAE;">
          {{$store.state.language == 'th' ? 'บันทึกรายการสำเร็จ' : 'Save Successful'}}
        </div>

        <div style=" display: flex; justify-content: end; width: 1%;padding-right: 30px;">
          <i style=" font-size: 20px; cursor:pointer; " class='bx bx-x-circle'
            @click="sos_finish()"
            :style="  $store.state.theme == 'light'
                  ? 'color: #000;  '
                  : 'color: #fff;'"></i>
        </div>
      </div>
      <div style="width: 100%; height: 45%;  overflow-y: auto; padding-top: 5px;"
   >
                  <div style="height: 100%; width: 100%; padding: 10px 20px" :style="  $store.state.theme == 'light'
                  ? 'background-color: #fff;  '
                  : 'background: rgba(255, 255, 255, 0.1);'">
                    <div style="display: flex; align-items: center;">
                      <div>
                        <img style="width: 54px; height: 48px;" src="../page/StreetPage/sosimage.png" alt="">
                      </div>
                      <div style="margin-left:10px; font-size: 20px; font-weight: bold;">
                         {{$store.state.language == 'th' ? 'SOS แจ้งเหตุฉุกเฉิน ' : 'Sos Emergency'}}
                      </div>
                    </div>
                    <div style="  grid-template-columns: 1fr  1fr; display: grid; width: 100%;padding-top:10px ;">
                      <div style="color: #D9D9D9 ; width: 100%; font-size: 14px;">
                        {{$store.state.language == 'th' ? 'ชื่อ-นามสกุลผู้แจ้ง ' : 'Firstname-Lastname'}}
                      </div>
                      <div style=" color:#D9D9D9; width:100%; font-size: 14px;">
                       {{$store.state.language == 'th' ? ' เลขบัตรประจำตัวประชาชน ' : 'ID Card'}}
                      </div>
                    </div>
                    <div style="  grid-template-columns: 1fr  1fr; display: grid; width: 100%;padding-top:5px ;">
                      <div style=" width: 100%; font-size: 16px;"
                      :style="  $store.state.theme == 'light'
                            ? 'color: #242731;  '
                            : 'color: #fff;'">
                        {{temp_fullname}}
                      </div>
                      <div style=" width:100%; font-size: 16px;"
                      :style="  $store.state.theme == 'light'
                            ? 'color: #242731;  '
                            : 'color: #fff;'">
                        {{temp_id}}
                      </div>
                    </div>
                    <div style="  grid-template-columns: 1fr  1fr; display: grid; width: 100%;padding-top:20px ;">
                      <div style=" width: 100%; font-size: 16px; display: flex; align-items: center;"
                      :style="  $store.state.theme == 'light'
                            ? 'color: #242731;  '
                            : 'color: #fff;'">
                        <i class="bx bx-calendar-minus" style="font-size: 20px; color: #D9D9D9 ; margin-right: 10px;"></i>
                         <!-- วันจันทร์ที่ 22 สิงหาคม 2565   -->
                        {{$store.state.language == "th" ? "วัน"+$moment(tempdatesos).format('dddd')+"ที่ "+$moment(tempdatesos).format("Do MMM YY") : $moment(tempdatesos).format("LLLL") }}
                      </div>
                      <div style=" width:100%; font-size: 16px;display: flex; align-items: center;"
                      :style="  $store.state.theme == 'light'
                            ? 'color: #242731;  '
                            : 'color: #fff;'">
                        <i class="bx bx-time" style="font-size: 20px; color: #D9D9D9 ; margin-right: 10px;"></i>
                        {{$store.state.language == "th" ? $moment(tempdatesos).format("LT") + " น.": $moment(tempdatesos).format("LT") }}
                      </div>
                    </div>
                    <div style="  grid-template-columns: 1fr  1fr; display: grid; width: 100%;padding-top:20px ;">
                      <div style=" width: 100%; font-size: 16px; display: flex; align-items: center;"
                      :style="  $store.state.theme == 'light'
                            ? 'color: #242731;  '
                            : 'color: #fff;'">
                        <i class="bx bx-phone" style="font-size: 20px; color: #D9D9D9 ; margin-right: 10px;"></i> {{$store.state.language == 'th' ? 'เจ้าหน้าที่' : 'Officer'}}
                      </div>
                      <div style="  width:100%; font-size: 16px;display: flex; align-items: center;"
                      :style="  $store.state.theme == 'light'
                            ? 'color: #242731;  '
                            : 'color: #fff;'"
                      >
                        <i class="bx bx-phone" style="font-size: 20px; color: #D9D9D9 ; margin-right: 10px;" ></i>
                        {{$store.state.language == "th" ? temp_time + " น.": temp_time}}
                      </div>
                    </div>
                    <div style="padding-top: 20px; display: flex ; ">
                      <i class="bx bx-error-circle" style="font-size: 20px; color: #D9D9D9 ; margin-right: 10px; display: flex; align-items: center; justify-content: center;"></i>
                      <div style="background-color:rgba(0, 255, 174, 0.1); color:#02EABC ; border-radius: 10px;padding:5px 10px">
                        {{temp_warning}}
                      </div>
                      <div style="background-color:rgba(0, 255, 174, 0.1); color:#02EABC ; margin-left: 5px ; border-radius: 10px; padding:5px 10px" v-for="(data, ix) in temp_subdivision" :key="ix" >
                        {{data.subname}}
                      </div>
                    </div>

                  </div>
      </div>
      <div style="width: 100%; height: 45%; ">
                  <div style="height: 100%; width: 100%; padding: 10px 20px;"
                  :style="  $store.state.theme == 'light'
                  ? 'background-color: #fff;  '
                  : 'background: rgba(255, 255, 255, 0.1);'">
                    <div style=" font-weight: bold;"
                    :style="  $store.state.theme == 'light'
                            ? 'color: #000;  '
                            : 'color: #fff;'">
                      {{$store.state.language == 'th' ? 'รายละเอียดเพิ่มเติม' : 'Infomation'}}
                    </div>
                    <div style="width: 100%; height: 80%; background-color:#F6F7F9; margin-top: 5px; padding: 10px; border-radius: 10px;"
                    :style="  $store.state.theme == 'light'
                            ? 'background-color: #F6F7F9; color:#242731  '
                            : 'background: #5F6165; color:#fff '">
                    {{temp_remark}}
                    </div>

                  </div>
      </div>
    </div>
  </div>
  <!--  -->

  <!--  popup ai event -->
  <div  v-if="show_noti_denger==true"  class="body-notidenger">
    <div   :style="  $store.state.theme == 'light'
                  ? 'background-color: #fff;  '
                  : 'background-color: rgb(56, 56, 56);'"
       class="dengetstyle_opoup">
      <div style="display:flex ;" class="body-header">
      <div style="position: relative; left: 65%; ">
        <i class="bx bx-x-circle" @click.prevent="closepagepopupevent_ai" style="font-size: 20px; cursor: pointer; color: rgb(0, 0, 0);"></i>
      </div>
      <img  :style="  $store.state.language == 'th'?'left:27%;'
            : 'left:16%;'"
            src="../../../public/assets/icon-main/warning.png" alt="">
      <h2>{{`${this.$store.state.language =='th'?'มีการแจ้งเตือนเข้าเขตพื้นที่อันตราย':'There is a notification to enter the dangerous area.'}`}}</h2>

       
        <!-- <div type="button" @click.prevent="closepage" class="closepage" >
        <img src="../../../public/assets/icon-main/Dell_duotone_line.png" alt=""> 
        </div> -->
      </div>

      <div class="body-contnet">
        <div class="card-colum-1">
          <!-- :style="`background-image: url('${data_ai_in_mqtt.image}');`" -->
          <div class="colum-1" :style="`background-image: url('${data_ai_in_mqtt.image}');`">

          <!-- <div class="line1" :style="`right:${150}px;top:${345}px; width:${322}px; height:${117}px;`"></div> points:[326.3,229.9,8,26.3],-->
          <!-- x=item[0]
          y=item[1]
          w=item[2]
          h=item[3]

          x1 = x - w/2
          y1 = y - h/2

          x2 = x + w/2
          y2 = y + h/2 -->
          
          <div class="line1" v-for="item in frame" :key="item" :style="`${`left:calc(${((item[0]/416) - (item[2]/416/2))*100}%);`}top:calc(${(item[1]/416 - (item[3]/416/2))*100}%); width:calc(${item[2]/416*1920/2}px); height:calc(${item[3]/416*1080/2}px);`"><div class="hrederframe">[{{`${item[4]}`}} {{`${item[5]}`}}%]</div></div>
          <!-- <div class="line1" :style="`${`left:calc(${(350/415)*100}%);`}top:calc(${(250/440)*100}%); width:calc(${10}px); height:calc(${20}px);`"></div> -->
           
          <div class="line3"></div>
          <div class="line4"></div>
          <div class="line5"></div>
      
      </div> 
 
        </div>
       
      <div  class="colum-2">
        <div id="map_denger_area">
        </div>
  
        <div :style=" $store.state.theme == 'light'?'background-color: #F6F7F9;color:#8C8C8C;' : 'background-color: rgb(65, 65, 65);color:#fff;'" class="detail">          
        
          <!--no test -->
 
           <span style="font-size: 1.5rem;">{{`${this.$store.state.language =="th"?'รายละเอียดการแจ้งเตือน':'Notification details'}`}}</span> 
          <span><img  src="../../../public/assets/icon-main/Ring.png" alt="">  <span >{{`${ this.$moment(data_ai_in_mqtt.time).format('LLLL')}`}} น.</span></span>
          <span><img src="../../../public/assets/icon-main/Search.png" alt="">  {{`${this.$store.state.language =="th"?'สิ่งที่ตรวจพบ':'What is detected'}`}}  : {{this.data_ai_in_mqtt.points.names.length}} {{`${this.$store.state.language =="th"?'คน':'people'}`}}</span>
          <span><img :src="icontime" alt="">  {{`${this.$store.state.language =="th"?'เวลาที่อยู่นอกเขตปลอดภัย':'Time outside the safe zone'}`}} : {{data_ai_in_mqtt.violatetime}} {{`${this.$store.state.language =="th"?'วินาที':'Second'}`}}</span>
          <span><img :src="`${$store.state.theme == 'light'?iconlavellight:iconlavelblack}`" alt="">  {{`${this.$store.state.language =="th"?'ระดับความอันตราย':'Degree of Danger'}`}} : {{`${this.$store.state.language=="th"?`${data_ai_in_mqtt.lavel==1?'มาก':'ปานกลาง'}`:`${this.data_ai_in_mqtt==1?'very dangerous':'medium danger'}`}`}}</span>
          <span><img src="../../../public/assets/icon-main/Subtract.png" alt="">  {{`${this.$store.state.language =="th"?'ที่ตั้ง':'location'}`}} : {{`${this.$store.state.language=="th"?`${data_ch_datainstalation.installation_point_th}`:`${data_ch_datainstalation.installation_point_en}`}`}}</span> 
           
          <!--no test -->
   
          <!-- test -->
          <!-- <span style="font-size: 1.5rem;">{{`${this.$store.state.language =="th"?'รายละเอียดการแจ้งเตือน':'Notification details'}`}}</span> 
          <span> <img src="../../../public/assets/icon-main/Ring.png" alt="">  <span >{{`${ this.$moment('2022-09-15').format('LLLL')}`}}</span></span>
          <span><img src="../../../public/assets/icon-main/Search.png" alt="">  {{`${this.$store.state.language =="th"?'สิ่งที่ตรวจพบ':'What is detected'}`}}  : {{`${this.$store.state.language =="th"?'คน':'people'}`}}</span>
          <span><img src="../../../public/assets/icon-main/Time_light.png" alt="">  {{`${this.$store.state.language =="th"?'เวลาที่อยู่นอกเขตปลอดภัย':'Time outside the safe zone'}`}} : 30 </span>
          <span><img :src="`${$store.state.theme == 'light'?iconlavellight:iconlavelblack}`" alt="">  {{`${this.$store.state.language =="th"?'ระดับความอันตราย':'Degree of Danger'}`}} : ds</span>
          <span><img src="../../../public/assets/icon-main/Subtract.png" alt="">  {{`${this.$store.state.language =="th"?'ที่ตั้ง':'location'}`}} : บางแสน</span>  -->
          <!-- <span><img src="../../../public/assets/icon-main/Vector.png" alt="">  {{`${this.$store.state.language =="th"?'รหัส':'code'}`}} : 004</span>  -->
          
          <!-- test -->
    
    
        </div>
        <div class="btn-bontom">
          <Button @click="closepage" style="background-color: #02EABC; border: #00FFAE; width: 100%; justify-content: center; margin-top:10px; border-radius: 10px; font-size: larger;" :label="this.$store.state.language =='th'?'ดำเนินการต่อ':'Continue'"></Button>
        </div>
        
        

      </div>
      </div>
     
    </div>
   
    
  </div>
  
 <!-- popup content event ai -->
      <div class="sos_box" v-if="sos_notify_denger == true">
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
                <img  style="width: 54px; height: 48px ;" src="../../../public/assets/icon-main/Mask_group.png"
                  alt="">
              </div>
              <div style="font-weight: bold; display: flex; text-align: center; margin-left: 5px;">
                {{$store.state.language == 'th' ? "บันทึกเหตุการณ์แจ้งเตือนเข้าเขตพื้นที่อันตราย" : "Sos Emergency"}}
              </div>
            </div>
            <div style="font-size: 13px; text-align: center;"
            :style="  $store.state.theme == 'light'
                  ? 'color:#3C3C3E;  '
                  : 'color:#fff;'">
              <!-- {{$moment(tempdatesos).format("LLLL")}} -->
             {{`${ this.$moment(data_ai_in_mqtt.time).format('LLLL')}`}} น.
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


              <!-- control -->
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
              <!-- control -->

          </div>
        </div>
        <!-- colrum 2 camera -->
        <div style=" width: 100%; height: 100%;">
          <div style="width: 100%; height: calc(100%); display: grid; grid-template-columns: 100%; grid-template-rows: 100%;  padding: 10px ">
            
              <div  style="
                    width: 100%;
                    height: 100%;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 5px;
                  ">
            <iframe style="width: 100%; height: 100%; background-color: black; border-radius: 5px;" :src="`https://${data_ch_datainstalation.server_id}/live/${data_ch_datainstalation.chanel}/${data_ch_datainstalation.user_id}/${data_ch_datainstalation.pass}`"></iframe>
            <!-- https://demo.dtcdvr.com/live/VG800718@1/event/95F6771DDF61D3B5ACC4CEBA74EF08376E9B56B8309D29D54F258D995238A002 -->
              </div>
          </div>
        </div>
        <!-- colrum 2 camera -->
             
        <!-- detail right -->

        <div style="background: #fff; width: 100%; height: 100%; padding: 15px 15px 15px 10px; overflow-y: auto"
        :style="  $store.state.theme == 'light'
                  ? 'background: #fff;  '
                  : 'background: #414141 ;'">
                  <!-- รายละเอียดจุดติดตั้ง -->
          <div style="display: flex; ">
            <img style="width: 20px; height: 20px;" src="../page/StreetPage/dotgreen.png" alt="">
            <div style=" font-weight: bold; font-size: 16px; margin-left: 10px;"
            :style="  $store.state.theme == 'light'
                  ? 'color: #000;  '
                  : 'color: #fff ;'">
               {{$store.state.language == 'th' ? "รายละเอียดเสาและจุดติดตั้ง" : "Installation point and pole details"}}
            </div>
          </div>
                  <!-- รายละเอียดจุดติดตั้ง -->

           <!-- div detail รายละเอียดจุดติดตั้ง -->
          <div style=" padding-top: 10px ;">
            <div class="div_detall_installation" style="height: auto;  padding: 15px; border-radius: 10px;" :style="$store.state.theme == 'light'? 'background-color: #F6F7F9;  ': 'background-color: rgba(255, 255, 255, 0.1);'">
              {{`${$store.state.language=='th'?'เลขคอนโทรลเลอร์':'Controller Number'} : ${data_ch_datainstalation.control_number}`}}<br>
              {{`${$store.state.language=='th'?'ตำแหน่ง':'Location'} : ${$store.state.language=='th'?`${data_ch_datainstalation.installation_point_th}`:`${data_ch_datainstalation.installation_point_en}`}`}}<br>
              {{`${$store.state.language=='th'?'ละติจูด':'lat'} : ${data_ch_datainstalation.lat}`}}<br>
              {{`${$store.state.language=='th'?'ลองติจูด':'long'} : ${data_ch_datainstalation.lng}`}}<br>
              {{`${$store.state.language=='th'?'หน่วยงาน':'division'} : ${$store.state.language=='th'?`${data_ch_datainstalation.installation_point_th}`:`${data_ch_datainstalation.installation_point_en}`}`}}<br>
            </div>
          </div>
           <!-- div detail รายละเอียดจุดติดตั้ง -->

                  <!-- รายละเอียดเหตุการณ์ -->

           <!-- div detail รายละเอียดเหตุการณ์ -->

           <div style="display: flex;margin-top: 10px; ">
            <img style="width: 20px; height: 20px;" src="../page/StreetPage/dotgreen.png" alt="">
            <div style=" font-weight: bold; font-size: 16px; margin-left: 10px;"
            :style="  $store.state.theme == 'light'
                  ? 'color: #000;  '
                  : 'color: #fff ;'">
               {{$store.state.language == 'th' ? "รายละเอียดเหตุการณ์" : "Event Details"}}
            </div>
          </div>

           <!-- div detail รายละเอียดเหตุการณ์ -->
          <div style=" padding-top: 10px ;">
            <div class="div_detall_installation" style="height: auto;  padding: 15px; border-radius: 10px;" :style="$store.state.theme == 'light'? 'background-color: #F6F7F9;  ': 'background-color: rgba(255, 255, 255, 0.1);'">
              {{`${ this.$moment(data_ai_in_mqtt.time).format('LLLL')}`}} น.<br>
              {{`${$store.state.language=='th'?'ระดับความอันตราย':'Degree of Danger'} : ปานกลาง`}}<br>
              {{`${$store.state.language=='th'?'สิ่งที่ตรวจจับได้':'What is detected'}` }} : {{data_ai_in_mqtt.points.names.length}} {{`${this.$store.state.language =="th"?'คน':'people'}`}}<br>
              {{`${$store.state.language=='th'?'ระดับความน่าเชื่อถือ':'Level of Credibility'} : 80 %`}}<br>
              {{`${$store.state.language=='th'?'ชนิดอุปกรณ์':'Device Type'} : AI Device`}}<br>
              {{`${$store.state.language=='th'?'อุณหภูมิของอุปกรณ์':'Device Temperature'} : ${data_ai_in_mqtt.temperature}`}}<br>
              {{`${$store.state.language=='th'?'เวลาที่อยู่นอกเขต':'Time outside the safe zone'} : ${data_ai_in_mqtt.violatetime}`}}<br>
            </div>
          </div>
           <!-- div detail รายละเอียดเหตุการณ์ -->
          <div style="padding-top: 10px;">
            <div style="font-size: 12px; margin-bottom:6px">
              {{$store.state.language == 'th' ? "รายละเอียดการดำเนินเพิ่มเติม" : "Additional operation details"}}

            </div>
            <div style="">
              <Textarea :disabled="dis_detail"
                style=" width: 100%; border-radius: 2px; border-radius: 10px; background-color: #F6F7F9; "
                v-model="description" rows="3" cols="30" />
            </div>
            <div>
              <div style="font-size: 12px; padding-top: 10px;">
                {{$store.state.language == "th" ? "ระดับการแจ้งเตือน": "Warning Level"}}
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
              <Button @click="submit_denger_area" :label="$store.state.language == 'th' ? 'บันทึก': 'Save'" style="
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
         <!-- detail right -->
      </div>
      </div>
  </div>
  
  
</template>

<script>
import imagepin from "../../../public/assets/image/alert.gif";
import jsontest from '../components/data.json';
export default {

data() {
    return {
      
      icontime:jsontest.icontime,
      img:jsontest.img,
      iconlavelblack:jsontest.iconblack,
      iconlavellight:jsontest.iconlight,
      frame: [],
      image_denger_area:null,
      data_ai_in_mqtt:null,
      map_debger_area:null,
        sos_flag: false,
        ck_aw: true,
        show_noti_denger:false,
      sos_notify_denger:false,
      data_ch_datainstalation:null,
      select_id_card: "",
      description:null,
      select_tel: "",
      select_fullname:"",
      select_lightid: "",
      select_area: "",
      ck_police: false,
      ck_warning: "1",
      ck_public: false,
      ck_rescuer: false,
      ck_firefighter: false,
      socket: null,
      denger_id:null,
      cam_get_channel: [],
      camera_list: [],
      map: null,
      marker: [],
      temppole: [],
      sos_call: false,
      sos_call_recived: false,
      sos_recived: [],
      sos_popup: false,
      sos_get: false,
      noti: false,
      websocket: null,
      websocketsoscam: null,
      tempevent: [],
      arr_flv: [],
      full_time: "00:00",
      temp_date: "",
      temp_installation: "",
      temp_detail: "",
      temp_pole: "",
      ck_id_card: false,
      ck_fullname: false,
      ck_tel: false,
      ck_etc: false,
      temp_id_card: "กรุณากรอกข้อมูล",
      dis_fullname: false,
      dis_tel: false,
      dis_id_card: false,
      dis_detail:false,
      ck_ok_id: false,
      temp_address: [],
      tamp_lat: null,
      temp_lng: null,
      ck_insert_card: false,
      insertpole: "",
      tempdatesos: null,
      sidebar_preview: false,
      zoomval: 50,
      focusval: 50,
      temp_camera: [],
      temp_remark:"",
      temp_subdivision :[],
      temp_warning:"",
      temp_id:"",
      temp_fullname:"",
      temp_time:"",
      pin_icon:null,
      loadding_page:false,
      temp_dengerarea:[],
      update_at:null,
      items: [
        {
          label: "Add",
          icon: "pi pi-pencil",
          command: () => {
            this.$toast.add({
              severity: "info",
              summary: "Add",
              detail: "Data Added",
            });
          },
        },
        {
          label: "Update",
          icon: "pi pi-refresh",
          command: () => {
            this.$toast.add({
              severity: "success",
              summary: "Update",
              detail: "Data Updated",
            });
          },
        },
        {
          label: "Delete",
          icon: "pi pi-trash",
          command: () => {
            this.$toast.add({
              severity: "error",
              summary: "Delete",
              detail: "Data Deleted",
            });
          },
        },
        {
          label: "Upload",
          icon: "pi pi-upload",
          command: () => {
            this.$router.push("fileupload");
          },
        },
        {
          label: "Vue Website",
          icon: "pi pi-external-link",
          command: () => {
            window.location.href = "https://vuejs.org/";
          },
        },
      ],
      menu: [
        {
          menu_th: "เมนสตรีม",
          menu_en: "Mainsteam",
          url: "/mainsteam",
          logo: "bx bxs-pie-chart-alt-2",
          noti: 0,
          priority_id: 1001,
          flag: 1,
        },
        {
          menu_th: "ซีเอ็มเอส",
          menu_en: "CMS",
          url: "/cms",
          logo: "bx bxs-pie-chart-alt-2",
          noti: 0,
          priority_id: 1001,
          flag: 1,
        },
        {
          menu_th: "เสาไฟ",
          menu_en: "Street Light",
          url: "/street-light",
          logo: "bx bxs-pie-chart-alt-2",
          noti: 0,
          priority_id: 1001,
          flag: 1,
        },
        {
          menu_th: "รายงาน",
          menu_en: "Report",
          url: "/report",
          logo: "bx bxs-pie-chart-alt-2",
          noti: 0,
          priority_id: 1001,
          flag: 1,
        },
        {
          menu_th: "ตั้งค่า",
          menu_en: "Settings",
          url: "/settings/user",
          logo: "bx bxs-pie-chart-alt-2",
          noti: 0,
          priority_id: 1001,
          flag: 1,
        },
      ],
      camera_al_list: [
        {
          id: "al_box_1",
        },
        {
          id: "al_box_2",
        },
        {
          id: "al_box_3",
        },
        {
          id: "al_box_4",
        },
      ],
    }
},
created() {
  // this.websocket = new WebSocket('ws://203.150.210.26:3048');
  // this.websocket = new WebSocket('ws://bangsaothong.dtc.co.th:3048');
  this.websocket = new WebSocket('ws://localhost:3048');

},
  mounted() {
    

    //console.log(document.getElementsByClassName("colum-1"));
   this.theme_mode = this.$store.state.theme
    // this.sidebar_preview = true
    console.log(this.service);
    console.log(this.websocket);
    let temppp = new Date();
    console.log(this.$moment(temppp).format("LLLL"));
  // setTimeout(() => {

  //         this.sos_popup = true;
  //         this.sos_call = true;
  //         // this.sos_recived = [{}];

  //         setTimeout(() => {
  //           this.getlocation(13.676882,100.603370);
  //           console.log(this.theme_mode);
  //           if(this.$store.state.theme != this.theme_mode){
  //           this.theme_mode = this.$store.state.theme

  //           this.clearMap()
  // }

  //           this.getMap();
  //         }, 50);
  //       }, 50);
    // this.$store.dispatch('setActionsSosFlag', this.sos_flag)
    const v = this;
    // v.websocket = new WebSocket("ws://203.150.210.26:3048");
    // v.websocket = new WebSocket("ws://bangsaothong.dtc.co.th:3048");
    v.websocket = new WebSocket("ws://localhost:3048");
    v.websocket.onmessage = (event) => {

      if (event.data != "connection") {
        let get_status = [];
        this.tempevent = JSON.parse(event.data);
        get_status.push(JSON.parse(event.data));

        v.$store.dispatch("setActionsTemplight", get_status);
        console.log(this.tempevent);


      }
    };
},
methods: {
  closepagepopupevent_ai(){
    this.sos_flag=false;
    this.show_noti_denger=false;
    this.sos_notify_denger=false;
  },
 async submit_denger_area(){
  
      this.temp_dengerarea=[];
    this.ck_firefighter == true?this.temp_dengerarea.push(1):'';
    this.ck_public == true?this.temp_dengerarea.push(2):'';
    this.ck_rescuer == true?this.temp_dengerarea.push(3):'';
     this.ck_police == true?this.temp_dengerarea.push(4):'';
     this.ck_etc == true?this.temp_dengerarea.push(5):'';
     console.log(this.temp_dengerarea,this.ck_warning);
    if (this.temp_dengerarea.length != 0) {
      let result = await this.service.post("sos/update-data-denger-area", {
        denger_area_id: this.denger_id,
        sos_type_warning: Number(this.ck_warning),
        sos_subdivision_id: this.temp_dengerarea,
        update_at: this.$moment(new Date()).format("YYYY-MM-DD h:mm:ss"),
        description: this.description,
        status: 2
      });
      if (result.code == 200) {
        this.$swal.fire({
              position: "center",
              icon: "success",
              title: "บันทึกสำเร็จ",
              showConfirmButton: false,
              timer: 1500,
            });
        this.sos_flag = false;
        this.sos_notify_denger = false;
        this.show_noti_denger = false;
      } 
      console.log(result);

    }else{
        alert('กรอกข้อมูลให้ครบถ้วน')
      }
    
  },
  closepage(){
    this.show_noti_denger = false;
    this.sos_notify_denger = true;
  },
  async noti_denger_area(data, id) {
    this.denger_id = id
    // this.map_debger_area.remove()
    this.map_debger_area = null
    this.data_ai_in_mqtt = data
    this.frame = [];
    this.data_ai_in_mqtt.points.points.forEach((arr, i) => {
      this.frame.push(arr.concat(this.data_ai_in_mqtt.points.names[i], this.data_ai_in_mqtt.points.confidence[i]))
    });
    this.show_noti_denger = true
    this.image_denger_area = data.image
    setTimeout(() => {
      this.getMap_denger_area()
    }, 500);

  },
  getMap_denger_area() {
      let deemapLight = this.$L.tileLayer(
        "https://www.deemap.com/DeeMap/gwc/service/tms/1.0.0/DeeMap2_THA_Map_No_POI@EPSG%3A900913@png8/{z}/{x}/{-y}.png8",
      );

      let deemapNigth = this.$L.tileLayer.wms('https://www.deemap.com/DeeMap/gwc/service/wms?', {
        layers: "DeeMap2_THA_Map_Night",
        format: "image/png8"
      });
      var LeafIcon = L.Icon.extend({
        options: {
          iconSize: [70, 70],
          shadowSize: [16, 16],
        },
      });

      this.pin_icon = new LeafIcon({
        iconUrl: imagepin
      });
      var map = L.map("map_denger_area", {
        //center: [this.temppole[0].lat, this.temppole[0].lng],
         center: [13.2922543,100.9086],
        zoom: 15,
        maxZoom: 20,
        layers: [this.theme_mode == 'light' ? deemapLight : deemapNigth],
        zoomControl: false,
      });
      // let tempdivision = this.$store.state.language == "th" ? this.temppole[0].division_th : this.temppole[0].division_en
     // L.marker([this.temppole[0].lat, this.temppole[0].lng],{icon: this.pin_icon})
       L.marker([13.2922543,100.9086],{icon: this.pin_icon})
        .addTo(map)
         // <div>
        //   <div style=" height: auto; top:80%">
        //   <span style=" font-weight: bold; font-size:15px;">${this.$store.state.language =='th'?'ตำแหน่ง':'Position'} :</span> <span style="font-size:15px;">บางแสน</span> <br>
        //   <span style=" font-weight: bold; font-size:15px;">${this.$store.state.language =='th'?'หน่วยงาน':'Agency'} :</span> <span style="font-size:15px;">บางแสน </span> <br>
        //   <span style=" font-weight: bold; font-size:15px;">${this.$store.state.language =='th'?'ระดับความอันตราย':'Degree of Danger'} :</span> <span style="font-size:15px;">ปานกลาง</span><br>
        //   <span style=" font-weight: bold; font-size:15px;">${this.$store.state.language =='th'?'ละติจูด':'Let'} :</span> <span style="font-size:15px;">13.3214214</span><br>
        //   <span style=" font-weight: bold; font-size:15px;">${this.$store.state.language =='th'?'ลองติจูด':'Long'} :</span> <span style="font-size:15px;">100.5647</span>
        // </div>
        // </div>
         .bindPopup(`
         <div>
          <div style=" height: auto; top:80%">
          <span style=" font-weight: bold; font-size:15px;">${this.$store.state.language =='th'?'ตำแหน่ง':'Position'} :</span> <span style="font-size:15px;">${this.$store.state.language =='th'?`${this.data_ch_datainstalation.installation_point_th}`:`${this.data_ch_datainstalation.installation_point_en}`}</span> <br>
          <span style=" font-weight: bold; font-size:15px;">${this.$store.state.language =='th'?'หน่วยงาน':'Agency'} :</span> <span style="font-size:15px;">${this.$store.state.language =='th'?`${this.data_ch_datainstalation.installation_point_th}`:`${this.data_ch_datainstalation.installation_point_en}`} </span> <br>
          <span style=" font-weight: bold; font-size:15px;">${this.$store.state.language =='th'?'ระดับความอันตราย':'Degree of Danger'} :</span> <span style="font-size:15px;">${this.$store.state.language =='th'?`${this.data_ai_in_mqtt==1?'มาก':'ปานกลาง'}`:`${this.data_ai_in_mqtt==1?'very dangerous':'medium danger'}`}</span><br>
          <span style=" font-weight: bold; font-size:15px;">${this.$store.state.language =='th'?'ละติจูด':'Let'} :</span> <span style="font-size:15px;">${this.data_ch_datainstalation.lat}</span><br>
          <span style=" font-weight: bold; font-size:15px;">${this.$store.state.language =='th'?'ลองติจูด':'Long'} :</span> <span style="font-size:15px;">${this.data_ch_datainstalation.lng}</span>
        </div>
        </div>
        `);
       
      this.map_debger_area = map;
    },
    getMapMini() {
      let deemapLight = this.$L.tileLayer(
        "https://www.deemap.com/DeeMap/gwc/service/tms/1.0.0/DeeMap2_THA_Map_No_POI@EPSG%3A900913@png8/{z}/{x}/{-y}.png8",
      );

      let deemapNigth = this.$L.tileLayer.wms('https://www.deemap.com/DeeMap/gwc/service/wms?', {
        layers: "DeeMap2_THA_Map_Night",
        format: "image/png8"
      });
      var LeafIcon = L.Icon.extend({
        options: {
          iconSize: [70, 70],
          shadowSize: [16, 16],
        },
      });

      this.pin_icon = new LeafIcon({
        iconUrl: imagepin
      });
      var map = L.map("mapsidemenumini", {
        center: [this.temppole[0].lat, this.temppole[0].lng],
        // center: [13.676882,100.603370],
        zoom: 15,
        maxZoom: 20,
        layers: [this.theme_mode == 'light' ? deemapLight : deemapNigth],
        zoomControl: false,
      });
      // let tempdivision = this.$store.state.language == "th" ? this.temppole[0].division_th : this.temppole[0].division_en
      L.marker([this.temppole[0].lat, this.temppole[0].lng],{icon: this.pin_icon})
      // L.marker([13.676882,100.603370])
        .addTo(map)
      L.control
        .zoom({
          position: "bottomright",
        })
        .addTo(map);
      this.map = map;
    },
  async getlocation(lat, lng) {
      console.log(Number(lat));

    console.log("locationnnnnnnnnnnnnnnnnnnn");
      let address =  await this.$axios.get(
        " https://www.deemap.com/DeeMap2WS_GC_dtc-ws/geocodingWithPOI.jsp?lat=" + Number(lat) + "&lon=" + Number(lng) + "&radius=1"
      );

      this.temp_address = address.data.tambon[0];
      console.log(this.temp_address);
      this.$store.state.language == "th" ? this.temp_detail = "ต." + this.temp_address.TAM_TNAME + "  อ." + this.temp_address.AMP_TNAME + "  จ." + this.temp_address.PROV_TNAME + " " + this.temp_address.POSTCOD + ""
        : this.temp_detail = this.temp_address.TAM_ENAME + "sub-district," + this.temp_address.AMP_ENAME + "district," + this.temp_address.PROV_ENAME + ", " + this.temp_address.POSTCOD;

    },
    getTime() {
      this.totalSeconds = 0;
      setInterval(() => {
        ++this.totalSeconds;
        this.full_time =
          pad(parseInt(this.totalSeconds / 60)) +
          ":" +
          pad(this.totalSeconds % 60);
      }, 1000);
      let pad = (val) => {
        var valString = val + "";
        if (valString.length < 2) {
          return "0" + valString;
        } else {
          return valString;
        }
      };
    },
    async sos_finish(){
      this.sidebar_preview = false;
      this.sos_flag = false

        setTimeout(() => {
          if (this.sos_recived.length > 0) {
            this.temp_lat = this.sos_recived[0].result.lat
      this.temp_lng = this.sos_recived[0].result.lng

      // this.temp_date = result.data[0].installation_point_en
      this.temp_installation =  this.$store.state.language == 'th' ? this.sos_recived[0].result[0].installation_point_th : this.sos_recived[0].result[0].installation_point_en ;

      this.temp_camera = this.sos_recived[0].data_camera
      console.log(this.temp_camera);
      // this.temp_detail =
      this.temp_pole =  this.$store.state.language == 'th' ? "รหัส : "+this.sos_recived[0].result[0].pole_name_th+"#"+ this.sos_recived[0].result[0].pole_id  : this.sos_recived[0].result[0].pole_id +"#"+ this.sos_recived[0].result[0].pole_name_en ;

      console.log(this.temp_pole);
      // this.temppole[0].lat

      this.temppole = this.sos_recived[0].result;
         console.log(this.temppole);
          this.sos_flag = true;
          this.sos_popup = true;
          this.sos_call = true;
          this.sos_recived.shift();
          setTimeout(() => {
            this.getMap();
          }, 100);
          }
        }, 3000);
    },
    async search() {
      this.chkDigitPid(this.select_id_card);
      if (this.ck_id_card == false) {
        this.loadding_page = true
        let result = await this.service.post("sos/get-population-master", {
          id_card: this.select_id_card,
        });
        this.loadding_page = false
        console.log(result.data);
        if (result.data.length > 0) {
          this.select_fullname = result.data[0].fullname;
          this.select_tel = result.data[0].tel;
          this.dis_id_card = true;
          this.dis_fullname = true;
          this.dis_tel = true;
          this.dis_detail = false;
        }
        else {
          this.ck_insert_card = true
          this.dis_id_card = true;
          this.dis_fullname = false;
          this.dis_tel = false;
          this.dis_detail = false;
        }
      }
    },
    clearMap(){
      this.map.remove();
      if(this.marker_item.length > 0){
          for (let i = 0; i < this.marker_item.length; i++) {
              this.marker_item[i].closePopup()
          }
        }
      this.marker_item = []
      this.getMap()
  },
    createChannel() {
      for (let i = 0; i < this.camera_list.length; i++) {
        for (let x = 0; x < this.camera_list[i].channel.length; x++) {
          this.cam_get_channel.push({
            ch: this.camera_list[i].channel[x].ch,
            server: this.camera_list[i].channel[x].server_address,
          });
        }
      }
      this.lenght_ole = this.cam_get_channel.length;
      console.log(this.lenght_ole);
      if (this.cam_get_channel.length < this.number_pattern) {
        let count = this.number_pattern - this.cam_get_channel.length;
        console.log(this.number_pattern);
        console.log(this.cam_get_channel.length);
        console.log(count);
        for (let i = 0; i < count; i++) {
          this.cam_get_channel.push({ ch: `ch-cam${i}`, server: "" });
        }
      }
    },
    getMap() {
      let deemapLight = this.$L.tileLayer(
        "https://www.deemap.com/DeeMap/gwc/service/tms/1.0.0/DeeMap2_THA_Map_No_POI@EPSG%3A900913@png8/{z}/{x}/{-y}.png8",
      );

      let deemapNigth = this.$L.tileLayer.wms('https://www.deemap.com/DeeMap/gwc/service/wms?', {
        layers: "DeeMap2_THA_Map_Night",
        format: "image/png8"
      });
      var LeafIcon = L.Icon.extend({
        options: {
          iconSize: [70, 70],
          shadowSize: [16, 16],
        },
      });

      this.pin_icon = new LeafIcon({
        iconUrl: imagepin
      });
      var map = L.map("mapsidemenu", {
        center: [this.temppole[0].lat, this.temppole[0].lng],
        // center: [13.676882,100.603370],
        zoom: 15,
        maxZoom: 20,
        layers: [this.theme_mode == 'light' ? deemapLight : deemapNigth],
        zoomControl: false,
      });
      // let tempdivision = this.$store.state.language == "th" ? this.temppole[0].division_th : this.temppole[0].division_en
      L.marker([this.temppole[0].lat, this.temppole[0].lng],{icon: this.pin_icon})
      // L.marker([13.676882,100.603370])
        .addTo(map)
      L.control
        .zoom({
          position: "bottomright",
        })
        .addTo(map);
      this.map = map;
    },
    getMapMini() {
      let deemapLight = this.$L.tileLayer(
        "https://www.deemap.com/DeeMap/gwc/service/tms/1.0.0/DeeMap2_THA_Map_No_POI@EPSG%3A900913@png8/{z}/{x}/{-y}.png8",
      );

      let deemapNigth = this.$L.tileLayer.wms('https://www.deemap.com/DeeMap/gwc/service/wms?', {
        layers: "DeeMap2_THA_Map_Night",
        format: "image/png8"
      });
      var LeafIcon = L.Icon.extend({
        options: {
          iconSize: [70, 70],
          shadowSize: [16, 16],
        },
      });

      this.pin_icon = new LeafIcon({
        iconUrl: imagepin
      });
      var map = L.map("mapsidemenumini", {
        center: [this.temppole[0].lat, this.temppole[0].lng],
        // center: [13.676882,100.603370],
        zoom: 15,
        maxZoom: 20,
        layers: [this.theme_mode == 'light' ? deemapLight : deemapNigth],
        zoomControl: false,
      });
      // let tempdivision = this.$store.state.language == "th" ? this.temppole[0].division_th : this.temppole[0].division_en
      L.marker([this.temppole[0].lat, this.temppole[0].lng],{icon: this.pin_icon})
      // L.marker([13.676882,100.603370])
        .addTo(map)
      L.control
        .zoom({
          position: "bottomright",
        })
        .addTo(map);
      this.map = map;
    },
    // canclecallRecieved() {
    //   this.sos_call = false;
    //   this.sos_recived.shift();
    //   setTimeout(() => {
    //     if (this.sos_recived.length > 0) {
    //       this.sos_popup = true;
    //       this.sos_call = true;
    //       setTimeout(() => {
    //         this.getMap();
    //       }, 100);
    //     }
    //   }, 1000);
    // },
    callRecieved() {
      setTimeout(() => {
        document.getElementById("cam1").src = "https://" + this.temp_camera[0].ip_address + "/live/" + this.temp_camera[0].chanel + "/event/" + this.temp_camera[0].pass + "";
        document.getElementById("cam2").src = "https://" + this.temp_camera[1].ip_address + "/live/" + this.temp_camera[1].chanel + "/event/" + this.temp_camera[1].pass + "";
        document.getElementById("cam3").src = "https://" + this.temp_camera[2].ip_address + "/live/" + this.temp_camera[2].chanel + "/event/" + this.temp_camera[2].pass + "";
        document.getElementById("cam4").src = "https://" + this.temp_camera[3].ip_address + "/live/" + this.temp_camera[3].chanel + "/event/" + this.temp_camera[3].pass + "";
      }, 100);
      this.getTime();
      this.sos_call = false;
      this.sos_call_recived = true;
      // this.sos_recived.shift();
      console.log(this.sos_recived);
    },

    async callFinish() {
      console.log(this.ck_insert_card);
      console.log(this.tempevent.data);
      this.temp_subdivision = [];
      if (this.ck_ok_id == false) {
        this.$store.state.language == "th" ? this.temp_id_card = "กรุณาระบุเลขบัตรประชาชนให้ถูกต้อง" : this.temp_id_card = "Please enter a valid ID card number";
      }
      if (this.select_id_card != "") {
        this.ck_id_card = false;
      } else {
        this.ck_id_card = true;
      }
      if (this.select_fullname != "") {
        this.ck_fullname = false;
      } else {
        this.ck_fullname = true;
      }

      if (this.select_tel != "") {
        this.ck_tel = false;
      } else {
        this.ck_tel = true;
      }
      if (this.ck_firefighter == true) {
        this.temp_subdivision.push({ sent_subdivision: "1" ,subname: "ดับเพลิง" });
      }
      if (this.ck_public == true) {
        this.temp_subdivision.push({ sent_subdivision: "2" ,subname: "แพทย์ฉุกเฉิน"});
      }
      if (this.ck_rescuer == true) {
        this.temp_subdivision.push({ sent_subdivision: "3" ,subname: "หน่วยกู้ภัย"});
      }
      if (this.ck_police == true) {
        this.temp_subdivision.push({ sent_subdivision: "4" ,subname: "ตำรวจ"});
      }
      if (this.ck_etc == true) {
        this.temp_subdivision.push({ sent_subdivision: "5" ,subname: "อื่น ๆ"});
      }

      if (
        this.ck_id_card == false &&
        this.ck_fullname == false &&
        this.ck_tel == false &&
        this.ck_ok_id == true
      ) {
        this.temp_time = this.full_time
        this.temp_id = this.select_id_card;
        this.temp_fullname = this.select_fullname;
        this.tempdatesos = new Date();
       if(this.ck_warning == 1){
          this.temp_warning = this.$store.state.language == 'th' ? "เร่งด่วน": "Urgent"
         }else if(this.ck_warning == 2){
          this.temp_warning =  this.$store.state.language == 'th' ? "ไม่เร่งด่วน": "UnUrgent"
         }
        this.temp_remark = this.select_area
        if (this.ck_insert_card == false) {
          let result = {
            "remark": this.select_area,
            "id_card": this.select_id_card,
            "pole_tel": this.insertpole,
            // "tracker_address": this.nd
            "time_call": this.full_time,
            "sos_type_warning": this.ck_warning,
            "operator_user": this.select_area,
            // "lat": this.temppole[0].lat,
            // "lng" : this.temppole[0].lng,
            // lat: this.temp_lat,
            // lng: this.temp_lng,
            "temp_subdivision": this.temp_subdivision,
            "fullname": this.select_fullname,
            "tel": this.select_tel
          };
          this.loadding_page = true
          this.websocket.send(JSON.stringify({type: "web",data: result,insert:"NO"}))
          this.loadding_page = false
          this.sidebar_preview = true
          // if (result.code == 200) {
          //   // document.getElementById("container_sos").innerHTML = "";
          //   this.sos_popup = false;
          //   this.sidebar_preview = true;
          //   this.$swal.fire({
          //     position: "center",
          //     icon: "success",
          //     title: "บันทึกสำเร็จ",
          //     showConfirmButton: false,
          //     timer: 1500,
          //   });
          // } else {
          //   this.$swal.fire({
          //     position: "center",
          //     icon: "error",
          //     title: "เกิดข้อผิดพลาด",
          //     showConfirmButton: false,
          //     timer: 1500,
          //   });
          // }
        } else if (this.ck_insert_card == true) {
          let result = {
            "remark": this.select_area,
            "id_card": this.select_id_card,
            "pole_tel": this.insertpole,
            // "tracker_address": this.nd
            "time_call": this.full_time,
            "sos_type_warning": this.ck_warning,
            "operator_user": this.select_area,
            // "lat": this.temppole[0].lat,
            // "lng" : this.temppole[0].lng,
            // lat: this.temp_lat,
            // lng: this.temp_lng,
            "temp_subdivision": this.temp_subdivision,
            "fullname": this.select_fullname,
            "tel": this.select_tel
          };
          this.loadding_page = true
          this.websocket.send(JSON.stringify({type: "web",data: result,insert:"YES"}))
          this.loadding_page = false
          this.sidebar_preview = true
          // let result = await this.service.post("sos/create-population-master", {
          //   id_card: this.select_id_card,
          //   fullname: this.select_fullname,
          //   tel: this.select_tel,
          //   remark: this.select_area,
          //   pole_tel: this.insertpole,
          //   // "tracker_address": this.nd
          //   time_call: this.full_time,
          //   sos_type_warning: this.ck_warning,
          //   operator_user: this.select_area,
          //   // "lat": this.temppole[0].lat,
          //   // "lng" : this.temppole[0].lng,
          //   lat: 13.676882,
          //   lng: 100.60337,
          //   temp_subdivision: ff,
          // });
          // if (result.code == 200) {
          //   // document.getElementById("container_sos").innerHTML = "";
          //   this.sos_popup = false;
          //   this.sidebar_preview = true;
          //   this.$swal.fire({
          //     position: "center",
          //     icon: "success",
          //     title: "บันทึกสำเร็จ",
          //     showConfirmButton: false,
          //     timer: 1500,
          //   });
          // } else {
          //   this.$swal.fire({
          //     position: "center",
          //     icon: "error",
          //     title: "เกิดข้อผิดพลาด",
          //     showConfirmButton: false,
          //     timer: 1500,
          //   });
          // }
        }
        this.sos_call_recived = false;
        this.sos_popup = false;

      }
    },
    chkDigitPid(p_iPID) {
      var total = 0;
      var iPID;
      var chk;
      var Validchk;
      iPID = p_iPID.replace(/-/g, "");
      Validchk = iPID.substr(12, 1);
      var j = 0;
      var pidcut;
      for (var n = 0; n < 12; n++) {
        pidcut = parseInt(iPID.substr(j, 1));
        total = total + pidcut * (13 - n);
        j++;
      }

      chk = 11 - (total % 11);

      if (chk == 10) {
        chk = 0;
      } else if (chk == 11) {
        chk = 1;
      }
      if (chk == Validchk) {
        // this.temp_id_card =  "ระบุหมายเลขประจำตัวประชาชนถูกต้อง"
        this.ck_id_card = false;
        this.ck_ok_id = true;
      } else {
        this.temp_id_card = "ระบุหมายเลขประจำตัวประชาชนไม่ถูกต้อง";
        this.ck_id_card = true;
      }
    },
},
watch:{
  sos_call_recived(e) {
    console.log(e);
      if (e == false) {
        this.select_id_card = "";
        this.select_fullname = "";
        this.select_area = "";
        this.select_tel = "";
        this.full_time = "00:00";
        // this.tempdetail.splice(index, 1);
      } else {
        this.ck_id_card = false;
        this.ck_fullname = false;
        this.ck_tel = false;
        this.ck_warning = "1";
        this.ck_firefighter = false;
        this.ck_public = false;
        this.ck_rescuer = false;
        this.ck_police = false;
        this.dis_fullname = true;
        this.dis_id_card = false;
        this.dis_detail = true;
        this.dis_tel = true;
        this.ck_etc = false;
      }
    },
    async tempevent(a) {
     // console.log(a);
// console.log(a.incoming);

if (a.type == "call") {
  console.log("callllllllllllllllllllllllllllll");
  console.log(a.data.status);
  if (a.data.status == "Incoming") {
    this.insertpole = a.data.remote
    this.sos_flag = true
    this.tempdatesos = new Date();
       if (this.sos_call_recived == false && this.sos_popup == false && this.sidebar_preview == false) {
      let date = new Date();
      this.$moment.locale("th");
      console.log(date);
      this.temp_date = this.$moment(date).format("LLLL");
      console.log(this.temp_date);
      // console.log(this.$route)
      // console.log(this.$route.fullPath.split('/')[1])
        console.log(a.data.remote);
      let result = await this.service.post("sos/get-sos-pole", {
        tel: a.data.remote
      });
      console.log("dataaaaaaaaaaaaaaaaaaaaaaaaaaa");
      console.log(result);
      this.temp_lat = result.data[0].lat
      this.temp_lng = result.data[0].lng
      console.log(this.temp_lat, this.temp_lng);
      // this.temp_date = result.data[0].installation_point_en
      this.temp_installation =  this.$store.state.language == 'th' ? result.data[0].installation_point_th : result.data[0].installation_point_en ;

      this.temp_camera = result.data_camera
      console.log(this.temp_camera);
      // this.temp_detail =
      this.temp_pole =  this.$store.state.language == 'th' ? "รหัส : "+result.data[0].pole_name_th+"#"+ result.data[0].pole_id  : result.data[0].pole_id +"#"+ result.data[0].pole_name_en ;
      console.log(this.temp_camera);
      console.log(this.temp_pole);
      // this.temppole[0].lat
      console.log(result.data);
      this.temppole = result.data;
      console.log(this.temppole[0].lat);
      console.log(this.temppole[0].lng);

      // let result_log = await this.service.post("sos/create-sos-log", {
      //   pole_tel: a.data.remote,
      //   lat: result.data[0].lat,
      //   lng: result.data[0].lng
      // });

      setTimeout(() => {
        this.sos_popup = true;
        this.sos_call = true;
        this.$store.dispatch('setActionsHead',true)
        // this.sos_recived = [{}];

        setTimeout(() => {
          this.getlocation(this.temppole[0].lat, this.temppole[0].lng);
          this.getMap();
        }, 100);
      }, 100);
    }
    else if (this.sos_popup == true || this.sos_call_recived == true || this.sidebar_preview == true) {
    
      let result = await this.service.post("sos/get-sos-pole", {
        tel: a.data.remote
      });

      this.sos_recived.push({"result":result.data,"data_camera":result.data_camera});
      console.log(this.sos_recived[0].result);

      // let result_log_wait = await this.service.post("sos/create-sos-log", {
      //   pole_tel: a.data.remote,
      //   lat: result.data[0].lat,
      //   lng: result.data[0].lng
      // });
      setTimeout(() => {
          this.temppole = result.data;
          this.getlocation(this.temppole[0].lat, this.temppole[0].lng);
          this.getMapMini();
        }, 100);
    }
  }
  else if (a.data.status == "Answered") {
    let tempnumber = localStorage.getItem('user_phone')
    console.log(tempnumber);
    console.log(a.data.operator);
    console.log(a.data.remote);
    if (a.data.operator != tempnumber) {
      this.sos_call_recived = false;
      this.sos_popup = false;
      this.sos_flag = false;
      this.map.remove();
      setTimeout(() => {
        if (this.sos_recived.length > 0) {

          this.temp_lat = this.sos_recived[0].result.lat
      this.temp_lng = this.sos_recived[0].result.lng

      // this.temp_date = result.data[0].installation_point_en
      this.temp_installation =  this.$store.state.language == 'th' ? this.sos_recived[0].result[0].installation_point_th : this.sos_recived[0].result[0].installation_point_en ;

      this.temp_camera = this.sos_recived[0].data_camera
      console.log(this.temp_camera);
      // this.temp_detail =
      this.temp_pole =  this.$store.state.language == 'th' ? "รหัส : "+this.sos_recived[0].result[0].pole_name_th+"#"+ this.sos_recived[0].result[0].pole_id  : this.sos_recived[0].result[0].pole_id +"#"+ this.sos_recived[0].result[0].pole_name_en ;

      console.log(this.temp_pole);
      // this.temppole[0].lat

      this.temppole = this.sos_recived[0].result;
         console.log(this.temppole);
          this.sos_flag = true;
          this.sos_popup = true;
          this.sos_call = true;
          this.sos_recived.shift();
          setTimeout(() => {
            this.getMap();
          }, 100);
        }
      }, 3000);
    } else if (a.data.operator == tempnumber) {
     // console.log(a);
      this.callRecieved()
      // this.websocket.send(JSON.stringify({type: "web",data: "Answer the call"}))
      // CLIENTS[i].send(JSON.stringify({type: "call",data: data}));
    }
  }
}
else if (a.type == "sip_log" && this.sos_call_recived == false && this.sidebar_preview == false) {
  this.sos_call_recived = false;
  this.sos_popup = false;
  this.map.remove();
  this.sos_flag = false

}else if(a.type ==='ai'){
 
  this.map_debger_area = null
  console.table(a.data);
  const data = a.data 
   let datastorel = localStorage.getItem("user_data")
    let data_ = JSON.parse(datastorel) 
    if(this.sos_flag==true){
      console.log('event ซ้อน');
    }else{
      // if(new Date(data.time).getTime())
      let text = a.topic
          text = text.split('/')
          console.log(text);
      let result_ = await this.service.post("sos/get_ch_camara_ai", {
        control_number: text[2],
         division_id: '1'
      })
      console.log(result_);

      if (result_.code == 200) {
        this.data_ch_datainstalation = result_.message
        let result = await this.service.post("sos/create-log-denger-area", {
          installation_point_id: this.data_ch_datainstalation.installation_point_id,
          log_denger_lavel: data.level,
          log_denger_image: data.image,
          violatetime: data.violatetime,
          temperature: data.temperature,
          time_event: data.time,
          device_type: data.type,
          confidence: null,
          token: data.token,
          description: null,
          status: 1,
          control_number:text[2]
        });
        console.log(result);
        if (result.code == 200) {
          this.sos_flag = true
          this.noti_denger_area(a.data, result.denger_area_id)
        }

      } else {
        this.sos_flag = false
      }
    }
      
    
  
 
  
  
}
//  else if(a.incoming == "false"){

//  }
},
},
}
</script>

<style scoped>
.sos_box{
    position: relative;
    z-index: 6000;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: #00000033;
}
.playbacksos {
  /* height: calc(100vh - 860px) ;  */
  background-color: #ffffff10;
  padding: 10px;
  border-radius: 12px;
  margin-bottom: 10px;
}

@media only screen and (max-height: 800px) {
  .playbacksos {
    /* height: calc(100vh - 600px) ;  */
    background-color: #ffffff10;
    padding: 10px;
    border-radius: 12px;
    margin-bottom: 10px;
  }
}

.controlsos {
  /* height: calc(100vh - 740px) ;   */
  background-color: #ffffff10;
  padding: 10px;
  border-radius: 12px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  margin-bottom: 10px;
}

@media only screen and (max-height: 800px) {
  .controlsos {
    /* height: calc(100vh - 510px) ;   */
    background-color: #ffffff10;
    padding: 10px;
    border-radius: 12px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    margin-bottom: 10px;
  }

  /* .control-btn {
    height: 35px !important;
  }
  .control-btn i {
    font-size: 24px !important;
  } */
}

.navbar-box {
  color: #fff;
  /* border-bottom: 1px solid #00ffb3bb;
  box-shadow: 2px 2px 10px #00ffb3bb; */
  height: 100%;
  display: grid;
  grid-template-columns: 4fr 3fr;
  justify-content: center;
  align-items: center;
}

.navbar-logo {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
}

.navbar-icon {
  position: relative;
}

.navbar-icon:after {
  display: block;
  content: "";
  width: 20px;
  height: 20px;
  position: absolute;
  top: 0px;
  left: -10px;
  border-top: 3px solid #00ffb3bb;
  border-left: 3px solid #00ffb3bb;
}

.navbar-in:before {
  display: block;
  content: "";
  width: 20px;
  height: 20px;
  position: absolute;
  bottom: 0px;
  right: -10px;
  border-bottom: 3px solid #00ffb3bb;
  border-right: 3px solid #00ffb3bb;
}

.navbar-menu {
  display: flex;
  justify-content: center;
  align-items: center;
  /* grid-template-columns: 1fr 1fr 1fr 1fr; */
  text-align: center;
}

.navbar-sub {
  margin-right: 50px;
  cursor: pointer;
  transition: 0.1s;
}

.navbar-set {
  cursor: pointer;
  transition: 0.1s;
}

.navbar-set:hover {
  border-bottom: 3px solid #00ffb3bb;
  box-shadow: 0 8px 8px -5px #00ffb3bb;
}

.navbar-sub:hover {
  border-bottom: 3px solid #00ffb3bb;
  box-shadow: 0 8px 8px -5px #00ffb3bb;
}

.video {
  object-fit: fill;
}

/* .navbar-sub.active{
  color: #00ffb3;
} */
/* .router-link-active.router-link-exact-active.active{
  color: #00ffb3;

} */
a {
  color: #fff;
}

a:hover {
  color: #fff;
}

.router-link-active {
  color: #00ffb3;
}


.navbar-user {
  display: flex;
  justify-content: end;
  align-items: center;
}

.navbar-profile {
  /* border: 0.5px solid #fff; */
  border-radius: 25px;
  width: 40px;
  height: 40px;
}

.navbar-noti {
  position: relative;
}

.navbar-noti-count {
  position: absolute;
  border-radius: 50px;
  background: #ff577e;
  font-size: 10px;
  min-width: 20px;
  max-height: 20px;
  display: grid;
  justify-content: center;
  align-items: center;
  top: 10px;
  left: 10px;
}

.navbar-setting {
  display: none;
}

.navbar-list-noti {
  display: none;
}

.navbar-set {
  position: relative;
}

.navbar-set:hover .navbar-setting {
  color: #414347;
  z-index: 1000;
  display: block;
  position: absolute;
  margin-top: 0px;
  width: 100%;
  /* left: 0; */
  /* background: #373a3ddd; */
  background: #373a3d00;
  /* text-align: left; */
}

.navbar-setting .navbar-list {
  background: #878787ee;
  border-radius: 0 5px 5px 5px;
  padding: 3px 3px;
  /* width: 280px; */
  /* margin-left: -140px; */
  /* width: 100vw; */
  /* position: fixed;
  left: 0;
  justify-content: center; */
  display: flex;
}

/* .navbar-setting .navbar-list .navbar-list-item{
  transition: color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}
.navbar-setting .navbar-list .navbar-list-item:hover{
  box-shadow: inset 100px 0 0 0 #00ffb399;
  color: #fff;
} */
.navbar-setting .triangle {
  width: 0;
  height: 0;
  border: 10px solid transparent;
  border-top: 0;
  border-bottom: 7px solid #878787ee;
}

.navbar-noti:hover .navbar-list-noti {
  color: #fff;
  z-index: 2000;
  display: block;
  position: absolute;
  margin-top: 0px;
  right: 0px;
  width: 200px;
  /* background: #373a3ddd; */
  background: #373a3d00;
  text-align: left;
}

.navbar-list-noti .navbar-list {
  overflow-y: auto;
  max-height: 300px;
  background: #878787ee;
  border-radius: 5px 0 5px 5px;
  padding: 3px 3px;
}

.navbar-list-noti .navbar-list .navbar-list-item {
  transition: color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.navbar-list-noti .navbar-list .navbar-list-item:hover {
  box-shadow: inset 200px 0 0 0 #00ffb399;
  color: #fff;
}

.navbar-list-noti .triangle {
  width: 0;
  height: 0;
  border: 10px solid transparent;
  border-top: 0;
  border-bottom: 7px solid #878787ee;
}

.sos_layout {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  /* background: #ffffff40; */
  z-index: 2000;
  display: grid;
  justify-content: center;
  align-items: center;
  
}

/* #container_sos {
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin: 0;
  padding: 0;
}

#container_sos>div {
  margin: 0;
  padding: 0;
  background: red;
} */

.soc_minicall_sos {
  position: fixed;
  bottom: 10px;
  left: 10px;
  padding: 10px;
  width: 300px;
  height: 400px;
  background-image: linear-gradient(#02EABC, #00A3F3);
  border-radius: 10px;
  /* box-shadow: 0px 5px 15px 0px rgba(0, 0, 0, 0.6); */
  box-shadow: 0px 4px 20px rgba(4, 162, 240, 0.2);
}
.soc_call {
  padding: 10px;
  width: 784px;
  height: 784px;

  border-radius: 20px;
  box-shadow: 0px 5px 15px 0px rgba(0, 0, 0, 0.6);

}


.sos_noti {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1900;
}


.sos_noti_popup {
  width: 200px;
  height: 80px;
  background: #ffffff10;
  box-shadow: 0px 5px 15px 0px rgba(0, 0, 0, 0.6);
  margin-top: 10px;
  display: grid;
  justify-content: center;
  align-items: center;
  color: #fff;
  animation: shake 0.5s;
  animation-iteration-count: infinite;
  padding: 10px;
}

@keyframes shake {
  0% {
    transform: translate(1px, 1px) rotate(0deg);
  }

  100% {
    transform: translate(1px, -2px) rotate(-1deg);
  }
}

#mapsidemenu {
  width: 100%;
  height: 100%;
  /* height: calc(100% - 30px); */
}
#mapsidemenumini{
  width: 100%;
  height: 100%;
}

.dot {
  height: 60px;
  width: 60px;
  background-color: #00e0c1;
  border-radius: 50%;
  display: inline-block;
}

.dot2 {
  height: 60px;
  width: 60px;
  background-color: #ff5d30;
  border-radius: 50%;
  display: inline-block;
}

.circle-icon {
  background: #ffc0c0;
  padding: 30px;
  border-radius: 50%;
}

.control-btn {
  background: #F6F7F9;
  width: 100%;
  height: 30px;
  border-radius: 10px;
  margin: 5px;
  cursor: pointer;
  display: grid;
  align-items: center;
  justify-content: center;
}

.control-btn:hover {

  background-color: #F6F7F9;
  /* border:1px solid  linear-gradient(180deg, #00A3F4 0%, #02EABC 100%); */
  /* linear-gradient(180deg, #00A3F4 0%, #02EABC 100%); */
}

.control-btn-c {
  background: #F6F7F9;
  width: 100%;
  height: 36px;
  border-radius: 50%;
  margin: 5px;
  cursor: pointer;
  display: grid;
  align-items: center;
  justify-content: center;
}

.control-btn-c:hover {
  background: #F6F7F9;
}

.control-btn:active {
  color: #02EABC;
}

.control-btn-c:active {
  color: #02EABC;
}

#container_sos div {
  margin: 0;
  padding: 0;
}

.imgwarin{
  height: 80px;
}
.body-notidenger{
  position: relative;
}
.dengetstyle_opoup{
  margin-top:19px;
  position: absolute;
  border-radius: 10px;
  min-height: 200px;
  min-width: 200px;
  height:max(95vh);
  width:max(160vh);
  box-shadow: 0px 5px 15px 0px rgba(0, 0, 0, 0.6);
  left: 50%;
  top:50%;
  transform: translate(-50%);
}

.body-header > img {
  position:absolute;
  height:50px;
}
.line1{
  position: absolute;
  border-top: 1px solid #02EABC;
  top:9%;
  width: 100%;
}
.body-header{
  display: grid;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: auto;
}
.body-header > h2{
  margin: 19px 0 10px;
  font-weight: bold;
  color: #02EABC;
}
.body-contnet{
  padding-left: 20px;
  padding-right: 20px;
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-gap: 10px;
  height: 88%;
  width: 100%;

}
.card-colum-1{
  display: flex;
  align-items: center;
  height: 100%;
  width: 875px;
  /* box-shadow: 0px 5px 5px 0px rgba(0, 0, 0, 0.6); */
  border-radius: 15px;
}
.colum-1{
  width: 100%;
  height: 31.25rem;
  position: relative;
  background-size: cover;
  border-radius: 15px; 
}
.colum-1>.line1{
  position: absolute;
  border: 1.5px solid rgb(39, 234, 39);
}
.hrederframe{
  width: 120px;
  position: absolute;
  top:-30%;
  left:-30%;
  font-size: 6px;
  font-weight: 600;
  color:rgb(39, 234, 39);
}
.colum-1>.line3{
  position: absolute;
  border: 2px solid #00ffb3;
  height: 210px;
  width:100%;
  border-radius:0 0 15px 15px;
  top:58%;
  left:0;
}
.colum-1>.line4{
  position: absolute;
  border: 2px solid yellow;
  height: 87px;
  width:100%;
  top:41%;
  left:0;
}
.colum-1>.line5{
  position: absolute;
  border: 2px solid red;
  width:100%;
  top:16%;
  height: 127px;
  left:0;
}
.colum-2{
  width: 100%;
  justify-content: center;
  align-items: center;
  height: 91%;
}
/* .colum-1 >iframe{
  height: 101%;
  width: 100%;
  object-fit: cover;
  object-position: left;
  border-radius: 15px;
} */
.detail{
  margin-top:10px;
  display: grid;
  grid-gap: 10px;
  padding:13px;
  height: 50%;
  border-radius: 15px;

}

.detail> span{
  margin:5px;
  margin-left:1rem;
  font-size:0.813rem;
  font-weight: bolder;
}
#map_denger_area{
  height: 50%;
  width: 100%;
  border-radius: 1rem;

}
.closepage{
  position: absolute;
  top:1%;
  left: 96%;
}
.detail>span>img{
  height: 1.5rem;
  margin-right: 7px;
  margin-bottom: 5px;
  border: 1px;
  width: 1.4rem;
}
.img-submit{
  background: #00000033;
  padding: 7px;
  margin:10px;
  justify-content: center;
  font-size: larger;
  font-weight: bold;
  border-radius: 15px;
  text-align: center;
}
.btn-bontom{
  text-align: center;
  height: auto;
 
}
.div_detall_installation{
  font-size: 14px;
}
</style>