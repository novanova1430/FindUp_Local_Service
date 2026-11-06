# FixFlow Local Development & Setup Guide

This guide walks through configuring and running both the **React 19 Frontend** and the **Django 5 + PostgreSQL Backend** on your local workstation (macOS, Linux, or Windows with WSL).

---

## 📋 Prerequisites

Ensure the following tools are installed on your machine:
- **Node.js**: v18.0.0 or higher (`node -v`)
- **npm**: v9.0.0 or higher (`npm -v`)
- **Python**: 3.10, 3.11, or 3.12 (`python3 --version`)
- **PostgreSQL**: 14, 15, or 16 (`psql --version`)
- **Git**

---

## 🐘 1. PostgreSQL Database Setup

1. Open your PostgreSQL terminal:
   ```bash
   psql -U postgres
   ```
2. Create the database and dedicated user:
   ```sql
   CREATE DATABASE fixflow_db;
   CREATE USER fixflow_user WITH ENCRYPTED PASSWORD 'FixFlowSecret2026!';
   GRANT ALL PRIVILEGES ON DATABASE fixflow_db TO fixflow_user;
   ALTER DATABASE fixflow_db OWNER TO fixflow_user;
   \q
   ```
3. Test connection:
   ```bash
   psql -U fixflow_user -d fixflow_db -h localhost
   ```

---

## 🐍 2. Django Backend Setup

1. Open a terminal and navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Create a Python virtual environment:
   ```bash
   python3 -m venv venv
   ```
3. Activate the virtual environment:
   - **macOS / Linux**:
     ```bash
     source venv/bin/activate
     ```
   - **Windows (Command Prompt / PowerShell)**:
     ```powershell
     venv\Scripts\activate
     ```
4. Install all Python dependencies:
   ```bash
   pip install --upgrade pip
   pip install -r requirements.txt
   ```
5. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` to match your local PostgreSQL credentials:
   ```env
   DEBUG=True
   SECRET_KEY=django-insecure-your-local-dev-secret-key-change-in-production
   ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0

   DB_NAME=fixflow_db
   DB_USER=fixflow_user
   DB_PASSWORD=FixFlowSecret2026!
   DB_HOST=localhost
   DB_PORT=5432

   CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
   ```
6. Run database migrations:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```
7. Seed the database with demo users, categories, and services:
   ```bash
   python manage.py shell < seed_data.py
   ```
8. Start the Django development server:
   ```bash
   python manage.py runserver 8000
   ```
   The Django REST API will be available at: `http://127.0.0.1:8000/api/v1/`  
   The Django Admin Panel will be at: `http://127.0.0.1:8000/admin/`

---

## ⚛️ 3. React Frontend Setup

1. Open a second terminal window at the project root directory:
   ```bash
   cd /path/to/FixFlow
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## 🔄 4. Connecting the React Frontend to Your Live Django API

FixFlow is designed with dual-engine flexibility:
- **Default Mode**: Operates in standalone browser mode using `storageService.ts` (instant preview in AI Studio or offline).
- **Live Django API Mode**:
  1. Log into FixFlow as Administrator (`admin@fixflow.demo`).
  2. Navigate to **Admin Dashboard -> Platform Settings**.
  3. Under **Backend API Connection**, enter your Django API base URL (default: `http://127.0.0.1:8000/api/v1`).
  4. Toggle the **Connect to Live Backend** switch to **Enabled** and click **Save Settings**.
  5. The React `apiClient.ts` will now route network calls directly to your local Django REST API server!
