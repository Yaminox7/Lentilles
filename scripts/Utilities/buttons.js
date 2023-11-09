var params = document.getElementById("params");
var openbtn = document.getElementById("open");
var closebtn = document.getElementById("close");

closebtn.onclick = () => {
    params.style.display = "none";
    closebtn.style.display = "none";
    openbtn.style.display = "block";
}

openbtn.onclick = () => {
    params.style.display = "block";
    closebtn.style.display = "block";
    openbtn.style.display = "none";
}