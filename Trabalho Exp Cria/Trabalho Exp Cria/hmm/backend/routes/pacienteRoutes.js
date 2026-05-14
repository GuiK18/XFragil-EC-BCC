const express = require('express');

const router = express.Router();

const pacienteController =
    require('../controllers/pacienteController');

const {
    verificarPermissaoPaciente
} = require('../middlewares/auth');


// criar
router.post(
    '/',
    pacienteController.criarPaciente
);


// editar
router.put(
    '/:id',
    verificarPermissaoPaciente,
    pacienteController.editarPaciente
);


// deletar
router.delete(
    '/:id',
    verificarPermissaoPaciente,
    pacienteController.deletarPaciente
);

module.exports = router;