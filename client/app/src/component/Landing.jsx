import styles from "./Landing.module.css";
import logo from "../img/taggy_logo_1x.png";
import landing from "../img/landing_right.png";
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
        <Link to={"/signin"} className={styles.logInWrapper}>
          <div className={styles.logInBtn}>Log In</div>
        </Link>
        <Link to={"/signup"}>
          <div className={styles.SignUpBtn}>Sign up</div>
        </Link>
      </div>
      <div className={styles.main}>
        <div className={styles.mainLeft}>
          <h1 className={styles.title}>Simple way to expand your knowledge</h1>
          <h3 className={styles.subTitle}>
            The total solution for you to follow latest dev insight, read RSS
            and save website content
          </h3>
        </div>
        <div className={styles.mainRight}>
          <img src={landing} alt="" />
        </div>
      </div>
    </div>
  );
}
