const { Kafka } = require('kafkajs');
const { exec } = require('child_process');
const pool = require('./db');
const path = require('path');

const kafka = new Kafka({ clientId: 'trading-app', brokers: ['trustin-kafka-1:9092'] }); // ✅ Kafka 브로커 주소
const consumer = kafka.consumer({ groupId: 'matching-engine-group' });

const run = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: 'orders', fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ message }) => {
            const order = JSON.parse(message.value.toString());
            console.log('📥 Received order from Kafka:', order);

            // ✅ Docker 환경에서 실행 가능한 절대 경로 설정
            const matchingEnginePath = path.resolve(__dirname, '../matching_engine.exe'); 

            // ✅ 매칭 엔진 실행 (C++ 코드 실행)
            exec(matchingEnginePath, async (error, stdout, stderr) => {
                if (error) {
                    console.error(`❌ Error running matching engine: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.error(`⚠️ Matching Engine stderr: ${stderr}`);
                }
                console.log(`✅ Matching Engine Output:\n${stdout}`);

                // ✅ 매칭된 주문 상태를 COMPLETED로 업데이트
                try {
                    await pool.query('UPDATE orders SET status = $1 WHERE id = $2', ['COMPLETED', order.id]);
                    console.log(`✅ Order ${order.id} updated to COMPLETED`);
                } catch (dbError) {
                    console.error(`❌ Database update error: ${dbError.message}`);
                }
            });
        },
    });
};

run().catch(console.error);
