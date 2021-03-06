import db from "../models/Index.js";
import { forbidden, notAthorized } from "./error_handler.js";
export const checkSigned = (req, res, next) => {
  console.log(req.session);
  if (!req.session.user) {
    console.log("로그인이 유효하지 않습니다");
    notAthorized(req, res);
  } else next();
};
export const checkAdmin = async (req, res, next) => {
  try {
    const loginUser = await db.User.findOne({
      where: { email: req.session.user.email },
    });
    if (!loginUser.authority) forbidden(req, res);
    else next();
  } catch (error) {
    notAthorized(req, res);
  }
  return;
};
