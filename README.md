# Laravel & React Project

This project combines a Laravel backend API with a React frontend. The backend handles all server-side logic, while the frontend is built with React to interact with the API.

## Prerequisites

Before you start, make sure you have the following installed on your system:

- PHP >= 8.0 (for Laravel)
- Composer (PHP dependency manager)
- Node.js >= 16 (for React)
- npm or yarn (for managing JavaScript dependencies)
- MySQL 
- Git (for version control)

## Setup Instructions

### 1. Clone the Repository

    Start by cloning the repository to your local machine:
```bash
    git clone https://github.com/Jhonwal/tour-backend.git
    cd tour-backend
```
### 2. Set Up Laravel (Backend)
    Install PHP Dependencies
```bash
    composer install
```
Set Up Environment File
```bash
    cp .env.example .env
```
Generate a new application key for Laravel:
```bash
    php artisan key:generate
```
Run the database migrations to set up the necessary tables:
```bash
    php artisan migrate (or importe the db file)
```
Now, serve the Laravel backend using Artisan:
```bash
    php artisan serve
```
 ### 3. Set up react frontend
 Now, navigate to the frontend folder: 
```bash
     cd tour-frontend
```
Install the necessary dependencies:
```bash
     npm install
```
Run the React development server:
```bash
     npm run dev

```
### How to Access the Project

1. **Backend (Laravel API)**: The backend will be running on `http://127.0.0.1:8000` (default). You can interact with the API by sending requests from the React frontend.

2. **Frontend (React app)**: The frontend will be running on `http://localhost:3000`. You can interact with the UI through your browser.

### Notes

Let me know if you need further adjustments to the README!
