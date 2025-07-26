# Netsanet Database Setup

This document explains how to set up and use the SQLite database for the Netsanet application.

## Database Structure

The application uses SQLAlchemy with SQLite to store:

1. **Stories** - User-submitted anonymous stories (with moderation)
2. **Legal Advice Requests** - AI-generated legal advice requests
3. **Appeal Letters** - Generated appeal letters in English and Amharic
4. **Support Organizations** - Directory of support organizations

## Setup Instructions

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Initialize Database

Run the database initialization script:

```bash
python run_init.py
```

This will:
- Create the SQLite database file (`netsanet.db`)
- Create all necessary tables
- Populate with initial sample data (organizations and stories)

### 3. Start the Application

```bash
python main.py
```

## Database Models

### Story
- `id`: Primary key
- `title`: Story title
- `content`: Story content
- `category`: Story category (domestic_violence, workplace_discrimination, etc.)
- `region`: Geographic region
- `is_approved`: Moderation status (False by default)
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

### LegalAdviceRequest
- `id`: Primary key
- `description`: Case description
- `region`: Geographic region
- `advice_generated`: AI-generated advice
- `case_type`: Classified case type
- `created_at`: Creation timestamp

### AppealLetter
- `id`: Primary key
- `name`: Requester's name
- `case_type`: Type of case
- `incident_date`: Date of incident
- `location`: Location of incident
- `description`: Case description
- `evidence`: Evidence details
- `contact_info`: Contact information
- `english_letter`: Generated English letter
- `amharic_letter`: Generated Amharic letter
- `created_at`: Creation timestamp

### SupportOrganization
- `id`: Primary key
- `name`: Organization name
- `region`: Geographic region
- `services`: JSON string of services offered
- `contact`: Contact information
- `address`: Physical address
- `website`: Website URL
- `is_active`: Active status
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

## Admin Endpoints

The application includes admin endpoints for managing content:

- `GET /admin/stories/pending` - Get pending stories for moderation
- `POST /admin/stories/approve` - Approve/reject stories
- `GET /admin/stats` - Get application statistics
- `DELETE /admin/stories/{story_id}` - Delete a story
- `GET /admin/legal-requests` - Get all legal advice requests
- `GET /admin/appeal-letters` - Get all appeal letters

## Data Persistence

All user interactions are now stored in the database:

- **Story submissions** are stored and require admin approval
- **Legal advice requests** are logged with generated advice
- **Appeal letters** are saved with both English and Amharic versions
- **Support organizations** are managed through the database

## Backup and Maintenance

- The database file (`netsanet.db`) should be backed up regularly
- Consider using Alembic for database migrations in production
- Monitor database size and performance as the application grows

## Security Notes

- The database file contains sensitive information
- Ensure proper file permissions on the database file
- Consider encryption for production deployments
- Regular backups are essential for data protection 