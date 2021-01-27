document.getElementById("registar").onclick = function() {registar()};

function registar() {

  if(document.getElementById("user").value && document.getElementById("pass").value && document.getElementById("pass2").value)
  {
    if(document.getElementById("pass").value === document.getElementById("pass2").value)
    {
      if(document.getElementById("user").value === "Anonimo")
      {
        document.getElementById("alerta").innerHTML = "<p><b>Username inválido</b></p>";
        document.getElementById("alerta").style = "display: block;";
      }
      var data = { user: document.getElementById("user").value,
               password: document.getElementById("pass").value };
      fetch("https://lacy-boulder-clutch.glitch.me/register", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
      })
        .then(res => res.json())
        .then(res => {
          if(res.created === true)
          {
            document.getElementById("alerta").innerHTML = "<p><b>Registo bem sucedido</b></p>";
            document.getElementById("alerta").style = "display: block; background-color: #3deb5a";
            document.getElementById("registar").style = "display: none;";
            window.location.replace("../login/login.html");
          }
          else
          {
            
            document.getElementById("alerta").innerHTML = "<p><b>Username já existente</b></p>";
            document.getElementById("alerta").style = "display: block;";
          }
        })
        .catch(err => console.log(err));

      document.getElementById("user").value = "";
      document.getElementById("pass").value = "";
      document.getElementById("pass2").value = "";
    }
    else
    {
      document.getElementById("alerta").innerHTML = "<p><b>Passwords não correspondem</b></p>";
      document.getElementById("alerta").style = "display: block;";
    }
  }

  document.getElementById("alerta").classList.remove("alerta");
  void document.getElementById("alerta").offsetWidth;
  document.getElementById("alerta").classList.add("alerta");
};
