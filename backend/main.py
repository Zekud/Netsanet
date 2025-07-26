from fastapi import FastAPI, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional
import google.generativeai as genai
import os
from dotenv import load_dotenv
import json

# Load environment variables
load_dotenv()

# Configure Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-1.5-flash')

app = FastAPI(title="Netsanet API", description="AI-Powered Support for Women in Ethiopia")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class CaseDescription(BaseModel):
    description: str
    region: Optional[str] = None

class AppealForm(BaseModel):
    name: str
    case_type: str
    incident_date: str
    location: str
    description: str
    evidence: Optional[str] = None
    contact_info: str

class StorySubmission(BaseModel):
    title: str
    content: str
    category: str
    region: Optional[str] = None

# Load support organizations data
def load_support_organizations():
    return {
        "organizations": [
            {
                "name": "Ethiopian Women Lawyers Association (EWLA)",
                "region": "Addis Ababa",
                "services": ["Legal Aid", "Counseling", "Rights Education"],
                "contact": "+251 11 123 4567",
                "address": "Bole, Addis Ababa",
                "website": "www.ewla.org.et"
            },
            {
                "name": "Association for Women's Sanctuary and Development (AWSAD)",
                "region": "Addis Ababa",
                "services": ["Shelter", "Counseling", "Rehabilitation"],
                "contact": "+251 11 987 6543",
                "address": "Kazanchis, Addis Ababa",
                "website": "www.awsad.org"
            },
            {
                "name": "Tiruzer Ethiopia",
                "region": "Addis Ababa",
                "services": ["Legal Support", "Advocacy", "Training"],
                "contact": "+251 11 456 7890",
                "address": "Piazza, Addis Ababa",
                "website": "www.tiruzer.org"
            },
            {
                "name": "Women's Association of Tigray",
                "region": "Tigray",
                "services": ["Legal Aid", "Community Support", "Education"],
                "contact": "+251 34 123 4567",
                "address": "Mekelle, Tigray",
                "website": "www.wat.org.et"
            },
            {
                "name": "Oromia Women's Association",
                "region": "Oromia",
                "services": ["Legal Support", "Counseling", "Advocacy"],
                "contact": "+251 22 987 6543",
                "address": "Adama, Oromia",
                "website": "www.owa.org.et"
            }
        ]
    }

# Load case stories
def load_case_stories():
    return {
        "stories": [
            {
                "id": 1,
                "title": "Finding Strength Through Legal Support",
                "content": "After experiencing workplace discrimination, I reached out to EWLA. They provided me with legal guidance and helped me understand my rights under Ethiopian labor law. With their support, I was able to file a formal complaint and received compensation for the discrimination I faced.",
                "category": "workplace_discrimination",
                "region": "Addis Ababa",
                "outcome": "positive"
            },
            {
                "id": 2,
                "title": "Domestic Violence - A Path to Freedom",
                "content": "I was trapped in an abusive relationship for years. AWSAD provided me with shelter and counseling services. They helped me understand that I had rights and options. Today, I'm living independently and helping other women in similar situations.",
                "category": "domestic_violence",
                "region": "Addis Ababa",
                "outcome": "positive"
            },
            {
                "id": 3,
                "title": "Property Rights Victory",
                "content": "When my husband passed away, his family tried to take our property. Tiruzer Ethiopia helped me understand my inheritance rights under Ethiopian law. With their legal support, I successfully defended my property rights.",
                "category": "property_rights",
                "region": "Addis Ababa",
                "outcome": "positive"
            }
        ]
    }

@app.get("/")
async def root():
    return {"message": "Netsanet API - Supporting Women in Ethiopia"}

@app.post("/api/legal-advice")
async def get_legal_advice(case: CaseDescription):
    """Get AI-powered legal advice based on case description"""
    try:
        prompt = f"""
        You are a legal advisor specializing in Ethiopian law and women's rights. 
        Based on the Ethiopian Constitution and relevant laws, provide guidance for this case:
        
        Case Description: {case.description}
        Region: {case.region or 'Not specified'}
        
        Please provide:
        1. Case classification (domestic violence, workplace discrimination, property rights, etc.)
        2. Relevant rights under Ethiopian Constitution and laws
        3. Recommended actions the person can take
        4. Important legal considerations
        5. Emergency contacts if needed
        
        Be supportive, clear, and provide practical advice. Focus on Ethiopian legal context.
        """
        
        response = model.generate_content(prompt)
        
        return {
            "advice": response.text,
            "case_type": "classified_by_ai",
            "timestamp": "2024-01-01T00:00:00Z"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating legal advice: {str(e)}")

@app.post("/api/generate-appeal")
async def generate_appeal(form: AppealForm):
    """Generate a formal appeal letter using AI"""
    try:
        prompt = f"""
        Generate a formal appeal letter in Amharic and English for the following case:
        
        Name: {form.name}
        Case Type: {form.case_type}
        Incident Date: {form.incident_date}
        Location: {form.location}
        Description: {form.description}
        Evidence: {form.evidence or 'Not provided'}
        Contact Information: {form.contact_info}
        
        The letter should:
        1. Be formal and professional
        2. Include relevant Ethiopian legal references
        3. Clearly state the complaint and requested actions
        4. Be written in both Amharic and English
        5. Follow proper legal letter format
        
        Format the response as:
        ENGLISH VERSION:
        [English letter content]
        
        AMHARIC VERSION:
        [Amharic letter content]
        """
        
        response = model.generate_content(prompt)
        
        return {
            "appeal_letter": response.text,
            "generated_at": "2024-01-01T00:00:00Z",
            "case_details": form.dict()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating appeal letter: {str(e)}")

@app.get("/api/support-organizations")
async def get_support_organizations(region: Optional[str] = None):
    """Get list of support organizations, optionally filtered by region"""
    organizations_data = load_support_organizations()
    
    if region:
        filtered_orgs = [
            org for org in organizations_data["organizations"] 
            if org["region"].lower() == region.lower()
        ]
        return {"organizations": filtered_orgs}
    
    return organizations_data

@app.get("/api/case-stories")
async def get_case_stories(category: Optional[str] = None, region: Optional[str] = None):
    """Get case stories, optionally filtered by category or region"""
    stories_data = load_case_stories()
    
    filtered_stories = stories_data["stories"]
    
    if category:
        filtered_stories = [
            story for story in filtered_stories 
            if story["category"] == category
        ]
    
    if region:
        filtered_stories = [
            story for story in filtered_stories 
            if story["region"] == region
        ]
    
    return {"stories": filtered_stories}

@app.post("/api/submit-story")
async def submit_story(story: StorySubmission):
    """Submit an anonymous story (in a real app, this would be stored in a database)"""
    try:
        # In a real application, this would be saved to a database
        # For demo purposes, we'll just return a success message
        return {
            "message": "Story submitted successfully",
            "story_id": "demo_123",
            "submitted_at": "2024-01-01T00:00:00Z"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error submitting story: {str(e)}")

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "Netsanet API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 