CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    type VARCHAR(10),
    price NUMERIC,
    quantity INTEGER,
    status VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
