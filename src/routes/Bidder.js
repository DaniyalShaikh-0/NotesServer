const pool = require("../database/db_connection");
const PutBid = (req, res) => {
  try {
    const { auction_id, bid_price, userid, remaining_tokens } = req.body;
    const bidder_id = parseInt(userid);
    if (isNaN(bidder_id)) {
      console.log("ERRORRR INVALIDD  bidder_id:", bidder_id);
      res.status(500).send({ data: "No conversations yet", response: false });
    } else {
      let query = `insert into bg_bid values (default,'${auction_id}',${bid_price},${bidder_id},default,default)`;
      pool
        .query(query)
        .then(
          () =>
            (token_update = `update bg_user set tokens=${remaining_tokens} where userid=${bidder_id}`)
        )
        .then((query) => pool.query(query))
        .then(() => res.send({ response: true }))
        .catch(() => res.send({ response: false }));
    }
    return;
  } catch (error) {
    res.status(500).send(error.message);
    console.log(error.message);
  }
};

module.exports = PutBid;
