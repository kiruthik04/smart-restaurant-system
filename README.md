# Love, Rosie - Smart Restaurant System 🌹

A modern, full-stack restaurant management system built with **Spring Boot** and **React**.

## 🚀 Application Flow

### 👤 User Journey
```mermaid
graph TD
    A[Start] --> B{Has Account?}
    B -- No --> C[Sign Up]
    C --> |Mobile/Email Verification| D[Login]
    B -- Yes --> D
    D --> E[Home Page]
    E --> F[Browse Menu / Categories]
    F --> G[Add Items to Cart]
    G --> H[View Cart & Checkout]
    H --> I[Payment Gateway]
    I --> J[Order Placed]
    J --> K{Order Status}
    K --> |Preparing| L[Kitchen Dashboard]
    K --> |Served| M[Enjoy Meal!]
```

### 🔐 Authentication & Security Process
```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant DB
    participant Email/SMS

    User->>Frontend: Enters Credentials
    Frontend->>Backend: POST /api/auth/login
    Backend->>DB: Validate User
    alt Valid
        DB-->>Backend: User Details
        Backend->>Frontend: JWT Token + Profile (Mobile/Name)
        Frontend->>User: Redirect to Home
    else Invalid
        Backend-->>Frontend: 403 Forbidden
        Frontend-->>User: Show Error
    end
    
    rect rgb(240, 248, 255)
    note right of User: Mobile/Email Verification
    User->>Frontend: Request Mobile Change
    Frontend->>Backend: POST /api/auth/profile (New Mobile)
    Backend->>Email/SMS: Send OTP (Simulated)
    Email/SMS-->>User: Receive OTP
    User->>Frontend: Enter OTP
    Frontend->>Backend: POST /api/auth/verify-mobile-change
    Backend->>DB: Update Mobile Number
    end
```

### 👨‍🍳 Kitchen & Admin Workflow
```mermaid
stateDiagram-v2
    [*] --> NewOrder
    NewOrder --> Preparing : Kitchen Accepts
    Preparing --> Ready : Chef Completes
    Ready --> Served : Waiter Serves
    
    state Admin_Controls {
        [*] --> ManageMenu
        ManageMenu --> Add/Edit_Items
        ManageMenu --> Upload_Images
        
        [*] --> ManageUsers
        ManageUsers --> Promote_Roles
        
        [*] --> ManageTables
        ManageTables --> Generate_QR_Codes
    }
```

## 🛠️ Technology Stack

*   **Frontend**: React.js, Context API, CSS3 (Modern/Glassmorphism)
*   **Backend**: Java Spring Boot, Hibernate, Spring Security (JWT)
*   **Database**: MySQL (Dev) / TiDB (Prod)
*   **Tools**: Maven, NPM, Git

## 🏃‍♂️ Quick Start

### Backend
```bash
cd backend/smart-restaurant-backend
mvn clean spring-boot:run
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## 📱 Features
*   **Mobile Number Verification**: Secure OTP-based verification for signups and profile updates.
*   **Real-time Order Tracking**: Separation of concerns between User, Admin, and Kitchen views.
*   **Dynamic Menu**: Admin-managed menu with categories and image uploads.
*   **Responsive UI**: Optimized for mobile and desktop experiences.
