// server.js
// init project
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const fs = require("fs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

// listen for reqs :)
var listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});

// init sqlite db
const dbFile = "./.data/sqlite.db";
const exists = fs.existsSync(dbFile);
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(dbFile);

db.serialize(() => {
  if (!exists) {
    db.run(
      "CREATE TABLE links (link TEXT PRIMARY KEY NOT NULL, urlOriginal TEXT NOT NULL, user TEXT NOT NULL)"
    );
    db.run(
      "CREATE TABLE users (login TEXT PRIMARY KEY NOT NULL, senha TEXT NOT NULL)"
    );
    db.run(
      "CREATE TABLE passUsadas (user TEXT NOT NULL, pass TEXT NOT NULL)"
    );

    db.serialize(() => {
      db.run(
        "INSERT INTO links (link, urlOriginal, user) VALUES ('https://nic.eu.org/admin', 'https://www.google.com/', 'Admin')"
      );
      db.run(
        "INSERT INTO users (login, senha) VALUES ('Admin', 'Admin123')"
      );
      db.run(
        "INSERT INTO passUsadas (user, pass) VALUES ('Admin', 'Admin123')"
      );
    });
  } else {
    console.log("A base de dados está pronta!");
    
    db.each("SELECT * from links", (err, row) => {
      if (row) {
        console.log(row);
      } else {
        console.log(err);
      }
    });

    db.each("SELECT * from users", (err, row) => {
      if (row) {
        console.log(row);
      } else {
        console.log(err);
      }
    });
    
    db.each("SELECT * from passUsadas", (err, row) => {
      if (row) {
        console.log(row);
      } else {
        console.log(err);
      }
    });
  }
});

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/views/index.html`);
});

// endpoint para procurar os links
app.post("/getLinks", (req, res) => {
  var user = req.body.user;
  if (user === "Admin") {
    db.all("SELECT * from links", (err, rows) => {
      if (!(Object.keys(rows).length === 0)) {
        res.send({ links: rows });
      } else {
        res.send({message: "erro"});
      }
    });
    
  } else {
    db.all("SELECT * from links where user = ?", user, (err, rows) => {
      if (!(Object.keys(rows).length === 0)) {
        res.send({ links: rows });
      } else {
        res.send({message: "erro"});
      }
    });
  }
});

function encurtar(urlOriginal, alias) {
  var valido = validarUrl(urlOriginal);
  if (valido === true) {
    if (alias) {
      var shortUrl = `https://nic.eu.org/${alias}`;
    } else {
      var shortUrl = `https://nic.eu.org/${Math.floor(
        Math.random() * (9999 - 1000)
      ) + 1000}`;
    }

    var disponivel = verificarDisponibilidade(shortUrl);
    if (disponivel === false && !alias) {
      encurtar(urlOriginal);
    } else if (disponivel === false && alias) {
      return false;
    } else {
      console.log(shortUrl);
      return shortUrl;
    }
  } else {
    console.log("URL inválido!");
    return false;
  }
}

function validarUrl(url) {
  var pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
    "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|" + // domain name
    "((\\d{1,3}\\.){3}\\d{1,3}))" + // ip (v4) address
    "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + //port
    "(\\?[;&amp;a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  );
  return pattern.test(url);
}

function verificarDisponibilidade(url) {
  // endpoint para selecionar todos os links e procurar se url já existe
  db.all("SELECT * from links where link = ?", url, (err, rows) => {
    if (!(Object.keys(rows).length === 0)) {
      return false;
    } else {
      return true;
    }
  });
}

// endpoint para adicional um link
app.post("/addLink", (req, res) => {
  if (!req.body.url) {
    return;
  }

  var urlOriginal = cleanseString(req.body.url);
  if (req.body.alias) {
    var shortUrl = encurtar(urlOriginal, req.body.alias);
  } else {
    var shortUrl = encurtar(urlOriginal, false);
  }

  if (shortUrl === false) {
    res.send({ message: "erro" });
    return;
  }

  const user = req.body.user;
  db.run("INSERT INTO links VALUES (?, ?, ?)", shortUrl, urlOriginal, user, err => {
      if (err) {
        res.send({ message: "erro" });
      } else {
        res.send({ link: shortUrl });
      }
    }
  );
});

// endpoint para limpar os links
app.post("/deleteLinks", (req, res) => {
  console.log("teste");
  if (!req.body.link) {
    return;
  }

  var link = req.body.link;

  db.all("DELETE from links where link = ?", link, (err, rows) => {
      if (rows) {
        console.log("Eliminou");
        res.send({ deleted: true });
      } else {
        console.log("Erro");
        res.send({ deleted: false });
      }
    }
  );
});

// helper function that prevents html/css/script malice
const cleanseString = function(string) {
  return string.replace(/</g, "&lt;").replace(/>/g, "&gt;");
};

// endpoint para fazer login
app.post("/login", (req, res) => {
  if (!req.body.login || !req.body.password) {
    return;
  }

  var login = cleanseString(req.body.login);
  var pass = cleanseString(req.body.password);

  db.all("SELECT * from users where login = ? AND senha = ?", login, pass, (err, rows) => {
      if (!(Object.keys(rows).length === 0)) {
        console.log("Entrou");
        res.send({ logged: true, acc: login });
      } else {
        console.log("Erro");
        res.send({ logged: false });
      }
    }
  );
});

// endpoint para registar conta
app.post("/register", (req, res) => {
  if (!req.body.user || !req.body.password) {
    return;
  }

  var user = cleanseString(req.body.user);
  var pass = cleanseString(req.body.password);

  db.all("SELECT * from users where login = ?", user, (err, rows) => {
    if (!(Object.keys(rows).length === 0)) {
      console.log("Já existe");
      res.send({ created: false });
    } else {
      console.log("não existe");
      db.serialize(() => {
        db.run("INSERT INTO users (login, senha) VALUES (?, ?)", user, pass);
        db.run("INSERT INTO passUsadas (user, pass) VALUES (?, ?)", user, pass);
      });
      res.send({ created: true });
    }
  });
});

// endpoint para dar redirect
app.post("/redirect", (req, res) => {
  if (!req.body.url) {
    return;
  }

  var url = cleanseString(req.body.url);
  db.all("SELECT * from links where link = ?", url, (err, rows) => {
    if (!(Object.keys(rows).length === 0)) {
      var rowsStr = JSON.stringify(rows);
      var mySubString = rowsStr.substring(
        rowsStr.lastIndexOf('urlOriginal":"') + 14,
        rowsStr.lastIndexOf('","user')
      );
      res.send({ redirectUrl: mySubString });
    } else {
      res.send({ redirectUrl: false });
    }
  });
});

// endpoint para procurar as informações das bases
app.get("/getLinksList", (request, response) => {
  db.all("SELECT * from links", (err, rows) => {
    response.send(JSON.stringify(rows));
  });
});

app.get("/getUsersList", (request, response) => {
  db.all("SELECT * from users", (err, rows) => {
    response.send(JSON.stringify(rows));
  });
});

app.get("/getPassList", (request, response) => {
  db.all("SELECT * from passUsadas", (err, rows) => {
    response.send(JSON.stringify(rows));
  });
});

//endpoint para alterar a senha
app.post("/changePass", (req, res) => {
  if (!req.body.pass || !req.body.newPass) {
    return;
  }
  var pass = cleanseString(req.body.pass);
  var newPass = cleanseString(req.body.newPass);
  
  db.all("SELECT * from users where login = ? AND senha = ?",req.body.login, pass, (err, rows) => {
    if (!(Object.keys(rows).length === 0)) 
    {
      db.all("SELECT * from passUsadas where user = ? AND pass = ?",req.body.login, newPass, (err, rows) => {
        if (Object.keys(rows).length === 0) 
        {
          db.serialize(() => {
            db.run("UPDATE users SET senha = ? where login = ?", newPass, req.body.login);         
            db.run("INSERT INTO passUsadas (user, pass) VALUES (?, ?)", req.body.login, newPass);
          });
          res.send({changed: true});
        }
        else
        {
          res.send({changed: "igual"});
        }
      });
    }
    else
    {
        res.send({changed: false});
    }
  });
});
