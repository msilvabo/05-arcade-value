import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navbar */}
      <header className="av-nav">
        <div className="logo">
          <div className="logo-mark" />
          <span className="logo-text neon-cyan">ARCADE VAULT</span>
        </div>

        <nav className="links">
          <Link href="/" className="active">
            JUEGOS
          </Link>
          <Link href="#salon">SALÓN DE LA FAMA</Link>
          <Link href="#comunidad">COMUNIDAD</Link>
        </nav>

        <div className="spacer" />

        <div className="coin-counter">
          <span className="coin" />
          <span>CREDITS: 04</span>
        </div>

        <div className="auth-btn">
          <button type="button" className="btn magenta">
            LOGIN
          </button>
        </div>
      </header>

      {/* Main Hero */}
      <main className="av-main">
        <section className="av-hero">
          <h1 className="flicker">ARCADE VAULT</h1>
          <p className="sub">
            INSERT COIN TO PLAY <span className="blink">_</span>
          </p>
          <p className="max-w-xl mx-auto mt-6 text-sm text-[var(--ink-dim)]">
            Revive la época dorada de las máquinas recreativas. Compite por el
            puntaje más alto en la bóveda definitiva de clásicos arcade.
          </p>

          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <button type="button" className="btn lg pulse">
              EXPLORAR JUEGOS
            </button>
            <button type="button" className="btn yellow lg">
              VER RANKINGS
            </button>
          </div>
        </section>

        {/* Featured Showcase Grid */}
        <section className="av-grid">
          <article className="card">
            <div className="cover cover-bricks">
              <span className="label">ACTION</span>
            </div>
            <div className="meta">
              <h2 className="title">ARKANOID NEON</h2>
              <p className="desc">
                Destruye bloques de neón con reflejos supersónicos.
              </p>
              <div className="row">
                <div className="score-badge">
                  <span>RECORD</span>
                  <b>98,450</b>
                </div>
                <button type="button" className="btn">
                  JUGAR
                </button>
              </div>
            </div>
          </article>

          <article className="card">
            <div className="cover cover-tetro">
              <span className="label">PUZZLE</span>
            </div>
            <div className="meta">
              <h2 className="title">TETRO VAULT</h2>
              <p className="desc">
                Encaja las piezas al ritmo de la música sintetizada.
              </p>
              <div className="row">
                <div className="score-badge">
                  <span>RECORD</span>
                  <b>142,800</b>
                </div>
                <button type="button" className="btn magenta">
                  JUGAR
                </button>
              </div>
            </div>
          </article>

          <article className="card">
            <div className="cover cover-invaders">
              <span className="label">SHOOTER</span>
            </div>
            <div className="meta">
              <h2 className="title">SPACE DEFENDER</h2>
              <p className="desc">
                Defiende el cuadrante cósmico de oleadas alienígenas.
              </p>
              <div className="row">
                <div className="score-badge">
                  <span>RECORD</span>
                  <b>210,120</b>
                </div>
                <button type="button" className="btn yellow">
                  JUGAR
                </button>
              </div>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
