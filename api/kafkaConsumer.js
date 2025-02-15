const { Kafka } = require('kafkajs');
const { exec } = require('child_process');
const pool = require('./db');

const kafka = new Kafka({ clientId: 'trading-app', brokers: ['kafka:9092'] }); // ✅ 변경된 Kafka 브로커 주소
const consumer = kafka.consumer({ groupId: 'matching-engine-group' });

const run = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: 'orders', fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ message }) => {
            const order = JSON.parse(message.value.toString());
            console.log('📥 Received order from Kafka:', order);

            // ✅ 매칭 엔진 실행 (C++ 코드 실행, 경로 수정됨)
            exec('./matching_engine', (error, stdout, stderr) => {
                if (error) {
                    console.error(`❌ Error running matching engine: ${error.message}`);
                    return;
                }
                console.log(`✅ Matching Engine Output:\n${stdout}`);

                // ✅ 매칭된 주문 상태를 COMPLETED로 업데이트
                pool.query('UPDATE orders SET status = $1 WHERE id = $2', ['COMPLETED', order.id]);
            });
        },
    });
};

run().catch(console.error);
