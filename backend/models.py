from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(100), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    is_admin = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Story(Base):
    __tablename__ = "stories"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    category = Column(String(100), nullable=False)
    region = Column(String(100))
    is_approved = Column(Boolean, default=False)  # For moderation
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationship
    user = relationship("User", back_populates="stories")

class LegalAdviceRequest(Base):
    __tablename__ = "legal_advice_requests"
    
    id = Column(Integer, primary_key=True, index=True)
    description = Column(Text, nullable=False)
    region = Column(String(100))
    advice_generated = Column(Text)
    case_type = Column(String(100))
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationship
    user = relationship("User", back_populates="legal_requests")

class AppealLetter(Base):
    __tablename__ = "appeal_letters"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    case_type = Column(String(100), nullable=False)
    incident_date = Column(String(50), nullable=False)
    location = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    evidence = Column(Text)
    contact_info = Column(String(255), nullable=False)
    english_letter = Column(Text)
    amharic_letter = Column(Text)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationship
    user = relationship("User", back_populates="appeal_letters")

class SupportOrganization(Base):
    __tablename__ = "support_organizations"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    region = Column(String(100), nullable=False)
    services = Column(Text, nullable=False)  # JSON string of services
    contact = Column(String(100), nullable=False)
    address = Column(String(255), nullable=False)
    website = Column(String(255))
    is_active = Column(Boolean, default=True)
    created_by = Column(Integer, ForeignKey("users.id"))  # Admin who created/updated
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

# Add relationships to User model
User.stories = relationship("Story", back_populates="user")
User.legal_requests = relationship("LegalAdviceRequest", back_populates="user")
User.appeal_letters = relationship("AppealLetter", back_populates="user") 