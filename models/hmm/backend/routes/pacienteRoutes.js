const router = require("express").Router();

const auth =
require("../middlewares/authMiddleware");

const role =
require("../middlewares/roleMiddleware");

const controller =
require("../controllers/pacienteController");

router.post(
    "/",
    auth,
    role("ADM","DOC"),
    controller.criar
);

router.get(
    "/meus",
    auth,
    role("ADM","DOC"),
    controller.meusPacientes
);

module.exports = router;