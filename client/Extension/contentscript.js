let rawDocument = document.querySelector("html");

console.log("content script run!");
chrome.runtime.sendMessage({
  msg: "from content script, hey background, I am running",
});

chrome.runtime.onMessage.addListener((request, sender, sendresponse) => {
  console.log(request);

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
