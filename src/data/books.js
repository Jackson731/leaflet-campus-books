export const initialBooks = [
  { id: '1', title: 'Calculus: Early Transcendentals', author: 'James Stewart', course: 'MATH 151 · Calculus I', isbn: '9781285741550', price: 48, condition: 'Good', seller: 'Maya R.', updated: '12 min ago', cover: '9781285741550', color: '#24634d', available: true, created: 8 },
  { id: '2', title: 'The Central Science', author: 'Brown, LeMay, Bursten et al.', course: 'CHEM 121 · General Chemistry', isbn: '9780134414232', price: 62, condition: 'Like new', seller: 'Andre K.', updated: '38 min ago', cover: '9780134414232', color: '#16485a', available: true, created: 7 },
  { id: '3', title: 'Campbell Biology', author: 'Urry, Cain, Wasserman et al.', course: 'BIOL 110 · Intro Biology', isbn: '9780135188743', price: 55, condition: 'Good', seller: 'Nina P.', updated: '1 hr ago', cover: '9780135188743', color: '#4f6650', available: true, created: 6 },
  { id: '4', title: 'C++ Primer', author: 'Stanley B. Lippman', course: 'CS 201 · Data Structures', isbn: '9780321714114', price: 34, condition: 'Well loved', seller: 'Theo M.', updated: '2 hrs ago', cover: '9780321714114', color: '#754f36', available: true, created: 5 },
  { id: '5', title: 'Psychology', author: 'David G. Myers', course: 'PSYC 101 · Intro Psychology', isbn: '9781319190808', price: 39, condition: 'Like new', seller: 'Sam L.', updated: '3 hrs ago', cover: '9781319190808', color: '#b95136', available: true, created: 4 },
  { id: '6', title: 'Principles of Microeconomics', author: 'N. Gregory Mankiw', course: 'ECON 102 · Microeconomics', isbn: '9780357722718', price: 42, condition: 'Good', seller: 'Jamie W.', updated: 'Yesterday', cover: '9780357722718', color: '#344c74', available: true, created: 3 },
  { id: '7', title: 'Organic Chemistry', author: 'Paula Yurkanis Bruice', course: 'CHEM 231 · Organic Chemistry', isbn: '9780134042282', price: 70, condition: 'Good', seller: 'Chris D.', updated: 'Yesterday', cover: '9780134042282', color: '#66518a', available: false, created: 2 },
  { id: '8', title: 'Introduction to Algorithms', author: 'Cormen, Leiserson, Rivest, Stein', course: 'CS 301 · Algorithms', isbn: '9780262046305', price: 58, condition: 'Like new', seller: 'Alex H.', updated: '2 days ago', cover: '9780262046305', color: '#304c6c', available: true, created: 1 },
];

export function readStored(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}