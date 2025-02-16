const { Kafka } = require("kafkajs");
const { exec } = require("child_process");
const pool = require("./db");

const kafka = new Kafka({ clientId: "trading-app", brokers: ["kafka:9092"] });
const consumer = kafka.consumer({ groupId: "matching-engine-group" });

const run = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: "orders", fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ message }) => {
            try {
                const rawMessage = message.value.toString();
                
                // JSON 파싱 오류 방어
                if (!rawMessage.startsWith("{")) {
                    console.error("❌ Invalid JSON received, skipping:", rawMessage);
                    return;
                }

                const order = JSON.parse(rawMessage);
                console.log("📥 Received order from Kafka:", order);

                exec("./matching_engine", (error, stdout, stderr) => {
                    if (error) {
                        console.error(`❌ Error running matching engine: ${error.message}`);
                        return;
                    }
                    console.log(`✅ Matching Engine Output:\n${stdout}`);

                    pool.query("UPDATE orders SET status = $1 WHERE id = $2", ["COMPLETED", order.id]);
                });

            } catch (err) {
                console.error("❌ JSON parsing error, skipping message:", message.value.toString());
            }
        },
    });
};

run().catch(console.error);
