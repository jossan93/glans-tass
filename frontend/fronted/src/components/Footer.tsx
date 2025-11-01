import "../styles/Footer.css"

function Footer() {
    return (
        <footer className="footer">
            <p>© {new Date().getFullYear()} Glans & Tass</p>
            <p>Alla bilder är från <a href="https://www.pexels.com/" target="_blank" rel="noopener noreferrer">Pexels</a></p>
        </footer>
    );
}

export default Footer;