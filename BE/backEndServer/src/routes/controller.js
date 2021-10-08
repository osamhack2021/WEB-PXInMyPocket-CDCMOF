import express from "express";
import expressSession from "express-session";
import home from "./user_manage/home.js";
import product from "./product_manage/product.js";
import admin from "./admin_manage/admin.js";
import freeboard from "./freeboard_manage/freeboard.js";
import * as HttpError from "./error_handler.js";

var router = express.Router();

//expressSession 미들웨어 추가
router.use(
  expressSession({
    secret: "my key",
    resave: true,
    saveUninitialized: true,
  })
);

//home으로 이동
router.get("/", HttpError.badRequest);
router.use("/home", home);
router.use("/product", product);
router.use("/admin", admin);
router.use("/freeboard", freeboard);
router.use("/*", HttpError.badRequest);
export default router;