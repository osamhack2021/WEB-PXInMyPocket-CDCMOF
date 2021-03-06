// </product/*> 에서는 물품정보를 제공하고 주문기능을 수행합니다.
import express from "express";
var router = express.Router();
import db from "../../models/Index.js";
import { checkSigned } from "../middleWare.js";
import { badRequest } from "../error_handler.js";

router.use("/", checkSigned);
// GET /cart
// 현재 로그인 되어있는 유저정보의 장바구니 아이템들을 보냅니다.
router.get("/", async (req, res) => {
  try {
    const items = await db.Cart.findAll({
      where: {
        owner_email: req.session.user.email,
      },
    });
    let items2 = [];
    for (let i = 0; i < items.length; i++) {
      await db.Product.findOne({
        where: {
          product_id: items[i].added_product_id,
        },
      })
        .then((item) => {
          items2.push(item);
        })
        .catch((err) => {
          console.log(err);
          res.status(404).json({ error: "matching product not found" });
        });
    }
    res.status(200).json({ data: items, info: items2 });
  } catch (error) {
    res.status(404).json({ error: "matching cart_id is not found" });
  }
});
/*
router.get("/", async (req, res) => {
  try {
    const items = await db.Cart.findAll({
      where: {
        owner_email: req.session.user.email,
      },
    });
    console.log(items.length);
    let cartlist = [];
    let item = null;
    for (let i = 0; i < items.length; i++) {
      try {
        item = await db.Product.findOne({
          where: { product_id: items[i].added_product_id },
        });
        cartlist.push({ data: cartlist, info: item });
      } catch (error) {
        console.log(error);
      }
    }
    res.status(200).json({ data: cartlist });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "matching cart_id is not found" });
  }
});
*/
// POST /cart
// 장바구니에 물품을 추가합니다.
router.post("/", async (req, res) => {
  db.Cart.create({
    quantity: req.body.quantity,
    added_product_id: req.body.added_product_id,
    owner_email: req.session.user.email,
    total_price: req.body.total_price,
  })
    .then(() => {
      res.status(200).json({ createSuccess: true });
    })
    .catch(() => {
      res.status(406).json({ createSuccess: false });
    });
});

// DELETE /cart
// 장바구니에 물품을 삭제합니다.
router.delete("/", async (req, res) => {
  db.Cart.destory({
    where: {
      cart_id: req.body.id,
    },
  })
    .then(() => {
      res.status(200).json({ deleteSuccess: true });
    })
    .catch(() => {
      res.status(406).json({ deleteSuccess: false });
    });
});

// POST /cart/edit
router.post("/edit", async (req, res) => {
  try {
    const item = await db.Cart.findOne({ where: { cart_id: req.body.id } });
    await item.update({ quantity: req.body.quantity });
    res.status(200).json({ editSuccess: true });
  } catch (error) {
    res.status(406).json({ findSuccess: false });
  }
});
router.all("/*", badRequest);
export default router;
