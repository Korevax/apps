import { Link } from "react-router-dom";
import "./Discover.css";

function Discover(){
    return(
        <main className="Discover_container">
            <section className="DiscoverBanner"></section>
            
            <section className="DiscoverCOntent">

                <article className="DiscoverMOvie DiscoverArtcle">
                    <header className="Art-Header">
                        <h2>Discover</h2>

                        <Link to="#">Ver Mais</Link>
                    </header>

                    /* catalog*/
                </article>

                <article className="DiscoverSerie DiscoverArtcle">
                    <header className="Art-Header">
                        <h2>Discover</h2>

                        <Link to="#">Ver Mais</Link>
                    </header>

                    /* catalog*/
                </article>

                <article className="DiscoverAnimation DiscoverArtcle">
                    <header className="Art-Header">
                        <h2>Discover</h2>

                        <Link to="#">Ver Mais</Link>
                    </header>

                    /* catalog*/
                </article>

                <article className="DiscoverMusic DiscoverArtcle">
                    <header className="Art-Header">
                        <h2>Discover</h2>

                        <Link to="#">Ver Mais</Link>
                    </header>

                    /* catalog*/
                </article>

                <article className="DiscoverCollection DiscoverArtcle">
                    <header className="Art-Header">
                        <h2>Discover</h2>

                        <Link to="#">Ver Mais</Link>
                    </header>

                    /* catalog*/
                </article>

            </section>
        </main>
    );
}

export default Discover