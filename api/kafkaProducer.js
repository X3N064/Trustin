const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'my-trading-app',
  brokers: ['127.0.0.1:9093'], // 원래 'localhost:9092' → '127.0.0.1:9093'로 변경
});

const producer = kafka.producer();

const produceMessage = async () => {
  await producer.connect();
  await producer.send({
    topic: 'orders',
    messages: [
      { value: JSON.stringify({ orderId: 123, type: 'BUY', price: 100.0, quantity: 10 }) }
    ],
  });
  console.log('Message sent to Kafka');
  await producer.disconnect();
};

produceMessage().catch(console.error);
