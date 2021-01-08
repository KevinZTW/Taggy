import styles from "./Landing.module.css";
import logo from "../imgs/taggy_logo_1x.png";
import landing_main from "../imgs/import_article.png";
import { Link } from "react-router-dom";
export default function Landing() {
  return (
    <div className={styles.landingWrapper}>
      <div className={styles.headWrapper}>
        <Link to={"/"}>
          <div className={styles.homeWrapper}>
            <div className={styles.logoWrapper}>
              <img src={logo} alt="" />
            </div>
            <div className={styles.logoTitle}>Taggy</div>
          </div>
        </Link>
        <Link to={"/signup"} className={styles.SignUpBtnWrapper}>
          <div className={styles.SignUpBtn}>Sign up</div>
        </Link>
        <Link to={"/signin"} className={styles.logInWrapper}>
          <div className={styles.logInBtn}>Log in</div>
        </Link>
      </div>
      <div className={styles.main}>
        <div className={styles.mainLeft}>
          <h1 className={styles.title}>
            We make exploring and organizing knowledge easier.
          </h1>
          <Link to={"/signin"}>
            <div className={styles.getStarted}>Get Started</div>
          </Link>
        </div>
        <div className={styles.mainRight}>
          <img src={landing_main} alt="" />
        </div>
      </div>
    </div>
  );
}
