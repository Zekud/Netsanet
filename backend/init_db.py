from database import engine, SessionLocal
from models import Base, SupportOrganization, Story, User
from auth import get_password_hash
import json

def init_db():
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    # Get database session
    db = SessionLocal()
    
    try:
        # Check if admin user already exists
        existing_admin = db.query(User).filter(User.is_admin == True).first()
        if not existing_admin:
            # Create admin user
            admin_user = User(
                username="admin",
                email="admin@netsanet.org",
                hashed_password=get_password_hash("admin123"),
                is_admin=True,
                is_active=True
            )
            db.add(admin_user)
            db.commit()
            print("Admin user created: username='admin', password='admin123'")
        
        # Check if organizations already exist
        existing_orgs = db.query(SupportOrganization).count()
        if existing_orgs == 0:
            # Get admin user for created_by field
            admin_user = db.query(User).filter(User.is_admin == True).first()
            
            # Add initial support organizations
            organizations = [
                {
                    "name": "Ethiopian Women Lawyers Association (EWLA)",
                    "region": "Addis Ababa",
                    "services": json.dumps(["Legal Aid", "Counseling", "Rights Education"]),
                    "contact": "+251 11 123 4567",
                    "address": "Bole, Addis Ababa",
                    "website": "www.ewla.org.et",
                    "created_by": admin_user.id if admin_user else None
                },
                {
                    "name": "Association for Women's Sanctuary and Development (AWSAD)",
                    "region": "Addis Ababa",
                    "services": json.dumps(["Shelter", "Counseling", "Rehabilitation"]),
                    "contact": "+251 11 987 6543",
                    "address": "Kazanchis, Addis Ababa",
                    "website": "www.awsad.org",
                    "created_by": admin_user.id if admin_user else None
                },
                {
                    "name": "Tiruzer Ethiopia",
                    "region": "Addis Ababa",
                    "services": json.dumps(["Legal Support", "Advocacy", "Training"]),
                    "contact": "+251 11 456 7890",
                    "address": "Piazza, Addis Ababa",
                    "website": "www.tiruzer.org",
                    "created_by": admin_user.id if admin_user else None
                },
                {
                    "name": "Women's Association of Tigray",
                    "region": "Tigray",
                    "services": json.dumps(["Legal Aid", "Community Support", "Education"]),
                    "contact": "+251 34 123 4567",
                    "address": "Mekelle, Tigray",
                    "website": "www.wat.org.et",
                    "created_by": admin_user.id if admin_user else None
                },
                {
                    "name": "Oromia Women's Association",
                    "region": "Oromia",
                    "services": json.dumps(["Legal Support", "Counseling", "Advocacy"]),
                    "contact": "+251 22 987 6543",
                    "address": "Adama, Oromia",
                    "website": "www.owa.org.et",
                    "created_by": admin_user.id if admin_user else None
                }
            ]
            
            for org_data in organizations:
                org = SupportOrganization(**org_data)
                db.add(org)
            
            # Add initial case stories (if admin user exists)
            if admin_user:
                stories = [
                    {
                        "title": "Finding Strength Through Legal Support",
                        "content": "After experiencing workplace discrimination, I reached out to EWLA. They provided me with legal guidance and helped me understand my rights under Ethiopian labor law. With their support, I was able to file a formal complaint and received compensation for the discrimination I faced.",
                        "category": "workplace_discrimination",
                        "region": "Addis Ababa",
                        "is_approved": True,
                        "user_id": admin_user.id
                    },
                    {
                        "title": "Domestic Violence - A Path to Freedom",
                        "content": "I was trapped in an abusive relationship for years. AWSAD provided me with shelter and counseling services. They helped me understand that I had rights and options. Today, I'm living independently and helping other women in similar situations.",
                        "category": "domestic_violence",
                        "region": "Addis Ababa",
                        "is_approved": True,
                        "user_id": admin_user.id
                    },
                    {
                        "title": "Property Rights Victory",
                        "content": "When my husband passed away, his family tried to take our property. Tiruzer Ethiopia helped me understand my inheritance rights under Ethiopian law. With their legal support, I successfully defended my property rights.",
                        "category": "property_rights",
                        "region": "Addis Ababa",
                        "is_approved": True,
                        "user_id": admin_user.id
                    }
                ]
                
                for story_data in stories:
                    story = Story(**story_data)
                    db.add(story)
            
            db.commit()
            print("Database initialized with sample data!")
        else:
            print("Database already contains data, skipping initialization.")
            
    except Exception as e:
        print(f"Error initializing database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    init_db() 