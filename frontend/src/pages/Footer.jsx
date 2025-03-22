import React from "react";
import styles from "../styles/Footer.module.css"; 
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa"; 

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        
        <div className={styles.footerBrand}>
          <h2>Expensio</h2>
          <p>Track your expenses smarter!</p>
        </div>

        <div className={styles.footerLinks}>
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/expenses">Expenses</a></li>
            <li><a href="/analytics">Analytics</a></li>
          </ul>
        </div>

        <div className={styles.footerSocial}>
          <h3>Follow Us</h3>
          <div className={styles.socialIcons}>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebook />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>

      <p className={styles.footerCopyright}>
        © 2025 Expensio. All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
