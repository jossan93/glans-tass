import "../styles/Footer.css"

function Footer() {
    return (
        <footer className="footer">
            <p>© {new Date().getFullYear()} Glans & Tass</p>
        </footer>
    );
}

export default Footer;