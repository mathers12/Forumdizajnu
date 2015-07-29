var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var passportLocal = require('passport-local');
var nodemailer = require('nodemailer');
var bcrypt = require("bcrypt");
var params = require('./params.js');

router.use(passport.initialize());
router.use(passport.session());

/* ---------------------NODEMAILER--------------------------*/
var smtpTransport = nodemailer.createTransport("SMTP",{
  service: "Gmail",
  auth: {
    user: params.SMTP.user,
    pass: params.SMTP.pass
  }
});


var uri = 'mongodb://127.0.0.1:27017/db';

/* ---------------------FUNCTIONS--------------------------*/

/*--Vrati konkretnu rolu--*/
var getRole = function(role)
{
  switch(role)
  {
    case 'admin':
      return 'admin';
    case 'architect':
      return 'architect';
    default:
      return 'client';
  }
};

var insertClientToDb = function(mainAdmin,req,res)
{
  var addUserSchema = mongoose.model('clients');
  var addUser = new addUserSchema(
    {
      firstName: req.body['firstName'],
      lastName: req.body['lastName'],
      password: req.body['password'],
      email: req.body['email'],
      verifiedEmail: false,
      date_of_birth: req.body['date_of_birth'],
      gender: req.body['gender'],
      roles: (mainAdmin)? ['admin','client']:getRole(req.body['role'])
    }
  );
  addUser.save(function (err, data) {
    if (!err) {
      structureHtmlDataAndRender(req,res,data._id);
    }
  });
}

var structureHtmlDataAndRender = function(req,res,id)
{
  var link = "http://" + req.get('host') + "/auth/verify?id=" + id;

  var htmlData = {
    link: link,
    titleMale: params.email.html.titleMale,
    titleFemale: params.email.html.titleFemale,
    gender: req.body['gender'],
    role: getRole(req.body['role']),
    htmlAddress: req.body['firstName']+" "+req.body['lastName'],
    message: params.email.html.message,
    subject: params.email.html.subject,
    button: params.email.html.button,
    footer: params.email.footer
  };

  //RENDEROVANIE
  res.render('registrationApproving',htmlData,function(err,html)
  {
    sendEmail(req.body['email'],html,params.email.subject); // Volanie funkcie na posielanie ver. emailu

    res.send({comparePasswords: true,sameEmail: false});
  });
}
var saveToDB = function(req,res,mainAdmin)
{
  /*--Ak to je hlavny admin--*/
  if (mainAdmin)
  {
    mongoose.model('clients').findOne({email: req.body['email']},{},function(err,user)
    {
      /*--Ak uz je hlavny admin v databaze--*/
      if (user)
      {
        console.log("AKTUALIZUJEM HLAVNEHO ADMINA");
        user.firstName = req.body['firstName'];
        user.lastName = req.body['lastName'];
        user.password = req.body['password'];
        user.gender = req.body['gender'];
        user.verifiedEmail = false;
        user.date_of_birth = req.body['date_of_birth'];
        user.roles = (user.roles === undefined) ? ["admin","client"] : ["client"];

        user.save(function(err)
        {
          structureHtmlDataAndRender(req,res,user._id);
        });
      }
      /*--Ak hlavny admin este nie je v databaze--*/
      else
      {
        insertClientToDb(mainAdmin,req,res);
      }
    });
  }
  else
  {
    /*--otestujeme, ci 0klient uz nema nejaku rolu a ak ano, tak pridame mu dalsiu rolu--*/
    mongoose.model('clients').findOne({email: req.body['email']},{},function(err,user)
    {
      if (user)
      {
        if (user.roles)
        {
          insertOtherRoleToDb(user,req,res);
        }
        else
        {
          insertClientToDb(mainAdmin,req,res);
        }
      }
      else
      {
        insertClientToDb(mainAdmin,req,res);
      }
    });

  }
}

var insertOtherRoleToDb = function(client,req,res)
{
  client.roles.push('client');
  client.verifiedEmail = false;
  client.save(function(err)
  {
    if (!err)
    {
      structureHtmlDataAndRender(req,res,client._id);
    }
  });
}

var comparePassword = function(mainAdmin,password,hash,verifiedEmail,meno,priezvisko,role,email,id,done)
{
  bcrypt.compare(password, hash, function (err, res) {
    /*--Ak heslo suhlasi s hashom--*/
    if (res)
    {
      /*--Ak klientsky e-mail uz je verifikovany--*/
      if (verifiedEmail)
      {
        console.log(role);
        done(null,{email: email, firstName: meno, lastName: priezvisko, role: role, id: id});

      }
      /*--Ak este nepresla verifikacia e-mailu--*/
      else
      {
        console.log("NEVERIFIKOVANE");
        done(null,false);
      }
    }
    /*Ak heslo nesuhlasi s hashom*/
    else
    {
      /*--Je to hlavny admin--*/
      if (mainAdmin)
      {
        var ROLE = (role.length)?role: ['admin'];
        done(null,{email: email, firstName: meno, lastName: priezvisko, role: ROLE, id: id});

      }
      else
      {
        done(null,false);
      }
    }
  });
}

var checkSentInvitation = function(client_id,client_email,role,req,res)
{
  mongoose.model('confirmations').findOne({addressedTo: client_id, role: role},{},function(err,user)
  {
    /*--Ak uz mu bola poslana pozvanka, tak zamietni dalsie posielanie--*/
    if (user)
    {
      res.send({hasAllRoles: false, sameRole: false,sentInvitation: true});
    }
    else
    {
      processingInvitation(client_email,role,client_id,req,res);
    }
  });
}

var insertClientAndProcessing = function(hasAllRoles,client,req,res)
{
  var roles = (client.length)?client[0].roles:0;
  var ClientSchema = mongoose.model('clients');

  if (hasAllRoles)
  {
    res.send({hasAllRoles: true,sameRole: false,sentInvitation: false});
  }
  /*--Klient ma aspon 1 rolu--*/
  else if (roles)
  {
    console.log("KLIENT MA ASPON 1 ROLU");
    /*--Skontrolujeme ci uz mu nebola poslana pozvanka--*/
    checkSentInvitation(client[0]._id,client[0].email,req.body['role'],req,res);
  }
  /*Klient nema ziadnu rolu*/
  else
  {
    var newClient = new ClientSchema({
      email: req.body['email']
    });
    newClient.save(function(err,newUser)
    {
      if (!err)
      {
        processingInvitation(newUser.email,req.body['role'],newUser._id,req,res);
      }
    });
  }
}

var insertConfirmations = function(addressedId,createdId,request,res,role,email)
{
  var Confirmations = mongoose.model('confirmations');

  /*--Vlozime udaje do kolekcie Confirmations--*/
  var confirmationSchema = new Confirmations({
    addressedTo: addressedId,
    state: 'V stave prijatia',
    role: request.body['role'],
    createdBy: createdId

  });
  confirmationSchema.save(function(err,confirmation)
  {
    if (!err)
    {
      structureInvitationHtmlEmail(confirmation._id,addressedId,role,email,request,res);
    }
  })
}

/*--Znova poslanie emailu--*/
router.post('/resend',function(req,res)
{
  mongoose.model('confirmations').find({_id: req.body['id']},{}).exec(function(err,user)
  {
    if (user.length)
    {
      mongoose.model('clients').populate(user, {path: 'addressedTo'}, function (err, client)
      {
        structureInvitationHtmlEmail(req.body['id'],req.body['addressedTo'],req.body['role'],client[0].addressedTo.email,req,res);
      })
    }
  })
});

var structureInvitationHtmlEmail = function(confirmationId,addressedId,role,email,request,res)
{
  var linkAccept = 'http://' + request.get('host') + '/auth/invitation?id=' + addressedId+"&role="+role+"&answer=accept";
  var linkReject = 'http://' + request.get('host') + '/auth/invitation?id=' + addressedId+"&role="+role+"&answer=reject";

  mongoose.model('clients').find({email: request.body['fromEmail']},{},function(err,user)
  {
    if (user)
    {
      var roleName = "";
      switch(role)
      {
        case 'admin':
          roleName = params.email.htmlInvitation.messageAdmin;
          break;
        case 'manager':
          roleName = params.email.htmlInvitation.messageManager;
          break;
        case 'client':
          roleName = params.email.htmlInvitation.messageClient;
          break;
      }
      /*--Udaje pre E-mail--*/
      var htmlData = {
        linkAccept: linkAccept,
        linkReject: linkReject,
        title: params.email.htmlInvitation.title,
        role: role,
        user: (user[0].firstName === undefined)?user[0].email:user[0].firstName+" "+user[0].lastName+" ["+user[0].email+"]",
        invite: params.email.htmlInvitation.invite,
        roleName: roleName,
        message: params.email.htmlInvitation.message,
        subject: params.email.htmlInvitation.subject,
        buttonAccept: params.email.htmlInvitation.buttonAccept,
        buttonReject: params.email.htmlInvitation.buttonReject,
        footer: params.email.footer,
        emailSubject: params.email.subject
      };

      /*--Ukladame text do DESCRIPTION CONFIRMATIONS--*/
      mongoose.model('confirmations').findOne({_id: confirmationId},{},function(err,confirmation)
      {
        confirmation.description = htmlData.title+htmlData.invite+htmlData.user+htmlData.message+roleName;
        confirmation.save(function(err)
        {
          if (!err)
          {
            //RENDEROVANIE
            res.render('invitation', htmlData, function (err, html) {
              /*--Posielanie HTML emailu--*/
              sendEmail(email, html, params.email.subjectInvitation);
              res.send({hasAllRoles: false, sameRole: false,sentInvitation: false});
            });
          }
        })

      });
    }
  });

}

/*--Spracovanie admin/manager/client emailu--*/
var processingInvitation = function(email,role,id,request,res) {
  /*--Ziskame ID posielatela--*/
  mongoose.model('clients').find({email: request.body['fromEmail']},{},function(err,client)
  {
    if (client.length)
    {
      insertConfirmations(id,client[0]._id,request,res,role,email);
    }
    /*--Ak nemozme najst udaje odosielatela, tak ide o hlavneho admina este neregistrovaneho--*/
    /*else
     {
     var Clients = mongoose.model('clients');
     var clientsSchema = Clients({
     email: request.body['fromEmail'],
     verifiedEmail: true,
     roles: ['admin']
     });
     clientsSchema.save(function(err,user)
     {
     if (!err)
     {
     insertConfirmations(id,user._id,request,res,role,email);
     }
     });
     }*/
  });


}


var sendEmail = function(email,html,emailSubject)
{
  smtpTransport.sendMail({  //email options
    from: params.email.from,
    to: email,
    subject: emailSubject,
    html: html,
    attachments:[

      {
        fileName: "top-shadow-right.gif",
        cid: "top-shadow-right",
        filePath: "auth/images/top-shadow-right.gif"
      },
      {

        fileName: "footer-shadow.gif",
        cid: "footer-shadow",
        filePath: "auth/images/footer-shadow.gif"

      }
    ]

  }, function(error, response){  //callback
    if(error){
      console.log("Nastala chyba");

    }
    else
    {
      console.log(response.message);

    }
    smtpTransport.close();

  });


}

passport.serializeUser(function(user,done)
{
  done(null,user);
});
passport.deserializeUser(function(user,done)
{
  done(null,user);
});

/* ---------------------PASSPORT LOCAL--------------------------*/
passport.use(new passportLocal.Strategy({usernameField: "email", passwordField: "password"},function(email,password,done)
{
  mongoose.model('clients').find({email: email},{},function(err,user)
  {
    /*--Udaje hlavneho admina--*/
    var options = {
      user: email,
      pass: password
    };
    /*--Ak sa email nachadza v DB--*/
    if (user.length)
    {
      var mainAdmin = false;
      /*--Testujeme ci to je hlavny admin--*/
      mongoose.createConnection(uri,options,function(err)
      {
        /*--Nie je to hlavny admin, bude to client,admin alebo manager--*/
        if (err)
        {
          comparePassword(mainAdmin,password, user[0].password, user[0].verifiedEmail, user[0].firstName,
            user[0].lastName, user[0].roles, email,user[0]._id, done);
        }
        /*--Je to hlavny admin, ale pozrieme sa ci nie je aj s emailom v DB --*/
        else
        {
          mainAdmin = true;
          console.log("Je to hlavny admin");
          comparePassword(mainAdmin,password, user[0].password, user[0].verifiedEmail, user[0].firstName,
            user[0].lastName, user[0].roles, email,user[0]._id, done);
        }
      });
    }
    /*--Bude to potom hlavny admin alebo neplatny email--*/
    else
    {
      /*--Testujeme ci to nie je hlavny admin--*/
      mongoose.createConnection(uri,options,function(err,user)
      {
        /*--Bude to neplatny email--*/
        console.log(err);
        if (err)
        {
          console.log("Je to neplatny email");
          done(null,false);
        }
        /*--Uspesnie prihlasenie HLAVNEHO ADMINA--*/
        else
        {
          console.log("Je to hlavny admin");
          insertMainAdmin(email); //Vkladam do DB kvoli tomu lebo nema este ucet
          done(null,{email: email,role: ['admin'],verifiedEmail: true});
        }
      });
    }

  });

}));

var insertMainAdmin = function (email)
{
  var Clients = mongoose.model('clients');
  var clientsSchema = Clients({
    email: email,
    verifiedEmail: true,
    roles: ['admin']
  });
  clientsSchema.save(function(err,user)
  {
    if (!err)
    {
      console.log("OK");
    }
  });
}

/* ---------------------ROUTES --------------------------*/

/*--Pozvanka pre admina/managera/klienta--*/
router.post('/invitation',function(req,res)
{
  var hasAllRoles = false;
  /*--Osetrime, ci uz email nie je v DB--*/
  mongoose.model('clients').find({email: req.body['email'], roles: req.body['role']},{},function(err,data)
  {
    /*--Ak uz ma tu rolu co mu chce admin priradit--*/
    if (data.length) {
      /*--Pri adminovi moze mat email 3 ucty= admin,manager,klient--*/
      if (req.body['fromRole'] === 'admin') {
        mongoose.model('clients').find({
          email: req.body['email'],
          $and: [{roles: 'admin'}, {roles: 'manager'}, {roles: 'client'}]
        }, {}, function (err, user) {
          /*--Skontrolujeme ci nahodou uz nema vsetky roly--*/
          if (user.length) {
            console.log("ALL ROLES "+user);
            hasAllRoles = true;
            insertClientAndProcessing(hasAllRoles,user, req, res);
          }
          /*--Nema teda vsetky roly, tak zamietneme tu vybranu rolu--*/
          else {
            res.send({hasAllRoles: false, sameRole: true,sentInvitation: false});
          }
        });

      }
      else if (req.body['fromRole'] === 'manager') {
        mongoose.model('clients').find({email: req.body['email'], $and: [{roles: 'manager'}, {roles: 'client'}]
        }, {}, function (err, user) {
          if (user.length) {
            hasAllRoles = true;
            insertClientAndProcessing(hasAllRoles,user,req, res);
          }
          else {
            res.send({hasAllRoles: false, sameRole: true,sentInvitation: false});
          }
        });
      }
    }
    /*--Ak nema este ziadnu rolu, tak v pohode pokracuj--*/
    else
    {
      console.log("NENASLI SME HO, NEMA TU ROLU");
      mongoose.model('clients').find({email: req.body['email']},{},function(err,user)
      {
        insertClientAndProcessing(hasAllRoles,user,req,res);
      });


    }
  });
});
/*ClientSchema.findByIdAndUpdate(
 data._id,
 {$push: {"roles": req.body['role']}},
 {safe: true, upsert: true},
 function(err) {
 if (!err)
 {*/
/*-----------------------GET-INVITATION---------------------------*/
router.get('/invitation',function(req,res)
{
  console.log("INVITATION GET");
  mongoose.model('clients').findById(req.query.id,{},function(err,user)
  {
    /*--Ak chceme dat rolu neregistrovanemu klientovi--*/
    if (user)
    {
      res.redirect('/invitation?id='+user._id+"&role="+req.query.role+"&answer="+req.query.answer);
    }
    /*--Zadanie ID neexistuje v DB--*/
    else
    {
      res.send(404);
    }
  });
});
/* ---------------------GET-VERIFY-EMAIL--------------------------*/
router.get('/verify',function(req,res)
{
  console.log("Verify");
  mongoose.model('clients').findById(req.query.id,{}, function(err, user)
  {

    /*--Najdeme klienta s danym verify ID--*/
    if (user)
    {
      user.verifiedEmail = true;
      user.save();
      res.redirect('/login?verify_id='+req.query.id);
    }
    else res.send(404);
  });

});



router.get('/getVerifyMessage',function(req,res)
{
  mongoose.model('clients').findById(req.query.verify_id,{},function(err,user)
  {
    /*--Ak to je dany uzivatel s verifikovanym IDckom--*/
    if (user)
    {
      res.send(200);
    }
    else
    {
      res.sendStatus(404);
    }
  });
});

/* ---------------------POST-REGISTRATION--------------------------*/


router.post("/forgotPassword",function(req,res)
{
  mongoose.model('clients').find({email: req.body['email']},{},function(err,user)
  {
    if (user.length)
    {
      var link = 'http://' + req.get('host') + '/forgotPassword?id=' + user[0]._id;
      var htmlData = {
        link: link,
        title: params.email.htmlForgotPassword.title,
        message: params.email.htmlForgotPassword.message,
        subject: params.email.htmlForgotPassword.subject,
        button: params.email.htmlForgotPassword.button,
        footer: params.email.footer,
        emailSubject: params.email.subject
      };

      //RENDEROVANIE
      res.render('forgotPassword', htmlData, function (err, html) {
        /*--Posielanie HTML emailu--*/
        sendEmail(req.body['email'], html, params.email.subjectForgotPassword);
        res.send({emailNotFound: false});
      });
    }
    else
    {
      res.send({emailNotFound: true});
    }
  });
});

/*--Spracovanie registracie--*/
router.post('/registration',function(req, res)
{
  /*--Skontrolujeme ci tam uz nie je rovnaky email s pravom client--*/
  mongoose.model('clients').find({email: req.body['email'], roles: 'client'},{},function(err, users)
  {
    /*--Ak uz je e-mail v DB--*/
    if (users.length)
    {
      console.log("Same email");
      res.send({sameEmail: true});
    }
    /*--Ak e-mail nie je v DB--*/
    else
    {
      /*--Skontrolujem zhodu hesiel a ukladam do DB--*/
      if (req.body['password1'] == req.body['password2'])
      {
        /*--Udaje hlavneho admina--*/
        var options = {
          user: req.body['email'],
          pass: req.body['password1']
        };

        /*--Pozriem sa do DB ci nejdem registrovat hlavny admin email--*/
        mongoose.createConnection(uri,options,function(err)
        {
          var mainAdmin = false;
          if (!err)
          {
            console.log("JE TO HLAVNY ADMIN");
            mainAdmin = true;
            bcrypt.genSalt(10, function(err, salt) {
              bcrypt.hash(req.body['password'], salt, function(err, hash) {
                req.body['password'] = req.body['password2'] = hash;
                /*--Volanie funkcie na ukladanie do DB--*/
                console.log("It is an Admin");
                saveToDB(req,res,mainAdmin);
              });
            });
          }
          else
          {
            //V pohode registrujeme noveho uzivatela
            bcrypt.genSalt(10, function(err, salt) {
              bcrypt.hash(req.body['password'], salt, function(err, hash) {
                req.body['password'] = req.body['password2'] = hash;
                /*--Volanie funkcie na ukladanie do DB--*/
                console.log("New client");
                saveToDB(req,res,mainAdmin);
              });
            });
          }
        });
      }
      /*--Ak sa hesla nezhoduju--*/
      else
      {
        console.log("Not compare passwords");
        res.send({sameEmail: false,comparePasswords: false});
      }
    }

  });

});

/*--------------------GET-LOGOUT--------------------------*/
router.get('/logout',function(req,res)
{
  req.logout();
  res.redirect("/login");
});

/*-------------------LOGGED IN----------------------------*/
router.get('/loggedin', function(req, res) {

  res.send(req.isAuthenticated() ? req.user : false);
});




/* ---------------------POST-LOGIN--------------------------*/
router.post('/',passport.authenticate("local"),function(req,res)
{
  /*--Presmerovanie na URL, kde sme naposledy chceli ist--*/
  res.send(req.user);
  res.redirect(req.body['link']);
});


module.exports = router;
