import "../styles/pages/HomePage.css";

export default function HomePage() {
  return (
    <div className="home-container">
      <div className="section home-section">
        <div className="image">
          <img
            src="/public/Photos/cat-bluebackground.jpg"
            alt="katt blå bakgrund"
            className="hero-cat"
          />
        </div>

        <div className="text">
          <h1>Välkommen till Glans & Tass</h1>
          <p>
            Vi erbjuder professionell hund och kattvård med omtanke, trygghet
            och kvalitet. Hos oss får din fyrbenta vän den bästa omsorgen i en
            lugn och trevlig miljö.
          </p>
        </div>

        <div className="image">
          <img
            src="/public/Photos/two-dogs.jpg"
            alt="två hundar"
            className="hero-dogs"
          />
        </div>
      </div>
    </div>
  );
}
