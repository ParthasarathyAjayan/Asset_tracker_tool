
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import Optional
import uuid
from datetime import datetime
from app.utils.config import ADMIN_SECRET
from app.database import get_db

router = APIRouter()

@router.get("/assets/count")
def count_assets(db: Session = Depends(get_db)):
    result = db.execute(
        text("SELECT COUNT(*) AS total FROM assets")
    ).fetchone()
    return {"count": result.total or 0}

@router.get("/assets/{asset_code}")
def get_asset(asset_code: str, db: Session = Depends(get_db)):

    result = db.execute(
        text("""
            SELECT 
                a.asset_code,
                c.name AS category,
                a.type,
                a.brand,
                a.model,
                a.serial_number,
                a.status,
                a.location,
                a.warranty_applicable,
                a.warranty_end_date,
                a.remarks,
                aa.employee_id,
                e.name AS employee_name,
                e.email AS employee_email,
                e.location AS employee_location
            FROM assets a
            JOIN categories c ON a.category_id = c.id
            LEFT JOIN asset_assignments aa ON a.asset_code = aa.asset_code 
                AND aa.is_active = TRUE
            LEFT JOIN employees e ON aa.employee_id = e.employee_id
            WHERE a.asset_code = :code
        """),
        {"code": asset_code}
    ).fetchone()

    if not result:
        raise HTTPException(status_code=404, detail="Asset not found")

    return dict(result._mapping)

@router.post("/assign")
def assign_asset(asset_code: str, employee_id: str, db: Session = Depends(get_db)):

    # Check asset exists
    asset = db.execute(
        text("SELECT status FROM assets WHERE asset_code = :code"),
        {"code": asset_code}
    ).fetchone()

    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")

    if asset.status == "assigned":
        raise HTTPException(status_code=400, detail="Asset already assigned")

    # Check employee exists
    employee = db.execute(
        text("SELECT employee_id FROM employees WHERE employee_id = :eid AND status='active'"),
        {"eid": employee_id}
    ).fetchone()

    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    # Insert assignment
    db.execute(
        text("""
            INSERT INTO asset_assignments (asset_code, employee_id)
            VALUES (:code, :eid)
        """),
        {"code": asset_code, "eid": employee_id}
    )

    # Update asset status
    db.execute(
        text("""
            UPDATE assets
            SET status='assigned',
                updated_at=CURRENT_TIMESTAMP
            WHERE asset_code=:code
        """),
        {"code": asset_code}
    )

    db.commit()

    return {"message": "Asset assigned successfully"}

@router.post("/return")
def return_asset(asset_code: str, remarks: str = "", db: Session = Depends(get_db)):

    # Check active assignment
    assignment = db.execute(
        text("""
            SELECT id FROM asset_assignments
            WHERE asset_code = :code
            AND is_active = TRUE
        """),
        {"code": asset_code}
    ).fetchone()

    if not assignment:
        raise HTTPException(status_code=400, detail="Asset not currently assigned")

    # Close assignment
    db.execute(
        text("""
            UPDATE asset_assignments
            SET returned_date = CURRENT_TIMESTAMP,
                is_active = FALSE
            WHERE asset_code = :code
            AND is_active = TRUE
        """),
        {"code": asset_code}
    )

    # Update asset status
    db.execute(
        text("""
            UPDATE assets
            SET status = 'instock',
                updated_at = CURRENT_TIMESTAMP
            WHERE asset_code = :code
        """),
        {"code": asset_code}
    )

    # Log to asset history
    db.execute(
        text("""
            INSERT INTO asset_history (asset_code, action, old_status, new_status, remarks)
            VALUES (:code, 'return', 'assigned', 'instock', :remarks)
        """),
        {"code": asset_code, "remarks": remarks}
    )

    db.commit()

    return {"message": "Asset returned to stock"}

@router.post("/repair")
def send_to_repair(asset_code: str, repair_employee_id: str, remarks: str = "", db: Session = Depends(get_db)):

    # Close previous repair entries
    db.execute(
    text("""
        UPDATE repair_tracking
        SET is_active = FALSE
        WHERE asset_code = :code
        AND is_active = TRUE
    """),
    {"code": asset_code}
)

    # Close assignment if exists
    db.execute(
        text("""
            UPDATE asset_assignments
            SET returned_date = CURRENT_TIMESTAMP,
                is_active = FALSE
            WHERE asset_code = :code
            AND is_active = TRUE
        """),
        {"code": asset_code}
    )

    # Update asset status
    db.execute(
        text("""
            UPDATE assets
            SET status = 'repair',
                updated_at = CURRENT_TIMESTAMP
            WHERE asset_code = :code
        """),
        {"code": asset_code}
    )

    # Add repair tracking
    db.execute(
        text("""
            INSERT INTO repair_tracking (asset_code, repair_assignee_id)
            VALUES (:code, :emp)
        """),
        {"code": asset_code, "emp": repair_employee_id}
    )

    # Log to asset history
    db.execute(
        text("""
            INSERT INTO asset_history (asset_code, action, old_status, new_status, employee_id, remarks)
            VALUES (:code, 'repair', 'assigned', 'repair', :emp, :remarks)
        """),
        {"code": asset_code, "emp": repair_employee_id, "remarks": remarks}
    )

    db.commit()

    return {"message": "Asset moved to repair"}

@router.post("/repair/complete")
def complete_repair(asset_code: str, db: Session = Depends(get_db)):

    # Update asset status
    db.execute(
        text("""
            UPDATE assets
            SET status = 'instock',
                type = 'Repaired',
                updated_at = CURRENT_TIMESTAMP
            WHERE asset_code = :code
        """),
        {"code": asset_code}
    )

    # Close repair record
    db.execute(
        text("""
            UPDATE repair_tracking
            SET is_active = FALSE
            WHERE asset_code = :code
            AND is_active = TRUE
        """),
        {"code": asset_code}
    )

    db.commit()

    return {"message": "Asset repaired and moved to stock"}

@router.post("/missing")
def mark_missing(asset_code: str, remarks: str = "", db: Session = Depends(get_db)):

    # Close assignment if active
    db.execute(
        text("""
            UPDATE asset_assignments
            SET returned_date = CURRENT_TIMESTAMP,
                is_active = FALSE
            WHERE asset_code = :code
            AND is_active = TRUE
        """),
        {"code": asset_code}
    )

    # Update asset status
    db.execute(
        text("""
            UPDATE assets
            SET status = 'missing',
                updated_at = CURRENT_TIMESTAMP
            WHERE asset_code = :code
        """),
        {"code": asset_code}
    )

    # Log to asset history
    db.execute(
        text("""
            INSERT INTO asset_history (asset_code, action, new_status, remarks)
            VALUES (:code, 'missing', 'missing', :remarks)
        """),
        {"code": asset_code, "remarks": remarks}
    )

    db.commit()

    return {"message": "Asset marked as missing"}

@router.post("/missing/recover")
def recover_missing(asset_code: str, db: Session = Depends(get_db)):

    db.execute(
        text("""
            UPDATE assets
            SET status = 'instock',
                updated_at = CURRENT_TIMESTAMP
            WHERE asset_code = :code
        """),
        {"code": asset_code}
    )

    db.commit()

    return {"message": "Missing asset recovered and moved to stock"}

@router.post("/retire")
def retire_asset(asset_code: str, secret: str, remarks: str = "", db: Session = Depends(get_db)):

    if secret != ADMIN_SECRET:
        raise HTTPException(status_code=403, detail="Invalid admin secret")

    # Close assignment
    db.execute(
        text("""
            UPDATE asset_assignments
            SET returned_date = CURRENT_TIMESTAMP,
                is_active = FALSE
            WHERE asset_code = :code
            AND is_active = TRUE
        """),
        {"code": asset_code}
    )

    # Update asset status
    db.execute(
        text("""
            UPDATE assets
            SET status = 'retired',
                updated_at = CURRENT_TIMESTAMP
            WHERE asset_code = :code
        """),
        {"code": asset_code}
    )

    # Log to asset history
    db.execute(
        text("""
            INSERT INTO asset_history (asset_code, action, new_status, remarks)
            VALUES (:code, 'retire', 'retired', :remarks)
        """),
        {"code": asset_code, "remarks": remarks}
    )

    db.commit()

    return {"message": "Asset retired successfully"}

@router.get("/assets")
def list_assets(db: Session = Depends(get_db)):

    result = db.execute(
        text("""
            SELECT
                a.asset_code,
                c.name AS category,
                a.type,
                a.brand,
                a.model,
                a.serial_number,
                a.status,
                a.location,
                a.warranty_end_date,
                aa.employee_id,
                e.name AS employee_name
            FROM assets a
            JOIN categories c ON a.category_id = c.id
            LEFT JOIN asset_assignments aa
                ON aa.asset_code = a.asset_code
                AND aa.is_active = TRUE
            LEFT JOIN employees e
                ON e.employee_id = aa.employee_id
            ORDER BY a.created_at DESC
        """)
    )

    return [dict(row._mapping) for row in result]


@router.post("/assets/add")
def add_asset(
    asset_code: Optional[str] = None,
    category_id: int = None,
    type: str = None,
    brand: str = None,
    model: str = None,
    serial_number: str = None,
    location: str = None,
    db: Session = Depends(get_db),
):

    if not asset_code:
        # Get category name first
        category_result = db.execute(
            text("SELECT name FROM categories WHERE id = :id"),
            {"id": category_id}
        ).fetchone()
        
        category_name = category_result.name if category_result else "XXX"
        prefix = category_name[:3].upper()
        
        # Add date in DDMMYY format (without spaces)
        date_str = datetime.now().strftime("%d%m%y")
        
        # Generate unique barcode by incrementing number until we find one that doesn't exist
        counter = 1
        while True:
            asset_code = f"{prefix}{date_str}{counter:03d}"
            existing = db.execute(
                text("SELECT asset_code FROM assets WHERE asset_code = :code"),
                {"code": asset_code}
            ).fetchone()
            if not existing:
                break
            counter += 1

    existing = db.execute(
        text("""
            SELECT status FROM assets
            WHERE asset_code = :code
        """),
        {"code": asset_code}
    ).fetchone()

    # Asset exists
    if existing:
        status_update = ""
        if existing.status == "repair":
            status_update = ", status='instock'"

            # Close repair entry
            db.execute(
                text("""
                    UPDATE repair_tracking
                    SET is_active = FALSE
                    WHERE asset_code = :code
                """),
                {"code": asset_code}
            )

        db.execute(
            text(f"""
                UPDATE assets
                SET category_id=:cat,
                    type=:type,
                    brand=:brand,
                    model=:model,
                    serial_number=:sn,
                    location=:loc,
                    updated_at=CURRENT_TIMESTAMP
                    {status_update}
                WHERE asset_code=:code
            """),
            {
                "code": asset_code,
                "cat": category_id,
                "type": type,
                "brand": brand,
                "model": model,
                "sn": serial_number,
                "loc": location,
            }
        )

        db.commit()

        return {"message": "Asset updated", "asset_code": asset_code}

    # New asset
    db.execute(
        text("""
            INSERT INTO assets
            (asset_code, category_id, type, brand, model,
             serial_number, status, location)
            VALUES
            (:code, :cat, :type, :brand, :model,
             :sn, 'instock', :loc)
        """),
        {
            "code": asset_code,
            "cat": category_id,
            "type": type,
            "brand": brand,
            "model": model,
            "sn": serial_number,
            "loc": location,
        }
    )

    db.commit()

    return {"message": "Asset added successfully", "asset_code": asset_code}


@router.get("/repair/list")
def repair_list(db: Session = Depends(get_db)):

    result = db.execute(
        text("""
            SELECT
                r.asset_code,
                e.name,
                r.repair_start_date
            FROM repair_tracking r
            LEFT JOIN employees e
                ON r.repair_assignee_id = e.employee_id
            WHERE r.is_active = TRUE
        """)
    )

    return [dict(row._mapping) for row in result]








