// kafkaProducer.js
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'my-trading-app',
  brokers: ['localhost:9092']  // Kafka 브로커 주소에 맞게 수정하세요.
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
