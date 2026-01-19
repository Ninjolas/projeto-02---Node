const express = require('express');
const path = require( 'path');
const mongoose = require('mongoose')
var bodyParser = require('body-parser');

const app = express();

const Posts = require('./posts.js');

var session = require('express-session');

mongoose.connect('mongodb+srv://ninjolas:gPhVrslZY4f7Ades@teste.z16kqae.mongodb.net/teste_notícias').then(()=>{
    console.log('Conectado ao banco de dados');
}).catch((err)=>{
    console.log(err.message);
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'keyboard cat',
    cookie: {maxAge : 60000}
}))

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
                descricaoCurta : val.conteudo.substring(0,100),
                views: val.views
            }
        })
        
        let postsTop = await Posts.find({}).sort({'views':-1}).limit(3).exec()
        postsTop = postsTop.map((val) => {
            return {
                titulo:val.titulo,
                imagem:val.imagem,
                categoria:val.categoria,
                conteudo:val.conteudo,
                slug:val.slug,
                descricaoCurta : val.conteudo.substring(0,100),
                views: val.views
            }
        })
        //console.log(posts[0]);
        res.render('home', {posts:posts, postsTop: postsTop});
    }
    else{

        let posts = await Posts.find({titulo: {$regex: req.query.busca, $options: "i"}})
        posts = posts.map((val)=>{
            return {
                titulo:val.titulo,
                imagem:val.imagem,
                categoria:val.categoria,
                conteudo:val.conteudo,
                slug:val.slug,
                descricaoCurta : val.conteudo.substring(0,100),
                views: val.views
            }
        })
        res.render("busca", {posts:posts, contagem:posts.length});
    }
})

app.get("/:slug", async (req,res) => {
    let noticias = await Posts.findOneAndUpdate({slug: req.params.slug}, {$inc: {views: 1}}, {new: true});
    if(noticias != null){
        let postsTop = await Posts.find({}).sort({'views':-1}).limit(3).exec()
        postsTop = postsTop.map((val) => {
            return {
                titulo:val.titulo,
                imagem:val.imagem,
                categoria:val.categoria,
                conteudo:val.conteudo,
                slug:val.slug,
                descricaoCurta : val.conteudo.substring(0,100),
                views: val.views
            }
        })
        //console.log(noticias);
        res.render('single',{noticia:noticias, postsTop: postsTop});
    }
    else{
        res.redirect("/")
    }
    
});

var usuarios = [
    {
        login: 'Nícolas',
        senha: "123456789"
    }
]

app.post('/admin/login', (req,res)=>{
    usuarios.map(function(val){
        if(val.login == req.body.login && val.senha == req.body.senha){
            req.session.login = "Nícolas";
            
        }
    })
    res.redirect('/admin/login')
})

app.get('/admin/login', (req,res)=>{
    if(req.session.login == null){
        res.render('admin-login');
        
    }else{
        res.render('admin-panel');
    }
})

app.listen(5010,() => {
    console.log('Servidor rodando');
});