const router = require("express").Router();

const auth =
require("../middlewares/authMiddleware");

const role =
require("../middlewares/roleMiddleware");

const controller =
require("../controllers/relatorioController");

router.get(
    "/:idPaciente",
    auth,
    role("ADM","DOC"),
    controller.gerar
);

module.exports = router;