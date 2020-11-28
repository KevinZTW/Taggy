import React, { useState, useEffect } from "react";
import ReactMde from "react-mde";
import * as Showdown from "showdown";
import "react-mde/lib/styles/css/react-mde-all.css";
import { db } from "../../firebase";

const converter = new Showdown.Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true,
});
function updateArticles(id, content) {
  db.collection("Articles").doc(id).update({
    content: content,
  });
}
export default function MD(props) {
  console.log(props);
  const [value, setValue] = useState(props.content);
  useEffect(() => {
    setValue(props.content);
  }, [props.content]);
  const [selectedTab, setSelectedTab] = useState("preview");
  console.log("MD is here");
  console.log(value);
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
