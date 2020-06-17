const path = require('path');
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '124578369',
    database: 'db_eng_esamc'
});

connection.connect(function (error) {
    if (!!error) console.log(error);
    else console.log('Database Connected!');
})

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    let sql = "SELECT * FROM tb_contato";
    let query = connection.query(sql, (err, rows) => {
        if (err) throw err;
        res.render('index', {
            title: 'Cadastro',
            users: rows
        });
    });
});

app.get('/add', (req, res) => {
    res.render('add', {
        title: 'Novo Usuário'
    });
});

app.post('/save', (req, res) => {
    let data = { nome: req.body.nome, email: req.body.email, cpf: req.body.cpf };
    let sql = "INSERT INTO tb_contato SET ?";
    let query = connection.query(sql, data, (err, results) => {
        if (err) throw err;
        res.redirect('/');
    });
});

app.get('/edit/:userId', (req, res) => {
    const userId = req.params.userId;
    let sql = `SELECT * FROM tb_contato WHERE id = ${userId}`;
    let query = connection.query(sql, (err, result) => {
        if (err) throw err;
        res.render('edit', {
            title: 'Editar Usuário',
            user: result[0]
        });
    });
});

app.post('/update', (req, res) => {
    const userId = req.body.id;
    let sql = "UPDATE tb_contato SET nome='" + req.body.nome + "',  email='" + req.body.email + "',  cpf='" + req.body.cpf + "' WHERE id =" + userId;
    let query = connection.query(sql, (err, results) => {
        if (err) throw err;
        res.redirect('/');
    });
});

app.get('/delete/:userId', (req, res) => {
    const userId = req.params.userId;
    let sql = `DELETE FROM tb_contato WHERE id = ${userId}`;
    let query = connection.query(sql, (err, result) => {
        if (err) throw err;
        res.redirect('/');
    });
});

app.listen(3000, () => {
    console.log('Server running at port 3000')
});