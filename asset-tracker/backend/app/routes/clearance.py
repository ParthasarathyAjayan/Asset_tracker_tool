from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.utils.config import ADMIN_SECRET

from app.database import get_db

router = APIRouter()

@router.get("/exit-clearance/{employee_id}")
def check_clearance(employee_id: str, db: Session = Depends(get_db)):

    # Active assignments
    assigned_assets = db.execute(
        text("""
            SELECT asset_code
            FROM asset_assignments
            WHERE employee_id = :eid
            AND is_active = TRUE
        """),
        {"eid": employee_id}
    ).fetchall()

    if assigned_assets:
        return {
            "clearance": False,
            "reason": "Assets still assigned",
            "assets": [row.asset_code for row in assigned_assets]
        }

    # Missing assets previously held
    missing_assets = db.execute(
        text("""
            SELECT DISTINCT aa.asset_code
            FROM asset_assignments aa
            JOIN assets a ON a.asset_code = aa.asset_code
            WHERE aa.employee_id = :eid
            AND a.status = 'missing'
        """),
        {"eid": employee_id}
    ).fetchall()

    if missing_assets:
        return {
            "clearance": False,
            "reason": "Employee linked to missing assets",
            "assets": [row.asset_code for row in missing_assets]
        }

    return {
        "clearance": True,
        "message": "Employee cleared"
    }


@router.post("/exit-clearance/approve")
def approve_clearance(employee_id: str, secret: str, db: Session = Depends(get_db)):

    if secret != ADMIN_SECRET:
        raise HTTPException(status_code=403, detail="Invalid admin secret")

    # Check active assignments
    active_assets = db.execute(
        text("""
            SELECT 1 FROM asset_assignments
            WHERE employee_id = :eid
            AND is_active = TRUE
        """),
        {"eid": employee_id}
    ).fetchone()

    if active_assets:
        raise HTTPException(
            status_code=400,
            detail="Employee still has assigned assets"
        )

    # Deactivate employee
    db.execute(
        text("""
            UPDATE employees
            SET status = 'inactive'
            WHERE employee_id = :eid
        """),
        {"eid": employee_id}
    )

    db.commit()

    return {"message": "Exit clearance approved"}
