DROP DATABASE IF EXISTS BANCO;
CREATE DATABASE BANCO;
USE BANCO;

CREATE TABLE Conta(
	IDConta INT AUTO_INCREMENT PRIMARY KEY,
    CPF VARCHAR(14) NOT NULL UNIQUE,
    NomeConta VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL UNIQUE,
    HashSenha VARCHAR(255) NOT NULL,
    role ENUM('ADM', 'DOC', 'SECRETARIA', 'INATIVO') DEFAULT 'INATIVO'
);

CREATE TABLE Paciente(
	IDPaciente INT AUTO_INCREMENT PRIMARY KEY,
    CPF BIGINT NOT NULL UNIQUE,
    NomePaciente VARCHAR(255) NOT NULL,
    Sexo ENUM('F', 'M') NOT NULL,
    Nascimento DATE NOT NULL
);

CREATE TABLE Acompanhante(
	IDAcompanhante INT AUTO_INCREMENT PRIMARY KEY,
    NomeAcompanhante VARCHAR(255),
    Contato VARCHAR(20),
    Relacionamento VARCHAR(255),
    IDPaciente INT,
    FOREIGN KEY (IDPaciente)
		REFERENCES Paciente(IDPaciente)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE ProfissionaisPorPaciente(
	IDConta INT,
    IDPaciente INT,
    PRIMARY KEY (IDConta, IDPaciente),
    FOREIGN KEY (IDConta)
		REFERENCES Conta(IDConta)
        ON UPDATE CASCADE,
        FOREIGN KEY (IDPaciente)
        REFERENCES Paciente(IDPaciente)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE Formulario(
	IDForm INT AUTO_INCREMENT PRIMARY KEY,
    Score INT,
    Observacoes VARCHAR(255),
    IDPaciente INT,
    FOREIGN KEY (IDPaciente)
		REFERENCES Paciente(IDPaciente)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE LogAtividade(
	IDLog INT AUTO_INCREMENT PRIMARY KEY,
    Mudanca VARCHAR(255),
    DataLog TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    IDConta INT,
    FOREIGN KEY (IDConta)
		REFERENCES Conta(IDConta)
        ON UPDATE CASCADE
);

CREATE INDEX idx_profissional
ON ProfissionaisPorPaciente(IDConta);

CREATE INDEX idx_paciente
ON ProfissionaisPorPaciente(IDPaciente);

CREATE INDEX idx_nomepaciente
ON Paciente(NomePaciente);

SELECT * FROM Conta;

