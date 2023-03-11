<template>
  <div id="container"></div>
</template>

<script>
import io from "socket.io-client";
export default {
  data() {
    return {
      socket: null,
      cam_data: [
      {
        id: 0,
        ch: "ch46",
      },
      // {
      //   id: 1,
      //   ch: "ch47",
      // },
      {
        id: 2,
        ch: "ch48",
      },
      // {
      //   id: 3,
      //   ch: "ch49",
      // },
    ],
    };
  },
  created() {
    this.socket = io("http://localhost:6147");
    console.log(this.socket);
  },
  mounted() {
   this.getRtsp()
  },
  methods: {
    getRtsp(){
        

    for (let ch = 0; ch < this.cam_data.length; ch++) {
      var div = document.createElement("div");
      div.innerHTML = `<img id="${this.cam_data[ch].ch}" style="width:50vw;height:50vh;">`;
      var image = div.getElementsByTagName("img")[0];
      container.appendChild(div);
    }

    var socket =  this.socket
    socket.on("start", (cou) => {
      var container = document.getElementById("container");
      var divSocket;

      if (divSocket) {
        divSocket.disconnect();
      }
      for (let ca = 0; ca < this.cam_data.length; ca++) {
        divSocket = io("http://localhost:6147" + `/${this.cam_data[ca].ch}`);
        divSocket.on("camera-data", (data) => {
          if (data.ch == this.cam_data[ca].ch) {
            document.getElementById(this.cam_data[ca].ch).src =
              "data:image/jpeg;base64," +
              this.base64ArrayBuffer(new Uint8Array(data.data));
          }
        });
      }
    });
    },
  },
}
</script>

<style scoped>
#container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin: 0;
  padding: 0;
}
#container > div {
  margin: 0;
  padding: 0;
  background: #000;
}
</style>