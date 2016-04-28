if(!navigator.onLine) {
   //当前用户安装时没有网络
   if(!localStorage["installed"]) {
       localStorage["online"] = "off";
       window.addEventListener("online", function(e) {
            if(localStorage["online"] == "off"){
                localStorage.removeItem("online");
                location.reload();
            }
       }, true);
   }
}


if(!localStorage["~debug"]){
    document.write('<script src="background.js?' + Date.now() +'"></script>');
}else{
    document.write('<script src="background.js?' + Date.now() +'"></script>');
}