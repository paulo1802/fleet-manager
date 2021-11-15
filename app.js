const express = require('express')
const bodyParser = require("body-parser");
const request = require("request");
const mongoose = require("mongoose");
const { static } = require('express');
const app = express();
const erro = "";
const OSedit = "";


app.set('view engine', 'ejs');

app.use(static("public"));
app.use(bodyParser.urlencoded({extended:true}));



app.listen(process.env.PORT);
//const port = 3000;
//app.listen(port, function() {
   // console.log(`Example app listening at http://localhost:${port}`);
  //})



  
app.get("/", function(req,res) {
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req, res) {
  var email = req.body.email;
  var senha = req.body.password;

  if((email =="gerente@gmail.com" && senha =="gerenteFrota") || (email == "trabalhador@gmail.com"  && senha == "trabalhadorFrota")){
    res.redirect("/home");
  } else {
    res.redirect("/erro");
  }
  
  
  
  
})


//Aqui começa o contato com o back para /home

mongoose.connect("mongodb://localhost:27017/fleetManagerDB");

const itemsSchema = {
  ID: String,
  numeroDeOrdem: String,
  linha: String,
  disponibilidade: String,
  IDos: String,
  autor: String,
  responsavel: String,
  descricao: String,
  status: String,
  tipoManutencao: String,
  sistema: String,
  componente: String,
  descricao: String,
  comentario: String,
  DataDeAbertura:String,
  DataConclusao: String
  


};

const Item = mongoose.model("Item", itemsSchema);

const Item1 = new Item ({
  ID: "1",
  numeroDeOrdem: "200",
  linha: "Jaboatão (Parador)",
  disponibilidade: "disponível",
  IDos: "1111",
  autor: "mecanico",
  responsavel: "eletricista",
  descricao: "descricao",
  status:"Aberta",
  tipoManutencao: "preventiva",
  sistema: "elétrica",
  componente: "farol",
  descricao: "Troca de farol anual",
  comentario: "N/A",
  DataDeAbertura:"23/09/2021",
  DataConclusao: "26/09/2021"

  

})

  
const defaultItems = [Item1];

app.get("/home", function(req,res) {

  Item.find({}, function(err, foundItems){
  if(foundItems.length===0) {
    Item.insertMany(defaultItems, function(err) {
  if (err) {
    console.log(err);
  } else{
    console.log("tudo ok!");
  }
});
res.redirect("/home");
  } else {
    res.render("home",{newListItems:foundItems});
  }
    
  })
  
});

app.post("/home", function (req,res) {
  Item.find({}, function(err, foundItems){
    
      let item= getRandomInt(1,10000);;
    
    let itemA = req.body.newItemA;
    let itemB = req.body.newItemB;
    if (itemA != "" && itemB != "") {
   
    const intem1 = new Item( {
      ID: item,
      numeroDeOrdem: itemA,
      linha: itemB,
      disponibilidade: "Disponível",

  
  
  
    })
  
    intem1.save();

    res.redirect("/home");
  }

  });

})

app.post("/deleteBus", function(req,res) {
  const checkedItemId = req.body.deleteButton;

  
  Item.findByIdAndRemove(checkedItemId, function(err) {
    if(!err) {
      console.log("deletado com sucesso!");
    }
  })

  res.redirect("/home");
})

//Aqui começa para OS

app.get("/OS", function(req,res) {


  

  Item.find({"IDos": {"$ne": null}}, function(err, foundItems){
    
      
  res.render("OS.ejs",{newListItems:foundItems});
      
    })
 // res.render("OS",{newListItems:foundItems});
  });
  


app.post("/OS", function (req,res) {
  let numero = req.body.newItem;


 
  
  let itemA = getRandomInt(1,10000);

const filter = {$and:[{ID:numero},{"IDos": null}]}
//caso primeira OS
const update = {IDos:itemA};


  Item.findOneAndUpdate(filter, update, function(err) {
    if(!err) {
      console.log("ok");
    }
  }) 

  //caso segunda OS em diante
 /* const update2 = {IDos:itemA};
  const filter2 = {$and:[{ID:numero},{"OS.IDos": {"$ne": ''}}]}
 
  Item.findOneAndUpdate(filter2, {$push: {OS:update2}}, function(err) {
    if(!err) {
      console.log("ok");
    }
  })   */


  
  res.redirect("/OS");
  
 
  
}) 

app.post("/OSedit", function(req,res) {
  var idFilter = req.body.editButton;
  
  Item.find({"_id" : idFilter} , function(err, foundItems){ //"_id" : new ObjectIdidFilter}
   
    res.render("OSedit.ejs",{newListItems: foundItems });
  });
 
})

app.post("/OSedit2" , function(req,res) {
  // { OS: [{ autor: valor }] }  essa aqui exclui a OS toda.
  //{ $pull: { OS: { autor: valor } } }
  let OS = req.body.IDos;
  let filter = {"IDos": OS};

  let campos = ["DataDeAbertura","DataConclusao","autor", "responsavel", "status", "tipoManutencao","sistema", "componente","descricao","comentario", "disponibilidade"]
  let DataDeAbertura = req.body.DataDeAbertura;
  let DataConclusao = req.body.DataConclusao;
  let autor = req.body.autor;
  let responsavel = req.body.responsavel;
  let status = req.body.status;
  let tipoManutencao = req.body.tipoManutencao;
  let sistema = req.body.sistema;
  let componente = req.body.componente;
  let descricao = req.body.descricao;
  let comentario = req.body.comentario;
  let disponibilidade = req.body.disponibilidade;
  let valoresCampos = [DataDeAbertura,DataConclusao,autor, responsavel, status, tipoManutencao,sistema, componente,descricao,comentario, disponibilidade];

  var valoresPreenchidos = [];
  var camposPreenchidos = [];
  
  
      function associaIndex(index) {
      camposPreenchidos.push(valoresCampos[index]);
      valoresPreenchidos.push(campos[index]);
      }
  
  function verificaElementos(elemento, index, array) {
      if(elemento !="" && elemento!=null && elemento != " ") {
        associaIndex(index);  
      }
  
    
    
  }

  valoresCampos.forEach(verificaElementos);
  
//console.log(camposPreenchidos); // armazenando valor da variavel
//console.log(valoresPreenchidos); // armazenando nome do campo
  
  
  for(let j = 0; j<=valoresPreenchidos.length; j++ ) {
    let valorCampo = camposPreenchidos[j];
  
    let nomeCampo = valoresPreenchidos[j];
 
    //{ valorCampotring : nomeCampo }

   let update = {};

   switch (nomeCampo) {
     case "DataDeAbertura":
     update = {"DataDeAbertura": valorCampo };
     break;
     case "DataConclusao":
     update = {"DataConclusao": valorCampo };
     break;
     case "autor":
     update = {"autor": valorCampo };
     break;
     case "responsavel":
     update = {"responsavel": valorCampo };
     break;
     case "status":
     update = {"status": valorCampo };
     break;
     case "tipoManutencao":
     update = {"tipoManutencao": valorCampo };
     break;
     case "sistema":
     update = {"sistema": valorCampo };
     break;
     case "componente":
     update = {"componente": valorCampo };
     break;
      case "descricao":
      update = {"descricao": valorCampo };
      break;
      case "comentario":
     update = {"comentario": valorCampo };
     break;
     case "disponibilidade":
     update = {"disponibilidade": valorCampo };
     break;

   }
  Item.findOneAndUpdate(filter,  update, function(err) {
    
    if(err) {
      console.log(err);
    }
    
  })
  }
 var camposPreenchidos =[];
 var valoresPreenchidos =[];
  res.redirect("/OS");

})

app.post("/OSdelete" , function(req,res) {
  let OS = req.body.IDos;
  let update = {
  "IDos": null,
  "autor": "",
  "responsavel": "",
  "descricao": "",
  "status": "",
  "tipoManutencao": "",
  "sistema": "",
  "componente": "",
  "descricao": "",
  "comentario": "",
  "DataDeAbertura":"",
  "DataConclusao": ""

  }
  Item.findOneAndUpdate({"IDos": OS}, update, function(err) {
    if(!err) {
      console.log("comunicação com banco ok");
    }
    res.redirect("/OS");

  })
   
})



app.get("/sobre", function (req,res) {
  Item.find({}, function(err, foundItems){
    res.render("sobre",{newListItems:foundItems})
  })
})

app.get("/kanban", function (req,res) {
  Item.find({}, function(err, foundItems){
    res.render("kanban",{newListItems:foundItems})
  })
})
app.get("/erro", function(req,res) {
  res.render("erro",{variavel: erro});
})

app.post("/erro", function(req,res) {
  res.redirect("/");
})

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}