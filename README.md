# Netsanet: AI-Powered Support for Women in Ethiopia

Netsanet (meaning "solidarity" in Amharic) is a comprehensive platform dedicated to supporting women in Ethiopia who experience abuse and discrimination. The system leverages AI to provide legal guidance, generate formal appeal letters, connect users with support organizations, and foster a supportive community through shared experiences.

---

## Table of Contents

- [Features](#features)
- [Architecture Overview](#architecture-overview)
- [Backend](#backend)
  - [API Endpoints](#api-endpoints)
  - [Setup & Running](#backend-setup--running)
- [Frontend](#frontend)
  - [Key Pages](#key-pages)
  - [Setup & Running](#frontend-setup--running)
- [Technology Stack](#technology-stack)
- [Community Guidelines & Disclaimer](#community-guidelines--disclaimer)
- [License](#license)

---

## Features

- **AI Legal Advisor:** Personalized legal guidance based on Ethiopian law and user-specific situations.
- **Appeal Letter Generator:** Automated generation of formal appeal letters in both Amharic and English.
- **Support Directory:** Directory of local legal aid organizations and support services.
- **Case Stories:** Real stories from women who have overcome legal and social challenges.
- **Story Wall:** Anonymous sharing of experiences to inspire and support others.
- **Modern UI:** Responsive, accessible, and user-friendly interface.

---

## Architecture Overview

- **Frontend:** React + TypeScript (Vite), Tailwind CSS for styling.
- **Backend:** FastAPI (Python), Gemini AI integration for content generation.
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

### Backend Setup & Running

1. **Install dependencies:**
   ```sh
   cd backend
   python3 -m venv myenv
   source myenv/bin/activate
   pip install -r requirements.txt
   ```

2. **Set environment variables:**  
   Create a `.env` file with your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

3. **Run the server:**
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
- **Backend:** FastAPI, Python, Gemini AI API
- **Other:** Axios, React Router, Lucide Icons

---

## Community Guidelines & Disclaimer

- Share your story respectfully and honestly.
- Avoid sharing identifying information about others.
- All stories are moderated before being posted.
- The AI legal advice is for informational purposes only and does not constitute formal legal counsel. For specific legal matters, consult a qualified lawyer.

---

## License

This project is for demonstration and educational purposes.

---

For questions or contributions, please contact