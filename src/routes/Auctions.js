const pool = require("../database/db_connection");
const { Auction_State, Auction_Type } = require("../status/AuctionStatus");

const Monitoring = (buyerid) => {
  //! 1. GET ALL THE AUCTIONS USER IS INTERACTING IN
  //! 2. GET ALL THE AUCTIONS Specific to Sellers in which USER IS INTERACTING IN (ordered by sellers)
  //! 3. GET ALL THE AUCTIONS Specific to Seller's Items in which USER IS INTERACTING IN (ordered by seller's item)
  //? 3. GET ALL THE AUCTIONS Specific to Categories in which USER IS INTERACTING IN (ordered by categories)
  //! 4. Check the data among the sellers
  //! 5. If User is interacting with many auctions of one specific seller and more than any other
  //! (it means he/she can be friend of the seller and helping in shill bidding creating disturbance for sight)
  //! 6. It will increase fake bid chances
  //! 7. Algorithm::
  //! select all bids of specific sellers
  //! for each seller (on which buyer has interacted with items more than n times)
  //! if buyer bids x% more on seller's auction than every other seller
  //! add x/n to fake bid chance
  //! After calculating fake bid chance, filter specific auction items of seller for that buyer and take (fakebidchange)% items from it.
  //! add the processed results to auctions
};

const ShowAuctions = async (req, res) => {
  try {
    const { buyerid } = req.headers;
    const id = parseInt(buyerid);
    if (isNaN(id)) {
      console.log("ERRORRR INVALIDD  id:", id);
      res.status(500).send({ data: "No conversations yet", response: false });
    } else {
      console.log(id, " is id");
      let query;
      let TempResult = [];
      let Auctions_ids = [];
      //   const { email, password } = req.headers;
      let type = req?.params?.type.toUpperCase();
      if (type !== "ALL" && type !== "PRIVATE") {
        //TODO replace auction_status='a' with auction_status='${AuctionState.Active}'
        query = `select * from bg_auction where auction_status='${Auction_State.ACTIVE}' and sellerid!=${id} and current_date < auction_expiry and auction_type='${Auction_Type[type]}';`;
      } else {
        if (type === "PRIVATE") {
          query = ``;
        } else {
          query = `select * from bg_auction where auction_status='${Auction_State.ACTIVE}' and sellerid!=${id} and current_date < auction_expiry and auction_type!='${Auction_Type.PRIVATE}';`;
        }
      }

      // ? CAN DO "TAKE ALL FROM BG_AUCTION , TAKE ALL FROM AUCTION_IMAGES. FILTER AUCTION IMAGES WITH AUCTION_ID OF RETRIEVED, THEN JOIN THEM"
      // select c.conversation_id,conversation_name from _users_in_conversation c left join _conversation on _conversation.conversation_id=c.conversation_id where userid=${id}
      await pool
        .query(query)
        .then(
          (result) => {
            // console.log(result.rows.length, " is len");
            result?.rows?.map((val) => TempResult.push(val));

            return TempResult;
          },
          (err) => {
            console.log("ERROR BROO");
            res.send({ response: false });
          }
        )
        .then(() => {
          private_query = `select auction_id from users_in_private where buyerid=${buyerid}`;
          return pool.query(private_query);
        })
        .then((result) =>
          result?.rows?.map((val) => "'" + val.auction_id + "'")
        )
        .then((values) => {
          if (values?.length <= 0 || !values) {
            return [];
          } else {
            //* values are auction ids of private auctions
            if (type !== "ALL") {
              priavte_auctions = `select * from bg_auction where auction_status='a' and auction_type='${Auction_Type[type]}' and auction_id in (${values})`;
            } else {
              priavte_auctions = `select * from bg_auction where auction_status='a' and auction_id in (${values})`;
            }
            return pool.query(priavte_auctions);
          }
        })
        .then((result) => {
          result?.rows?.map((val) => TempResult.push(val));

          return TempResult;
        })
        .then((val) => {
          Auctions_ids = val.map((it) => "'" + it.auction_id + "'");
          return Auctions_ids;
        })
        .then((val) => {
          bid_info = `select * from participants_info(ARRAY[${val}]) as
          (bid_id bigint,auction_id text,highest_price int
            ,bidder_id bigint,bid_stamp timestamp with time zone
            ,confirmed char,name text,number_of_participants bigint);`;
          return pool.query(bid_info);
        })
        .then((result) => {
          TempResult = TempResult.map((value) => {
            let item = result.rows.filter(
              (val) => val.auction_id === value.auction_id
            )[0];
            console.log(" ID IS ITEM FJF : \n", item, "\nID IS ITEM FJF ");
            return { ...value, bid_info: item };
          });
          return Auctions_ids;
        })
        .then((value) =>
          pool.query(
            `select * from auction_images where auction_id in (${value})`
          )
        )
        .then((result) => {
          // ! HERE PROCESSING will happen
          return TempResult.map((value) => {
            let items = result.rows.filter(
              (val) => val.auction_id === value.auction_id
            );
            return { ...value, images: items };
          });
        })
        .then((AllAuctions) =>
          AllAuctions.map((val) => {
            return {
              ...val,
              //! enabled means that if the auctions has become availabe as it will be active after 30mins
              enabled:
                val.auction_stamp.getTime() + 1 * 60 * 1000 <=
                new Date().getTime(),
            };
          })
        )
        .then((val) => res.send({ dataitems: val, response: true })) // DONE {Here the query is completed}
        //TODO ALSO ADD MONITORING ALGO AND THEN SEND FILTERED RESULTS
        .catch((err) => res.send({ response: false })); // ! If any error occurs
    }
  } catch (error) {
    res.status(500).send(error.message);
    console.log(error);
  }
};

// ! POST REQ
const PutAuctions = (req, res) => {
  try {
    let {
      sellerid,
      auction_type,
      item_name,
      item_desc,
      item_specs,
      item_category,
      base_price,
      charity_part,
      bid1,
      bid2,
      bid3,
      buynow_price,
      remaining_tokens,
      images, // ! IMAGE will contain URLS of images hosted on AWS s3
    } = req.body;

    console.log(bid1, bid2, bid3);
    const id = parseInt(sellerid);
    {
      // bid1 = parseInt(bid1);
      // bid2 = parseInt(bid2);
      // bid3 = parseInt(bid3);
      // buynow_price = parseInt(buynow_price);
      // base_price = parseInt(base_price);
    } // ? IF NEEDED
    if (isNaN(id)) {
      console.log("ERRORRR INVALIDD  id:", id);
      res.status(330).send({ data: "No conversations yet", response: false });
    } else {
      let query;
      let type = auction_type.toUpperCase();
      query = `INSERT INTO bg_auction VALUES (default,${id}, '${
        Auction_Type[type]
      }',default,
      '${item_name}','${item_desc}','${item_specs}','${item_category}',${base_price},${charity_part},default,${
        bid1 ? bid1 : 0
      },${bid2 ? bid2 : 0},${bid3 ? bid3 : 0},
      ${buynow_price ? buynow_price : 0},default) RETURNING auction_id;`;
      let Allsend = true;
      pool
        .query(query)
        .then((result) => result.rows[0])
        .then((value) => {
          return images.map((val, ind) => {
            console.log(" ind is  ", ind);
            img_query = `INSERT INTO auction_images values (default,'${value.auction_id}','${val}');`;
            return pool.query(img_query, (err, res) => {
              err ? (Allsend = false) : "";
            });
          });
        })
        .then(() => {
          upd_query = `update bg_user set tokens=${remaining_tokens} where userid=${sellerid}`;
          return pool.query(upd_query);
        })
        // .then(() => console.log("All sent is : " + Allsend))
        .then(() => res.send({ response: Allsend }));
    }
  } catch (error) {
    res.status(500).send(error.message);
    console.log(error.message);
  }
};

// for (let count = 0; count < data_response.length; count++) {
//     console.log("In for\n");
//     let uid = data_response[count]?.conversation_id;
//     if (uid) {
//       query = `select userid from _users_in_conversation where conversation_id=${uid}`;
//       await pool.query(query, (err, result) => {
//         console.log("====================================");
//         console.log("FOR", count, "\n", result?.rows, "\n", "FOR", count);
//         console.log("====================================");
//         result.rows.length >= 1
//           ?
//           : res.send({ data: "No conversations yet", response: false });
//       });
//     }
//   }

//
const ShowAuctionsSeller = async (req, res) => {
  try {
    const { sellerid } = req.headers;
    const id = parseInt(sellerid);
    if (isNaN(id)) {
      console.log("ERRORRR INVALIDD  id:", id);
      res.status(500).send({ data: "No conversations yet", response: false });
    } else {
      console.log(id, " is id");
      let query;
      let TempResult = [];
      let Auctions_ids = [];
      //   const { email, password } = req.headers;

      //TODO replace auction_status='a' with auction_status='${AuctionState.Active}'
      query = `select * from bg_auction where sellerid=${id}`;

      // ? CAN DO "TAKE ALL FROM BG_AUCTION , TAKE ALL FROM AUCTION_IMAGES. FILTER AUCTION IMAGES WITH AUCTION_ID OF RETRIEVED, THEN JOIN THEM"
      // select c.conversation_id,conversation_name from _users_in_conversation c left join _conversation on _conversation.conversation_id=c.conversation_id where userid=${id}
      await pool
        .query(query)
        .then(
          (result) => {
            // console.log(result.rows.length, " is len");
            result?.rows?.map((val) => TempResult.push(val));

            return TempResult;
          },
          (err) => {
            console.log("ERROR BROO");
            res.send({ response: false });
          }
        )
        .then((val) => {
          Auctions_ids = val.map((it) => "'" + it.auction_id + "'");
          return Auctions_ids;
        })
        .then((val) => {
          bid_info = `select * from participants_info(ARRAY[${val}]) as
          (bid_id bigint,auction_id text,highest_price int
            ,bidder_id bigint,bid_stamp timestamp with time zone
            ,confirmed char,name text,number_of_participants bigint);`;
          return pool.query(bid_info);
        })
        .then((result) => {
          TempResult = TempResult.map((value) => {
            let item = result.rows.filter(
              (val) => val.auction_id === value.auction_id
            )[0];
            // console.log(" ID IS ITEM FJF : \n", item, "\nID IS ITEM FJF ");
            return { ...value, bid_info: item };
          });
          return Auctions_ids;
        })
        .then((value) =>
          pool.query(
            `select * from auction_images where auction_id in (${value})`
          )
        )
        .then((result) => {
          // ! HERE PROCESSING will happen
          return TempResult.map((value) => {
            let items = result.rows.filter(
              (val) => val.auction_id === value.auction_id
            );
            return { ...value, images: items };
          });
        })
        .then((AllAuctions) =>
          AllAuctions.map((val) => {
            return {
              ...val,
              //! enabled means that if the auctions has become availabe as it will be active after 30mins
              enabled:
                val.auction_stamp.getTime() + 30 * 60 * 1000 <=
                new Date().getTime(),
            };
          })
        )
        .then((val) => res.send({ dataitems: val, response: true })) // DONE {Here the query is completed}
        .catch((err) => res.send({ dataitems: [], response: false })); // ! If any error occurs
    }
  } catch (error) {
    res.status(500).send(error.message);
    console.log(error);
  }
};
module.exports = { ShowAuctions, PutAuctions, ShowAuctionsSeller };
