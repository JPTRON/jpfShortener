document.getElementById("alterar").onclick = function() {alterar()};

var conta = localStorage.getItem('login');

function alterar() {
  
  if(document.getElementById("pass").value && document.getElementById("npass").value && document.getElementById("npass2").value)
  {
    if(document.getElementById("pass").value && document.getElementById("npass").value === document.getElementById("npass2").value)
    {
      var data = { login: conta,
                   pass: document.getElementById("pass").value,
                   newPass: document.getElementById("npass").value };
      fetch("YourServerAddress/changePass", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
      })
        .then(res => res.json())
        .then(res => {
          if(res.changed === true)
          {
            window.location.replace("../menu/menu.html");
            return;
          }
          else if(res.changed === "igual")
          {
            document.getElementById("alerta").innerHTML = "<p><b>Password já utilizada</b></p>";
            document.getElementById("alerta").style = "display: block;";
            document.getElementById("alerta").innerHTML = "";
          }
          else
          {
            document.getElementById("alerta").innerHTML = "<p><b>Password incorreta</b></p>";
            document.getElementById("alerta").style = "display: block;";
            document.getElementById("alerta").innerHTML = "";
          }
        })
        .catch(err => console.log(err));

      
    }
    else
    {
      document.getElementById("alerta").innerHTML = "<p><b>Passwords não correspondem</b></p>";
      document.getElementById("alerta").style = "display: block;";
    }
  }

  document.getElementById("pass").value = "";
  document.getElementById("npass").value = "";
  document.getElementById("npass2").value = "";

  document.getElementById("alerta").classList.remove("alerta");
  void document.getElementById("alerta").offsetWidth;
  document.getElementById("alerta").classList.add("alerta");
};
