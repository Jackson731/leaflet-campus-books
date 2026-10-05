import { useEffect, useState } from 'react';
import { ArrowDownUp, BookOpen, Clock3, Heart, Plus, Search, Send, SlidersHorizontal, Sparkles, X } from 'lucide-react';
import { initialBooks, readStored } from './data/books.js';

function BookCover({ book }) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div className="cover" style={{ '--cover': book.color }}>
      {imageFailed ? <div className="cover-fallback"><span>{book.title}</span><small>{book.author}</small></div> : <img src={`https://covers.openlibrary.org/b/isbn/${encodeURIComponent(book.cover)}-M.jpg?default=false`} alt={`${book.title} cover`} loading="lazy" onError={() => setImageFailed(true)} />}
      <span className={`availability ${book.available ? '' : 'reserved'}`}>{book.available ? 'AVAILABLE' : 'RESERVED'}</span>
    </div>
  );
}

function BookCard({ book, saved, onSave, onContact, onWaitlist }) {
  return (
    <article className="book-card">
      <div className="cover-wrap">
        <BookCover book={book} />
        <button className={`save-button ${saved ? 'saved' : ''}`} aria-label={saved ? 'Remove from saved books' : 'Save to saved books'} onClick={() => onSave(book.id)}><Heart size={17} fill={saved ? 'currentColor' : 'none'} /></button>
      </div>
      <div className="book-info">
        <div className="course">{book.course}</div>
        <h2 className="book-title">{book.title}</h2>
        <div className="author">{book.author}</div>
        <div className="card-meta"><strong className="price">${book.price}</strong><span className="condition">{book.condition}</span></div>
        <div className="card-bottom"><span className="freshness"><Clock3 size={12} />{book.available ? `Checked ${book.updated}` : `Updated ${book.updated}`}</span><button className="card-action" onClick={() => (book.available ? onContact(book) : onWaitlist(book))}>{book.available ? 'Message seller' : 'Join waitlist'} <span aria-hidden="true">→</span></button></div>
      </div>
    </article>
  );
}

function FilterPanel({ course, setCourse, condition, setCondition, min, setMin, max, setMax, available, setAvailable, courses, onClear, mobile = false }) {
  return (
    <aside className={`filters ${mobile ? 'mobile-open' : ''}`}>
      <div className="filter-heading"><strong>Refine results</strong><button className="text-button" onClick={onClear}>Clear all</button></div>
      <div className="filter-block"><label className="filter-label" htmlFor={mobile ? 'course-mobile' : 'course-filter'}>Course</label><select id={mobile ? 'course-mobile' : 'course-filter'} value={course} onChange={event => setCourse(event.target.value)}><option value="">All courses</option>{courses.map(item => <option key={item}>{item}</option>)}</select></div>
      <div className="filter-block"><label className="filter-label" htmlFor={mobile ? 'condition-mobile' : 'condition-filter'}>Condition</label><select id={mobile ? 'condition-mobile' : 'condition-filter'} value={condition} onChange={event => setCondition(event.target.value)}><option value="">Any condition</option><option>Like new</option><option>Good</option><option>Well loved</option></select></div>
      <div className="filter-block"><p className="filter-label">Price range</p><div className="price-inputs"><input aria-label="Minimum price" type="number" min="0" placeholder="$ min" value={min} onChange={event => setMin(event.target.value)} /><span>–</span><input aria-label="Maximum price" type="number" min="0" placeholder="$ max" value={max} onChange={event => setMax(event.target.value)} /></div></div>
      <div className="filter-block"><p className="filter-label">Availability</p><label className="checkline"><input type="checkbox" checked={available} onChange={event => setAvailable(event.target.checked)} /> Available now</label><div className="filter-note">Sellers confirm availability when they post. Each listing shows when it was last checked.</div></div>
    </aside>
  );
}

function Modal({ modal, onClose, onSubmit }) {
  if (!modal) return null;

  const isListing = modal.type === 'listing';
  const isWaitlist = modal.type === 'waitlist';
  const title = isListing ? 'List a textbook' : isWaitlist ? 'Join the waitlist' : 'Message the seller';
  const subtitle = isListing ? 'Give it a second life with someone in your class.' : isWaitlist ? `${modal.book.title} is reserved right now. Leave your email and we’ll let you know if it opens up.` : `${modal.book.title} · $${modal.book.price} · ${modal.book.seller}`;

  return (
    <div className="modal-backdrop" onMouseDown={event => event.target === event.currentTarget && onClose()}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-head"><div><h2 id="modal-title">{title}</h2><p>{subtitle}</p></div><button className="close-button" aria-label="Close" onClick={onClose}><X size={18} /></button></div>
        <form onSubmit={event => { event.preventDefault(); onSubmit(new FormData(event.currentTarget)); }}>
          {isListing ? <>
            <label>Book title<input name="title" required maxLength="90" placeholder="e.g. Calculus: Early Transcendentals" /></label>
            <div className="form-row"><label>Course<input name="course" required maxLength="50" placeholder="MATH 151" /></label><label>Price ($)<input name="price" required type="number" min="1" max="999" placeholder="35" /></label></div>
            <div className="form-row"><label>Condition<select name="condition" defaultValue="Good"><option>Like new</option><option>Good</option><option>Well loved</option></select></label><label>ISBN (optional)<input name="isbn" inputMode="numeric" maxLength="17" placeholder="978..." /></label></div>
            <label>Your name<input name="seller" required maxLength="40" placeholder="First name and last initial" /></label>
          </> : isWaitlist ? <label>Email address<input name="email" type="email" required placeholder="you@university.edu" /></label> : <>
            <label>Your email<input name="email" type="email" required placeholder="you@university.edu" /></label>
            <label>Message<textarea name="message" required maxLength="400" defaultValue={`Hi ${modal.book.seller}, is this textbook still available? I’d love to arrange a campus pickup.`} /></label>
          </>}
          <button className="primary-button" type="submit">{isListing ? 'Publish listing' : isWaitlist ? 'Notify me' : <><Send size={15} /> Send message</>}</button>
        </form>
      </section>
    </div>
  );
}

export default function App() {
  const [books, setBooks] = useState(() => [...readStored('leaflet-user-books', []), ...initialBooks]);
  const [saved, setSaved] = useState(() => new Set(readStored('leaflet-saved', [])));
  const [view, setView] = useState('browse');
  const [search, setSearch] = useState('');
  const [course, setCourse] = useState('');
  const [condition, setCondition] = useState('');
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');
  const [available, setAvailable] = useState(true);
  const [sort, setSort] = useState('recent');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState('');
  const courses = [...new Set(books.map(book => book.course))].sort();

  useEffect(() => localStorage.setItem('leaflet-saved', JSON.stringify([...saved])), [saved]);

  const visibleBooks = books.filter(book => {
    const term = search.trim().toLowerCase();
    const matchesTerm = !term || [book.title, book.author, book.course, book.isbn].some(value => value.toLowerCase().includes(term));
    return matchesTerm && (!course || book.course === course) && (!condition || book.condition === condition) && (!min || book.price >= Number(min)) && (!max || book.price <= Number(max)) && (!available || book.available) && (view !== 'saved' || saved.has(book.id)) && (view !== 'my-listings' || book.owner === 'me');
  }).sort((a, b) => sort === 'price-low' ? a.price - b.price : sort === 'price-high' ? b.price - a.price : b.created - a.created);

  function showToast(message) {
    setToast(message);
    window.setTimeout(() => setToast(''), 2600);
  }

  function clearFilters() {
    setCourse(''); setCondition(''); setMin(''); setMax(''); setAvailable(true);
  }

  function toggleSaved(id) {
    setSaved(current => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
    showToast(saved.has(id) ? 'Removed from saved books.' : 'Saved to your books.');
  }

  function submitModal(data) {
    if (modal.type === 'listing') {
      const isbn = String(data.get('isbn')).replace(/[^0-9Xx]/g, '');
      const book = { id: crypto.randomUUID(), title: data.get('title').trim(), author: 'Student listing', course: data.get('course').trim(), isbn, price: Number(data.get('price')), condition: data.get('condition'), seller: data.get('seller').trim(), updated: 'just now', cover: isbn, color: '#35634f', available: true, created: Date.now(), owner: 'me' };
      setBooks(current => {
        localStorage.setItem('leaflet-user-books', JSON.stringify([book, ...current.filter(item => item.owner === 'me')]));
        return [book, ...current];
      });
      setView('my-listings');
      showToast('Your book is live and marked available.');
    } else if (modal.type === 'waitlist') {
      showToast('You’re on the list. We’ll be in touch.');
    } else {
      showToast('Message sent. Check your inbox for their reply.');
    }
    setModal(null);
  }

  function setActiveView(nextView) {
    setView(nextView);
    setMobileFiltersOpen(false);
  }

  const views = [{ id: 'browse', label: 'Browse' }, { id: 'saved', label: 'Saved' }, { id: 'my-listings', label: 'My listings' }];

  return (
    <div className="shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="Leaflet home"><span className="brand-mark"><BookOpen size={18} /></span><span>leaflet<small>CAMPUS BOOK EXCHANGE</small></span></a>
        <nav className="nav" aria-label="Main navigation">{views.map(item => <button key={item.id} className={view === item.id ? 'active' : ''} onClick={() => setActiveView(item.id)}>{item.label}{item.id === 'saved' && saved.size > 0 && <span className="nav-count">{saved.size}</span>}</button>)}</nav>
        <div className="top-actions"><div className="campus"><span className="campus-dot" /><span><b>Northbridge University</b> · Campus only</span></div><button className="sell-button" onClick={() => setModal({ type: 'listing' })}><Plus size={16} /> List a book</button></div>
      </header>
      <main>
        <section className="intro"><div><div className="eyebrow"><Sparkles size={13} /> The smarter campus bookshelf</div><h1>Find your next textbook.</h1><p>Real books from students on your campus. No stale posts, no full-price surprises.</p></div><div className="intro-aside"><span className="pulse" /><span><b>{books.filter(book => book.available).length}</b> books confirmed available</span></div></section>
        <div className="content">
          <FilterPanel course={course} setCourse={setCourse} condition={condition} setCondition={setCondition} min={min} setMin={setMin} max={max} setMax={setMax} available={available} setAvailable={setAvailable} courses={courses} onClear={clearFilters} />
          <section className="results" aria-label="Textbook listings">
            <div className="toolbar"><label className="search-wrap"><Search size={17} /><input type="search" placeholder="Search title, author, course or ISBN" aria-label="Search listings" value={search} onChange={event => setSearch(event.target.value)} /></label><button className="mobile-filter" onClick={() => setMobileFiltersOpen(open => !open)}><SlidersHorizontal size={15} /> Filters</button><label className="sort-wrap"><ArrowDownUp size={14} /><select value={sort} aria-label="Sort results" onChange={event => setSort(event.target.value)}><option value="recent">Recently listed</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select></label></div>
            {mobileFiltersOpen && <FilterPanel mobile course={course} setCourse={setCourse} condition={condition} setCondition={setCondition} min={min} setMin={setMin} max={max} setMax={setMax} available={available} setAvailable={setAvailable} courses={courses} onClear={clearFilters} />}
            <div className="view-tabs">{views.map(item => <button key={item.id} className={view === item.id ? 'active' : ''} onClick={() => setActiveView(item.id)}>{item.id === 'browse' ? 'All books' : item.label}<span className="count">({item.id === 'browse' ? visibleBooks.length : item.id === 'saved' ? books.filter(book => saved.has(book.id)).length : books.filter(book => book.owner === 'me').length})</span></button>)}</div>
            {visibleBooks.length ? <div className="grid">{visibleBooks.map(book => <BookCard key={book.id} book={book} saved={saved.has(book.id)} onSave={toggleSaved} onContact={book => setModal({ type: 'contact', book })} onWaitlist={book => setModal({ type: 'waitlist', book })} />)}</div> : <div className="empty"><strong>{view === 'saved' ? 'No saved books yet' : view === 'my-listings' ? 'No listings yet' : 'No books found'}</strong><span>{view === 'saved' ? 'Tap the heart on a book to keep it here.' : view === 'my-listings' ? 'List a textbook to see it here.' : 'Try a different search or loosen your filters.'}</span>{view === 'my-listings' && <button className="primary-button" onClick={() => setModal({ type: 'listing' })}><Plus size={15} /> List a book</button>}</div>}
          </section>
        </div>
      </main>
      <button className="sell-button mobile-sell" onClick={() => setModal({ type: 'listing' })}><Plus size={16} /> List a book</button>
      <Modal modal={modal} onClose={() => setModal(null)} onSubmit={submitModal} />
      <div className={`toast ${toast ? 'show' : ''}`} role="status">{toast}</div>
    </div>
  );
}