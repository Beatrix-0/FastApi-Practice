# SEUOJ | Online Judge

A premium, modern Online Judge system built with FastAPI and React.

## Features
- **Modern UI**: Top-navigation based responsive design with glassmorphism effects.
- **Judging Engine**: Real-time code execution and judging (supports Python 3 and C++).
- **Authentication**: Secure JWT-based login and signup with role selection (Admin/User).
- **Manage Problems**: Admin dashboard to add and modify problems and test cases.
- **Problem Bank**: Categorized problems with difficulty levels and constraints.
- **Submission History**: Clickable submission IDs to view your past code and results.
- **Real-time Updates**: Instant feedback on submission status.

## Tech Stack
- **Backend**: FastAPI (Python), PostgreSQL, SQLAlchemy.
- **Frontend**: React 18, Vite, Lucide-React, Axios.
- **Judging**: Subprocess-based secure runner.

## Setup Instructions

### Backend
1. Navigate to the root directory.
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Configure your PostgreSQL database in the `.env` file.
4. Start the server:
   ```bash
   uvicorn app.main:app --reload
   ```

### Frontend
1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Admin Access
Currently, any user can access the `/admin` route in the frontend to add problems for testing purposes. In production, you should implement strict role-based access control (RBAC).

## Security Note
The judging engine runs code using `subprocess`. For a production environment, it is highly recommended to use a Docker-based sandbox (like `epicbox` or `Judge0`) to prevent malicious code execution.
