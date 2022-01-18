// const { types } = require("pg");
const pool = require("../database/db_connection");

const Put_verify = async (req, res) => {
  let All_sent = true;
  try {
    const { userObj, images_for_verification } = req.body;
    // console.log(req.body);
    const {
      name,
      email,
      password,
      phone,
      gender,
      userType,
      area,
      city,
      fullAddress,
    } = userObj;
    let { userid } = req.params;
    console.log(userObj);
    userid = parseInt(userid);
    console.log("id is  : ", userid);
    let img_query;
    const Queries = images_for_verification.reduce((prev, curr) => {
      return prev
        .then(() => {
          img_query = `insert into bg_user_verify values (default,${userid},'${curr}')`;
          return pool.query(img_query);
        })
        .then(
          (fulfilled) => {},
          (rejected) => {
            All_sent = false;
          }
        );
    }, Promise.resolve());
    Queries.then(() =>
      userType === "b"
        ? `update bg_user set phone_number='${phone}' 
    , area='${area}', city='${city}'
     , fulladdress='${fullAddress}' where userid=${userid}`
        : `update bg_user set area='${area}', city='${city}'
         , fulladdress='${fullAddress}' where userid=${userid}`
    )
      .then((query) => pool.query(query))
      .then(() => res.send({ response: All_sent }));
  } catch (error) {
    console.log(" IS MESSAGE\n", error.message, "\n IS MESSAGE");
  }
};

const SignUp = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      gender,
      userType,
      area,
      city,
      fullAddress,
    } = req.body;
    console.log(
      name,
      "\n",
      email,
      "\n",
      password,
      "\n",
      phone,
      "\n",
      gender,
      "\n",
      userType,
      "\n",
      area,
      "\n",
      city,
      "\n",
      fullAddress
    );
    //! Name is an object

    const { firstName, midName, lastName } = name;

    // DONE : SIGNUP QUERY FOR BACKEND
    const query = `
    insert into bg_user values 
    (default,'${
      userType //?Buyer 'b' or Seller 's'
    }',
    '${firstName}','${midName}','${lastName}','${email}','${phone}','${gender}','${city}','${area}','${fullAddress}','${password}',default,default) returning userid`;
    pool.query(query, (err, result) => {
      console.log(err ? err : "SuccessFully Inserted with id : ", result?.rows);
      err
        ? res.send({
            data: "Not registered!! Response time out",
            response: false,
          })
        : res.send({ data: result?.rows[0], response: true });

      console.log("\n\n____________________Signed Up___________________\n");
    });
  } catch (error) {
    res.status(500).send(error.message);
    console.log(error.message);
  }
};

// DONE : LOGIN QUERY BACKEND
const LogIn = async (req, res) => {
  try {
    const { identity, password } = req.headers;
    // console.log(" Received from App : ", identity, password);
    const query = `select distinct * from bg_user where (email='${identity}' or phone_number='${identity}') and password='${password}'; `;
    // console.log(query);
    pool.query(query, (err, result) => {
      // console.log("\n\n\n\n", result, "\n\n\n\n");
      result?.rows?.length >= 1 // !change to ===1
        ? res.send({ data: result.rows[0], response: true })
        : res.send({ data: "No email found", response: false });

      console.log("\n\n____________________Logged In___________________\n");
    });
  } catch (error) {
    res.status(500).send(error.message);
    // console.log(error.message);
  }
};

module.exports = { LogIn, SignUp, Put_verify };
