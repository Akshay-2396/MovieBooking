
// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { moviesPageStyles } from "../../assets/dummyStyles";

// const API_BASE = "https://moviebooking-yqod.onrender.com";
// const COLLAPSE_COUNT = 12;
// const PLACEHOLDER = "https://placehold.co/400x600?text=No+Poster";


// const getUploadUrl = (maybe) => {
//   if (!maybe) return null;
//   if (typeof maybe !== "string") return null;

//   const trimmed = maybe.trim();

//   if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
//   if (/^(uploads\/|public\/uploads\/)/i.test(trimmed)) {
//     return `${API_BASE}/${trimmed.replace(/^public\//i, "")}`;
//   }
//   if (/^[\w\-.]+?\.(jpg|jpeg|png|webp|gif|bmp|svg)$/i.test(trimmed)) {
//     return `${API_BASE}/uploads/${trimmed}`;
//   }
//   if (/^\d+x\d+\?/.test(trimmed) || /\s/.test(trimmed) || trimmed.includes("?")) {
//     return null;
//   }
//   return `${API_BASE}/uploads/${trimmed}`;
// };

// const categoriesList = [
//   { id: "all", name: "All Movies" },
//   { id: "action", name: "Action" },
//   { id: "horror", name: "Horror" },
//   { id: "comedy", name: "Comedy" },
//   { id: "adventure", name: "Adventure" },
// ];

// const mapBackendMovie = (m) => {
//   const id = m._id || m.id || "";
//   const title = m.movieName || m.title || "Untitled";
//   const rawImg = m.poster || m.latestTrailer?.thumbnail || m.thumbnail || null;
//   const image = getUploadUrl(rawImg) || PLACEHOLDER;

//   const cat =
//     (Array.isArray(m.categories) && m.categories[0]) ||
//     m.category ||
//     (Array.isArray(m.latestTrailer?.genres) && m.latestTrailer.genres[0]) ||
//     "General";

//   const category = String(cat || "General");

//   return { id, title, image, category, raw: m };
// };

// export default function MoviesPage() {
//   const [activeCategory, setActiveCategory] = useState("all");
//   const [showAll, setShowAll] = useState(false);
//   const [movies, setMovies] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const ac = new AbortController();
//     let mounted = true;

//     async function load() {
//       setLoading(true);
//       setError(null);

//       try {
//         const url = `${API_BASE}/api/movies?type=normal&limit=200`;
//         const res = await fetch(url, { signal: ac.signal });
//         if (!res.ok) throw new Error(`HTTP ${res.status}`);
//         const json = await res.json();
//         const items = Array.isArray(json.items) ? json.items : [];
//         const mapped = items.map(mapBackendMovie);
//         if (mounted) {
//           setMovies(mapped);
//           setLoading(false);
//         }
//       } catch (err) {
//         if (err.name === "AbortError") return;
//         console.error("Failed to load movies:", err);

//         // fallback: try a generic fetch for any movies
//         try {
//           const res2 = await fetch(`${API_BASE}/api/movies?limit=200`);
//           if (!res2.ok) throw new Error(`Fallback HTTP ${res2.status}`);
//           const json2 = await res2.json();
//           const items2 = Array.isArray(json2.items) ? json2.items : [];
//           const mapped2 = items2.map(mapBackendMovie);
//           if (mounted) {
//             setMovies(mapped2);
//             setLoading(false);
//           }
//         } catch (err2) {
//           if (err2.name === "AbortError") return;
//           console.error("Movies fallback failed:", err2);
//           if (mounted) {
//             setError("Unable to load movies.");
//             setLoading(false);
//           }
//         }
//       }
//     }

//     load();
//     return () => {
//       mounted = false;
//       ac.abort();
//     };
//   }, []);

//   useEffect(() => {
//     setShowAll(false);
//   }, [activeCategory]);

//   const filteredMovies = React.useMemo(() => {
//     if (activeCategory === "all") return movies;
//     return movies.filter(
//       (m) =>
//         String(m.category || "").toLowerCase() === String(activeCategory || "").toLowerCase()
//     );
//   }, [movies, activeCategory]);

//   const visibleMovies = showAll ? filteredMovies : filteredMovies.slice(0, COLLAPSE_COUNT);

//   return (
//     <div className={moviesPageStyles.container}>
//       <section className={moviesPageStyles.categoriesSection}>
//         <div className={moviesPageStyles.categoriesContainer}>
//           <div className={moviesPageStyles.categoriesFlex}>
//             {categoriesList.map((category) => (
//               <button
//                 key={category.id}
//                 className={`${moviesPageStyles.categoryButton.base} ${
//                   activeCategory === category.id
//                     ? moviesPageStyles.categoryButton.active
//                     : moviesPageStyles.categoryButton.inactive
//                 }`}
//                 onClick={() => setActiveCategory(category.id)}
//                 type="button"
//               >
//                 {category.name}
//               </button>
//             ))}
//           </div>
//         </div>
//       </section>

//       <section className={moviesPageStyles.moviesSection}>
//         <div className={moviesPageStyles.moviesContainer}>
//           {loading ? (
//             <div className="py-12 text-center text-gray-300">Loading movies…</div>
//           ) : error ? (
//             <div className="py-12 text-center text-red-400">{error}</div>
//           ) : (
//             <>
//               <div className={moviesPageStyles.moviesGrid}>
//                 {visibleMovies.map((movie) => (
//                   <Link
//                     key={movie.id || movie.title}
//                     to={`/movies/${movie.id}`}
//                     state={{ movie: movie.raw }}
//                     aria-label={`Open details for ${movie.title}`}
//                     className={moviesPageStyles.movieCard}
//                   >
//                     <div className={moviesPageStyles.movieImageContainer}>
//                       <img
//                         src={movie.image}
//                         alt={movie.title}
//                         className={moviesPageStyles.movieImage}
//                         onError={(e) => {
//                           if (e.currentTarget.src !== PLACEHOLDER) e.currentTarget.src = PLACEHOLDER;
//                         }}
//                       />
//                     </div>

//                     <div className={moviesPageStyles.movieInfo}>
//                       <h3 className={moviesPageStyles.movieTitle}>{movie.title}</h3>
//                       <div className={moviesPageStyles.movieCategory}>
//                         <span className={moviesPageStyles.movieCategoryText}>{movie.category}</span>
//                       </div>
//                     </div>
//                   </Link>
//                 ))}

//                 {filteredMovies.length === 0 && (
//                   <div className={moviesPageStyles.emptyState}>No movies found in this category.</div>
//                 )}
//               </div>

//               {filteredMovies.length > COLLAPSE_COUNT && (
//                 <div className={moviesPageStyles.showMoreContainer}>
//                   <button
//                     onClick={() => setShowAll((p) => !p)}
//                     className={moviesPageStyles.showMoreButton}
//                     aria-expanded={showAll}
//                     type="button"
//                   >
//                     {showAll ? "Show less" : `Show more (${filteredMovies.length - COLLAPSE_COUNT} more)`}
//                   </button>
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </section>
//     </div>
//   );
// }

// MovieDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";

const API_BASE = "https://moviebooking-yqod.onrender.com";
const PLACEHOLDER = "https://placehold.co/400x600?text=No+Poster";

// small helper - same rules you used elsewhere
const getUploadUrl = (maybe) => {
  if (!maybe || typeof maybe !== "string") return null;
  const trimmed = maybe.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  if (/^(uploads\/|public\/uploads\/)/i.test(trimmed)) {
    return `${API_BASE}/${trimmed.replace(/^public\//i, "")}`;
  }
  if (/^[\w\-.]+?\.(jpg|jpeg|png|webp|gif|bmp|svg)$/i.test(trimmed)) {
    return `${API_BASE}/uploads/${trimmed}`;
  }
  return `${API_BASE}/uploads/${trimmed}`;
};

// normalize date to YYYY-MM-DD
const normalizeDate = (d) => {
  if (!d) return null;
  // if it's already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return null;
  return dt.toISOString().split("T")[0];
};

export default function MovieDetails() {
  const { id: paramId } = useParams();
  const location = useLocation();
  // If the movies list passed state, use it as initialMovie
  const initialMovie = location.state?.movie ?? null;

  const [movie, setMovie] = useState(initialMovie);
  const [loading, setLoading] = useState(!initialMovie);
  const [error, setError] = useState(null);

  const [selectedDate, setSelectedDate] = useState(null);
  const [availableDates, setAvailableDates] = useState([]); // array of YYYY-MM-DD
  const [slotsForDate, setSlotsForDate] = useState([]);

  // fetch the movie by id (either paramId or movie._id)
  useEffect(() => {
    const id = paramId || (movie && (movie._id || movie.id));
    if (!id) {
      setError("Movie id not provided");
      setLoading(false);
      return;
    }

    // if we already have movie and it has slots, ensure UI uses it
    if (movie && Array.isArray(movie.slots) && movie.slots.length > 0) {
      const dates = Array.from(new Set(movie.slots.map(s => normalizeDate(s.date)).filter(Boolean)));
      setAvailableDates(dates);
      setSelectedDate((d) => d || dates[0] || null);
      setLoading(false);
      return;
    }

    let aborted = false;
    setLoading(true);
    setError(null);

    async function fetchMovie() {
      try {
        const res = await fetch(`${API_BASE}/api/movies/${id}`);
        if (!res.ok) throw new Error(`Fetch movie failed ${res.status}`);
        const json = await res.json();
        // backend returns { success: true, item: obj }
        const item = json?.item ?? null;
        if (aborted) return;
        if (!item) {
          setError("Movie not found");
          setLoading(false);
          return;
        }
        setMovie(item);

        // extract available dates from item.slots (or item.showtimes if you use different name)
        const slots = item.slots || item.showtimes || [];
        const dates = Array.from(new Set((slots || []).map(s => normalizeDate(s.date)).filter(Boolean)));
        setAvailableDates(dates);
        setSelectedDate(dates[0] || null);
        setLoading(false);
      } catch (err) {
        if (aborted) return;
        console.error("fetchMovie error:", err);
        setError("Unable to load movie");
        setLoading(false);
      }
    }

    fetchMovie();
    return () => { aborted = true; };
  }, [paramId]);

  // when selectedDate or movie changes, compute slots for that date
  useEffect(() => {
    if (!movie) {
      setSlotsForDate([]);
      return;
    }
    const slots = movie.slots || movie.showtimes || [];
    if (!selectedDate) {
      setSlotsForDate([]);
      return;
    }
    const normalized = slots.filter(s => normalizeDate(s.date) === normalizeDate(selectedDate));
    // If your slots store times differently, adapt here. We expect each slot to have { time, seatTypes, ... }
    setSlotsForDate(normalized);
  }, [movie, selectedDate]);

  // simple render
  if (loading) return <div className="py-12 text-center">Loading movie…</div>;
  if (error) return <div className="py-12 text-center text-red-500">{error}</div>;
  if (!movie) return <div className="py-12 text-center">Movie not found</div>;

  const posterUrl = getUploadUrl(movie.poster || movie.thumbnail || movie.latestTrailer?.thumbnail) || PLACEHOLDER;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex gap-6">
        <img src={posterUrl} alt={movie.movieName || movie.title} className="w-48 h-auto rounded" />
        <div>
          <h1 className="text-2xl font-bold">{movie.movieName || movie.title}</h1>
          <p className="mt-2 text-gray-600">{movie.description || movie.story || ""}</p>
        </div>
      </div>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Showtimes</h2>

        {availableDates.length === 0 ? (
          <div className="mt-4 text-gray-500">No showtime dates available.</div>
        ) : (
          <>
            <div className="mt-4 flex gap-2 flex-wrap">
              {availableDates.map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDate(d)}
                  className={`px-3 py-1 rounded ${selectedDate === d ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                  type="button"
                >
                  {d}
                </button>
              ))}
            </div>

            <div className="mt-4">
              {slotsForDate.length === 0 ? (
                <div className="text-gray-500">No showtimes available for the selected date.</div>
              ) : (
                <ul className="mt-2 space-y-2">
                  {slotsForDate.map((s, i) => (
                    <li key={i} className="p-3 border rounded flex justify-between items-center">
                      <div>
                        <div className="font-medium">{s.time || s.slot || "Time unknown"}</div>
                        <div className="text-sm text-gray-600">{s.seatTypes ? Object.keys(s.seatTypes).join(", ") : ""}</div>
                      </div>
                      <div>
                        <button className="px-3 py-1 bg-green-600 text-white rounded">Book</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </section>
    </div>
  );
}