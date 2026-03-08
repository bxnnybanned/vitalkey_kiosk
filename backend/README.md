# VitalKey Backend (FastAPI + XAMPP MySQL)

## 1) Setup database in XAMPP

1. Start `Apache` and `MySQL` in XAMPP Control Panel.
2. Open `http://localhost/phpmyadmin`.
3. Import file: `backend/schema.sql`.

This creates database `vitalkey_kiosk` and seed rows.

## 2) Python setup

```powershell
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

## 3) Environment variables

Copy `.env.example` values into your terminal env (or your own loader):

```powershell
$env:DB_HOST="127.0.0.1"
$env:DB_PORT="3306"
$env:DB_USER="root"
$env:DB_PASSWORD=""
$env:DB_NAME="vitalkey_kiosk"
```

## 4) Run API

```powershell
uvicorn main:app --reload --port 8000
```

## 5) Flow endpoints (from top of kiosk flow)

- `POST /api/session/start` body: `{ "kiosk_code": "KIOSK-001" }`
- `POST /api/consent/accept` body: `{ "session_token": "...", "agree_terms": true, "agree_biometric": true }`
- `GET /api/patients/search?q=maria`
- `POST /api/patients/verify-returning` body: `{ "session_token": "...", "patient_name": "Maria Santos", "id_number": "104582" }`
- `POST /api/patients/register` body:
  `{ "session_token": "...", "full_name": "...", "age": 30, "gender": "Female", "address": "...", "contact": "..." }`
