const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./db');  
const sendOrderToKafka = require('./kafkaProducer');


const app = express();
const port = 3000;

app.use(bodyParser.json());

app.get('/order', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch orders" });
    }
});

app.post('/order', async (req, res) => {
    const { type, price, quantity } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO orders (type, price, quantity, status) VALUES ($1, $2, $3, $4) RETURNING *',
            [type, price, quantity, 'PENDING']
        );

        const order = result.rows[0];
        await sendOrderToKafka(order); // ✅ Kafka로 주문을 전송
        res.json({ status: "Order received", order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to save order" });
    }
});


app.patch('/order/:id', async (req, res) => {
    const { status } = req.body; // "COMPLETED" 또는 "CANCELLED"
    const { id } = req.params;

    if (!["COMPLETED", "CANCELLED"].includes(status)) {
        return res.status(400).json({ error: "Invalid status value" });
    }

    try {
        const result = await pool.query(
            'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Order not found" });
        }
        res.json({ status: "Order updated", order: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update order status" });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

require('./kafkaConsumer'); // ✅ Kafka Consumer 실행 (매칭 엔진 자동 실행)
