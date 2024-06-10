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
        <li className="social-media-item">
          <a className="social-media-link" href="#">
            <LogoFacebook height="30px" width="30px"></LogoFacebook>
          </a>
        </li>

        <li className="social-media-item">
          <a className="social-media-link" href="#">
            <LogoTwitter height="30px" width="30px"></LogoTwitter>
          </a>
        </li>

        <li className="social-media-item">
          <a className="social-media-link" href="#">
            <LogoLinkedin height="30px" width="30px"></LogoLinkedin>
          </a>
        </li>

        <li className="social-media-item">
          <a className="social-media-link" href="#">
            <LogoInstagram height="30px" width="30px"></LogoInstagram>
          </a>
        </li>

        <li className="social-media-item">
          <a className="social-media-link" href="#">
            <LogoYoutube height="30px" width="30px"></LogoYoutube>
          </a>
        </li>
      </ul>

      <p>@ 2024 TechWave | All Rights Reserved</p>
    </footer>
  );
};

export default Footer;
