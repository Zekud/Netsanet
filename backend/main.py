from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any
import google.generativeai as genai
import os
from dotenv import load_dotenv
import json
import re
from database import get_supabase
from admin import router as admin_router
from auth_routes import router as auth_router
from auth import get_current_user, get_current_admin_user

# Load environment variables
load_dotenv()

# Configure Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-1.5-flash')

supabase = get_supabase()

app = FastAPI(title="Netsanet API", description="AI-Powered Support for Women in Ethiopia")

# CORS middleware (allow dynamic origins via ENV, fallback to localhost)
allowed_origins_env = os.getenv("ALLOWED_ORIGINS")
allowed_origins = (
    [o.strip() for o in allowed_origins_env.split(",") if o.strip()]
    if allowed_origins_env else [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)
app.include_router(admin_router)

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

@app.get("/")
async def root():
    return {"message": "Netsanet API - Supporting Women in Ethiopia"}

@app.post("/api/legal-advice")
async def get_legal_advice(case: CaseDescription, current_user: Dict[str, Any] = Depends(get_current_user)):
    """Get AI-powered legal advice based on case description"""
    if not model:
        raise HTTPException(
            status_code=503,
            detail="AI service not available. Please configure GEMINI_API_KEY in the .env file. Get your API key from: https://makersuite.google.com/app/apikey"
        )
    
    try:
        prompt = f"""
        You are a legal advisor specializing in Ethiopian law and women's rights. 
        Based on the Ethiopian Constitution and relevant laws, provide clear, actionable guidance for this case.
        
        Case Description: {case.description}
        Region: {case.region or 'Not specified'}
        
        Provide structured advice in the following format:
        
        CASE CLASSIFICATION:
        [Classify the case type]
        
        YOUR RIGHTS:
        [List relevant rights under Ethiopian Constitution and laws]
        
        RECOMMENDED ACTIONS:
        [Step-by-step actions the person can take]
        
        LEGAL CONSIDERATIONS:
        [Important legal points to consider]
        
        EMERGENCY CONTACTS:
        [Relevant emergency contacts if needed]
        
        Be supportive, clear, and provide practical advice. Focus on Ethiopian legal context. Do not include any introductory text or explanations outside of the structured format above.
        """
        
        response = model.generate_content(prompt)
        advice = response.text
        
        # Store the request in Supabase with user_id
        supabase.table("legal_advice_requests").insert({
            "description": case.description,
            "region": case.region,
            "advice_generated": advice,
            "case_type": "classified_by_ai",
            "user_id": current_user["id"],
        }).execute()
        
        return {
            "advice": advice,
            "case_type": "classified_by_ai",
            "timestamp": "2024-01-01T00:00:00Z"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating legal advice: {str(e)}")

@app.post("/api/generate-appeal")
async def generate_appeal(form: AppealForm, current_user: Dict[str, Any] = Depends(get_current_user)):
    """Generate a formal appeal letter using AI"""
    if not model:
        raise HTTPException(
            status_code=503,
            detail="AI service not available. Please configure GEMINI_API_KEY in the .env file. Get your API key from: https://makersuite.google.com/app/apikey"
        )
    
    try:
        prompt = f"""
        Generate ONLY a formal appeal letter in both Amharic and English for the following case. Do not include any explanations, introductions, or additional text - just the letter content.

        Case Details:
        Name: {form.name}
        Case Type: {form.case_type}
        Incident Date: {form.incident_date}
        Location: {form.location}
        Description: {form.description}
        Evidence: {form.evidence or 'Not provided'}
        Contact Information: {form.contact_info}
        
        Requirements:
        - Write a formal, professional appeal letter
        - Include relevant Ethiopian legal references
        - Clearly state the complaint and requested actions
        - Follow proper legal letter format
        - Provide BOTH English and Amharic versions
        
        Format your response EXACTLY as follows (no other text):
        
        ENGLISH VERSION:
        [Complete English appeal letter with proper formatting]
        
        AMHARIC VERSION:
        [Complete Amharic appeal letter with proper formatting]
        """
        
        response = model.generate_content(prompt)
        appeal_letter = response.text
        
        # Parse the response to separate English and Amharic versions
        english_match = re.search(r'English Version:?\s*([\s\S]*?)(?=Amharic Version:|$)', appeal_letter, re.IGNORECASE)
        amharic_match = re.search(r'Amharic Version:?\s*([\s\S]*?)(?=English Version:|$)', appeal_letter, re.IGNORECASE)
        
        english_letter = english_match.group(1).strip() if english_match else appeal_letter
        amharic_letter = amharic_match.group(1).strip() if amharic_match else ""
        
        # Store the appeal letter in Supabase with user_id
        supabase.table("appeal_letters").insert({
            "name": form.name,
            "case_type": form.case_type,
            "incident_date": form.incident_date,
            "location": form.location,
            "description": form.description,
            "evidence": form.evidence,
            "contact_info": form.contact_info,
            "english_letter": english_letter,
            "amharic_letter": amharic_letter,
            "user_id": current_user["id"],
        }).execute()
        
        return {
            "appeal_letter": appeal_letter,
            "generated_at": "2024-01-01T00:00:00Z",
            "case_details": form.dict()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating appeal letter: {str(e)}")

@app.get("/api/support-organizations")
async def get_support_organizations(region: Optional[str] = None):
    """Get list of support organizations, optionally filtered by region"""
    query = supabase.table("support_organizations").select("*").eq("is_active", True)
    if region:
        query = query.ilike("region", f"%{region}%")
    organizations = (query.execute().data) or []
    
    result = []
    for org in organizations:
        result.append({
            "name": org["name"],
            "region": org["region"],
            "services": org.get("services") or [],
            "contact": org["contact"],
            "address": org["address"],
            "website": org.get("website"),
        })
    
    return {"organizations": result}

@app.get("/api/case-stories")
async def get_case_stories(category: Optional[str] = None, region: Optional[str] = None):
    """Get case stories, optionally filtered by category or region"""
    query = supabase.table("stories").select("*").eq("is_approved", True)
    if category:
        query = query.eq("category", category)
    if region:
        query = query.ilike("region", f"%{region}%")
    stories = (query.execute().data) or []
    
    result = []
    for story in stories:
        result.append({
            "id": story["id"],
            "title": story["title"],
            "content": story["content"],
            "category": story["category"],
            "region": story.get("region"),
            "outcome": "positive",
            "is_approved": story.get("is_approved", False)
        })
    
    return {"stories": result}

@app.post("/api/submit-story")
async def submit_story(story: StorySubmission, current_user: Dict[str, Any] = Depends(get_current_user)):
    """Submit an anonymous story"""
    try:
        inserted = supabase.table("stories").insert({
            "title": story.title,
            "content": story.content,
            "category": story.category,
            "region": story.region,
            "is_approved": False,
            "user_id": current_user["id"],
        }, returning="representation").execute()
        db_story_id = inserted.data[0]["id"] if inserted.data else None
        
        return {
            "message": "Story submitted successfully and is pending approval",
            "story_id": db_story_id,
            "submitted_at": "2024-01-01T00:00:00Z"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error submitting story: {str(e)}")

# User-specific endpoints
@app.get("/api/my/stories")
async def get_my_stories(current_user: Dict[str, Any] = Depends(get_current_user)):
    """Get current user's stories"""
    stories = (supabase.table("stories").select("*").eq("user_id", current_user["id"]).execute().data) or []
    
    result = []
    for story in stories:
        result.append({
            "id": story["id"],
            "title": story["title"],
            "content": story["content"],
            "category": story["category"],
            "region": story.get("region"),
            "is_approved": story.get("is_approved", False),
            "created_at": story.get("created_at")
        })
    
    return {"stories": result}

@app.get("/api/my/legal-advice")
async def get_my_legal_advice(current_user: Dict[str, Any] = Depends(get_current_user)):
    """Get current user's legal advice history"""
    requests = (supabase.table("legal_advice_requests").select("*").eq("user_id", current_user["id"]).order("created_at", desc=True).execute().data) or []
    
    result = []
    for req in requests:
        result.append({
            "id": req["id"],
            "description": req["description"],
            "region": req.get("region"),
            "advice_generated": req.get("advice_generated"),
            "case_type": req.get("case_type"),
            "created_at": req.get("created_at")
        })
    
    return {"legal_advice": result}

@app.get("/api/my/appeal-letters")
async def get_my_appeal_letters(current_user: Dict[str, Any] = Depends(get_current_user)):
    """Get current user's appeal letters"""
    appeals = (supabase.table("appeal_letters").select("*").eq("user_id", current_user["id"]).order("created_at", desc=True).execute().data) or []
    
    result = []
    for appeal in appeals:
        result.append({
            "id": appeal["id"],
            "name": appeal["name"],
            "case_type": appeal["case_type"],
            "location": appeal["location"],
            "english_letter": appeal.get("english_letter"),
            "amharic_letter": appeal.get("amharic_letter"),
            "created_at": appeal.get("created_at")
        })
    
    return {"appeal_letters": result}

@app.post("/api/approve-story/{story_id}")
async def approve_story(story_id: int, current_user: Dict[str, Any] = Depends(get_current_admin_user)):
    """Approve a story (admin only)"""
    found = supabase.table("stories").select("id").eq("id", story_id).limit(1).execute()
    if not found.data:
        raise HTTPException(status_code=404, detail="Story not found")
    supabase.table("stories").update({"is_approved": True}).eq("id", story_id).execute()
    
    return {
        "message": "Story approved successfully",
        "story_id": story.id
    }

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "Netsanet API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 