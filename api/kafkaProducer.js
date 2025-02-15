const { Kafka } = require('kafkajs');

const kafka = new Kafka({ clientId: 'trading-app', brokers: ['trustin-kafka-1:9092'] }); // ✅ 수정된 Kafka 브로커 주소
const producer = kafka.producer();

const sendOrderToKafka = async (order) => {
    try {
        await producer.connect();
        await producer.send({
            topic: 'orders',
            messages: [{ value: JSON.stringify(order) }],
        });
        console.log('📩 Order sent to Kafka:', order);
        await producer.disconnect();
    } catch (error) {
        console.error('❌ Failed to send order to Kafka:', error);
    }
};

module.exports = sendOrderToKafka;
