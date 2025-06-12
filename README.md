# FlickPick - Personalized Movie Discovery App

A full-stack movie discovery application that allows users to find movies based on their favorite genres and build personalized collections. Users can select genres, fetch movies from external APIs, and maintain their own movie database with smart caching.

## Features

- Genre-based movie discovery (select up to 3 genres)
- Smart movie fetching with multiple search strategies
- Personal movie collections stored in database
- Flip card animations for movie details
- Pagination for browsing large collections
- User authentication and personalized experience
- Optimized performance with database caching

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, React
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: Clerk
- **External API**: OMDB API
- **Deployment**: Vercel (frontend), Neon/Railway (database)

## Getting Started

### Prerequisites

- Node.js 18 or higher
- PostgreSQL database
- OMDB API key (free from [omdbapi.com](http://www.omdbapi.com/))
- Clerk account for authentication

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/flickpick.git
cd flickpick
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env.local` file in the root directory:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/flickpick"

# OMDB API
OMDB_API_KEY="your_omdb_api_key"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
CLERK_SECRET_KEY="your_clerk_secret_key"
```

4. Set up the database
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Setup

### Database Schema

The app uses two main tables:

**Users Table**
- id: User's unique identifier
- clerkId: Clerk authentication ID
- email: User's email
- createdAt: Account creation timestamp

**Movies Table**
- id: Auto-generated ID
- imdbId: External movie ID
- title: Movie title
- year: Release year
- genre: Movie genres
- director: Director name
- actors: Cast information
- plot: Movie plot
- poster: Poster image URL
- imdbRating: IMDb rating
- userId: Foreign key to Users table
- createdAt: When movie was added

### API Routes

- `POST /api/movies/new` - Fetch new movies based on genres
- `GET /api/movies/new` - Test endpoint with query parameters

## How It Works

1. **User Selection**: User selects up to 3 genres and specifies movie count
2. **API Processing**: Backend maps genres to search terms and queries OMDB API
3. **Data Collection**: Multiple searches per genre across different pages for variety
4. **Database Storage**: Movies are saved to user's personal collection
5. **Smart Display**: Shows most recent movies from database, only fetches new ones when requested

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── sign-in/
│   │   │   └── [[...sign-in]]/
│   │   │       └── page.tsx/
│   │   ├── sign-up/
│   │   │   └── [[...sign-in]]/
│   │   │        └── page.tsx/
│   │   ├─── newmovies/
│   │   │   └── page.tsx
│   │   ├─── oldmovies/
│   │   │   └── page.tsx
|   |   |── api/ # Movie fetching API
│   │   │   └── movies/
│   │   │       └── new/
│   │   │           └── route.ts
│   │   │       └── old/
│   │   │           └── route.ts      
│   │   └── globals.css
│   ├── lib/
│   │   └── prisma.ts                 # Database connection
│   └── types/
│       └── movie.ts                  # TypeScript interfaces
├── prisma/
│   └── schema.prisma                 # Database schema
├── .env.local                        # Environment variables
└── package.json
```

## Key Features Explained

### Genre-Based Search
The app uses intelligent mapping of genres to search terms:
```typescript
const GENRE_SEARCH_TERMS = {
  action: ["action", "fight", "war", "battle", "hero"],
  comedy: ["comedy", "funny", "laugh", "humor", "comic"],
  // ... more mappings
};
```

### Smart Caching
- Movies are stored in database after first fetch
- Subsequent visits load from database (faster)
- "New" button fetches fresh movies when needed
- Only shows 10 most recent movies per user

### Rate Limiting
Built-in delays prevent overwhelming external APIs:
```typescript
await new Promise((resolve) => setTimeout(resolve, 150));
```

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Database Hosting
- **Neon**: Serverless PostgreSQL (recommended)
- **Railway**: Simple database hosting
- **Supabase**: Full backend platform

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions:
- Open an issue on GitHub
- Check the [documentation](docs/)
- Review environment variable setup

## Acknowledgments

- [OMDB API](http://www.omdbapi.com/) for movie data
- [Clerk](https://clerk.com) for authentication
- [Tailwind CSS](https://tailwindcss.com) for styling
- [Prisma](https://www.prisma.io) for database management