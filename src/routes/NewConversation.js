const pool = require("../database/db_connection");
const NewConversation = async (req, res) => {
  try {
    let userid = parseInt(req.params.userid);
    console.log("user id is :   ", userid);
    if (isNaN(userid)) {
      console.log("ERRORRR INVALIDD  id:", userid);
      res.status(500).send({ data: "No conversations yet", response: false });
    } else {
      const query = `select firstname,lastname,userid,gender from _user where userid!=${userid};`;
      pool.query(query, (err, result) => {
        console.log("\n\n\n\n", result, "\n\n\n\n");
        result?.rows?.length !== 0
          ? res.send({ data: result?.rows, response: true })
          : res.send({ data: "No New Users", response: false });
      });
    }
  } catch (error) {
    res.status(500).send(error.message);
    console.log(error.message);
  }
};

const NewMessage = async (req, res) => {
  const { userid } = req.params;
  const { receiverid, message_text, message_type, conv_name } = req.body;
  let conversation_array = [];
  let conversation_id;
  let query = `insert into _conversation values (default,'${conv_name}') returning conversation_id;`;
  pool.query(query, (err, result) => {
    console.log(err ? err : "SuccessFully Inserted with id : ", result?.rows);
    err
      ? res.send({
          data: "Not registered!! Response time out",
          response: false,
        })
      : (conversation_id = result.rows[0].conversation_id);

    console.log("====================================");
    console.log(conversation_id);
    console.log("====================================");
    //   insert into _users_in_conversation(conversation_id,userid) values (1002,1016);
    query = `insert into _users_in_conversation(conversation_id,userid) values (${conversation_id},${userid});
      insert into _users_in_conversation(conversation_id,userid) values (${conversation_id},${receiverid});`;
    pool.query(query, (err, result) => {
      console.log(err ? err : "SuccessFully Inserted");
      err
        ? res.send({
            data: "Not registered!! Response time out",
            response: false,
          })
        : console.log("====================================");

      query = `insert into _message(senderid,conversation_id,message_text,
        message_type,image,image_type,message_time,message_date)
        values (${userid},${conversation_id},'${message_text}','${message_type}',default
        ,default,default,default) returning message_id;`;
      pool.query(query, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send({ data: "Message has been sent", response: true });
        }
      });
    });
  });
};

module.exports = { NewConversation, NewMessage };
