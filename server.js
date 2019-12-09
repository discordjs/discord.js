const express = require('express');
const chunk = require('chunk');
const http = require('http');
const app = express();
const fs = require("fs");
const moment = require("moment");
const db = require("quick.db");
let usdb = new db.table("USERS");
let server = require('http').createServer(app);

var session  = require('express-session')
var passport = require('passport')
var Strategy = require('passport-discord').Strategy

module.exports = async (bot) => {
  app.use(express.static("public"));
  app.set('view engine', 'ejs');
  app.listen(process.env.PORT);
  setInterval(() => {
    http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
  }, 50000);
  // coba fitur login
  passport.serializeUser(function(user, done) {
    done(null, user);
  });
  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });

  var scopes = ['identify', 'guilds', 'guilds.join'];

  passport.use(new Strategy({
    clientID: '652140244660912144',
    clientSecret: '9YkqjY8xMOegoeE7F8b1u-BMaD12asJn',
    callbackURL: 'https://human62-web.glitch.me/callback',
    scope: scopes
  }, function(accessToken, refreshToken, profile, done) {
    process.nextTick(function() {
      return done(null, profile);
    });
  }));

  app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
  }));
  
  app.use(passport.initialize());
  app.use(passport.session());
  app.get('/login', passport.authenticate('discord', { scope: scopes }), function(req, res) {});
  app.get('/callback',
          passport.authenticate('discord', { failureRedirect: '/' }), function(req, res) { res.redirect('/user/@me') } // auth success
         );
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });
  app.get('/testLogin', checkAuth, function(req, res) {
    res.json(req.user);
  });
  
  function checkAuth(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.sendFile(__dirname + "/views/unlogin.html");
  };
  // fitur login ampe sini aja \\
  
  // Homepage
  app.get("/", async (req, res) => {
    var guild = bot.guilds.get("618618433948352514")
    var mCount = guild.members.filter(m => !m.user.bot).size
    var bCount = guild.members.filter(m => m.user.bot).size
    var cCount = guild.channels.filter(m => m.type !== 'dm').size
    var rCount = guild.roles.filter(r => r.id !== guild.id).size
    var mg = guild.members
    
    let verifLevels = ["None", "Low", "Medium", "(╯°□°）╯︵  ┻━┻", "┻━┻ミヽ(ಠ益ಠ)ノ彡┻━┻"];
    var verifyLvl = verifLevels[guild.verificationLevel]
    res.render('Home', {
      guild: guild,
      mCount: mCount,
      bCount: bCount,
      cCount: cCount,
      mg: mg,
      rCount: rCount,
      verifyLvl: verifyLvl
    });
  });
  app.get("/Home", async (req, res) => {
    var guild = bot.guilds.get("618618433948352514")
    var mCount = guild.members.filter(m => !m.user.bot).size
    res.render('Home', {
      guild: guild,
      mCount: mCount
    });
  });

  app.get("/Staff", async (req, res) => {
    var rguild = bot.guilds.get("618618433948352514");
    var lorduwu = rguild.roles.find(r => r.id === "618619289150423041");
    var admin = lorduwu.members;
    
    var captain = rguild.roles.find(r => r.id === "618619292577038347");
    var moderator = captain.members;
    
    var uwusec = rguild.roles.find(r => r.id === "618620225910472747");
    var sec = uwusec.members;
    res.render('Staff', {
      guild: rguild,
      admin: admin,
      mod: moderator,
      sec: sec,
      uwusec: uwusec,
      captain: captain,
      lorduwu: lorduwu
    })
  });
  app.get("/Partner", async (req, res) => {
    var guild = bot.guilds.get("618618433948352514");
    var uwupartner = guild.roles.find(r => r.id === "639309078254059520");
    var partner = uwupartner.members;

    let data = {
      guild: guild,
      uwupartner: uwupartner,
      partner: partner
    }
    res.render('Partner', data)
  });
  app.get("/user", async (req, res) => {
    var guild = bot.guilds.get("618618433948352514");
    var members = guild.members
    var member = members.filter(m => !m.user.bot)
    let data = {
      guild: guild,
      bot: bot,
      member: member
    }
    res.render('Users', data)
  });
  app.get("/user/@me", checkAuth, async (req, res) => {
    let id = req.user.id;
    var guild = bot.guilds.get("618618433948352514");
    
    var member = guild.members.find(m => m.id === id);
    var nickname = member.nickname ? member.nickname : "-"
    var created = moment(member.user.createdAt).locale('id').utcOffset('+0700').format('dddd, D/MMMM/YYYY, HH:mm:ss');
    var joined = moment(member.joinedAt).locale('id').utcOffset('+0700').format('dddd, D/MMMM/YYYY, HH:mm:ss');
    var bstatus;
    if(member.user.presence.status === "online") bstatus = "green"
    if(member.user.presence.status === "offline") bstatus = "gray"
    if(member.user.presence.status === "dnd") bstatus = "red"
    if(member.user.presence.status === "idle") bstatus = "yellow"
    var roles = member.roles.filter(r => r.id !== guild.id).map(r => r.name).join(",  ")
    var rolec = member.roles.filter(r => r.id !== guild.id).map(r => r.color).join(",  ")
    var rolel = member.roles.filter(r => r.id !== guild.id).size
    
    let users = JSON.parse(fs.readFileSync("./json/users.json", "utf8"));
    if(!users[member.id]) users[member.id] = {
      Nama: "-",
      Umur: "-",
      Asal: "-",
      Gender: "-",
      Deskripsi: "-"
    };
    let user = users[member.id]
    
    res.render('user', {
      guild: guild,
      user: member,
      created: created,
      joined: joined,
      bstatus: bstatus,
      rolec: rolec,
      roles: roles,
      rolel: rolel,
      nickname: nickname,
      users: user
    });
  });
  app.get("/user/:id", async (req, res) => {
    let id = req.params.id;
    var guild = bot.guilds.get("618618433948352514");
    var test = guild.members.find(m => m.user.username === id) || guild.members.find(m => m.nickname === id) || guild.members.find(m => m.displayName === id) || guild.members.find(m => m.user.tag === id);
//    if(id === "Ahsw") id = "617711475234045996";
    if(test) {
      var s1 = test.displayName
      var s2 = test.user.tag
      var s3 = test.user.username
      var s4 = test.nickname
      if(id === s1) id = test.id
      if(id === s2) id = test.id
      if(id === s3) id = test.id
      if(id === s4) id = test.id
    }
    var member = guild.members.find(m => m.id === id);
     if(!member) {
       return res.render('NoUserFound', {
         id: id
       });
     };
    var nickname = member.nickname ? member.nickname : "-"
    var created = moment(member.user.createdAt).locale('id').utcOffset('+0700').format('dddd, D/MMMM/YYYY, HH:mm:ss');
    var joined = moment(member.joinedAt).locale('id').utcOffset('+0700').format('dddd, D/MMMM/YYYY, HH:mm:ss');
    var bstatus;
    if(member.user.presence.status === "online") bstatus = "green"
    if(member.user.presence.status === "offline") bstatus = "gray"
    if(member.user.presence.status === "dnd") bstatus = "red"
    if(member.user.presence.status === "idle") bstatus = "yellow"
    var roles = member.roles.filter(r => r.id !== guild.id).map(r => r.name)
    var rolec = member.roles.filter(r => r.id !== guild.id).map(r => r.color)
    var rolel = member.roles.filter(r => r.id !== guild.id).size
    
    let users = JSON.parse(fs.readFileSync("./json/users.json", "utf8"));
    if(!users[member.id]) users[member.id] = {
      Nama: "-",
      Umur: "-",
      Asal: "-",
      Gender: "-",
      Deskripsi: "-"
    };
    let user = users[member.id]
    
    res.render('user', {
      guild: guild,
      user: member,
      created: created,
      joined: joined,
      bstatus: bstatus,
      rolec: rolec,
      roles: roles,
      rolel: rolel,
      nickname: nickname,
      users: user
    });
  });
  
  // ERRORS PAGE | NOT FOUND PAGE | 404
  app.get("/*", async (req, res) => {
    res.status(404).sendFile(__dirname + "/views/404.html")
  });
  app.get("/*", async (req, res) => {
    res.status(502).sendFile(__dirname + "/views/404.html")
  });
  app.get("/*", async (req, res) => {
    res.status("Error").sendFile(__dirname + "/views/404.html")
  });
  app.get("/error", async (req, res) => {
    res.sendFile(__dirname + "/views/404.html")
  });
}