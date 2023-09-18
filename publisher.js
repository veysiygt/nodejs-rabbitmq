require("dotenv").config();
const amqp = require("amqplib");
const message = {
  description: "This is test message",
};
const data = require("./data.json");
const queueName = process.argv[2] || "jobsQueue";

connect_rabbitmq();

async function connect_rabbitmq() {
  try {
    const connection = await amqp.connect(`amqp://${process.env.APP_HOST}:${process.env.APP_PORT}`);
    const channel = await connection.createChannel();
    const assertion = await channel.assertQueue(queueName);

    data.forEach((i) => {
      message.description = i.id;
      channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
      console.log("Sent Message", i.id);
    });
  } catch (error) {
    console.log("Error", error);
  }
}
