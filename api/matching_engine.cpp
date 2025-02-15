// matching_engine.cpp
#include <iostream>
#include <queue>
#include <vector>
#include <algorithm>

enum class OrderType { BUY, SELL };

struct Order {
    int id;
    OrderType type;
    double price;
    int quantity;
};

struct BuyOrderComparator {
    bool operator()(const Order& a, const Order& b) {
        // 매수 주문: 가격이 높은 주문이 우선
        return a.price < b.price;
    }
};

struct SellOrderComparator {
    bool operator()(const Order& a, const Order& b) {
        // 매도 주문: 가격이 낮은 주문이 우선
        return a.price > b.price;
    }
};

int main() {
    std::priority_queue<Order, std::vector<Order>, BuyOrderComparator> buyOrders;
    std::priority_queue<Order, std::vector<Order>, SellOrderComparator> sellOrders;

    // 예시 주문 추가
    buyOrders.push({1, OrderType::BUY, 100.0, 10});
    sellOrders.push({2, OrderType::SELL, 99.0, 5});
    sellOrders.push({3, OrderType::SELL, 101.0, 10});
    
    // 단순 매칭 로직: 가장 높은 매수 주문과 가장 낮은 매도 주문 비교
    while (!buyOrders.empty() && !sellOrders.empty()) {
        Order buy = buyOrders.top();
        Order sell = sellOrders.top();
        if (buy.price >= sell.price) {
            int tradeQuantity = std::min(buy.quantity, sell.quantity);
            std::cout << "Matched: Buy Order " << buy.id << " with Sell Order " 
                      << sell.id << " for " << tradeQuantity 
                      << " units at price " << sell.price << "\n";
            
            // 체결 후 잔여 수량 업데이트
            buyOrders.pop();
            sellOrders.pop();
            if (buy.quantity > tradeQuantity) {
                buy.quantity -= tradeQuantity;
                buyOrders.push(buy);
            }
            if (sell.quantity > tradeQuantity) {
                sell.quantity -= tradeQuantity;
                sellOrders.push(sell);
            }
        } else {
            // 매칭 조건이 안 맞으면 종료
            break;
        }
    }
    
    return 0;
}
