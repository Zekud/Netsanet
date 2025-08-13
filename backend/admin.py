from fastapi import APIRouter, Depends, HTTPException
from database import get_supabase
from auth import get_current_admin_user
from typing import List, Optional
from pydantic import BaseModel
import json

router = APIRouter(prefix="/admin", tags=["admin"])

class StoryApproval(BaseModel):
    story_id: int
    approved: bool

class OrganizationCreate(BaseModel):
    name: str
    region: str
    services: List[str]
    contact: str
    address: str
    website: Optional[str] = None

class OrganizationUpdate(BaseModel):
    name: Optional[str] = None
    region: Optional[str] = None
    services: Optional[List[str]] = None
    contact: Optional[str] = None
    address: Optional[str] = None
    website: Optional[str] = None
    is_active: Optional[bool] = None

@router.get("/stories/pending")
async def get_pending_stories(current_user = Depends(get_current_admin_user)):
    """Get all pending stories for moderation (admin only)"""
    supabase = get_supabase()
    res = supabase.table("stories").select("*").eq("is_approved", False).execute()
    stories = res.data or []
    
    result = []
    for story in stories:
        result.append({
            "id": story["id"],
            "title": story["title"],
            "content": story["content"],
            "category": story["category"],
            "region": story.get("region"),
            "user_id": story["user_id"],
            "created_at": story.get("created_at")
        })
    
    return {"pending_stories": result}

@router.post("/stories/approve")
async def approve_story(approval: StoryApproval, current_user = Depends(get_current_admin_user)):
    """Approve or reject a story (admin only)"""
    supabase = get_supabase()
    # Ensure story exists
    found = supabase.table("stories").select("id").eq("id", approval.story_id).limit(1).execute()
    if not found.data:
        raise HTTPException(status_code=404, detail="Story not found")
    supabase.table("stories").update({"is_approved": approval.approved}).eq("id", approval.story_id).execute()
    
    return {
        "message": f"Story {'approved' if approval.approved else 'rejected'} successfully",
        "story_id": story.id
    }

@router.get("/stats")
async def get_stats(current_user = Depends(get_current_admin_user)):
    """Get application statistics (admin only)"""
    supabase = get_supabase()
    total_stories = len((supabase.table("stories").select("id").execute().data or []))
    approved_stories = len((supabase.table("stories").select("id").eq("is_approved", True).execute().data or []))
    pending_stories = len((supabase.table("stories").select("id").eq("is_approved", False).execute().data or []))
    legal_requests = len((supabase.table("legal_advice_requests").select("id").execute().data or []))
    appeal_letters = len((supabase.table("appeal_letters").select("id").execute().data or []))
    organizations = len((supabase.table("support_organizations").select("id").eq("is_active", True).execute().data or []))
    total_users = len((supabase.table("users").select("id").execute().data or []))
    admin_users = len((supabase.table("users").select("id").eq("is_admin", True).execute().data or []))
    
    return {
        "total_stories": total_stories,
        "approved_stories": approved_stories,
        "pending_stories": pending_stories,
        "legal_requests": legal_requests,
        "appeal_letters": appeal_letters,
        "active_organizations": organizations,
        "total_users": total_users,
        "admin_users": admin_users
    }

@router.delete("/stories/{story_id}")
async def delete_story(story_id: int, current_user = Depends(get_current_admin_user)):
    """Delete a story (admin only)"""
    supabase = get_supabase()
    found = supabase.table("stories").select("id").eq("id", story_id).limit(1).execute()
    if not found.data:
        raise HTTPException(status_code=404, detail="Story not found")
    supabase.table("stories").delete().eq("id", story_id).execute()
    
    return {"message": "Story deleted successfully"}

@router.get("/legal-requests")
async def get_legal_requests(current_user = Depends(get_current_admin_user)):
    """Get all legal advice requests (admin only)"""
    supabase = get_supabase()
    resp = supabase.table("legal_advice_requests").select("*").order("created_at", desc=True).execute()
    requests = resp.data or []
    
    result = []
    for req in requests:
        result.append({
            "id": req["id"],
            "description": req["description"],
            "region": req.get("region"),
            "case_type": req.get("case_type"),
            "user_id": req["user_id"],
            "created_at": req.get("created_at")
        })
    
    return {"legal_requests": result}

@router.get("/appeal-letters")
async def get_appeal_letters(current_user = Depends(get_current_admin_user)):
    """Get all appeal letters (admin only)"""
    supabase = get_supabase()
    resp = supabase.table("appeal_letters").select("*").order("created_at", desc=True).execute()
    appeals = resp.data or []
    
    result = []
    for appeal in appeals:
        result.append({
            "id": appeal["id"],
            "name": appeal["name"],
            "case_type": appeal["case_type"],
            "location": appeal["location"],
            "user_id": appeal["user_id"],
            "created_at": appeal.get("created_at")
        })
    
    return {"appeal_letters": result}

# Support Organization Management (Admin Only)
@router.get("/organizations")
async def get_organizations(current_user = Depends(get_current_admin_user)):
    """Get all support organizations (admin only)"""
    supabase = get_supabase()
    resp = supabase.table("support_organizations").select("*").order("created_at", desc=True).execute()
    organizations = resp.data or []
    
    result = []
    for org in organizations:
        result.append({
            "id": org["id"],
            "name": org["name"],
            "region": org["region"],
            "services": org.get("services") or [],
            "contact": org["contact"],
            "address": org["address"],
            "website": org.get("website"),
            "is_active": org.get("is_active", True),
            "created_at": org.get("created_at")
        })
    
    return {"organizations": result}

@router.post("/organizations")
async def create_organization(org_data: OrganizationCreate, current_user = Depends(get_current_admin_user)):
    """Create a new support organization (admin only)"""
    supabase = get_supabase()
    inserted = supabase.table("support_organizations").insert({
        "name": org_data.name,
        "region": org_data.region,
        "services": org_data.services,
        "contact": org_data.contact,
        "address": org_data.address,
        "website": org_data.website,
        "created_by": current_user["id"],
        "is_active": True,
    }, returning="representation").execute()
    if not inserted.data:
        raise HTTPException(status_code=500, detail="Failed to create organization")
    db_org = inserted.data[0]
    
    return {
        "message": "Organization created successfully",
        "organization_id": db_org["id"]
    }

@router.put("/organizations/{org_id}")
async def update_organization(org_id: int, org_data: OrganizationUpdate, current_user = Depends(get_current_admin_user)):
    """Update a support organization (admin only)"""
    supabase = get_supabase()
    # Build update payload only with provided fields
    payload = {}
    if org_data.name is not None:
        payload["name"] = org_data.name
    if org_data.region is not None:
        payload["region"] = org_data.region
    if org_data.services is not None:
        payload["services"] = org_data.services
    if org_data.contact is not None:
        payload["contact"] = org_data.contact
    if org_data.address is not None:
        payload["address"] = org_data.address
    if org_data.website is not None:
        payload["website"] = org_data.website
    if org_data.is_active is not None:
        payload["is_active"] = org_data.is_active
    # Ensure org exists
    found = supabase.table("support_organizations").select("id").eq("id", org_id).limit(1).execute()
    if not found.data:
        raise HTTPException(status_code=404, detail="Organization not found")
    supabase.table("support_organizations").update(payload).eq("id", org_id).execute()
    
    return {"message": "Organization updated successfully"}

@router.delete("/organizations/{org_id}")
async def delete_organization(org_id: int, current_user = Depends(get_current_admin_user)):
    """Delete a support organization (admin only)"""
    supabase = get_supabase()
    found = supabase.table("support_organizations").select("id").eq("id", org_id).limit(1).execute()
    if not found.data:
        raise HTTPException(status_code=404, detail="Organization not found")
    supabase.table("support_organizations").delete().eq("id", org_id).execute()
    
    return {"message": "Organization deleted successfully"}

@router.get("/users")
async def get_users(current_user = Depends(get_current_admin_user)):
    """Get all users (admin only)"""
    supabase = get_supabase()
    resp = supabase.table("users").select("*").execute()
    users = resp.data or []
    
    result = []
    for user in users:
        result.append({
            "id": user["id"],
            "username": user["username"],
            "email": user["email"],
            "is_admin": user.get("is_admin", False),
            "is_active": user.get("is_active", True),
            "created_at": user.get("created_at")
        })
    
    return {"users": result} 