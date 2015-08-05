var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var passportLocal = require('passport-local');
var passportFacebook = require("passport-facebook");
var nodemailer = require('nodemailer');
var bcrypt = require("bcrypt");
var params = require('./params.js');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;


/* ---------------------NODEMAILER--------------------------*/
var smtpTransport = nodemailer.createTransport("SMTP",{
  service: "Gmail",
  auth: {
    user: params.SMTP.user,
    pass: params.SMTP.pass
  }
});


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

var insertClientToDb = function(req,res)
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
      roles: getRole(req.body['role'])
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

    res.send({sameEmail: false,
      message: params.register.success,title: params.register.successTitle});
  });
}
var saveToDB = function(req,res)
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
          insertClientToDb(req,res);
        }
      }
      else
      {
        insertClientToDb(req,res);
      }
    });

}


var comparePassword = function(password,hash,verifiedEmail,meno,priezvisko,role,email,id,done)
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
        done(null,false);
    }
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
      console.log(error);

    }
    else
    {
      console.log(response.message);

    }
    smtpTransport.close();

  });


}

var ensureAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  console.log(req.isAuthenticated());
};

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
  console.log("PASSPORT LOCAL");
  mongoose.model('clients').find({email: email},{},function(err,user)
  {
    console.log(user);
    /*--Ak sa email nachadza v DB--*/
    if (user.length)
    {
          comparePassword(password, user[0].password, user[0].verifiedEmail, user[0].firstName,
            user[0].lastName, user[0].roles, email,user[0]._id, done);
    }

    else
    {
          console.log("Je to neplatny email");
          done(null,false);
    }

  });

}));

/* ---------------------PASSPORT-FACEBOOK -------------------------------------- */
passport.use(new passportFacebook.Strategy({
    clientID: "1620974774858693",
    clientSecret: "2a3e08bebfe5a44687044d6d52a30fad",
    callbackURL: "http://www.localhost:3000/auth/facebook",
    profileFields: ['id', 'displayName','emails',"gender",'profileUrl'],
    enableProof: false

  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {

      // To keep the example simple, the user's Facebook profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Facebook account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    })
  }
));

/*----------------------PASSPORT-GOOGLE----------------------------------*/
passport.use(new GoogleStrategy({
    clientID: "425171239070-8dtasul25icb9jnhh2vmm45j844c40d5.apps.googleusercontent.com",
    clientSecret: "8NL1Vg2jmZoUkqqRRW91q0w6",
    callbackURL: "http://localhost:3000/auth/google"
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {

    done(null,profile);
    });
  }
));

/* ---------------------ROUTES --------------------------*/
//Facebook Request

router.get('/facebook',
  passport.authenticate('facebook',{scope: ['email','public_profile']}),
  function(req, res) {
    res.redirect('/#/profile');
  });

router.get('/google',
  passport.authenticate('google', { scope: 'https://www.googleapis.com/auth/plus.login' }),
function(req,res)
{
  res.redirect('/#/profile');
});



/* ---------------------GET-VERIFY-EMAIL--------------------------*/
router.get('/verify',function(req,res)
{
  mongoose.model('clients').findById(req.query.id,{}, function(err, user)
  {
    /*--Najdeme klienta s danym verify ID--*/
    if (user)
    {
      user.verifiedEmail = true;
      user.save();
      res.redirect("/#home?verify_id="+req.query.id);
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
      res.send({message: params.login.verifiedEmail, title: params.login.verifiedEmailTitle});
    }
    else
    {
      res.sendStatus(404);
    }
  });
});



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
      res.send({sameEmail: true,message: params.register.existEmail,
        title: params.register.existEmailTitle});
    }
    /*--Ak e-mail nie je v DB--*/
    else
    {
            //V pohode registrujeme noveho uzivatela
            bcrypt.genSalt(10, function(err, salt) {
              bcrypt.hash(req.body['password'], salt, function(err, hash) {
                req.body['password'] = hash;
                /*--Volanie funkcie na ukladanie do DB--*/
                saveToDB(req,res);
              });
            });
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
  res.send(req.user);
});


module.exports = router;
