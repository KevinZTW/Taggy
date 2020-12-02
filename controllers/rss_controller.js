const getRSS = function (uid, url) {
  axios
    .get(url)
    .then((response) => {
      var doc = new JSDOM(response.data, {
        url: url,
      });
      let docTitle = doc.window.document.head.title.textContent;
      let reader = new Readability(doc.window.document);
      let article = reader.parse();
      console.log(article.title);
      let readerHtml = article.content;
      // fs.writeFile(
      //   __dirname + "/../articles/after.html",
      //   article.content,
      //   function (err) {
      //     if (err) {
      //       return console.log(err);
      //     }
      //   }
      // );

      var markDown = turndownService.turndown(readerHtml);
      addArticle(uid, article.title, readerHtml, markDown);
    })
    .catch((error) => {
      console.log(error);
    });
};

export { getArticle };
