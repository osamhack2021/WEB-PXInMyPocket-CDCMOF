import express from "express";
var router = express.Router();
import db from "../../models/Index.js";
import { checkSigned } from "../middleWare.js";
import { badRequest } from "../error_handler.js";

router.use("/", checkSigned);

//GET /notice
//주문자 아이디에 해당하는 모든 notice를 보냅니다.
router.get("/", function (req, res) {
  db.Notice.findAll({
   where: 
	  {
	   owner_id: req.query.owner_id,
	}
  })
    .then((item) => {
      res.status(200).json({ data: item });
      console.log("sending notice success", item);
    })
    .catch((err) => {
      res.status(406).json({ error: "failed to send notice" });
      console.log(err);
    });
});

//POST /notice/toggle-readed
//현재 readed값이 false 이면
readed를 true로 수정합니다. ture면 false로
router.post("/toggle-readed",(req,res) => {
	  db.Notice.findOne({
		  where:   { notice_id: req.body.notice_id }
	  })
	.then((item) => {
		  item.update({
			  readed: !item.readed,
		  })
		  .then(() => {res.status(200).json({ toggle: true }) });
	})
	.catch((err) => {
        res.status(406).json({ error: "failed to toggle readed" });
	  })
})

//DELETE /notice
router.delete("/", function (req, res) {
  db.Notice.destory({
   where: 
	  {
	   notice_id: req.query.notice_id,
	   readed: true,
	}
  })
    .then((item) => {
      res.status(200).json({ data: item });
      console.log("sending notice success", item);
    })
    .catch((err) => {
      res.status(406).json({ error: "failed to send notice" });
      console.log(err);
    });
});
router.all("/*", badRequest);
export default router;
