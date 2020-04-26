import * as express from "express";
import User from "../lib/User";

const router = express.Router();

router.post('/', async (req, res, next) => {
  const user = await User.createUser(req.body);
  res.send(user);
});

export default router;
