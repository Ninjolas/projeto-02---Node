const express = require('express');
const path = require( 'path');
var bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use('/public', express.static(path.join(__dirname,'public')));
app.set('views', path.join(__dirname , '/pages'));

app.get("/", (req,res) =>{
    console.log(req.query);

    if(req.query.oloco == null){
        res.render('home', {});
    }
    else{
        res.send("Você está buscando: "+req.query.oloco)
    }
})

app.get("/:slug", (req,res) => {
    res.send(req.params.slug);
});

app.listen(5010,() => {
    console.log('Servidor rodando');
});