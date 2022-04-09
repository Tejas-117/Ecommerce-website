import React from 'react';
import "./Footer.css";
import Logo from "../../../assets/logo.png";
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import PinterestIcon from '@mui/icons-material/Pinterest';
import InstagramIcon from '@mui/icons-material/Instagram';

function Footer() {
  return (
    <footer className='footer'>
      <div className="footer_logo">
        <img src={Logo} alt="Logo"/>
      </div>

      <div className="footer_links">
        <ul>
          <li><a href="#">About</a></li>
          <li><a href="#">Events</a></li>
          <li><a href="#">Products</a></li>
          <li><a href="#">Support</a></li>
        </ul>
      </div>

      <div className="socials">
        <a className="social_link" href="#"><FacebookIcon /></a>
        <a className="social_link" href="#"><TwitterIcon /></a>
        <a className="social_link" href="#"><PinterestIcon /></a>
        <a className="social_link" href="#"><InstagramIcon /></a>
      </div>

      <span>&copy; 2021. All rights reserved.</span>
    </footer>
  );
}

export default Footer;
