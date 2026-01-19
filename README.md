# Adult Media Gallery

This is a full-stack personal adult media gallery website built with Node.js, Express, MongoDB, HTML, CSS, and JavaScript. It features public viewing after age confirmation and admin-only upload/edit/delete functionality.

## Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- Cloudinary account (for cloud storage)

## Setup
1. **Clone or Download the Code**: Place the folder structure as provided.
2. **Install Dependencies**:
   - Navigate to `backend/` and run `npm install`.
3. **Environment Variables**:
   - Create `.env` in `backend/` with the variables listed above (replace with your values).
4. **Start MongoDB**:
   - If local, run `mongod`.
5. **Run the Server**:
   - In `backend/`, run `npm start` (or `npm run dev` for development).
   - Server starts on `http://localhost:3000`.
6. **Access the Site**:
   - Public gallery: `http://localhost:3000`
   - Admin dashboard: `http://localhost:3000/admin`
7. **Age Confirmation**: On first visit, confirm 18+ (sets a cookie).
8. **Admin Login**: Use the credentials from `.env` (default: admin/securepassword).
9. **Upload Media**: As admin, upload photos/videos; they go to Cloudinary, metadata to MongoDB.
10. **Search/View**: Public users can search and view in a responsive grid.

## Notes
- Media is stored only in Cloudinary; no local files persist.
- Ensure Cloudinary allows adult content (enable unsafe uploads if needed).
- In production, secure the admin password and use HTTPS.
- Videos use HTML5 player with controls.