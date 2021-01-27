var conta = localStorage.getItem('login');
if(!conta)
{
  localStorage.setItem("login", "Anonimo");
}