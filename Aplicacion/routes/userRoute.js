const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/userController");

router
  .route("/")
  .get(userControllers.index)
  .post(userControllers.newUser);

router.route("/login").post(userControllers.userlogin);

router.route("/all").get(userControllers.all);
// .post(userControllers.index)

router
  .route("/:userid")
  .get(userControllers.getUser)
  .put(userControllers.updateUser)
  /*.patch(userControllers.updateUser)*/
  .delete(userControllers.deleteUser);

router.route("/quiz").post(userControllers.sendQuiz);

/*router.route('/:userid/programs')
    .get(userControllers.getPrograms)

router.route('/:userid/:programid')
    .post(userControllers.addProgram)*/

module.exports = router;
