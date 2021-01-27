document.getElementById("login").onclick = function() {login()};

function login() 
{
  var data = { login: document.getElementById("user").value,
               password: document.getElementById("pass").value };
  fetch("https://lacy-boulder-clutch.glitch.me/login", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" }
  })
    .then(res => res.json())
    .then(res => {
      if(res.logged === true)
      {
        var conta = localStorage.getItem('login');
        if(!conta)
        {
          localStorage.setItem("login", res.acc);
        }
        else
        {
          localStorage.setItem("login", res.acc);
        }
        document.getElementById("alerta").innerHTML = "<p><b>Login bem sucedido</b></p>";
        document.getElementById("alerta").style = "display: block; background-color: #3deb5a";
        document.getElementById("login").style = "display: none;";
        window.location.replace("../menu/menu.html");
      }
      else
      {
        document.getElementById("alerta").innerHTML = "<p><b>Username ou Password incorretos</b></p>";
        document.getElementById("alerta").style = "display: block;";
      }
    })
    .catch(err => console.log(err));

  document.getElementById("user").value = "";
  document.getElementById("pass").value = "";

  document.getElementById("alerta").classList.remove("alerta");
  void document.getElementById("alerta").offsetWidth;
  document.getElementById("alerta").classList.add("alerta");
};
