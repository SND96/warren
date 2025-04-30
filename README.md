# Warren

A web application where a user can start deep diving into a particular topic and it will create a graph of the related topics and concepts. Meant for diving deep into a topic and being able to follow multiple paths at the same time.

## Project Structure

```
warren/
├── backend_express/    # Express backend server
├── src/               # React frontend source code
├── public/            # Static assets
├── backend_old/       # Legacy backend code
└── package.json       # Project dependencies and scripts
```

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/SND96/warren
cd warren
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`.

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App

## Tech Stack

- **Frontend:**
  - React
  - TypeScript
  - Styled Components
  - React Flow
  - React Draggable
  - React XArrows

- **Backend:**
  - Express.js
  - Node.js

## Deployment

The project is configured for deployment on:
- Heroku (using `heroku.yml`)
- Vercel (using `vercel.json`)

