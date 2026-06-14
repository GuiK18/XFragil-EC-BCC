require("dotenv").config();

const express = require("express");
const cors = require('cors');

const authRoutes =
require("./routes/authRoutes");

const contaRoutes =
require("./routes/contaRoutes");

const pacienteRoutes =
require("./routes/pacienteRoutes");

const relatorioRoutes =
require("./routes/relatorioRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);

app.use("/contas", contaRoutes);

app.use("/pacientes", pacienteRoutes);

app.use("/relatorios", relatorioRoutes);

app.listen(
    process.env.PORT,
    () => {
        console.log(
            "Servidor rodando"
        );
    }
);