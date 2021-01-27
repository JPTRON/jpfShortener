document.getElementById("encurtar").onclick = function() {encurtar()};
document.getElementById("sair").onclick = function() {sair()};
document.getElementById("copiar").onclick = function() {copiar()};

document.getElementById("shortUrldiv").style = "display: none;";

var conta = localStorage.getItem('login');
if(!conta)
{
  localStorage.setItem("login", "Anonimo");
  document.getElementById("aliasdiv").style = "display: none;";
  document.getElementById("admbtn").style = "display: none;";
  document.getElementById("sair").style = "display: none;";
  document.getElementById("dados").style = "display: none;";
  document.getElementById("alterar").style = "display: none;";
  conta = "Anonimo";
}
else
{
  document.getElementById("login").style = "display: none;";
  document.getElementById("registar").style = "display: none;";

  if(conta === "Anonimo")
  {
    document.getElementById("aliasdiv").style = "display: none;";
    document.getElementById("login").style = "display: block;";
    document.getElementById("registar").style = "display: block;";
    document.getElementById("sair").style = "display: none;";
    document.getElementById("dados").style = "display: none;";
    document.getElementById("alterar").style = "display: none;";
  }
}

function copiar()
{
  var copyLink = document.getElementById("link");
  copyLink.select();
  document.execCommand("copy");
  document.getElementById("alerta").innerHTML = "<p><b>Link copiado</b></p>";
  document.getElementById("alerta").style = "display: block; background-color: #3deb5a";
  document.getElementById("shortUrldiv").style = "display: none;";

  document.getElementById("alerta").classList.remove("alerta");
  void document.getElementById("alerta").offsetWidth;
  document.getElementById("alerta").classList.add("alerta");
}

function sair()
{
  conta = "Anonimo";
  localStorage.setItem("login", "Anonimo");
  document.getElementById("login").style = "display: block;";
  document.getElementById("registar").style = "display: block;";
  document.getElementById("sair").style = "display: none;";
  document.getElementById("aliasdiv").style = "display: none;";
  document.getElementById("dados").style = "display: none;";
  document.getElementById("alterar").style = "display: none;";
}

function encurtar() 
{
  if(document.getElementById("alias").value)
  {
    var data = { url: document.getElementById("url").value,
               user: conta,
               alias: document.getElementById("alias").value};
  }
  else
  {
    var data = { url: document.getElementById("url").value,
               user: conta};
  }
  
  fetch("https://lacy-boulder-clutch.glitch.me/addLink", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" }
  })
    .then(res => res.json())
    .then(res => {
      if(res.link)
      {
        document.getElementById("shortUrldiv").style = "display: block;";
        document.getElementById("link").value = res.link;
      }
      else
      {
        document.getElementById("alerta").innerHTML = "<p><b>Link inválido</b></p>";
        document.getElementById("alerta").style = "display: block;";
      }
    })
    .catch(err => console.log(err));

  document.getElementById("url").value = "";
  document.getElementById("alias").value = "";
  document.getElementById("url").focus();

  document.getElementById("alerta").classList.remove("alerta");
  void document.getElementById("alerta").offsetWidth;
  document.getElementById("alerta").classList.add("alerta");
};

