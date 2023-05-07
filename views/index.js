const toggle = document.querySelector(".switch");
const body = document.querySelector("body");

toggle.addEventListener('click', ()=>{
  if (toggle.checked) {
    body.style.backgroundColor = 'white'; 
  } else {
    body.style.backgroundColor = 'grey'; 
  }
});