from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from difflib import SequenceMatcher

from app.database import get_db

router = APIRouter()

@router.get("/categories")
def get_categories(db: Session = Depends(get_db)):

    result = db.execute(
        text("SELECT id, name FROM categories WHERE is_active = TRUE")
    )

    categories = [
        {"id": row.id, "name": row.name}
        for row in result
    ]

    return categories

@router.post("/categories/check-duplicate")
def check_duplicate_category(name: str, db: Session = Depends(get_db)):
    """Check if category name is similar to existing categories"""
    
    # Get all existing categories
    result = db.execute(
        text("SELECT name FROM categories WHERE is_active = TRUE")
    )
    
    existing_categories = [row.name for row in result]
    
    similar_categories = []
    
    for existing_name in existing_categories:
        # Check for exact match (case-insensitive)
        if existing_name.lower() == name.lower():
            similar_categories.append({
                "name": existing_name,
                "similarity": 1.0,
                "type": "exact"
            })
        else:
            # Calculate similarity ratio
            similarity = SequenceMatcher(None, name.lower(), existing_name.lower()).ratio()
            # Consider similar if more than 70% match
            if similarity > 0.7:
                similar_categories.append({
                    "name": existing_name,
                    "similarity": round(similarity, 2),
                    "type": "similar"
                })
    
    return {
        "has_similar": len(similar_categories) > 0,
        "similar_categories": similar_categories
    }

@router.post("/categories/add")
def add_category(name: str, db: Session = Depends(get_db)):
    """Add a new category"""
    
    if not name or not name.strip():
        raise HTTPException(status_code=400, detail="Category name is required")
    
    name = name.strip()
    
    # Check if category already exists (exact match, case-insensitive)
    existing = db.execute(
        text("SELECT id FROM categories WHERE LOWER(name) = LOWER(:name) AND is_active = TRUE"),
        {"name": name}
    ).fetchone()
    
    if existing:
        raise HTTPException(status_code=400, detail=f"Category '{name}' already exists")
    
    # Insert new category
    db.execute(
        text("""
            INSERT INTO categories (name, is_active)
            VALUES (:name, TRUE)
        """),
        {"name": name}
    )
    
    db.commit()
    
    # Get the newly created category
    result = db.execute(
        text("SELECT id, name FROM categories WHERE LOWER(name) = LOWER(:name) AND is_active = TRUE"),
        {"name": name}
    ).fetchone()
    
    return {
        "message": f"Category '{name}' created successfully",
        "id": result.id,
        "name": result.name
    }
