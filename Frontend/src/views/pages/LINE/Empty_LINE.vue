<script setup>
import Service from "../../../service/api";
import { ref } from 'vue';
import config from '../../../service/config';
const service = new Service()
const value1 = ref(null);
const save = async () => {
    const res = await service.post('/write/update_token_line', { token: value1.value });
    if (res.message == 'success') {
        return alert(res.message);
    }
    return alert(res.message);

}
</script>
<template>
    <div className="grid">
        <div>
            <br>
            <div>
                <h1 style="text-align: center;">ขั้นตอน การขอ Token จาก Line Notify&nbsp;</h1>
            </div>
            <div>
                <p style="text-align: center;"><span style="font-size: 18pt;">ขั้นตอนการขอ Token จาก Line notify
                        เพื่อรับการแจ้งเตือนต่างๆ จาก LINE นิยมนำมาใช้อย่างแพร่หลายกับวงการ Arduino และ NodeMCU
                        โดยนำมาเป็นช่องทางการแจ้งเตือน Error ต่างๆของระบบ หรือส่ง ข้อความ รูปภาพ ไปยังไลน์
                        (LINE)&nbsp;</span><br><span style="font-size: 18pt;">&nbsp;</span><br><span
                        style="font-size: 18pt;"><strong>ขั้นตอนที่ 1&nbsp;</strong>เข้าไปยังลิงค์&nbsp;<a
                            href="https://notify-bot.line.me/th/"
                            target="_blank">https://notify-bot.line.me/th/&nbsp;</a></span><br><span
                        style="font-size: 18pt;">เพื่อไปยังหน้าเว็บของ LINE Nofity แล้วทำการ Login Email
                        ของเราที่เชื่อมต่อกับ LINE</span><br><br><strong><img
                            style="display: block; margin-left: auto; margin-right: auto;"
                            src="https://dw.lnwfile.com/_/dw/_raw/49/qx/54.jpg" alt="" width="600"><br><br><span
                            style="font-size: 18pt;">ขั้นตอนที่ 2&nbsp;</span></strong><span
                        style="font-size: 18pt;">หลังจาก Login เสร็จ เข้าไปเลือกเมนู</span><strong><span
                            style="font-size: 18pt;">&nbsp;หน้าของฉัน</span><br><br><br><img
                            src="https://dw.lnwfile.com/_/dw/_raw/l5/y4/76.jpg" alt="" width="600"><br></strong>
                </p>
                <p style="text-align: center;"><span style="font-size: 18pt;"><strong>ขั้นตอนที่
                            3&nbsp;</strong>หลังจากทำตามขั้นตอนที่ 2 เสร็จเลื่อนลงมาข้างล่างหน่อย ก็จะเจอ
                        เมนู&nbsp;ออก Token&nbsp;&nbsp;กดเข้าไปได้เลย</span><strong><br><br><br><img
                            src="https://dw.lnwfile.com/_/dw/_raw/uq/dt/65.jpg" alt="" width="600"><br><br><span
                            style="font-size: 18pt;">ขั้นตอนที่ 4&nbsp; &nbsp;</span></strong><span
                        style="font-size: 18pt;">ตั้งชื่อ แล้วเลือกช่องแชทที่จะให้ Line nofity
                        ส่งข้อความไปให้เรา แล้กด&nbsp;ออก Token&nbsp;</span><strong><br><br><img
                            src="https://dw.lnwfile.com/_/dw/_raw/s8/nn/1q.jpg" alt=""
                            width="600"><br><br><br></strong><span style="font-size: 18pt;">จากนั้นเราก็จะได้ Token
                        LINE ของเราแล้ว</span><br><br><span
                        style="font-size: 18pt;"><strong>หมายเหตุ**</strong>&nbsp;ควร Copy Token ไว้เพราะ Token
                        จะเห็นได้เพียง 1 ครั้งเท่านั้นหากเราออกจากหน้า Token ที่ออกแล้วจะไม่สามารถดู Token
                        ได้อีกเลย แต่!! สามารถออก Token ได้อีกเรื่อย ๆ ไม่จำกัด</span><br><br><span
                        style="font-size: 24px;"><strong>จากนั้นนำ Token
                            ที่ได้นำมาใส่ในช่องด้านล่าง</strong></span></p>
                <p style="text-align: center;"><span style="font-size: 24px;"><strong><img
                                :src="`${config.backend_url_img}/resources/assets/mian-icon/default/icon-main/arrow-up.png`"
                                alt="Arrow up free icon" width="300" height="300"> </strong></span></p>
            </div>
            <div class="flex justify-content-center mt-10">
                <span class="p-float-label">
                    <InputText id="inputtext" type="text" v-model="value1" style="width: 400px; height: 50px;" />
                    <label for="inputtext">ใส่ Token ที่นี้</label>
                </span>
                <Button label="บันทึก" @click.prevent="save"
                    class="p-button-raised p-button-success mr-2 ml-2 mb-2 p-3" />
            </div>
        </div>
    </div>
</template>
