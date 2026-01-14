const express = require('express');
const path = require( 'path');
const mongoose = require('mongoose')
var bodyParser = require('body-parser');

const app = express();

const Posts = require('./posts.js');

mongoose.connect('mongodb+srv://ninjolas:gPhVrslZY4f7Ades@teste.z16kqae.mongodb.net/teste_notícias').then(()=>{
    console.log('Conectado ao banco de dados');
}).catch((err)=>{
    console.log(err.message);
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use('/public', express.static(path.join(__dirname,'public')));
app.set('views', path.join(__dirname , '/pages'));

app.get("/", async(req,res) =>{
  

    if(req.query.busca == null){
        let posts = await Posts.find({}).sort({'_id':-1}).exec()
        posts = posts.map((val)=>{
            return {
                titulo:val.titulo,
                imagem:val.imagem,
                categoria:val.categoria,
                conteudo:val.conteudo,
                slug:val.slug,
                descricaoCurta : val.conteudo.substring(0,100)
            }
        })
        console.log(posts[0]);
        res.render('home', {posts:posts});
    }
    else{
        res.render("busca", {});
    }
})

app.get("/:slug", (req,res) => {
    res.render('single',{});
});

app.listen(5010,() => {
    console.log('Servidor rodando');
});