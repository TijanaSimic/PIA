const express= require('express');
const router = express.Router();
const mongojs=require('mongojs');
const db= mongojs('mongodb+srv://tijana:tiksi123456@rasadnik-d4pvx.mongodb.net/Rasadnik?retryWrites=true&w=majority',['poljoprivrednici','admini','zahtevi','preduzeca','narudzbine','prodavnica', 'komentari','ocene','rasadnici','sadnice','magacini']);
const nodemailer=require('nodemailer')

router.post('/poljoprivrednik', (req,res,next)=> {
    

    var polj=req.body;
    db.poljoprivrednici.findOne({username:polj.username, password:polj.password},(err,data)=> {
        if(err) res.send(err);
        res.json(data);
    })

})

router.post('/preduzece', (req,res,next)=> {
    
    var pred=req.body;
    db.preduzeca.findOne({username:pred.username, password:pred.password},(err,data)=> {
        if(err) res.send(err);
        res.json(data);
    })

})

router.post('/admin', (req,res,next)=> {
    
    var admin=req.body;
    db.admini.findOne({username:admin.username, password:admin.password},(err,data)=> {
        if(err) res.send(err);
        res.json(data);
    })

})

router.get('/zahtevi',(req,res,next) => {
    
    db.zahtevi.find((err,zahtevi)=>{
        if(err) res.send(err);
        res.send(zahtevi);
    })

})

router.post('/add/poljoprivrednik',(req,res,next)=> {

    var polj=req.body;
    //nisam proveravala da li su pojedinacna polja null
    db.poljoprivrednici.save(polj, (err,polj)=> {
        if(err) res.send(err);
        res.json(polj)
    })
})

router.post('/add/preduzece',(req,res,next)=> {

    var polj=req.body;
    //nisam proveravala da li su pojedinacna polja null
    db.preduzeca.save(polj, (err,polj)=> {
        if(err) res.send(err);
        res.json(polj)
    })
})

router.post('/add/admin',(req,res,next)=> {

    var admin=req.body;
    //nisam proveravala da li su pojedinacna polja null
    db.admini.save(admin, (err,admin)=> {
        if(err) res.send(err);
        res.json(admin)
    })
})

router.get('/delete/:id',(req,res,next)=>{ //brisanje zahteva iz tabele zahteva
    db.zahtevi.remove({_id:mongojs.ObjectId(req.params.id)},(err,data)=> {
        if(err) res.send(err);
        res.json(data);
    })
})

router.get('/poljoprivrednik/delete/:username',(req,res,next)=>{  
    db.poljoprivrednici.remove({username:req.params.username},(err,data)=> {
        if(err) res.send(err);
        res.json(data);
    })
})

router.get('/preduzece/delete/:username',(req,res,next)=>{ //brisanje zahteva iz tabele zahteva
    db.preduzeca.remove({username:req.params.username},(err,data)=> {
        if(err) res.send(err);
        res.json(data);
    })
})

router.get('/admin/delete/:username',(req,res,next)=>{ 
    db.admini.remove({username:req.params.username},(err,data)=> {
        if(err) res.send(err);
        res.json(data);
    })
})


router.get('/poljoprivrednik/:username',(req,res,next)=> {
    
    
    db.poljoprivrednici.findOne({username:req.params.username},(err,data)=> {
        if(err) res.send(err);
        res.json(data);
    })

})

router.get('/preduzece/:username',(req,res,next)=> {
    
    db.preduzeca.findOne({username:req.params.username},(err,data)=> {
        if(err) res.send(err);
        res.json(data);
    })

})

router.get('/admin/:username',(req,res,next)=> {
    
    db.admini.findOne({username:req.params.username},(err,data)=> {
        if(err) res.send(err);
        res.json(data);
    })

})
router.get('/zahtev/:username',(req,res,next)=> {
    
    db.zahtevi.findOne({username:req.params.username},(err,data)=> {
        if(err) res.send(err);
        res.json(data);
    })

})

router.get('/sve/narudzbine/:preduzece',(req,res,next)=>{
    db.narudzbine.find({preduzece:req.params.preduzece},(err,data)=> {
        if(err) res.send(err);
        res.json(data);
    })
})


router.get('/narudzbine/:preduzece',(req,res,next)=>{
    db.narudzbine.find({preduzece:req.params.preduzece,poslata:0},(err,data)=> {
        if(err) res.send(err);
        res.json(data);
    })
})

router.get('/narudzbine/poslate/:preduzece',(req,res,next)=>{
    db.narudzbine.find({preduzece:req.params.preduzece,poslata:1},(err,data)=> {
        if(err) res.send(err);
        res.json(data);
    })
})

router.post('/narudzbine/delete', (req, res, next) => {

    db.narudzbine.remove({nazivProizvoda:req.body.naziv,poljoprivrednik:req.body.poljoprivrednik,
    preduzece:req.body.preduzece},(err,data)=> {
        if(err) res.send(err);
        res.json(data);
    })
}) 

router.post('/add/zahtev', (req,res,next)=> {
    var zahtev=req.body;
    //nisam proveravala da li su pojedinacna polja null
    db.zahtevi.save(zahtev, (err,zahtev)=> {
        if(err) res.send(err);
        res.json(zahtev)
    })
})

router.post('/narudzbine/add',(req,res,next)=> {
    var zahtev=req.body;
    db.narudzbine.save(zahtev, (err,zahtev)=> {
        if(err) res.send(err);
        res.json(zahtev)
    })
})
 

router.get('/delete/nar/:id',(req,res,next)=>{  
    db.narudzbine.remove({_id:mongojs.ObjectId(req.params.id)},(err,data)=> {
        if(err) res.send(err);
        res.json(data);
    })
})

router.get('/narudzbine/delete/:id',(req,res,next)=>{
  
        db.narudzbine.remove({_id:req.params.id},(err,issue)=>{
        if(err) res.send(err);
 

        res.json(issue);
    })
});

router.get('/prodavnica',(req,res,next) => {
    
    db.prodavnica.find((err,zahtevi)=>{
        if(err) res.send(err);
        res.send(zahtevi);
    })

})

router.get('/proizvodi/:username',(req,res,next)=> {
    
    db.prodavnica.find({preduzece:req.params.username},(err,data)=> {
        if(err) res.send(err);
        res.json(data);
    })

})
   
router.get('/komentari/:preduzece/:naziv',(req,res,next)=> {
    
    db.komentari.find({preduzece:req.params.preduzece,nazivProizvoda:req.params.naziv},(err,data)=> {
        if(err) res.send(err);
        res.json(data);
    })

}) 
router.get('/ocene/:preduzece/:naziv',(req,res,next)=> {
    
    db.ocene.find({preduzece:req.params.preduzece,nazivProizvoda:req.params.naziv},(err,data)=> {
        if(err) res.send(err);
        res.json(data);
    })

})


router.get('/proizvodi/:preduzece/:naziv',(req,res,next)=> {
     
    db.prodavnica.findOne({preduzece:req.params.preduzece,nazivProizvoda:req.params.naziv},(err,data)=> {
        if(err) res.send(err);
        res.json(data);
    })

})   




router.post('/add/proizvod', (req,res,next)=> {

    var proizvod=req.body;
    db.prodavnica.save(proizvod, (err,proizvod)=> {
        if(err) res.send(err);
        res.json(proizvod)
    })
})


router.get('/hello/:ime',(req,res,next)=> {

  milisek=new Date().getTime()-31*24*60*60*1000
      db.narudzbine.aggregate([
 
        {$match: {datumNarucivanja: {$gte:  new Date(new Date(milisek).getTime()-new Date(milisek).getTimezoneOffset()*60000)}}},
        {$match: {preduzece: {$eq:req.params.ime}}},
        { $group : {
            _id : { year: { $year: "$datumNarucivanja" } , month: { $month: "$datumNarucivanja" }, day: { $dayOfMonth: "$datumNarucivanja" }},
            count: { $sum: 1 }
            }},
            {$sort:{_id:1}}
    
     ], (err, data) => {
         if(err) res.send(err);
         res.json(data)
     })

})
 

 

router.get('/pr/delete/:preduzece/:naziv',(req,res,next)=>{  
    db.prodavnica.remove({preduzece:req.params.preduzece,nazivProizvoda:req.params.naziv},(err,data)=> {
        if(err) res.send(err);
        res.json(data);
    })
})

router.post('/proizvod/azuriranje',(req,res,next)=> {

    
    db.prodavnica.findAndModify({
        query:{preduzece:req.body.preduzece,nazivProizvoda:req.body.naziv},
       update: { $inc: {kolicina:parseInt(req.body.kolicina),cenaPoKomadu:parseInt(req.body.cena)}
       },
       new: true
         },  (err, data) =>{
       if (err) res.send(err);
               res.json(data);
           });
})


router.get('/rasadnici/:username',(req,res,next)=> {
    
    db.rasadnici.find({poljoprivrednik:req.params.username},(err,data)=> {
        if(err) res.send(err);
        res.json(data);
    })

})



router.post('/add/rasadnik', (req,res,next)=> {

     
    var rasadnik=req.body;
    rasadnik.emailPoslat=0;
    rasadnik.datumOsnivanja=new Date()
    db.rasadnici.save(rasadnik, (err,rasadnik)=> {
        if(err) res.send(err);
        res.json(rasadnik)
    })
})
router.post('/add/komentar', (req,res,next)=> {

     
    var komentar=req.body;
    db.komentari.save(komentar, (err,komentar)=> {
        if(err) res.send(err);
        res.json(komentar)
    })
})

router.post('/nar/polj', (req,res,next)=> {
     
    var nar=req.body;
    db.narudzbine.findOne({nazivProizvoda:nar.proizvod, preduzece:nar.preduzece,poljoprivrednik:nar.poljoprivrednik},(err,data)=> {
        if(err) res.send(err);
        res.json(data);
    })

})


router.post('/kom/polj', (req,res,next)=> {
    
    var nar=req.body;
    db.komentari.findOne({nazivProizvoda:nar.proizvod, preduzece:nar.preduzece,poljoprivrednik:nar.poljoprivrednik},(err,data)=> {
        if(err) res.send(err);
        res.json(data);
    })

})


router.post('/ocene/polj', (req,res,next)=> {
    
    var ocena=req.body;
    db.ocene.findOne({nazivProizvoda:ocena.proizvod, preduzece:ocena.preduzece,poljoprivrednik:ocena.poljoprivrednik},(err,data)=> {
        if(err) res.send(err);
        res.json(data);
    })

})
router.post('/add/ocena', (req,res,next)=> {

     
    var komentar=req.body;
    db.ocene.save(komentar, (err,komentar)=> {
        if(err) res.send(err);
        res.json(komentar)
    })
})
 
router.post('/nar/status',(req,res,next)=> {
 
    db.narudzbine.findAndModify({
        query:{_id:mongojs.ObjectId(req.body._id)},
       update: { $set: {status:req.body.status}
       },
       new: true
         },  (err, data) =>{
       if (err) res.send(err);
               res.json(data);
           });
})


router.get('/nar/datum/:id',(req,res,next)=> {
    
    db.narudzbine.findAndModify({
        query:{_id:mongojs.ObjectId(req.params.id)},
       update: { $set: {datumNarucivanja:new Date(new Date().getTime()-new Date().getTimezoneOffset()*60*1000)}
       },
       new: true
         },  (err, data) =>{
       if (err) res.send(err);
               res.json(data);
           });
})

router.post('/pr/azuriranje/kolicina',(req,res,next)=> {
 
    db.prodavnica.findAndModify({
        query:{_id:mongojs.ObjectId(req.body._id)},
       update: { $inc: {kolicina:req.body.kolicina}
       },
       new: true
         },  (err, data) =>{
           //  console.log(data)
       if (err) res.send(err);
               res.json(data);
           });
})

router.get('/t/:id/:temp',(req,res,next)=> {

    
    db.rasadnici.findAndModify({
        query:{_id:mongojs.ObjectId(req.params.id)},
       update: { $inc: {temperatura:mongojs.Double(req.params.temp)}
       },
       new: true
         },  (err, data) =>{
           //  console.log(data)
       if (err) res.send(err);
               res.json(data);
           });
})

router.get('/voda/:id/:voda',(req,res,next)=> {

    
    db.rasadnici.findAndModify({
        query:{_id:mongojs.ObjectId(req.params.id)},
       update: { $inc: {kolicinaVode:parseInt(req.params.voda)}
       },
       new: true
         },  (err, data) =>{
          //   console.log(data)
       if (err) res.send(err);
               res.json(data);
           });
})

router.get('/rasadnici/id/:id',(req,res,next)=> {
  
    db.rasadnici.findOne({_id:mongojs.ObjectId(req.params.id)},(err,data)=> {
        if(err) res.send(err);
        res.json(data);
    })

})

router.get('/sadniceRasadnika/:id',(req,res,next)=> {
 
    db.sadnice.find({idRasadnika:req.params.id},(err,data)=> {
        if(err) res.send(err);
        res.json(data);
    })

})

router.get('/sadnica/:id',(req,res,next)=> {
 
    db.sadnice.find({_id:mongojs.ObjectId(req.params.id)},(err,data)=> {
        if(err) res.send(err);
        res.json(data);
    })

})

router.get('/magacin/:id',(req,res,next)=> {
 
    db.magacini.find({idRasadnika:req.params.id},(err,data)=> {
        if(err) res.send(err);
        res.json(data);
    })

})

router.get('/magacin/preparati/:id',(req,res,next)=> {
 
    db.magacini.find({idRasadnika:req.params.id,vrsta:1},(err,data)=> {
        if(err) res.send(err);
        res.json(data);
    })

})

router.get('/magacin/sadnice/:id',(req,res,next)=> {
 
    db.magacini.find({idRasadnika:req.params.id,vrsta:0},(err,data)=> {
        if(err) res.send(err);
        res.json(data);
    })

})

router.get('/napredovanje/:id/:napredovanje',(req,res,next)=> {
 
   
    db.sadnice.findAndModify({
        query:{_id:mongojs.ObjectId(req.params.id)},
       update: { $inc: {napredovanje:parseInt(req.params.napredovanje)}
       },
       new: true
         },  (err, data) =>{
           //  console.log('data je',data)
       if (err) res.send(err);
               res.json(data);
           });
})

router.get('/pr/ko/:id/:kolicina',(req,res,next)=> {
 
    
    db.magacini.findAndModify({
        query:{_id:mongojs.ObjectId(req.params.id)},
       update: { $inc: {kolicina:parseInt(req.params.kolicina)}
       },
       new: true
         },  (err, data) =>{
           //  console.log(data)
       if (err) res.send(err);
               res.json(data);
           });
})
router.get('/magacin/delete/:id',(req,res,next)=>{
       
        db.magacini.remove({_id:mongojs.ObjectId(req.params.id)},(err,issue)=>{
        if(err) res.send(err);
        res.json(issue);
    })
});

router.get('/sadnice/delete/:id',(req,res,next)=>{
    
    db.sadnice.remove({_id:mongojs.ObjectId(req.params.id)},(err,issue)=>{
    if(err) res.send(err);
    res.json(issue);
})
});


router.post('/narudzbine/magacin',(req,res,next)=> {
    
    db.narudzbine.find({poljoprivrednik:req.body.poljoprivrednik,
        status:{$ne:"isporučena"},
    mestoRasadnika:req.body.mestoRasadnika,nazivRasadnika:req.body.nazivRasadnika},(err,data)=> {
        if(err) res.send(err);
        res.json(data);
    })

})

router.get('/nar/istiid/:identifikator/:polj',(req,res,next)=> {
 
        db.narudzbine.find({identifikatorPorudzbine:parseInt(req.params.identifikator),
                   poljoprivrednik:req.params.polj },(err,data)=> {
            if(err) res.send(err);
            res.json(data);
        })
    
    
})

router.post('/nid',(req,res,next)=> {
 
    db.narudzbine.find({identifikatorPorudzbine:parseInt(req.body.identifikator),
               poljoprivrednik:req.body.poljoprivrednik,
            preduzece:req.body.preduzece },(err,data)=> {
        if(err) res.send(err);
        res.json(data);
    })


})

router.get('/nar/identif/:id',(req,res,next)=> {
    
    db.narudzbine.findAndModify({
        query:{_id:mongojs.ObjectId(req.params.id)},
       update: { $set: {identifikatorPorudzbine:null}
       },
       new: true
         },  (err, data) =>{
       if (err) res.send(err);
               res.json(data);
           });
})
 

router.post('/dodavanje/sadnice', (req,res,next)=> {
 
    let obj = {
         
        naziv:req.body.naziv,
        proizvodjac:req.body.proizvodjac,
        napredovanje:0,
        ukupanBrojDana:req.body.ukupanBrojDana,
        datumSadjenja:new Date(),
        poljoprivrednik:req.body.poljoprivrednik,
        idRasadnika:req.body.idRasadnika,
         flagZaPorukuNaDijalogu:req.body.flagZaPorukuNaDijalogu

    }
    db.sadnice.save(obj, (err,obj)=> {
        if(err) res.send(err);
        res.json(obj)
    })
})

router.get('/nar/poljoprivrednik/:polj',(req,res,next)=> {
 
    db.narudzbine.find({poljoprivrednik:req.params.polj },(err,data)=> {
        if(err) res.send(err);
        res.json(data);
    })


})

router.post('/add/magacin',(req,res,next)=> {

  
    var polj=req.body;
    //nisam proveravala da li su pojedinacna polja null
    db.magacini.save(polj, (err,polj)=> {
        if(err) res.send(err);
        else {
         
        }
        res.json(polj)
    })
})
 
router.get('/r/:polj/:naziv',(req,res,next)=> {
    
    db.rasadnici.findOne({naziv:req.params.naziv,poljoprivrednik:req.params.polj},(err,data)=> {
        if(err) res.send(err);
        res.json(data);
    })

}) 

router.get('/preduzeca',(req,res,next) => {
    
    db.preduzeca.find((err,preduzeca)=>{
        if(err) res.send(err);
        res.send(preduzeca);
    })

})

router.get('/narpolj/:username',(req,res,next)=>{
    db.narudzbine.find({poljoprivrednik:req.params.username},(err,data)=> {
        if(err) res.send(err);
        res.json(data);
    })
})

router.get('/delnarmag/:username',(req,res,next)=>{  
    db.magacini.remove({poljoprivrednik:req.params.username},(err,data)=> {
        if(err) res.send(err);
        res.json(data);
    })
})
router.get('/delrasadnike/:username',(req,res,next)=>{  
    db.rasadnici.remove({poljoprivrednik:req.params.username},(err,data)=> {
        if(err) res.send(err);
        res.json(data);
    })
})
router.get('/delsadnice/:username',(req,res,next)=>{  
    db.sadnice.remove({poljoprivrednik:req.params.username},(err,data)=> {
        if(err) res.send(err);
        res.json(data);
    })
})


router.get('/dohvatiNar/:identifikator/:polj',(req,res,next)=> {
    
    db.narudzbine.findOne({identifikatorPorudzbine:parseInt(req.params.identifikator),
    poljoprivrednik:req.params.polj},(err,data)=> {
        if(err) res.send(err);
        res.json(data);
    })

})

router.get('/max/:polj',(req,res,next)=> {
    
    db.narudzbine.aggregate([
 
        
        {$match: {poljoprivrednik: {$eq:req.params.polj}}},
        { $sort : {identifikatorPorudzbine:-1 }}, 
        {$limit:1}
    
     ], (err, data) => {
         if(err) res.send(err);
         res.json(data)
     })

})

router.get('/delproizvode/:username',(req,res,next)=>{  
    db.prodavnica.remove({preduzece:req.params.username},(err,data)=> {
        if(err) res.send(err);
        res.json(data);
    })
})

router.get('/narpred/:username',(req,res,next)=>{
    db.narudzbine.remove({preduzece:req.params.username},(err,data)=> {
        if(err) res.send(err);
        res.json(data);
    })
})


router.get('/nar/kol/:id/:kol',(req,res,next)=> {
    
    db.narudzbine.findAndModify({
        query:{_id:mongojs.ObjectId(req.params.id)},
       update: { $inc: {kolicina:parseInt(req.params.kol)}
       },
       new: true
         },  (err, data) =>{
       if (err) res.send(err);
               res.json(data);
           });
})



router.get('/azurSadPor/:id/:poruka',(req,res,next)=> {
 
   
    db.sadnice.findAndModify({
        query:{_id:mongojs.ObjectId(req.params.id)},
       update: { $set: {flagZaPorukuNaDijalogu:parseInt(req.params.poruka)}
       },
       new: true
         },  (err, data) =>{
           //  console.log('data je',data)
       if (err) res.send(err);
               res.json(data);
           });
})



router.get('/delprocene/:ime/:preduzece',(req,res,next)=>{
    db.ocene.remove({preduzece:req.params.preduzece, nazivProizvoda:req.params.ime},(err,data)=> {
        if(err) res.send(err);
        res.json(data);
    })
})

router.get('/delprkomentari/:ime/:preduzece',(req,res,next)=>{
    db.komentari.remove({preduzece:req.params.preduzece, nazivProizvoda:req.params.ime},(err,data)=> {
        if(err) res.send(err);
        res.json(data);
    })
})

router.get('/delocene/:username',(req,res,next)=>{
    db.ocene.remove({preduzece:req.params.username},(err,data)=> {
        if(err) res.send(err);
        res.json(data);
    })
})

router.get('/delkom/:username',(req,res,next)=>{
    db.komentari.remove({preduzece:req.params.username},(err,data)=> {
        if(err) res.send(err);
        res.json(data);
    })
})


router.get('/delmagacin/:id',(req,res,next)=>{
 
    db.magacini.remove({idRasadnika:req.params.id},(err,issue)=>{
    if(err) res.send(err);
    res.json(issue);
})
});


module.exports = router;