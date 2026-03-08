import os
from datetime import datetime
from typing import Optional
from uuid import uuid4

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

try:
    import mysql.connector  # type: ignore
except Exception:
    mysql = None  # type: ignore

app = FastAPI(title="VitalKey Kiosk API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class StartSessionIn(BaseModel):
    kiosk_code: str = Field(min_length=1, max_length=50)


class TermsAcceptIn(BaseModel):
    session_token: str
    agree_terms: bool
    agree_biometric: bool


class ReturningVerifyIn(BaseModel):
    session_token: str
    patient_name: str = Field(min_length=1, max_length=120)
    id_number: str = Field(min_length=1, max_length=32)


class RegisterPatientIn(BaseModel):
    session_token: str
    full_name: str = Field(min_length=1, max_length=120)
    age: int = Field(ge=0, le=130)
    gender: str = Field(min_length=1, max_length=30)
    address: str = Field(min_length=1, max_length=255)
    contact: Optional[str] = Field(default="", max_length=30)


def _db_config() -> dict:
    return {
        "host": os.getenv("DB_HOST", "127.0.0.1"),
        "port": int(os.getenv("DB_PORT", "3306")),
        "user": os.getenv("DB_USER", "root"),
        "password": os.getenv("DB_PASSWORD", ""),
        "database": os.getenv("DB_NAME", "vitalkey_kiosk"),
    }


def get_conn():
    if mysql is None or getattr(mysql, "connector", None) is None:
        raise HTTPException(
            status_code=500,
            detail="mysql-connector-python is not installed in this backend environment.",
        )
    try:
        return mysql.connector.connect(**_db_config())
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Database connection failed: {exc}")


def now_utc() -> str:
    return datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")


@app.get("/")
def root():
    return {"message": "VitalKey backend is running"}


@app.get("/health")
def health():
    conn = get_conn()
    try:
        cur = conn.cursor()
        cur.execute("SELECT 1")
        cur.fetchone()
        return {"status": "ok", "db": "connected"}
    finally:
        conn.close()


@app.post("/api/session/start")
def start_session(payload: StartSessionIn):
    conn = get_conn()
    try:
        cur = conn.cursor(dictionary=True)
        cur.execute("SELECT id FROM kiosks WHERE kiosk_code = %s LIMIT 1", (payload.kiosk_code,))
        kiosk = cur.fetchone()
        if not kiosk:
            raise HTTPException(status_code=404, detail="Kiosk code not found.")

        token = str(uuid4())
        cur.execute(
            """
            INSERT INTO kiosk_sessions (session_token, kiosk_id, started_at, status)
            VALUES (%s, %s, %s, 'started')
            """,
            (token, kiosk["id"], now_utc()),
        )
        conn.commit()
        return {"session_token": token, "kiosk_id": kiosk["id"]}
    finally:
        conn.close()


@app.post("/api/consent/accept")
def accept_terms(payload: TermsAcceptIn):
    if not (payload.agree_terms and payload.agree_biometric):
        raise HTTPException(status_code=400, detail="Both consent checkboxes must be accepted.")

    conn = get_conn()
    try:
        cur = conn.cursor(dictionary=True)
        cur.execute(
            "SELECT id FROM kiosk_sessions WHERE session_token = %s LIMIT 1",
            (payload.session_token,),
        )
        session = cur.fetchone()
        if not session:
            raise HTTPException(status_code=404, detail="Session not found.")

        cur.execute(
            """
            INSERT INTO consent_logs (session_id, agree_terms, agree_biometric, accepted_at)
            VALUES (%s, %s, %s, %s)
            """,
            (session["id"], 1, 1, now_utc()),
        )
        cur.execute(
            "UPDATE kiosk_sessions SET status = 'consent_accepted' WHERE id = %s",
            (session["id"],),
        )
        conn.commit()
        return {"ok": True}
    finally:
        conn.close()


@app.get("/api/patients/search")
def search_patients(q: str, limit: int = 5):
    term = q.strip()
    if not term:
        return {"items": []}
    if limit < 1 or limit > 20:
        raise HTTPException(status_code=400, detail="limit must be between 1 and 20")

    conn = get_conn()
    try:
        cur = conn.cursor(dictionary=True)
        cur.execute(
            """
            SELECT id, patient_code, full_name
            FROM patients
            WHERE full_name LIKE %s
            ORDER BY full_name ASC
            LIMIT %s
            """,
            (f"%{term}%", limit),
        )
        rows = cur.fetchall()
        return {"items": rows}
    finally:
        conn.close()


@app.post("/api/patients/verify-returning")
def verify_returning(payload: ReturningVerifyIn):
    conn = get_conn()
    try:
        cur = conn.cursor(dictionary=True)
        cur.execute(
            "SELECT id FROM kiosk_sessions WHERE session_token = %s LIMIT 1",
            (payload.session_token,),
        )
        session = cur.fetchone()
        if not session:
            raise HTTPException(status_code=404, detail="Session not found.")

        cur.execute(
            """
            SELECT id, patient_code, id_number, full_name
            FROM patients
            WHERE full_name = %s
            LIMIT 1
            """,
            (payload.patient_name.strip(),),
        )
        patient = cur.fetchone()
        if not patient:
            raise HTTPException(status_code=404, detail="Patient not found.")

        is_valid = patient["id_number"] == payload.id_number.strip()
        if not is_valid:
            raise HTTPException(status_code=401, detail="Invalid ID number.")

        cur.execute(
            """
            INSERT INTO visits (session_id, patient_id, visit_type, created_at)
            VALUES (%s, %s, 'returning', %s)
            """,
            (session["id"], patient["id"], now_utc()),
        )
        cur.execute(
            "UPDATE kiosk_sessions SET status = 'patient_verified' WHERE id = %s",
            (session["id"],),
        )
        conn.commit()
        return {
            "ok": True,
            "patient": {
                "id": patient["id"],
                "patient_code": patient["patient_code"],
                "full_name": patient["full_name"],
            },
        }
    finally:
        conn.close()


@app.post("/api/patients/register")
def register_patient(payload: RegisterPatientIn):
    conn = get_conn()
    try:
        cur = conn.cursor(dictionary=True)
        cur.execute(
            "SELECT id FROM kiosk_sessions WHERE session_token = %s LIMIT 1",
            (payload.session_token,),
        )
        session = cur.fetchone()
        if not session:
            raise HTTPException(status_code=404, detail="Session not found.")

        patient_code = f"P{datetime.utcnow().strftime('%Y%m%d%H%M%S')}"
        id_number = f"{int(datetime.utcnow().timestamp()) % 1000000:06d}"
        cur.execute(
            """
            INSERT INTO patients (patient_code, id_number, full_name, age, gender, address, contact, created_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """,
            (
                patient_code,
                id_number,
                payload.full_name.strip(),
                payload.age,
                payload.gender.strip(),
                payload.address.strip(),
                payload.contact.strip(),
                now_utc(),
            ),
        )
        patient_id = cur.lastrowid
        cur.execute(
            """
            INSERT INTO visits (session_id, patient_id, visit_type, created_at)
            VALUES (%s, %s, 'new', %s)
            """,
            (session["id"], patient_id, now_utc()),
        )
        cur.execute(
            "UPDATE kiosk_sessions SET status = 'patient_registered' WHERE id = %s",
            (session["id"],),
        )
        conn.commit()
        return {
            "ok": True,
            "patient": {
                "id": patient_id,
                "patient_code": patient_code,
                "id_number": id_number,
                "full_name": payload.full_name.strip(),
            },
        }
    finally:
        conn.close()
