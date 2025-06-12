'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import { Star, Clock, Calendar, Globe, Film, ChevronLeft, ChevronRight, Search, Loader2 } from 'lucide-react';

// Define the interface for movie data (matching your existing interface)
interface Rating {
    Source: string;
    Value: string;
}

interface MovieData {
    Title: string;
    Year: string;
    Runtime: string;
    Genre: string;
    Actors: string;
    Plot: string;
    Language: string;
    Type: string;
    Poster: string;
    imdbRating: string;
    Ratings: Rating[];
}

interface MovieCardProps {
    movie: MovieData;
}

const AVAILABLE_GENRES = [
    'action', 'comedy', 'drama', 'horror', 'romance',
    'thriller', 'fantasy', 'sci-fi', 'animation', 'documentary'
];

const MovieCard = ({ movie }: MovieCardProps) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    // Get Rotten Tomatoes rating
    const rtRating = movie.Ratings.find(rating =>
        rating.Source === 'Rotten Tomatoes'
    )?.Value || 'N/A';

    // Format genre string
    const genres = movie.Genre.split(', ').slice(0, 3);

    // Format actors string
    const actors = movie.Actors.split(', ').slice(0, 3).join(', ');

    return (
        <div className="w-80 h-[500px] relative">
            <div
                className="relative w-full h-full cursor-pointer"
                onClick={() => setIsFlipped(!isFlipped)}
            >
                {/* Front of card */}
                <div className={`absolute inset-0 w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black border border-gray-700 shadow-2xl transition-all duration-500 ${isFlipped ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
                    }`}>
                    <div className="relative h-full">
                        {/* Poster Image */}
                        <div className="relative h-72 overflow-hidden bg-gray-800">
                            {!imageError ? (
                                <>
                                    <Image
                                        src={movie.Poster}
                                        alt={movie.Title}
                                        fill
                                        className={`object-cover transition-all duration-500 ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
                                            }`}
                                        onLoad={() => setImageLoaded(true)}
                                        onError={() => setImageError(true)}
                                        unoptimized
                                    />
                                    {!imageLoaded && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 z-10">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex flex-col items-center justify-center text-white">
                                    <Film size={48} className="mb-2 text-gray-400" />
                                    <p className="text-sm text-gray-400 text-center px-4">Image not available</p>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-5" />

                            {/* Type Badge */}
                            <div className="absolute top-4 left-4">
                                <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-white bg-red-600 rounded-full">
                                    <Film size={12} />
                                    {movie.Type.toUpperCase()}
                                </span>
                            </div>

                            {/* IMDB Rating */}
                            <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 bg-yellow-500 text-black rounded-lg text-sm font-bold">
                                <Star size={14} fill="currentColor" />
                                {movie.imdbRating}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-4">
                            <div>
                                <h2 className="text-xl font-bold text-white line-clamp-2 leading-tight">
                                    {movie.Title}
                                </h2>

                                <div className="flex items-center gap-4 mt-2 text-gray-300 text-sm">
                                    <div className="flex items-center gap-1">
                                        <Calendar size={14} />
                                        {movie.Year}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock size={14} />
                                        {movie.Runtime}
                                    </div>
                                </div>
                            </div>

                            {/* Genres */}
                            <div className="flex flex-wrap gap-2">
                                {genres.map((genre, index) => (
                                    <span
                                        key={index}
                                        className="px-2 py-1 text-xs bg-blue-600/20 text-blue-300 rounded-md border border-blue-500/30"
                                    >
                                        {genre.trim()}
                                    </span>
                                ))}
                            </div>

                            {/* Ratings */}
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1 text-yellow-400">
                                    <Star size={16} fill="currentColor" />
                                    <span className="text-sm font-semibold text-white">
                                        {movie.imdbRating}/10
                                    </span>
                                    <span className="text-xs text-gray-400">IMDb</span>
                                </div>
                                <div className="text-sm text-gray-300">
                                    🍅 <span className="text-red-400 font-semibold">{rtRating}</span>
                                </div>
                            </div>

                            {/* Click hint */}
                            <div className="text-center text-xs text-gray-500 border-t border-gray-700 pt-3">
                                Click to see more details
                            </div>
                        </div>
                    </div>
                </div>

                {/* Back of card */}
                <div className={`absolute inset-0 w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black border border-gray-700 shadow-2xl transition-all duration-500 ${isFlipped ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                    }`}>
                    <div className="p-6 h-full flex flex-col">
                        <div className="text-center mb-6">
                            <h3 className="text-lg font-bold text-white mb-2">{movie.Title}</h3>
                            <div className="w-16 h-0.5 bg-blue-500 mx-auto"></div>
                        </div>

                        <div className="flex-1 space-y-4 text-sm">
                            {/* Plot */}
                            <div>
                                <h4 className="text-blue-400 font-semibold mb-2">Plot</h4>
                                <p className="text-gray-300 leading-relaxed text-sm">
                                    {movie.Plot}
                                </p>
                            </div>

                            {/* Cast */}
                            <div>
                                <h4 className="text-blue-400 font-semibold mb-2">Cast</h4>
                                <p className="text-gray-300">{actors}</p>
                            </div>

                            {/* Language */}
                            <div className="flex items-center gap-2">
                                <Globe size={16} className="text-blue-400" />
                                <span className="text-blue-400 font-semibold">Language:</span>
                                <span className="text-gray-300">{movie.Language}</span>
                            </div>
                        </div>

                        {/* Click hint */}
                        <div className="text-center text-xs text-gray-500 border-t border-gray-700 pt-3 mt-4">
                            Click to go back
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function NewMovies() {
    // State for genre selection and movie count
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [movieCount, setMovieCount] = useState<number>(20);

    // State for movies data and pagination
    const [movies, setMovies] = useState<MovieData[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasSearched, setHasSearched] = useState(false);

    const handleGenreToggle = (genre: string) => {
        setSelectedGenres(prev => {
            if (prev.includes(genre)) {
                return prev.filter(g => g !== genre);
            } else if (prev.length < 3) {
                return [...prev, genre];
            }
            return prev;
        });
    };

    const fetchMovies = async () => {
        if (selectedGenres.length === 0) {
            setError('Please select at least one genre');
            return;
        }

        setLoading(true);
        setError(null);
        setHasSearched(false);

        try {
            const response = await fetch('/api/movies/new', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    genres: selectedGenres,
                    count: movieCount
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch movies');
            }

            // Transform API response to match your MovieData interface
            const transformedMovies: MovieData[] = data.movies.map((movie: any) => ({
                Title: movie.title,
                Year: movie.year.toString(),
                Runtime: movie.runtime,
                Genre: movie.genre,
                Actors: movie.actors,
                Plot: movie.plot,
                Language: movie.language,
                Type: movie.type,
                Poster: movie.poster || '/placeholder-movie.jpg',
                imdbRating: movie.imdbRating?.toString() || 'N/A',
                Ratings: movie.ratings || []
            }));

            setMovies(transformedMovies);
            setCurrentIndex(0);
            setHasSearched(true);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => {
        if (currentIndex + 2 < movies.length) {
            setCurrentIndex(currentIndex + 2);
        }
    };

    const handlePrev = () => {
        if (currentIndex >= 2) {
            setCurrentIndex(currentIndex - 2);
        }
    };

    const getCurrentMovies = () => {
        return movies.slice(currentIndex, currentIndex + 2);
    };

    const canGoNext = currentIndex + 2 < movies.length;
    const canGoPrev = currentIndex >= 2;

    return (
        <div className="min-h-screen bg-black">
            {!hasSearched ? (
                // Search Interface
                <div className="flex flex-col items-center justify-center min-h-screen p-8">
                    <div className="text-center mb-12">
                        <h1 className="text-6xl font-bold text-white mb-4">Welcome to FlickPick</h1>
                        <p className="text-xl text-gray-400">Discover amazing movies tailored to your taste</p>
                    </div>

                    <div className="bg-gray-900 rounded-2xl p-8 max-w-2xl w-full border border-gray-700">
                        {/* Genre Selection */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold text-white mb-4">
                                Select Genres <span className="text-blue-400">({selectedGenres.length}/3)</span>
                            </h2>
                            <div className="flex flex-wrap gap-3">
                                {AVAILABLE_GENRES.map(genre => (
                                    <button
                                        key={genre}
                                        onClick={() => handleGenreToggle(genre)}
                                        disabled={!selectedGenres.includes(genre) && selectedGenres.length >= 3}
                                        className={`px-4 py-2 rounded-full border transition-all duration-200 ${selectedGenres.includes(genre)
                                            ? 'bg-blue-500 text-white border-blue-500 shadow-lg shadow-blue-500/25'
                                            : 'bg-transparent text-gray-300 border-gray-600 hover:border-blue-400 hover:text-blue-400'
                                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                                    >
                                        {genre.charAt(0).toUpperCase() + genre.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Movie Count Selection */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold text-white mb-4">Number of Movies</h2>
                            <input
                                type="number"
                                min="4"
                                max="100"
                                value={movieCount}
                                onChange={(e) => setMovieCount(parseInt(e.target.value) || 4)}
                                className="px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white w-32 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <p className="text-gray-400 text-sm mt-2">Minimum 4 movies recommended</p>
                        </div>

                        {/* Error Display */}
                        {error && (
                            <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6">
                                {error}
                            </div>
                        )}

                        {/* Find Button */}
                        <button
                            onClick={fetchMovies}
                            disabled={loading || selectedGenres.length === 0}
                            className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold text-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    Finding Movies...
                                </>
                            ) : (
                                <>
                                    <Search size={20} />
                                    Find Movies
                                </>
                            )}
                        </button>
                    </div>
                </div>
            ) : (
                // Movie Display Interface
                <div className="flex flex-col items-center justify-center min-h-screen p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-5xl font-bold text-white mb-4">Your Movie Picks</h1>
                        <p className="text-gray-400">
                            Showing {currentIndex + 1}-{Math.min(currentIndex + 2, movies.length)} of {movies.length} movies
                        </p>
                        <button
                            onClick={() => {
                                setHasSearched(false);
                                setMovies([]);
                                setCurrentIndex(0);
                                setError(null);
                            }}
                            className="mt-4 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                        >
                            New Search
                        </button>
                    </div>

                    {movies.length > 0 && (
                        <>
                            {/* Movie Cards */}
                            <div className="flex flex-row items-center gap-10 mb-8">
                                {getCurrentMovies().map((movie, index) => (
                                    <div key={currentIndex + index} className="flex justify-center items-center">
                                        <MovieCard movie={movie} />
                                    </div>
                                ))}
                            </div>

                            {/* Navigation */}
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={handlePrev}
                                    disabled={!canGoPrev}
                                    className="flex items-center gap-2 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronLeft size={20} />
                                    Previous
                                </button>

                                <div className="px-4 py-2 bg-gray-800 text-white rounded-lg">
                                    {Math.floor(currentIndex / 2) + 1} / {Math.ceil(movies.length / 2)}
                                </div>

                                <button
                                    onClick={handleNext}
                                    disabled={!canGoNext}
                                    className="flex items-center gap-2 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Next
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </>
                    )}

                    {movies.length === 0 && !loading && (
                        <div className="text-center text-gray-400">
                            <p>No movies found. Try different genres or search again.</p>
                            <button
                                onClick={() => setHasSearched(false)}
                                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}