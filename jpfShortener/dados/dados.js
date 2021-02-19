document.getElementById("eliminar").onclick = function() {eliminar()};
document.getElementById("procurar").onclick = function() {procurar()};

var conta = localStorage.getItem('login');
var data = {user: conta};
var procura = false;

listarLinks();

function listarLinks()
{
  document.getElementById("links").innerHTML = "";

  fetch("YourServerAddress/getLinks", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" }
  })
    .then(res => res.json())
    .then(res => {
      if(res.message === "erro")
      {
        document.getElementById("links").innerHTML = "<br><br><p>Não existem links</p><br><br>";
        document.getElementById("eliminar").style = "display: none;"; 
      }
      else
      {
        mostrar(res);
      }
      
    })
    .catch(err => console.log(err));
}

function mostrar(res)
{
  var links = res.links;

  Object.keys(links).forEach((key) =>
  {
    var div = document.createElement("div");
    var label = document.createElement("label");
    var check = document.createElement('input');
    var br = document.createElement('br');
    var br2 = document.createElement('br');
    div.id = "linkUser";
    check.type = "checkbox";
    check.id = links[key].link;
    check.name = links[key].user;
    label.htmlFor = key;
    if(conta === "Admin")
    {
      label.innerText = `Link: ${links[key].link} \n Link original: ${links[key].urlOriginal} \n Utilizador: ${links[key].user}`;
    }
    else
    {
      label.innerText = `Link: ${links[key].link} \n Link original: ${links[key].urlOriginal}`;
    }
    
    div.appendChild(check);
    div.appendChild(label);
    div.appendChild(br);
    div.appendChild(br2);
    if(procura === false || document.getElementById("link").value == "")
    {
      document.getElementById("links").appendChild(div); 
    }
    else
    {
      if(links[key].link == ("https://nic.eu.org/" + document.getElementById("link").value))
      {
        document.getElementById("links").innerHTML = "";
        document.getElementById("links").appendChild(div);
        document.getElementById("eliminar").style = "display: block;";
        procura = "exit";
      }
      else
      {
        if(procura !== "exit")
        {
          document.getElementById("links").innerHTML = "<br><br><p>Link não encontrado</p><br><br>";
          document.getElementById("eliminar").style = "display: none;";
        }     
      }

    }                    
  });
}

async function eliminar()
{
  var checkboxes = document.querySelectorAll('input[type=checkbox]:checked')

  for (var i = 0; i < checkboxes.length; i++) {
    var links = checkboxes[i].id;
    var data = {link: links};
    await fetch("YourServerAddress/deleteLinks", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" }
    })
      .then(res => res.json())
      .then(res => {
      })
      .catch(err => console.log(err));
      }
      window.location.reload(); 
}

function procurar()
{
  procura = true;
  listarLinks();
}

