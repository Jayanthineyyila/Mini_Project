# CampusFix – College Issue Reporting System
### RGUKT Srikakulam (Rajiv Gandhi University of Knowledge Technologies)

CampusFix is a full-stack campus issue reporting and resolution system designed for students, wardens, and maintenance administrators at RGUKT Srikakulam.

---

## 🎨 Color Palette & Design System

| Role | Color | Hex | Usage |
|---|---|---|---|
| Primary (Maroon) | ![#8B1A2B](https://via.placeholder.com/15/8B1A2B/8B1A2B.png) | `#8B1A2B` | Headers, navbar, primary buttons, logo mark |
| Secondary (Navy) | ![#1E3A66](https://via.placeholder.com/15/1E3A66/1E3A66.png) | `#1E3A66` | Sub-headers, links, secondary buttons, dividers |
| Background | ![#FFFFFF](https://via.placeholder.com/15/FFFFFF/FFFFFF.png) | `#FFFFFF` | Page background |
| Surface / Card | ![#F7F8FA](https://via.placeholder.com/15/F7F8FA/F7F8FA.png) | `#F7F8FA` | Cards, panels, table stripes |
| Text (Body) | ![#1F1F1F](https://via.placeholder.com/15/1F1F1F/1F1F1F.png) | `#1F1F1F` | Body copy |
| Text (Muted) | ![#6B7280](https://via.placeholder.com/15/6B7280/6B7280.png) | `#6B7280` | Captions, timestamps |
| Status – Pending | ![#F5A623](https://via.placeholder.com/15/F5A623/F5A623.png) | `#F5A623` | Amber badge |
| Status – Ongoing | ![#1E88E5](https://via.placeholder.com/15/1E88E5/1E88E5.png) | `#1E88E5` | Blue badge |
| Status – Resolved | ![#2E7D32](https://via.placeholder.com/15/2E7D32/2E7D32.png) | `#2E7D32` | Green badge |

**Fonts:** Headings — *Merriweather*. Body/UI — *Inter*.

---

## 🚀 Key Features

### Student Portal
- **Auth**: JWT-based roll number & password authentication.
- **Report Issue**: Multi-step issue filing (Type, Campus Location, Photo, Description).
- **My Reports**: Dashboard with status tracking (`Pending` → `Ongoing` → `Resolved`).
- **Upvote Duplicate Issues**: Support existing reports ("+5 students facing this").

### Admin Dashboard
- **Kanban Board**: Drag-and-drop cards between Pending, Ongoing, and Resolved.
- **Analytics**: Issues by block (Bar chart), issues by type (Pie chart), avg. resolution time.
- **Management**: Bulk status updates, staff assignment, and CSV exports.

---

## 🛠️ Project Structure

```
campusfix/
├── client/ (Mini_Project)          # React + Vite + TypeScript Frontend
│   ├── public/
│   │   └── favicon.svg              # Custom CampusFix Tab Icon
│   └── src/
│       ├── components/              # UI components
│       ├── routes/                  # TanStack React Router routes
│       └── services/                # Axios API services
│
└── server/                          # Node.js + Express + MongoDB Backend
    ├── src/
    │   ├── config/                  # MongoDB & Cloudinary configuration
    │   ├── controllers/             # Auth, Complaint, Admin controllers
    │   ├── models/                  # User and Complaint schemas
    │   ├── routes/                  # Express REST routes
    │   └── server.js                # Express app listener
    └── .env
```

---

## 💻 Getting Started

### 1. Start Backend Server
```sh
cd server
npm install
npm run seed       # Seed initial admin (admin@rgukt.ac.in / admin123password)
npm run dev        # Runs Express API on http://localhost:5000
```

### 2. Start Frontend App
```sh
cd Mini_Project
npm install
npm run dev        # Runs Vite frontend on http://localhost:5173
```
