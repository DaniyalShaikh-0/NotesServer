// (req, res) => {
//     const id = req.params.id;

//   //   res.send();
//   }

// ! MONTIORING ALGORITHM

const pool = require("../database/db_connection");
const RetrieveMessages = (req, res) => {
  try {
    console.log(req.params);
    let cid = parseInt(req.params.cid);
    if (isNaN(cid)) {
      console.log("ERRORRR INVALIDD  cid:", cid);
      res.status(500).send({ data: "No conversations yet", response: false });
    } else {
      //   console.log(id, typeof id, NaN === NaN);
      let query = `SELECT message_id,senderid,message_text,message_type,
      message_date,firstname||' '||lastname as fullname FROM _message 
      left  join _user on senderid=userid where conversation_id=${cid} 
      order by message_id`;
      // select c.conversation_id,conversation_name from _users_in_conversation c left join _conversation on _conversation.conversation_id=c.conversation_id where userid=${id}
      let data_response = [];
      //   let rowsRetrieved = true;
      pool.query(query, (err, result) => {
        //QUERY TO RETRIEVE CONVERSATIONS//

        console.log("=============1st query=======================");
        console.log("\n\n", result?.rows, "\n\n");
        console.log("====================================");
        console.log(
          err
            ? err
            : result.rows.length >= 1
            ? "SuccessFully Retrieved ddd"
            : "no conversation yet"
        );
        result.rows.length >= 1
          ? res.send(
              result.rows.map((val) => {
                if (val.senderid === req.params.uid) {
                  return { ...val, userView: 0 };
                } else {
                  return { ...val, userView: 1 };
                }
              })
            )
          : res
              .status(500)
              .send({ data: "No conversations yet", response: false });
      });
    }
    // async.forEachSeries()
    // await console.log(data_response, "is data respone");

    return;
    // new Promise
    // res.send(data_response);
  } catch (error) {
    res.status(500).send(error.message);
    console.log(error.message);
  }
};

const SaveMessages = (req, res) => {
  try {
    console.log(req.params);
    // let { senderid, message_text, message_type } = req.body;
    console.log("====================================");
    console.log(req.body);
    console.log("====================================");
    let cid = parseInt(req.params.cid);
    let { senderid, message_text, message_type } = req.body;
    senderid = parseInt(senderid);
    if (isNaN(cid) || isNaN(senderid)) {
      console.log("ERRORRR INVALIDD  cid:", cid);
      res.status(500).send({ data: "NotSent", response: false });
    } else {
      let query = `insert into _message(senderid,conversation_id,message_text,message_type,image,image_type,message_time,message_date)
        values (${senderid},${cid},'${message_text}','${message_type}',default,default,default,default) returning message_id;`;
      pool.query(query, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send({ data: "Message has been sent", response: true });
        }
      });
      console.log("====================================");
    }
  } catch (error) {
    res.status(500).send(error.message);
    console.log(error.message);
  }
};

module.exports = { RetrieveMessages, SaveMessages };
const SaveMANYLOOPMessages = (req, res) => {
  try {
    console.log(req.params);
    // let { senderid, message_text, message_type } = req.body;
    console.log("====================================");
    console.log(req.body);
    console.log("====================================");
    let cid = parseInt(req.params.cid);
    // senderid = parseInt(senderid);
    console.log(req.body.length);
    if (isNaN(cid)) {
      console.log("ERRORRR INVALIDD  cid:", cid);
      res.status(500).send({ data: "NotSent", response: false });
    } else {
      let isAll = true;
      for (let i = 0; i < req.body.length && isAll; i++) {
        console.log("====================================");
        console.log("Function running with ind : ", i);
        console.log("====================================");
        let { senderid, message_text, message_type } = req.body[i];
        senderid = parseInt(senderid);
        let query = `insert into _message(senderid,conversation_id,message_text,message_type,image,image_type,message_time,message_date)
          values (${senderid},${cid},'${message_text}','${message_type}',default,default,default,default) returning message_id;`;
        pool.query(query, (err, result) => {
          if (err) {
            console.log(err);
            isAll = false;
          } else {
            console.log(result.rows[0]);
          }
        });
        console.log("====================================");
      }

      if (isAll === true) {
        res.send("All queries inserted");
      } else {
        res.status(202).send("Some queries were not inserted");
      }
    }
  } catch (error) {
    res.status(500).send(error.message);
    console.log(error.message);
  }
};
