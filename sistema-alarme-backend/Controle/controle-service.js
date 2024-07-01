const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


let porta = 8080;
app.listen(porta, () => {
    console.log('Servidor em execução na porta: ' + porta);
});

const sqlite3 = require('sqlite3');
var db = new sqlite3.Database('./Config.db', (err) => {
    if (err) {
        console.log('ERRO: não foi possível conectar ao SQLite.');
        throw err;
    }
    console.log('Conectado ao SQLite!');
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS configuracao (
          id INTEGER PRIMARY KEY,
          distancia_minima REAL)`, (err) => {
      if (err) {
          console.log('ERRO: não foi possível criar tabela.');
          throw err;
      }

      // Verifica se a tabela está vazia e insere uma configuração padrão
      db.get('SELECT COUNT(*) AS count FROM configuracao', (err, row) => {
          if (err) {
              console.log('ERRO: não foi possível verificar a tabela.');
              throw err;
          }

          if (row.count === 0) {
              db.run(`INSERT INTO configuracao (distancia_minima) VALUES (10)`, (err) => {
                  if (err) {
                      console.log('ERRO: não foi possível inserir configuração padrão.');
                      throw err;
                  }
                  console.log('Configuração padrão inserida com sucesso!');
              });
          }
      });
  });
});


// Configurações vindas do frontend
app.patch('/Controle', (req, res, next) => {
  db.run(`UPDATE configuracao SET distancia_minima = COALESCE(?,distancia_minima) WHERE id = 1`,
         [req.body.distancia_minima], function(err) {
          if (err){
              console.log("Erro ao alterar dados: " + err.message);
              res.status(500).send('Erro ao alterar dados.');
          } else {
              res.status(200).send('Configuração alterada com sucesso!');
          }
  });
});

// Configurações requisitadas pelo embarcado
app.get('/Controle', (req, res, next) => {
    db.all(`SELECT distancia_minima FROM configuracao`, [], (err, result) => {
        if (err) {
             console.log("Erro: " + err.message);
             res.status(500).send('Erro ao obter dados.');
        } else {
            res.status(200).json(result);
        }
    });
});
