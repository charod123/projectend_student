// const config = require('../config/config')
// const express = require('express');
// const app = express();
// const mqtt = require("mqtt");
// const moment = require("moment");
// const mqtt_client = mqtt.connect("mqtt://203.150.210.39");
// let WebSocketClient = require('websocket').client;
// let ws = new WebSocketClient();
// const pgcon = require("../pgconnection/pgCon");
// const port_send_data = config.send_background_notify
// let CLIENTS = []
// // let temp_log = []
// // let obj
// mqtt_client.on("connect", () => {
//   mqtt_client.subscribe("sos/867648042649648/status", (err) => {

//     if (!err) {
//       mqtt_client.publish("presence", "Hello mqtt");
//     }
//   });
// });

// mqtt_client.on("message", async (topic, message) => {
//   console.log(topic);
//   passData(topic, JSON.parse(Buffer.from(message).toString()))
// })


// ws.on('connectFailed', function (error) {
//   console.log('Connect Error: ' + error.toString());
// });

// ws.on('connect', function (connection) {
//   console.log('WebSocket Client Connected');
//   connection.on('error', function (error) {
//     console.log("Connection Error: " + error.toString());
//   });
//   connection.on('close', function () {
//     console.log('echo-protocol Connection Closed');
//   });
//   connection.on('message', function (message) {
//     // console.log(message);
//     if (message.type === 'utf8') {
//       console.log("Received: '" + message.utf8Data + "'");
//     }
//   });
//   CLIENTS = []
//   CLIENTS.push(connection);
//   //console.log(CLIENTS);
// });
// ws.connect(port_send_data);
// // ws.connect('ws://bangsaothong.dtc.co.th:3048');

// const passData = (topic, data) => {
//   for (var i = 0; i < CLIENTS.length; i++) {
//       CLIENTS[i].send(JSON.stringify({ type: "noti", topic: topic, data: data }));
//   }
// }


const mqtt = require("mqtt");
const WebSocket = require('websocket').client;
const config = require('../config/config');
const port_send_data = config.send_background_notify

const mqtt_client = mqtt.connect("mqtt://203.150.210.39");
const ws = new WebSocket();
const clients = [];

mqtt_client.on("connect", () => {
  mqtt_client.subscribe("sos/#", (err) => {
    if (!err) {
      mqtt_client.publish("presence", "Hello mqtt");
    }
  });
});

mqtt_client.on("message", (topic, message) => {
  const topic_ = topic.split('/')
  if (topic_[topic_.length - 1] === 'status') {
    for (let i = 0; i < clients.length; i++) {
      const client = clients[i];
      client.send(JSON.stringify({ type: "noti", topic, data: JSON.parse(Buffer.from(message).toString()) }))
    }
  }
});

ws.on('connectFailed', (error) => {
  console.log('Connect Error: ' + error.toString());
});

ws.on('connect', (connection) => {
  console.log('WebSocket Client Connected');
  connection.on('error', (error) => {
    console.log("Connection Error: " + error.toString());
  });
  connection.on('close', () => console.log('echo-protocol Connection Closed'));
  connection.on('message', (message) => {
    if (message.type === 'utf8') {
      console.log("Received: '" + message.utf8Data + "'");
    }
  });
  clients.push(connection)
});

ws.connect(port_send_data);
