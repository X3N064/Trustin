const { Kafka } = require('kafkajs');

const kafka = new Kafka({ clientId: 'trading-app', brokers: ['kafka:9092'] }); // ✅ 변경된 Kafka 브로커 주소
const producer = kafka.producer();

const sendOrderToKafka = async (order) => {
    await producer.connect();
    await producer.send({
        topic: 'orders',
        messages: [{ value: JSON.stringify(order) }],
    });
    console.log(`📩 Order sent to Kafka: ${JSON.stringify(order, null, 2)}`);
    await producer.disconnect();
};

module.exports = sendOrderToKafka;
