import "../styles/pages/AboutPage.css";

export default function AboutPage() {
  return (
    <div className="about-container">
      <div className="section about-section">
        <div className="image">
          <img
            src="/Photos/big-cat.jpg"
            alt="stro grå katt"
            className="about-cat"
          />
        </div>

        <div className="text">
          <h1>Om oss</h1>
          <p>
            Glans & Tass är en salong för hundar och katter där vi brinner för
            pälsvård, hälsa och välmående. Vi har lång erfarenhet av pälsvård.
          </p>
          <p>
            Vårt mål är att varje besök ska kännas tryggt och avslappnat både
            för djuren och dig som ägare.
          </p>
          <p>
            Vi använder endast högkvalitativa produkter och moderna metoder för
            att säkerställa att ditt djur får bästa möjliga omsorg. Oavsett om
            det är en pälsvårdssession, klokklippning eller ett bad tar vi hand
            om varje djur med kärlek och tålamod.
          </p>
          <p>
            Vårt team består av utbildade och passionerade medarbetare som
            älskar djur. Vi tar oss tid att lära känna varje individ och
            anpassar behandlingen efter deras behov och temperament.
          </p>
          <p>
            Vi tror på förebyggande vård och erbjuder därför råd om pälsvård och
            skötsel som hjälper dig att hålla din hund eller katt frisk och glad
            mellan besöken.
          </p>
        </div>
        <div className="image">
          <img
            src="Photos/dog-on-grass.jpg"
            alt="hund på gräs"
            className="about-dog"
          />
        </div>
      </div>
    </div>
  );
}
