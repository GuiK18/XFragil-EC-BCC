const router = require("express").Router();

const auth =
require("../middlewares/authMiddleware");

const role =
require("../middlewares/roleMiddleware");

const controller =
require("../controllers/contaController");

router.post(
    "/",
    //auth,
    //role("ADM"),
    controller.criar
);

router.get(
    "/profissionais",
    auth,
    role("ADM"),
    controller.listarProfissionais
);

module.exports = router;