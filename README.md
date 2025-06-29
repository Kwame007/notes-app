# NoteApp

A modern note-taking web application built with Angular and Supabase. Organize, create, and manage your notes with a clean UI and secure authentication.

---

## Project Description

NoteApp is a full-featured note-taking app that allows users to create, edit, archive, and manage notes. It features user authentication, tag management, and a responsive, accessible design. All data is securely stored using Supabase.

---

## Setup & Run Instructions

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up environment variables:**
   - Create a `.env` file or set the following in your environment:
     ```
     NG_APP_SUPABASE_URL=your_supabase_url
     NG_APP_SUPABASE_KEY=your_supabase_key
     ```

3. **Run the development server:**

   ```bash
   npm start
   ```

   Visit [http://localhost:4200](http://localhost:4200) in your browser.

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## Key Features

- **User Authentication:** Sign up, log in, and log out securely (email/password & Google OAuth).
- **Create & Edit Notes:** Rich note creation and editing with title, content, and tags.
- **Archive & Restore:** Archive notes and restore them anytime.
- **Tag Management:** Add tags to notes for easy organization.
- **Responsive UI:** Works great on desktop and mobile.
- **Supabase Backend:** All data is stored and synced via Supabase.
- **Protected Routes:** Only authenticated users can access notes.

---

## Technologies Used

- **Angular 19**
- **Supabase** (`@supabase/supabase-js`)
- **RxJS**
- **SCSS** (custom theming)
- **@ngx-env/builder** (for environment management)
- **Karma/Jasmine** (unit testing)

---

## Component Overview

- **AuthFormComponent:** Handles user login, registration, and Google OAuth.
- **NotesDashboardComponent:** Displays all user notes, search, and navigation.
- **NoteCreateComponent:** Form for creating new notes with title, content, and tags.
- **NoteDetailComponent:** View and edit a single note in detail.
- **ArchivedNotesComponent:** View and manage archived notes.

**Core Services:**

- **AuthService:** Handles authentication and session management.
- **NotesServiceService:** CRUD operations for notes.
- **SupabaseService:** Supabase client integration.
- **AuthGuard:** Protects routes from unauthenticated access.

---

## Bonus Features (if implemented)

- **Dark Mode:** Toggle between light and dark themes.
- **Google OAuth:** One-click login with Google.
- **Rich Text Editing:** Enhanced note formatting.
- **Search & Filter:** Quickly find notes by title, content, or tags.
- **PWA Support:** Installable on mobile devices.

---

## License

MIT
