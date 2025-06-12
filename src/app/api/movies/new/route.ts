// src/app/api/movies/new/route.ts
import { NextRequest, NextResponse } from "next/server";

const OMDB_API_KEY = process.env.OMDB_API_KEY;
const OMDB_BASE_URL = "http://www.omdbapi.com/";

// Genre-based search terms mapping
const GENRE_SEARCH_TERMS: Record<string, string[]> = {
  action: ["action", "fight", "war", "battle", "hero"],
  comedy: ["comedy", "funny", "laugh", "humor", "comic"],
  drama: ["drama", "story", "life", "family", "love"],
  horror: ["horror", "scary", "ghost", "evil", "dark"],
  romance: ["love", "romance", "heart", "wedding", "couple"],
  thriller: ["thriller", "suspense", "mystery", "crime", "detective"],
  fantasy: ["fantasy", "magic", "wizard", "dragon", "adventure"],
  "sci-fi": ["space", "future", "alien", "robot", "science"],
  animation: ["animation", "cartoon", "animated", "disney", "pixar"],
  documentary: ["documentary", "true", "real", "history", "nature"],
};

interface MovieSearchResult {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
  Genre?: string;
}

interface OMDBSearchResponse {
  Search: MovieSearchResult[];
  totalResults: string;
  Response: string;
  Error?: string;
}

interface OMDBDetailResponse {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: Array<{ Source: string; Value: string }>;
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: string;
  Error?: string;
}

async function searchMoviesByKeyword(
  keyword: string,
  page: number = 1
): Promise<MovieSearchResult[]> {
  try {
    const url = `${OMDB_BASE_URL}?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(
      keyword
    )}&type=movie&page=${page}`;
    const response = await fetch(url);
    const data: OMDBSearchResponse = await response.json();

    if (data.Response === "True" && data.Search) {
      return data.Search;
    }
    return [];
  } catch (error) {
    console.error(`Error searching for ${keyword}:`, error);
    return [];
  }
}

async function getMovieDetails(
  imdbID: string
): Promise<OMDBDetailResponse | null> {
  try {
    const url = `${OMDB_BASE_URL}?apikey=${OMDB_API_KEY}&i=${imdbID}&plot=full`;
    const response = await fetch(url);
    const data: OMDBDetailResponse = await response.json();

    if (data.Response === "True") {
      return data;
    }
    return null;
  } catch (error) {
    console.error(`Error getting details for ${imdbID}:`, error);
    return null;
  }
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export async function POST(request: NextRequest) {
  try {
    if (!OMDB_API_KEY) {
      return NextResponse.json(
        { error: "OMDB API key not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { genres, count } = body;

    // Validate input
    if (!Array.isArray(genres) || genres.length === 0) {
      return NextResponse.json(
        { error: "Please provide at least one genre" },
        { status: 400 }
      );
    }

    if (!count || count < 1 || count > 200) {
      return NextResponse.json(
        { error: "Count must be between 1 and 200" },
        { status: 400 }
      );
    }

    // Calculate movies per genre
    const moviesPerGenre = Math.ceil(count / genres.length);
    let allMovies: OMDBDetailResponse[] = [];
    const seenImdbIds = new Set<string>();

    // Search for movies in each genre
    for (const genre of genres) {
      const searchTerms = GENRE_SEARCH_TERMS[genre.toLowerCase()] || [genre];
      let genreMovies: MovieSearchResult[] = [];

      // Search using multiple terms for better coverage
      for (const term of searchTerms) {
        // Search multiple pages for variety
        for (let page = 1; page <= 3; page++) {
          const movies = await searchMoviesByKeyword(term, page);
          genreMovies.push(...movies);

          // Add small delay to avoid rate limiting
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }

      // Remove duplicates and shuffle
      const uniqueGenreMovies = genreMovies.filter(
        (movie, index, self) =>
          self.findIndex((m) => m.imdbID === movie.imdbID) === index &&
          !seenImdbIds.has(movie.imdbID)
      );

      const shuffledMovies = shuffleArray(uniqueGenreMovies);

      // Get detailed info for selected movies
      const selectedMovies = shuffledMovies.slice(0, moviesPerGenre);

      for (const movie of selectedMovies) {
        if (allMovies.length >= count) break;

        const details = await getMovieDetails(movie.imdbID);
        if (details) {
          allMovies.push(details);
          seenImdbIds.add(movie.imdbID);
        }

        // Add small delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 150));
      }
    }

    // Shuffle final results and limit to requested count
    const finalMovies = shuffleArray(allMovies).slice(0, count);

    // Transform data for consistent response
    const formattedMovies = finalMovies.map((movie) => ({
      id: movie.imdbID,
      title: movie.Title,
      year: parseInt(movie.Year),
      genre: movie.Genre,
      director: movie.Director,
      actors: movie.Actors,
      plot: movie.Plot,
      poster: movie.Poster !== "N/A" ? movie.Poster : null,
      imdbRating: parseFloat(movie.imdbRating) || null,
      runtime: movie.Runtime,
      rated: movie.Rated,
      released: movie.Released,
      language: movie.Language,
      country: movie.Country,
      awards: movie.Awards,
      boxOffice: movie.BoxOffice,
      metascore: movie.Metascore ? parseInt(movie.Metascore) : null,
      imdbVotes: movie.imdbVotes,
      type: movie.Type,
      ratings: movie.Ratings || [],
    }));

    return NextResponse.json({
      success: true,
      movies: formattedMovies,
      total: formattedMovies.length,
      requestedGenres: genres,
      requestedCount: count,
    });
  } catch (error) {
    console.error("Error fetching movies:", error);
    return NextResponse.json(
      { error: "Failed to fetch movies" },
      { status: 500 }
    );
  }
}

// Optional: GET method for testing
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const genres = searchParams.get("genres")?.split(",") || ["action"];
  const count = parseInt(searchParams.get("count") || "10");

  // Convert GET to POST format
  const mockRequest = {
    json: async () => ({ genres, count }),
  } as NextRequest;

  return POST(mockRequest);
}
