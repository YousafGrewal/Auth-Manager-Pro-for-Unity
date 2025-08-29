# INSTALLATION

## Backend
```bash
cd backend
cp .env.example .env
# edit .env with your values
npm install
npm run dev
```
- Ensure MongoDB is running (local or Atlas).
- Update `CORS_ORIGIN` to the URL you will open the frontend from (e.g., `http://localhost:5500`).

## Frontend (static, no build)
Serve `/frontend` with any static server (e.g. VS Code Live Server, `python -m http.server`, or an nginx/apache root).

## Unity Client
- Add `AuthManager.cs` to your project.
- In scene, add an empty GameObject with `AuthManager` component and set `apiBaseURL` to your backend URL.
