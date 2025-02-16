#include <iostream>
#include <vector>
#include <algorithm>

struct Order {
    int id;
    std::string type;
    double price;
    int quantity;
    std::string status;
};

void matchOrders(std::vector<Order> &buyOrders, std::vector<Order> &sellOrders) {
    std::sort(buyOrders.begin(), buyOrders.end(), [](Order a, Order b) { return a.price > b.price; });
    std::sort(sellOrders.begin(), sellOrders.end(), [](Order a, Order b) { return a.price < b.price; });

    for (auto &buy : buyOrders) {
        for (auto &sell : sellOrders) {
            if (buy.price >= sell.price && buy.quantity > 0 && sell.quantity > 0) {
                int matchQuantity = std::min(buy.quantity, sell.quantity);
                buy.quantity -= matchQuantity;
                sell.quantity -= matchQuantity;

                std::cout << "Matched: Buy Order " << buy.id << " with Sell Order " << sell.id
                          << " for " << matchQuantity << " units at price " << sell.price << std::endl;

                if (buy.quantity == 0) buy.status = "COMPLETED";
                if (sell.quantity == 0) sell.status = "COMPLETED";
            }
        }
    }
}

int main() {
    std::vector<Order> buyOrders = {{1, "BUY", 101, 5, "PENDING"}, {2, "BUY", 99, 10, "PENDING"}};
    std::vector<Order> sellOrders = {{3, "SELL", 100, 5, "PENDING"}, {4, "SELL", 102, 10, "PENDING"}};

    matchOrders(buyOrders, sellOrders);

    return 0;
}
