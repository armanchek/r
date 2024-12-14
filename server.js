const zmq = require("zeromq");

async function gameServer() {
  const socket = new zmq.Reply();

  await socket.bind("tcp://127.0.0.1:3000");
  console.log("Ready for the game");

  let min = null;
  let max = null;
  let guess = null;

  while (true) {
    const [message] = await socket.receive();
    const data = JSON.parse(message.toString());

    if (data.range) {
      [min, max] = data.range.split("-").map(Number);
      console.log(`Received range: ${min}-${max}`);
      guess = Math.floor((min + max) / 2);
      await socket.send(JSON.stringify({ answer: guess }));
    } else if (data.hint) {
      if (data.hint === "more") {
        min = guess + 1;
      } else if (data.hint === "less") {
        max = guess - 1;
      }
      guess = Math.floor((min + max) / 2);
      console.log(`New guess: ${guess}`);
      await socket.send(JSON.stringify({ answer: guess }));
    }
  }
}

gameServer();
