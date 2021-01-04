let rawDocument = document.querySelector("html");

console.log("content script run!");
var sweatAlertScript = document.createElement("script");
sweatAlertScript.setAttribute(
  "src",
  "https://cdn.jsdelivr.net/npm/sweetalert2@10"
);
document.head.appendChild(sweatAlertScript);
chrome.runtime.sendMessage({
  msg: "from content script, hey background, I am running",
});

chrome.runtime.onMessage.addListener((request, sender, sendresponse) => {
  console.log(request);
  if (request.msg === "SAVESUCCESS") {
    console.log("success!");
    alert("success store article in Taggy!");
    Swal.fire({
      title: "Article Save",
      text: "successfully store article in Taggy",
      icon: "success",
      iconColor: "#2074EC",
      confirmButtonText: "Cool",
    });
  }
  if (request.action === "SAVEARTICLE") {
    console.log("content get the message and send html to back");

    chrome.runtime.sendMessage({
      action: "SAVEARTICLE",
      uid: request.uid,
      content: rawDocument.innerHTML,
      url: window.location.href,
    });
  }
});
