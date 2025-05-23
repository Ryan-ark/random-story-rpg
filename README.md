# Random Story RPG

A text-based adventure game where every playthrough is unique. This console-style game uses AI to generate random storylines, creating a different experience each time you play.

## Features

- **Randomly Generated Stories**: Every game session offers a completely unique adventure
- **Character Progression**: Start as a beginner and become more powerful through items and experience
- **Combat System**: Battle enemies you encounter during your journey
- **Inventory Management**: Collect and use items to aid your adventure
- **Dynamic World**: Explore different locations with their own challenges and rewards

## Tech Stack

- **React/Next.js**: Frontend framework
- **Tailwind CSS**: Styling
- **Axios**: API requests
- **GROQ API**: Powers the AI storytelling

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env.local` file in the root directory with your GROQ API credentials:
   ```
   NEXT_PUBLIC_GROQ_API_URL=https://api.groq.com/v1
   NEXT_PUBLIC_GROQ_API_KEY=your_groq_api_key_here
   ```
4. Run the development server:
   ```
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## How to Play

- Type commands or choose from the presented options to progress through the story
- Common commands:
  - `look`: Examine your surroundings
  - `inventory` or `i`: Open your inventory
  - `examine [object]`: Look at a specific object
  - `take [item]`: Pick up an item
  - `use [item]`: Use an item from your inventory
  - `attack`: Fight an enemy (in combat)
  - `defend`: Take a defensive stance (in combat)
  - `flee`: Try to escape combat
  - `restart`: Start a new game

## Game Mechanics

- **Combat**: When you encounter enemies, you enter combat mode where you can attack, defend, or flee
- **Inventory**: Collect items throughout your adventure that can provide various benefits
- **Character Progression**: Gain experience points by defeating enemies and completing challenges
- **Random Events**: Encounter different scenarios, challenges, and rewards during each playthrough

## Development

This project uses Next.js with TypeScript. The main game logic is in the `app/page.tsx` file, with components and utilities organized in their respective directories.

- `app/components/`: UI components for the game
- `app/utils/`: Game logic, API integration, and TypeScript types

To modify the game or add features, start by exploring these directories.

## License

MIT

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
