import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000"); // ✅ `ws://` 대신 `http://` 사용

function App() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    socket.on("order_update", (data) => {
      console.log("📩 New Order Update:", data);
      setOrders((prevOrders) => [...prevOrders, data]);
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div>
      <h1>Trading Orders</h1>
      <ul>
        {orders.map((order, index) => (
          <li key={index}>
            {order.type} {order.quantity} @ {order.price} - {order.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
