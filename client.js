const zmq = require("zeromq");

async function gameClient(min, max) {
  const socket = new zmq.Request();

  socket.connect("tcp://127.0.0.1:3000");
  console.log(`Загадано число в диапазоне: ${min}-${max}`);

  const secretNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  console.log(`Загаданное число: ${secretNumber}`);

  await socket.send(JSON.stringify({ range: `${min}-${max}` }));

  while (true) {
    const [message] = await socket.receive();
    const { answer } = JSON.parse(message.toString());
    console.log(`Сервер угадал: ${answer}`);

    if (answer < secretNumber) {
      console.log("Подсказка: Больше");
      await socket.send(JSON.stringify({ hint: "more" }));
    } else if (answer > secretNumber) {
      console.log("Подсказка: Меньше");
      await socket.send(JSON.stringify({ hint: "less" }));
    } else {
      console.log("Угадано верно!");
      break;
    }
  }
}

const args = process.argv.slice(2);
if (args.length < 2) {
  console.log("Введите диапазон чисел (мин и макс)!");
  process.exit(1);
}
const [min, max] = args.map(Number);

gameClient(min, max);
