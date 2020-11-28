import React, { useState, useEffect } from "react";
import ReactMde from "react-mde";
import * as Showdown from "showdown";
import "react-mde/lib/styles/css/react-mde-all.css";
import { db } from "../../firebase";
import "../../css/App.css";
const converter = new Showdown.Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true,
});
function updateArticles(id, markDown) {
  db.collection("Articles")
    .doc(id)
    .update({
      markDown: markDown,
    })
    .then(console.log("change article"));
}
export default function MD(props) {
  const [value, setValue] = useState(props.content);
  useEffect(() => {
    setValue(props.content);
  }, [props.content]);
  const [selectedTab, setSelectedTab] = useState("preview");
  return (
    <div className="container">
      <ReactMde
        value={value}
        onChange={(e) => {
          setValue(e);
          updateArticles(props.id, e);
        }}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
        generateMarkdownPreview={(markdown) =>
          Promise.resolve(converter.makeHtml(markdown))
        }
      />
    </div>
  );
}
