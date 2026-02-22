from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.database import get_db

router = APIRouter()

@router.get("/employees")
def get_employees(db: Session = Depends(get_db)):

    result = db.execute(
        text("""
            SELECT employee_id, name, email, location
            FROM employees
            WHERE status = 'active'
        """)
    )

    employees = [
        {
            "employee_id": row.employee_id,
            "name": row.name,
            "email": row.email,
            "location": row.location,
        }
        for row in result
    ]

    return employees

from fastapi import HTTPException

@router.post("/employees/add")
def add_employee(
    employee_id: str,
    name: str,
    email: str,
    location: str,
    db: Session = Depends(get_db)
):

    exists = db.execute(
        text("SELECT 1 FROM employees WHERE employee_id=:id"),
        {"id": employee_id}
    ).fetchone()

    if exists:
        raise HTTPException(status_code=400, detail="Employee already exists")

    db.execute(
        text("""
            INSERT INTO employees
            (employee_id, name, email, location, status)
            VALUES (:id, :name, :email, :loc, 'active')
        """),
        {"id": employee_id, "name": name, "email": email, "loc": location}
    )

    db.commit()
    return {"message": "Employee added"}


from fastapi import HTTPException

@router.post("/employees/deactivate")
def deactivate_employee(employee_id: str, db: Session = Depends(get_db)):
    # Check for active asset assignments
    active_assets = db.execute(
        text("""
            SELECT 1 FROM asset_assignments
            WHERE employee_id = :id
            AND is_active = TRUE
        """),
        {"id": employee_id}
    ).fetchone()
    if active_assets:
        raise HTTPException(status_code=400, detail="Cannot deactivate employee with assigned assets.")

    db.execute(
        text("""
            UPDATE employees
            SET status='inactive'
            WHERE employee_id=:id
        """),
        {"id": employee_id}
    )

    db.commit()
    return {"message": "Employee deactivated"}


@router.get("/employees/{employee_id}/assets")
def get_employee_assets(employee_id: str, db: Session = Depends(get_db)):
    """Get count of active assets for an employee"""
    result = db.execute(
        text("""
            SELECT COUNT(*) as count FROM asset_assignments
            WHERE employee_id = :id
            AND is_active = TRUE
        """),
        {"id": employee_id}
    ).fetchone()
    
    return {"active_assets": result.count if result else 0}


