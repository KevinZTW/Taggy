import MobileRSSTab from "../RSS/MobileRSSTab";

import styles from "./MobileFunctionTab.module.css";
import boardStyles from "../RSS/RSSBoard.module.css";
import MenuIcon from "@material-ui/icons/Menu";
import MobileFolderTab from "./MobileFolderTab";
import { useState } from "react";

export default function MobileBurger(props) {
  const [showBurger, setShowBurger] = useState(false);
  let burgerCategory = "";
  switch (props.position) {
    case "board":
      burgerCategory = <MobileFolderTab />;
      break;
    case "RSS":
      burgerCategory = <MobileRSSTab />;
      break;
    default:
  }
  return (
    <div className={styles.burgerWrapper}>
      <MenuIcon
        fontSize="large"
        style={{ color: "white" }}
        onClick={() => {
          setShowBurger(true);
        }}
      />
      {showBurger ? (
        <div className={boardStyles.popup}>
          <div
            className={boardStyles.blur}
            onClick={() => {
              setShowBurger(false);
            }}
          ></div>
          {props.position === "board" ? <MobileFolderTab /> : <MobileRSSTab />}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
