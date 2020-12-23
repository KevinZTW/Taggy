import styles from "./MobileFunctionTab.module.css";
import boardStyles from "../RSS/RSSBoard.module.css";
import MenuIcon from "@material-ui/icons/Menu";
import MobileFolderTab from "./MobileFolderTab";
import { useState } from "react";

export default function MobileBurger() {
  const [showBurger, setShowBurger] = useState(false);
  return (
    <div class={styles.burgerWrapper}>
      <MenuIcon
        fontSize="large"
        style={{ color: "white" }}
        onClick={() => {
          console.log("hihi");
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
          <MobileFolderTab />
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
