const Auction_Type = {
  LIVE: "l",
  PRIVATE: "x",
  PUBLIC: "p",
};
const Auction_State = {
  ACTIVE: "a",
  SOLD: "s",
  INACTIVE: "i",
  PENDING: "p",
  // TODO more status if needed
};

Object.freeze(Auction_State);
Object.freeze(Auction_Type);

module.exports = { Auction_State, Auction_Type };
