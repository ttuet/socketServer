const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const logger = require("./configs/winston");

//io file
const fs = require("fs").promises;

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  socket.broadcast.emit("Hi");

  socket.on("sayHello", (_data) => {
    const totalUser = writeUser({
      ..._data,
    });
    console.log("Say Hell0 ", totalUser);
    io.emit("users", totalUser);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    logger.info("user disconnected");
  });
  socket.on("chat message", (data) => {
    logger.info("chat message ", data);
    io.emit("chat message", data);
  });
});

server.listen(8080, () => {
  console.log("listening on .... *:8080");
});

async function readUser() {
  try {
    const data = await fs.readFile(__dirname + "/user.json", {
      encoding: "utf-8",
    });
    const myPromise = new Promise((resolve, rejects) => {
      resolve(data);
    });
    return myPromise;
  } catch (err) {
    console.log(err);
  }
}

function writeUser(user) {
  readUser()
    .then((_data) => {
      const dataUser = JSON.parse(_data);

      const index = dataUser.find((item) => item.id === user.id);
      if (index >= 0) {
        dataUser[index] = user;
      } else {
        dataUser.push(user);
      }

      fs.writeFile(__dirname + "/user.json", JSON.stringify(dataUser));
      return dataUser;
    })
    .catch((err) => {
      console.log(err);
    });
}

// writeUser({
//   id: "9",
//   name: "Nguyen",
//   status: "on",
// });

// readUser().then((data) => {
//   console.log(data);
// });
