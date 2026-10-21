import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import BookScene from '../components/BookScene';
import { books } from '../data/books';
import '../styles/library.css';

function useReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return reduced;
}

export default function LibraryPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const book = books.find((entry) => entry.slug === slug);
  const reducedMotion = useReducedMotion();
  const [readerReady, setReaderReady] = useState(reducedMotion);
  const dialog = useRef(null);
  const closeButton = useRef(null);
  const restore = useRef(null);

  const openBook = (entry) => {
    const bounds = document.getElementById(`book-${entry.slug}`)?.getBoundingClientRect();
    const libraryRect = bounds && bounds.bottom > 0 && bounds.top < window.innerHeight
      ? { x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height }
      : undefined;
    navigate(`/library/${entry.slug}`, {
      state: { fromLibrary: true, libraryScroll: window.scrollY, libraryTrigger: entry.slug, libraryRect },
    });
  };
  const closeBook = () => {
    if (location.state?.fromLibrary) navigate(-1);
    else navigate('/library', { replace: true });
  };

  useEffect(() => {
    document.title = book ? `${book.title} — The reading room` : 'The reading room — Teddy Truong';
  }, [book]);

  useLayoutEffect(() => {
    if (!book) return undefined;
    const node = dialog.current;
    const priorOverflow = document.body.style.overflow;
    const scroll = location.state?.libraryScroll ?? window.scrollY;
    const trigger = location.state?.libraryTrigger ?? book.slug;
    restore.current = { scroll, trigger };
    setReaderReady(reducedMotion);
    document.body.style.overflow = 'hidden';
    if (!node.open) node.showModal();
    closeButton.current?.focus({ preventScroll: true });
    return () => {
      node.close();
      document.body.style.overflow = priorOverflow;
      const restoration = restore.current;
      requestAnimationFrame(() => {
        const opener = document.getElementById(`book-${restoration.trigger}`);
        if (opener) {
          window.scrollTo({ top: restoration.scroll, behavior: 'instant' });
          opener.focus({ preventScroll: true });
        }
      });
    };
  }, [book, reducedMotion]);

  return (
    <main id="main-content" className="reading-room">
      <div className="reading-room-atmosphere" aria-hidden="true" />
      <header className="library-intro">
        <span className="library-kicker">CHAPTER IV — THE THINGS THAT STAY</span>
        <h1>The <em>reading room.</em></h1>
        <p>A few shelves. A few perspectives.<br />A little more to think about.</p>
        <div className="library-intro-divider"><span /> <i aria-hidden="true">✳</i> <span /></div>
        <span className="library-sample-note">A sample collection, awaiting your own books &amp; notes.</span>
      </header>

      {slug && !book && (
        <div className="library-not-found" role="status">
          <h2>This shelf is still empty.</h2>
          <p>That book isn’t in the collection yet.</p>
          <Link to="/library">Return to the reading room <span aria-hidden="true">↗</span></Link>
        </div>
      )}

      <section className="library-collection" aria-label="Sample book collection">
        {books.map((entry, index) => (
          <article className={`library-volume ${index % 2 ? 'library-volume--reverse' : ''}`} key={entry.slug}>
            <div className="library-volume-object">
              <div className="library-spotlight" aria-hidden="true" />
              <button id={`book-${entry.slug}`} className="library-book-button" onClick={() => openBook(entry)} aria-label={`Open ${entry.title} — sample review`}>
                <BookScene book={entry} reducedMotion={reducedMotion} />
                <span className="library-object-hint">OPEN THE BOOK <span aria-hidden="true">↗</span></span>
              </button>
            </div>
            <div className="library-volume-caption">
              <span className="library-volume-number">{entry.number} <span /> {entry.category}</span>
              <h2><button onClick={() => openBook(entry)}>{entry.title}</button></h2>
              {entry.subtitle && <p className="library-volume-subtitle">{entry.subtitle}</p>}
              <p className="library-volume-author">{entry.author} <span aria-hidden="true">·</span> {entry.year}</p>
              <div className="library-caption-rule" />
              <p className="library-volume-description">{entry.blurb}</p>
              <button className="library-read-link" onClick={() => openBook(entry)}>Step inside <span aria-hidden="true">↗</span></button>
              <span className="library-volume-status">SAMPLE BOOK · REVIEW TO COME</span>
            </div>
          </article>
        ))}
      </section>

      <div className="library-endnote">
        <i aria-hidden="true">✳</i>
        <p>A personal library,<br /><em>slowly taking shape.</em></p>
        <Link to="/">Back to the portrait <span aria-hidden="true">↗</span></Link>
      </div>

      {book && (
        <dialog ref={dialog} className={`library-reader ${readerReady ? 'library-reader--ready' : ''}`} aria-labelledby="review-title" aria-describedby="review-status" onCancel={(event) => { event.preventDefault(); closeBook(); }}>
          <button ref={closeButton} className="library-reader-close" onClick={closeBook} aria-label="Close review and return to the reading room">
            <span aria-hidden="true">←</span> Back to the room <span className="library-escape-hint">ESC</span>
          </button>
          {!readerReady && (
            <div className="library-opening" aria-hidden="true">
              <BookScene book={book} opening originRect={location.state?.libraryRect} reducedMotion={reducedMotion} onOpened={() => setReaderReady(true)} />
              <p>Between the covers.</p>
            </div>
          )}
          <article className="library-review" aria-hidden={!readerReady}>
            <div className="library-review-topline"><span>THE READING ROOM</span><span>VOLUME {book.number}</span></div>
            <div className="library-review-heading">
              <span className="library-review-category">{book.category}</span>
              <h2 id="review-title">{book.title}</h2>
              {book.subtitle && <p className="library-review-subtitle">{book.subtitle}</p>}
              <p className="library-review-author">{book.author} <span aria-hidden="true">·</span> {book.year}</p>
            </div>
            <div className="library-review-placeholder" id="review-status">
              <span className="library-review-tag">SAMPLE BOOK · UNWRITTEN REVIEW</span>
              <h3>Your review will live here.</h3>
              <p>This is a sample volume, ready for your own reading notes. No personal review has been added yet.</p>
            </div>
            <div className="library-review-sections">
              <section><span>01</span><div><h3>What stayed with me</h3><p>A thought, a sentence, a new way of seeing. Your notes will go here.</p></div></section>
              <section><span>02</span><div><h3>Where I disagree</h3><p>The questions worth keeping open. Your reflections will go here.</p></div></section>
              <section><span>03</span><div><h3>In the margins</h3><p>Passages, connections, and things to return to. Your annotations will go here.</p></div></section>
            </div>
            <footer className="library-review-footer"><span>A shelf for what stays.</span><span>{book.number} / 03</span></footer>
          </article>
        </dialog>
      )}
    </main>
  );
}
