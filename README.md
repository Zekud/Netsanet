# Netsanet: AI-Powered Support for Women in Ethiopia

Netsanet (meaning "solidarity" in Amharic) is a comprehensive platform dedicated to supporting women in Ethiopia who experience abuse and discrimination. The system leverages AI to provide legal guidance, generate formal appeal letters, connect users with support organizations, and foster a supportive community through shared experiences.

---

## Table of Contents

- [Features](#features)
- [System Architecture](#system-architecture)
- [Backend](#backend)
  - [API Endpoints](#api-endpoints)
  - [Database & Admin](#database--admin)
  - [Setup & Running](#backend-setup--running)
- [Frontend](#frontend)
  - [Key Pages](#key-pages)
  - [Setup & Running](#frontend-setup--running)
- [Technology Stack](#technology-stack)
- [Community Guidelines & Disclaimer](#community-guidelines--disclaimer)
- [License](#license)
- [Contact](#contact)

---

## Features

- **AI Legal Advisor:** Personalized legal guidance based on Ethiopian law and user-specific situations.
- **Appeal Letter Generator:** Automated generation of formal appeal letters in both Amharic and English.
- **Support Directory:** Directory of local legal aid organizations and support services.
- **Case Stories:** Real stories from women who have overcome legal and social challenges.
- **Story Wall:** Anonymous sharing of experiences to inspire and support others.
- **Admin Dashboard:** Manage users, stories, organizations, and moderate content.
- **Database Integration:** Persistent storage for users, stories, organizations, and more.
- **Modern UI:** Responsive, accessible, and user-friendly interface.

---

## System Architecture

- **Frontend:** React + TypeScript (Vite), Tailwind CSS for styling.
- **Backend:** FastAPI (Python), Gemini AI integration for content generation, SQL database for persistent storage, and admin tools.
- **Communication:** RESTful API between frontend and backend.

---

## Backend

Located in the [`backend/`](backend/) directory.

### API Endpoints

- `POST /api/legal-advice`  
  Generate AI-powered legal advice based on a case description and region.

- `POST /api/generate-appeal`  
  Generate a formal appeal letter (Amharic & English) based on user input.

- `GET /api/support-organizations`  
  Retrieve a list of support organizations, optionally filtered by region.

- `GET /api/case-stories`  
  Retrieve case stories, optionally filtered by category or region.

- `POST /api/submit-story`  
  Submit an anonymous story to the Story Wall.

- `GET /api/health`  
  Health check endpoint.

- **(Admin Only)**  
  - `GET /api/admin/users`  
    List and manage platform users.
  - `GET /api/admin/stories`  
    Moderate and manage submitted stories.
  - `POST /api/admin/organizations`  
    Add or update support organizations.
  - `DELETE /api/admin/story/{id}`  
    Remove inappropriate or duplicate stories.

### Database & Admin

- Uses a SQL database (e.g., SQLite, PostgreSQL) for persistent storage of users, stories, organizations, and admin data.
- Alembic is used for database migrations.
- Admin routes are protected and require authentication.
- All content submissions are subject to moderation before publication.

**See [`backend/README_DATABASE.md`](backend/README_DATABASE.md) for full database schema, setup, and admin endpoint details.**

### Backend Setup & Running

1. **Install dependencies:**
   ```sh
   cd backend
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

2. **Set environment variables:**  
   Create a `.env` file with your Gemini API key and database URL:
   ```
   GEMINI_API_KEY=your_api_key_here
   DATABASE_URL=sqlite:///./netsanet.db
   ```

3. **Run database migrations:**
   ```sh
   alembic upgrade head
   ```

4. **Run the server:**
   ```sh
   uvicorn main:app --reload
   ```
   The API will be available at `http://localhost:8000`.

---

## Frontend

Located in the [`frontend/`](frontend/) directory.

### Key Pages

- **Home:** Overview, features, and navigation.
- **AI Legal Advisor:** Submit your case and receive structured legal advice.
- **Appeal Generator:** Generate and edit formal appeal letters in Amharic and English.
- **Support Directory:** Find organizations for legal and social support.
- **Case Stories:** Read real stories from other women.
- **Story Wall:** Share your experience anonymously and support others.
- **Admin Dashboard:** For authorized users to manage content and users.

### Frontend Setup & Running

1. **Install dependencies:**
   ```sh
   cd frontend
   npm install
   ```

2. **Run the development server:**
   ```sh
   npm run dev
   ```
   The app will be available at `http://localhost:5173`.

---

## Technology Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend:** FastAPI, Python, Gemini AI API, SQLAlchemy, Alembic
- **Other:** Axios, React Router, Lucide Icons

---

## Community Guidelines & Disclaimer

- Share your story respectfully and honestly.
- Avoid sharing identifying information about others.
- All stories are moderated before being posted.
- The AI legal advice is for informational purposes only and does not constitute formal legal counsel. For specific legal matters, consult a qualified lawyer.
- Admins reserve the right to remove inappropriate content and manage platform access.

---

## License

This project is for demonstration and educational purposes.

---

## Contact

For questions, feedback, or contributions, please contact the project maintainers.

---

**For more details on the database, see [`backend/README_DATABASE.md`](backend/README_DATABASE.md). For frontend development tips, see [`frontend/README.md`](frontend/README.md).**