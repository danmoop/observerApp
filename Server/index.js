var socket = require('socket.io'),
  http = require('http'),
  server = http.createServer(),
  socket = socket.listen(server),
  fs = require('fs'),
  batteryLevel = require('battery-level'),
  screenshot = require('desktop-screenshot');

socket.on('connection', function (client) {
  socket.emit('openDashboard');

  client.on('requestImage', () => {
    screenshot("screenshot.png", function (error, complete) {
      if (complete) {
        fs.readFile('screenshot.png', function (err, data) {
          socket.emit('provideScreenshot', "data:image/png;base64," + data.toString("base64"));
        });
      }
    });
  });

  client.on('requestPcStats', () => {
    var OS = process.env.OS;
    var PROCESSOR = process.env.PROCESSOR_IDENTIFIER;
    var result = `OS: ${OS}\nPROCESSOR: ${PROCESSOR}`;

    socket.emit('providePCStats', result);
  });

  client.on('requestBattery', () => {
    batteryLevel().then(level => {
      socket.emit('provideBatteryLevel', level);
    });
  });
});

server.listen(3000, function () {
  console.log('Server started');
});