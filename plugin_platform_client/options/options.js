// Saves options to localStorage.
function save_options() {
  var select = document.getElementById("env_select");
  var domain = select.children[select.selectedIndex].value || select.children[0].value ;
  localStorage["plugin-platform-setting-domain"] = domain;
  // Update status to let user know options were saved.
  // var status = document.getElementById("status");
  // status.innerHTML = "Options Saved.";
  // setTimeout(function() {
  //   status.innerHTML = "";
  // }, 750);
  swal("配置成功！","" , "success")
}
// Restores select box state to saved value from localStorage.
function restore_options() {
  var env = localStorage["plugin-platform-setting-domain"] || "online" ;
  if (!env) {
    return;
  }
  var select = document.getElementById("env_select");
  for (var i = 0; i < select.children.length; i++) {
    var child = select.children[i];
    if (child.value == env) {
      child.selected = "true";
      break;
    }
  }
}

document.body.onload = restore_options;
document.getElementById('save_action').onclick = save_options;
