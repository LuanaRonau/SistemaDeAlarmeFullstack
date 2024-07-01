const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


let porta = 8090;
app.listen(porta, () => {
    console.log('Servidor em execução na porta: ' + porta);
});

const sqlite3 = require('sqlite3');
var db = new sqlite3.Database('./Registros.db', (err) => {
    if (err) {
        console.log('ERRO: não foi possível conectar ao SQLite.');
        throw err;
    }
    console.log('Conectado ao SQLite!');
});

db.run(`CREATE TABLE IF NOT EXISTS registros 
        (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE,
        distancia REAL)`, 
        [], (err) => {
    if (err) {
        console.log('ERRO: não foi possível criar tabela.');
        throw err;
    }
});

// Envio pelo embarcado da distância lida pelo sensor ultrassônico
app.post('/Logging', (req, res, next) => {
    console.log('Recebendo dados para registro:', req.body); // Log dos dados recebidos
    db.run(`INSERT INTO registros(distancia) VALUES(?)`, 
         [req.body.distancia], (err) => {
        if (err) {
            console.log("Erro ao registrar distância: " + err.message);
            res.status(500).send('Erro ao registrar distância.');
        } else {
            console.log('Distância registrada com sucesso!');
            res.status(200).send('Distância registrada com sucesso!');
        }
    });
});

// Frontend solicita os dados registrados para exibir ao usuário
app.get('/Logging', (req, res, next) => {
    db.all(`SELECT * FROM registros`, [], (err, result) => {
        if (err) {
             console.log("Erro: " + err.message);
             res.status(500).send('Erro ao obter dados.');
        } else {
            res.status(200).json(result);
        }
    });
});
