const pool = require("../database/db_connection");
const UsersInPrivate = (req, res) => {
  try {
    const { auction_id, userid } = req.headers;
    const buyer_id = parseInt(userid);
    if (isNaN(buyer_id)) {
      console.log("ERRORRR INVALIDD  buyer_id:", buyer_id);
      res.status(500).send({ data: "No conversations yet", response: false });
    } else {
      let query = `INSERT INTO users_in_private VALUES (default, '${auction_id}', ${buyer_id}) returning private_id;`;
      // console.log(query);
      pool
        .query(query)
        .then((result) =>
          res.send({ insertId: result?.rows[0]?.private_id, response: true })
        )
        .catch((err) => res.send({ err, response: false }));
    }
    return;
  } catch (error) {
    res.status(500).send(error.message);
    console.log(error.message);
  }
};

const RemoveAddedUser = (req, res) => {
  let { auction_id, userid } = req.headers;
  console.log("====================================");
  // console.log(private_id);
  console.log("====================================");
  userid = parseInt(userid);
  let query = `delete from users_in_private where auction_id='${auction_id}' and buyerid=${userid}`;
  pool
    .query(query)
    .then(() => res.send({ response: true }))
    .catch(() => res.send({ response: false }));
};

const ShowCurrentAddedUsers = (req, res) => {
  const { auction_id } = req.params;
  console.log(auction_id);
  let query = `select userid,firstname,midname,lastname,email from users_in_private inner join bg_user on buyerid=userid where usertype='b' and auction_id='${auction_id}'`;
  pool
    .query(query)
    .then((result) =>
      result.rows.map((val) => {
        return {
          buyer_id: val.userid,
          email: val.email,
          name: [val.firstname, val.midname, val.lastname].join(" ").trim(), //*    TO SAVE FROM UNDEFINED VALUES
        };
      })
    )
    .then((items) => res.send({ data: items, response: true }))
    .catch((err) => res.send({ err, response: false }));
};

const ShowUsersToSeller = (req, res) => {
  try {
    let { seller_id, auction_id } = req.headers;
    // console.log(seller_id, auction_id);
    seller_id = parseInt(seller_id);
    if (isNaN(seller_id)) {
      console.log("ERRORRR INVALIDD  seller_id:", seller_id);
      res.status(500).send({ data: "No conversations yet", response: false });
    } else {
      let query = `select userid,firstname,midname,lastname,email from bg_user where usertype='b' and userid!=${seller_id} and userid not in (select buyerid from users_in_private where auction_id='${auction_id}');`;
      // let query = `select userid,firstname,midname,lastname,email from bg_user where verified='y' and userid!=${seller_id} and userid not in (select buyerid from users_in_private where auction_id='${auction_id}');`;
      console.log(query); //! change verify to S
      pool
        .query(query)
        .then((result) =>
          result.rows.map((val) => {
            return {
              buyer_id: val.userid,
              email: val.email,
              name: [val.firstname, val.midname, val.lastname].join(" ").trim(), //*    TO SAVE FROM UNDEFINED VALUES
            };
          })
        )
        .then((items) => res.send({ data: items, response: true }))
        .catch((err) => res.send({ err, response: false }));
    }
    return;
  } catch (error) {
    res.status(500).send(error.message);
    console.log(error.message);
  }
};

module.exports = {
  UsersInPrivate,
  ShowUsersToSeller,
  ShowCurrentAddedUsers,
  RemoveAddedUser,
};
