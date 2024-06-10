import "./Footer.css";
import { LogoFacebook } from "react-ionicons";
import { LogoTwitter } from "react-ionicons";
import { LogoLinkedin } from "react-ionicons";
import { LogoInstagram } from "react-ionicons";
import { LogoYoutube } from "react-ionicons";

const Footer = () => {

  return (
    <footer className="footer">
      <ul className="social-media">
        <li className="social-icon">
          <a className="social-icon-link" href="#">
            <LogoFacebook></LogoFacebook>
          </a>
        </li>

        <li className="social-icon">
          <a className="social-icon-link" href="#">
            <LogoTwitter></LogoTwitter>
          </a>
        </li>

        <li className="social-icon">
          <a className="social-icon-link" href="#">
            <LogoLinkedin></LogoLinkedin>
          </a>
        </li>

        <li className="social-icon">
          <a className="social-icon-link" href="#">
            <LogoInstagram></LogoInstagram>
          </a>
        </li>

        <li className="social-icon">
          <a className="social-icon-link" href="#">
            <LogoYoutube></LogoYoutube>
          </a>
        </li>
      </ul>

      <p>@ 2024 TechWave | All Rights Reserved</p>
    </footer>
  );
};

export default Footer;
