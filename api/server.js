const express = require('express'); 
const bodyParser = require('body-parser');
const pool = require('./db');
const sendOrderToKafka = require('./kafkaProducer');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const server = require('http').createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: "*", // ✅ 모든 출처 허용 (필요하면 수정 가능)
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log("✅ Client connected to WebSocket");

    socket.emit("message", { message: "Welcome to the trading platform!" });
});

function sendOrderUpdate(order) {
    io.emit("order_update", order);
}

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
        await sendOrderToKafka(order);
        sendOrderUpdate(order);

        res.json({ status: "Order received", order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to save order" });
    }
});

server.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});
