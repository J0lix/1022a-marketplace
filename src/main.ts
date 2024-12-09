// Importa as bibliotecas necessárias
import express from 'express'; // Framework para criar APIs e gerenciar rotas
import mysql from 'mysql2/promise'; // Biblioteca para conexão com banco de dados MySQL (modo assíncrono)
import cors from 'cors'; // Middleware para permitir requisições de diferentes origens (CORS)

// Cria uma aplicação Express
const app = express();

// Configura o middleware para interpretar JSON no corpo das requisições
app.use(express.json());

// Configura o middleware CORS para permitir requisições de origens diferentes
app.use(cors());

// Rota GET: Retorna todos os livros do banco de dados
app.get("/livros", async (req, res) => {
    try {
        // Cria uma conexão com o banco de dados
        const connection = await mysql.createConnection({
            host: process.env.dbhost ? process.env.dbhost : "localhost", // Configura o host (usa variável de ambiente ou padrão "localhost")
            user: process.env.dbuser ? process.env.dbuser : "root", // Configura o usuário do banco de dados
            password: process.env.dbpassword ? process.env.dbpassword : "", // Configura a senha do banco
            database: process.env.dbname ? process.env.dbname : "banco1022a", // Define o nome do banco de dados
            port: process.env.dbport ? parseInt(process.env.dbport) : 3306 // Define a porta do banco (3306 padrão do MySQL)
        });

        // Executa uma query SQL para buscar todos os livros
        const [result, fields] = await connection.query("SELECT * FROM livros");

        // Encerra a conexão com o banco
        await connection.end();

        // Retorna o resultado da consulta como resposta
        res.send(result);
    } catch (e) {
        // Trata erros e retorna status 500 com uma mensagem de erro
        res.status(500).send("Server ERROR");
    }
});

// Rota POST: Insere um novo livro no banco de dados
app.post("/livros", async (req, res) => {
    try {
        // Cria uma conexão com o banco de dados
        const connection = await mysql.createConnection({
            host: process.env.dbhost ? process.env.dbhost : "localhost",
            user: process.env.dbuser ? process.env.dbuser : "root",
            password: process.env.dbpassword ? process.env.dbpassword : "",
            database: process.env.dbname ? process.env.dbname : "banco1022a",
            port: process.env.dbport ? parseInt(process.env.dbport) : 3306
        })
        const {id,titulo,autor,preco,imagem} = req.body
        const [result, fields] = 
                    await connection.query("INSERT INTO livros VALUES (?,?,?,?,?)",
                            [id,titulo,autor,preco,imagem])
        await connection.end()
        res.status(201).send(result)
    } catch (e) {
        // Loga o erro no console e retorna status 500 com uma mensagem de erro
        console.log(e);
        res.status(500).send("Server ERROR");
    }
});

// Inicializa o servidor na porta 8000
app.listen(8000, () => {
    console.log("Iniciei o servidor"); // Loga uma mensagem indicando que o servidor está em execução
});
