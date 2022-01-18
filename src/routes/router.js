const express = require("express");
const Router = express.Router();
const signup = "/signup";
const login = "/login";
const SendMail = require("./VerifyEmail");
const SendSms = require("./Sms_Api");
const { LogIn, SignUp, Put_verify } = require("./Authentication");
const { ShowAuctions, PutAuctions, ShowAuctionsSeller } = require("./Auctions");
const PutBid = require("./Bidder");
const {
  UsersInPrivate,
  ShowUsersToSeller,
  ShowCurrentAddedUsers,
  RemoveAddedUser,
} = require("./UserInfo");
const Practice = require("../../Practice");

Router.post(signup, SignUp); // DONE
Router.get(login, LogIn); // DONE
Router.get("/auction/private/adduser/", UsersInPrivate); //DONE
Router.get("/auction/private/allusers", ShowUsersToSeller); //DONE
Router.get("/auction/private/:auction_id/currentusers", ShowCurrentAddedUsers); //DONE
Router.delete("/auction/private/removeuser", RemoveAddedUser); //DONE
Router.post("/:userid/verify/email", SendMail); //DONE
Router.post("/:userid/verify/phone", SendSms); //DONE
Router.post("/:userid/verify", Put_verify); //DONE
Router.get("/auction/show/:type", ShowAuctions); // DONE
Router.get("/auction/seller/show", ShowAuctionsSeller); // DONE
Router.post("/auction/put/", PutAuctions); //DONE
Router.post("/bid/new/", PutBid); //DONE
Router.get("/practice", Practice);
//TODO Router.post("/:userid/verifyImages", Put_verify);
// OTHER ROUTES TO BE ADDED HERE (CHAT, MESSAGE, CONVERSATION, ETC)

module.exports = Router;
