#!/usr/bin/env python3
"""
Script to create admin users for Netsanet
Run this script to create additional admin users.
"""

from database import SessionLocal
from models import User
from auth import get_password_hash

def create_admin_user(username: str, email: str, password: str):
    """Create a new admin user"""
    db = SessionLocal()
    
    try:
        # Check if user already exists
        existing_user = db.query(User).filter(User.username == username).first()
        if existing_user:
            print(f"User '{username}' already exists!")
            return
        
        # Create admin user
        admin_user = User(
            username=username,
            email=email,
            hashed_password=get_password_hash(password),
            is_admin=True,
            is_active=True
        )
        
        db.add(admin_user)
        db.commit()
        
        print(f"Admin user created successfully!")
        print(f"   Username: {username}")
        print(f"   Email: {email}")
        print(f"   Password: {password}")
        print(f"   Role: Admin")
        
    except Exception as e:
        print(f"Error creating admin user: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("Netsanet Admin User Creator")
    print("=" * 40)
    
    username = input("Enter username: ")
    email = input("Enter email: ")
    password = input("Enter password: ")
    
    if username and email and password:
        create_admin_user(username, email, password)
    else:
        print("All fields are required!") 