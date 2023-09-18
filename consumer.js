require("dotenv").config();
const amqp = require("amqplib");
const queueName = process.argv[2] || "jobsQueue";
const data = require("./data.json");

connect_rabbitmq();

async function connect_rabbitmq() {
  try {
    const connection = await amqp.connect(`amqp://${process.env.APP_HOST}:${process.env.APP_PORT}`);
    const channel = await connection.createChannel();
    const assertion = await channel.assertQueue(queueName);

    // Get message
    console.log("Waiting Message...");
    channel.consume(queueName, (message) => {
      const messageInfo = JSON.parse(message.content.toString());
      const userInfo = data.find((u) => u.id == messageInfo.description);
      if (userInfo) {
        console.log("Processed Record", userInfo);
        channel.ack(message);
      }
    });
  } catch (error) {
    console.log("Error", error);
  }
}
