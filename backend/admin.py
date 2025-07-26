from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Story, LegalAdviceRequest, AppealLetter, SupportOrganization, User
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
async def get_pending_stories(current_user: User = Depends(get_current_admin_user), db: Session = Depends(get_db)):
    """Get all pending stories for moderation (admin only)"""
    stories = db.query(Story).filter(Story.is_approved == False).all()
    
    result = []
    for story in stories:
        result.append({
            "id": story.id,
            "title": story.title,
            "content": story.content,
            "category": story.category,
            "region": story.region,
            "user_id": story.user_id,
            "created_at": story.created_at.isoformat() if story.created_at else None
        })
    
    return {"pending_stories": result}

@router.post("/stories/approve")
async def approve_story(approval: StoryApproval, current_user: User = Depends(get_current_admin_user), db: Session = Depends(get_db)):
    """Approve or reject a story (admin only)"""
    story = db.query(Story).filter(Story.id == approval.story_id).first()
    
    if not story:
        raise HTTPException(status_code=404, detail="Story not found")
    
    story.is_approved = approval.approved
    db.commit()
    
    return {
        "message": f"Story {'approved' if approval.approved else 'rejected'} successfully",
        "story_id": story.id
    }

@router.get("/stats")
async def get_stats(current_user: User = Depends(get_current_admin_user), db: Session = Depends(get_db)):
    """Get application statistics (admin only)"""
    total_stories = db.query(Story).count()
    approved_stories = db.query(Story).filter(Story.is_approved == True).count()
    pending_stories = db.query(Story).filter(Story.is_approved == False).count()
    legal_requests = db.query(LegalAdviceRequest).count()
    appeal_letters = db.query(AppealLetter).count()
    organizations = db.query(SupportOrganization).filter(SupportOrganization.is_active == True).count()
    total_users = db.query(User).count()
    admin_users = db.query(User).filter(User.is_admin == True).count()
    
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
async def delete_story(story_id: int, current_user: User = Depends(get_current_admin_user), db: Session = Depends(get_db)):
    """Delete a story (admin only)"""
    story = db.query(Story).filter(Story.id == story_id).first()
    
    if not story:
        raise HTTPException(status_code=404, detail="Story not found")
    
    db.delete(story)
    db.commit()
    
    return {"message": "Story deleted successfully"}

@router.get("/legal-requests")
async def get_legal_requests(current_user: User = Depends(get_current_admin_user), db: Session = Depends(get_db)):
    """Get all legal advice requests (admin only)"""
    requests = db.query(LegalAdviceRequest).order_by(LegalAdviceRequest.created_at.desc()).all()
    
    result = []
    for req in requests:
        result.append({
            "id": req.id,
            "description": req.description,
            "region": req.region,
            "case_type": req.case_type,
            "user_id": req.user_id,
            "created_at": req.created_at.isoformat() if req.created_at else None
        })
    
    return {"legal_requests": result}

@router.get("/appeal-letters")
async def get_appeal_letters(current_user: User = Depends(get_current_admin_user), db: Session = Depends(get_db)):
    """Get all appeal letters (admin only)"""
    appeals = db.query(AppealLetter).order_by(AppealLetter.created_at.desc()).all()
    
    result = []
    for appeal in appeals:
        result.append({
            "id": appeal.id,
            "name": appeal.name,
            "case_type": appeal.case_type,
            "location": appeal.location,
            "user_id": appeal.user_id,
            "created_at": appeal.created_at.isoformat() if appeal.created_at else None
        })
    
    return {"appeal_letters": result}

# Support Organization Management (Admin Only)
@router.get("/organizations")
async def get_organizations(current_user: User = Depends(get_current_admin_user), db: Session = Depends(get_db)):
    """Get all support organizations (admin only)"""
    organizations = db.query(SupportOrganization).order_by(SupportOrganization.created_at.desc()).all()
    
    result = []
    for org in organizations:
        result.append({
            "id": org.id,
            "name": org.name,
            "region": org.region,
            "services": json.loads(org.services) if org.services else [],
            "contact": org.contact,
            "address": org.address,
            "website": org.website,
            "is_active": org.is_active,
            "created_at": org.created_at.isoformat() if org.created_at else None
        })
    
    return {"organizations": result}

@router.post("/organizations")
async def create_organization(org_data: OrganizationCreate, current_user: User = Depends(get_current_admin_user), db: Session = Depends(get_db)):
    """Create a new support organization (admin only)"""
    db_org = SupportOrganization(
        name=org_data.name,
        region=org_data.region,
        services=json.dumps(org_data.services),
        contact=org_data.contact,
        address=org_data.address,
        website=org_data.website,
        created_by=current_user.id
    )
    
    db.add(db_org)
    db.commit()
    db.refresh(db_org)
    
    return {
        "message": "Organization created successfully",
        "organization_id": db_org.id
    }

@router.put("/organizations/{org_id}")
async def update_organization(org_id: int, org_data: OrganizationUpdate, current_user: User = Depends(get_current_admin_user), db: Session = Depends(get_db)):
    """Update a support organization (admin only)"""
    org = db.query(SupportOrganization).filter(SupportOrganization.id == org_id).first()
    
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")
    
    if org_data.name is not None:
        org.name = org_data.name
    if org_data.region is not None:
        org.region = org_data.region
    if org_data.services is not None:
        org.services = json.dumps(org_data.services)
    if org_data.contact is not None:
        org.contact = org_data.contact
    if org_data.address is not None:
        org.address = org_data.address
    if org_data.website is not None:
        org.website = org_data.website
    if org_data.is_active is not None:
        org.is_active = org_data.is_active
    
    db.commit()
    
    return {"message": "Organization updated successfully"}

@router.delete("/organizations/{org_id}")
async def delete_organization(org_id: int, current_user: User = Depends(get_current_admin_user), db: Session = Depends(get_db)):
    """Delete a support organization (admin only)"""
    org = db.query(SupportOrganization).filter(SupportOrganization.id == org_id).first()
    
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")
    
    db.delete(org)
    db.commit()
    
    return {"message": "Organization deleted successfully"}

@router.get("/users")
async def get_users(current_user: User = Depends(get_current_admin_user), db: Session = Depends(get_db)):
    """Get all users (admin only)"""
    users = db.query(User).all()
    
    result = []
    for user in users:
        result.append({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "is_admin": user.is_admin,
            "is_active": user.is_active,
            "created_at": user.created_at.isoformat() if user.created_at else None
        })
    
    return {"users": result} 