// index.js
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());

// 주문 제출 엔드포인트
app.post('/order', (req, res) => {
  const order = req.body;
  // 실제 환경에서는 매칭 엔진과 통신하거나 Kafka를 통해 전달
  console.log('Received order:', order);
  res.json({ status: 'Order received', orderId: Math.floor(Math.random() * 10000) });
});

// 주문 상태 조회 엔드포인트 (예시)
app.get('/status/:orderId', (req, res) => {
  const orderId = req.params.orderId;
  // 실제 주문 처리 결과를 조회하는 로직 필요
  res.json({ orderId: orderId, status: 'Filled' });
});

app.listen(port, () => {
  console.log(`API server is running at http://localhost:${port}`);
});
