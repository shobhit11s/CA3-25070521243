# TalentLoop — Modern Freelance Marketplace

TalentLoop is a full-featured, startup-quality freelance marketplace connecting ambitious clients with world-class freelancers offering web development, graphic design, video editing, content creation, and digital marketing services.

---

## 🚀 Tech Stack

- **Frontend**: React (Vite) + Vanilla CSS3 (Clean white `#ffffff`, deep navy text `#0f172a`, violet accents `#7c3aed`) + JavaScript (ES6+)
- **Backend**: Node.js + Express.js
- **Database**: MongoDB (managed locally via MongoDB Compass)
- **Authentication**: JSON Web Tokens (JWT) + bcryptjs password hashing
- **Icons**: Lucide React
- **API Communication**: Axios with Bearer token interceptor

---

## 📁 Project Structure

```
talentloop/
  ├── client/
  │   ├── src/
  │   │   ├── components/      # Navbar, Footer, ProjectCard, FreelancerCard, Modals, ProtectedRoute
  │   │   ├── context/         # AuthContext with token persistence
  │   │   ├── pages/           # 14 complete functional pages
  │   │   ├── services/        # Axios API client
  │   │   ├── App.jsx          # Router & Route guards
  │   │   ├── index.css        # Rich CSS design system & responsive tokens
  │   │   └── main.jsx         # Vite entrypoint
  │   ├── index.html
  │   ├── vite.config.js       # Vite dev server with proxy to backend
  │   └── package.json
  │
  └── server/
      ├── config/              # MongoDB connection (db.js)
      ├── controllers/         # Auth, Project, Proposal, Contract, Message, Review, Admin, User
      ├── middleware/          # JWT protect, role authorize, central errorHandler
      ├── models/              # User, Project, Proposal, Contract, Milestone, Conversation, Message, Review
      ├── routes/              # Express API routers
      ├── utils/               # JWT token generator
      ├── seed.js              # Realistic seed script for demo users, projects, contracts, reviews
      ├── test_e2e.js          # Automated end-to-end integration test suite
      ├── server.js            # Express application entrypoint
      └── package.json
```

---

## 👥 User Roles & Features

### 1. Client
- **Register & Login** with JWT authentication.
- **Post, Edit, and Delete** project listings with categories, budgets (fixed/hourly), deadline, and skills.
- **Review Proposals**: View bids, delivery estimates, and cover letters.
- **Hiring Workflow**: Accepting a proposal automatically creates an active contract and initial milestone, rejecting other bids.
- **Milestone Escrow & Progress Tracking**: Add milestones, review freelancer submissions, approve milestones, and complete contracts.
- **Direct Messaging**: Chat in real-time with hired freelancers.
- **Verified Reviews**: Submit 5-star ratings and testimonials for completed contracts.

### 2. Freelancer
- **Register & Login** with professional title, skills, hourly rate, and portfolio links.
- **Explore & Filter Projects**: Search by keywords, category, budget type, and budget range; sort by newest, budget, or proposals.
- **Submit Proposals**: Bid price, delivery days, and cover letter (duplicate proposals strictly blocked).
- **Freelancer Dashboard**: Track submitted proposals and ongoing contracts.
- **Milestone Deliverables**: Update milestones to "In Progress", submit deliverable notes for client approval.
- **Direct Messaging**: Communicate directly with project clients.
- **Public Profile**: Showcase rating, reviews, portfolio links, and completed projects.

### 3. Admin
- **Protected Admin Control Center** (`/admin`).
- **Platform Analytics**: Total users, open/active/completed projects, total proposals, active contracts.
- **User Management**: Search, filter by role, and suspend/unsuspend accounts.
- **Project Moderation**: Review user-flagged projects with reported reasons and dismiss or remove listings.

---

## ⚡ Quick Start & Development Setup

### 1. Prerequisites
- **Node.js** (v18+) & **npm**
- **MongoDB** running locally on port `27017`
- **MongoDB Compass** (optional graphical client)

### 2. Connect to MongoDB locally & via MongoDB Compass
1. Ensure the MongoDB service is running on your machine:
   ```bash
   # On macOS via Homebrew:
   brew services start mongodb/brew/mongodb-community
   ```
2. Open **MongoDB Compass** and connect using:
   ```
   mongodb://127.0.0.1:27017/talentloop
   ```
3. You will see collections: `users`, `projects`, `proposals`, `contracts`, `milestones`, `conversations`, `messages`, `reviews`.

---

### 3. Install Dependencies

In the server directory:
```bash
cd talentloop/server
npm install
```

In the client directory:
```bash
cd talentloop/client
npm install
```

---

### 4. Seed Demo Data (Optional but Recommended)

Populate the database with realistic demo accounts, projects, proposals, contracts, messages, and reviews:
```bash
cd talentloop/server
npm run seed
```

---

### 5. Running the Application

Open two separate terminal windows:

#### Terminal 1 — Backend Server:
```bash
cd talentloop/server
npm run dev
```
*(Backend runs on `http://localhost:5050`)*

#### Terminal 2 — Frontend Client:
```bash
cd talentloop/client
npm run dev
```
*(Frontend runs on `http://localhost:5173`)*

Open your browser at: **[http://localhost:5173](http://localhost:5173)**

---

## 🔑 Demo Login Credentials

The login page provides **1-Click Demo Login** buttons for instant access, or you can log in manually:

| Role | Email | Password |
|---|---|---|
| **Client** | `sarah.client@talentloop.com` | `password123` |
| **Client** | `marcus.client@talentloop.com` | `password123` |
| **Freelancer** | `elena.dev@talentloop.com` | `password123` |
| **Freelancer** | `david.design@talentloop.com` | `password123` |
| **Freelancer** | `maya.content@talentloop.com` | `password123` |
| **Admin** | `admin@talentloop.com` | `password123` |

---

## 🧪 Automated End-to-End Verification

A comprehensive automated test suite covers all 13 core workflows:
```bash
cd talentloop/server
node test_e2e.js
```

All 13 test suites verify:
1. Client authentication
2. Freelancer authentication
3. Admin authentication
4. Project creation
5. Proposal submission
6. Duplicate proposal rejection
7. Hiring workflow & contract generation
8. Milestone deliverable submission
9. Milestone approval
10. Contract completion
11. Verified review creation & automatic rating aggregation
12. Direct messaging thread
13. Admin metrics & moderation
