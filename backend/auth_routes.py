from fastapi import APIRouter, Depends, HTTPException, status
from database import get_supabase
from auth import get_password_hash, authenticate_user, create_access_token, get_current_user, ACCESS_TOKEN_EXPIRE_MINUTES
from pydantic import BaseModel
from datetime import timedelta

router = APIRouter(prefix="/auth", tags=["authentication"])

class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: int | str
    username: str
    email: str
    is_admin: bool
    is_active: bool

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

@router.post("/register", response_model=Token)
async def register(user_data: UserCreate):
    """Register a new user"""
    supabase = get_supabase()
    # Check if username already exists
    existing_user = supabase.table("users").select("id").eq("username", user_data.username).limit(1).execute()
    if existing_user.data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    # Check if email already exists
    existing_email = supabase.table("users").select("id").eq("email", user_data.email).limit(1).execute()
    if existing_email.data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    inserted = supabase.table("users").insert({
        "username": user_data.username,
        "email": user_data.email,
        "hashed_password": hashed_password,
        "is_admin": False,
        "is_active": True,
    }, returning="representation").execute()
    if not inserted.data:
        raise HTTPException(status_code=500, detail="Failed to create user")
    db_user = inserted.data[0]
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(db_user["id"])}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": db_user["id"],
            "username": db_user["username"],
            "email": db_user["email"],
            "is_admin": db_user.get("is_admin", False),
            "is_active": db_user.get("is_active", True),
        }
    }

@router.post("/login", response_model=Token)
async def login(user_data: UserLogin):
    """Login user"""
    user = authenticate_user(user_data.username, user_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Inactive user",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user["id"])}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user["id"],
            "username": user["username"],
            "email": user["email"],
            "is_admin": user.get("is_admin", False),
            "is_active": user.get("is_active", True),
        }
    }

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user = Depends(get_current_user)):
    """Get current user information"""
    return {
        "id": current_user["id"],
        "username": current_user["username"],
        "email": current_user["email"],
        "is_admin": current_user.get("is_admin", False),
        "is_active": current_user.get("is_active", True),
    } 