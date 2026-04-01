# Comprehensive Project Report: SkillSwap

## 1. Project Overview

### Project Name
SkillSwap

### Objective and Problem Statement
SkillSwap aims to connect college students to exchange skills, knowledge, and experiences. Many students want to learn new skills (e.g., coding, languages, design) but struggle to find accessible, peer-to-peer learning opportunities. SkillSwap solves this by creating a platform where peers can connect, match complementary skills, and schedule learning sessions together.

### Target Users
College students, peer learners, and individuals looking to share or acquire specific skills in an informal, collaborative environment.

### Key Features
- **User Authentication**: Secure login and registration with JWT.
- **Google OAuth Integration**: Connect Google Accounts for seamless interactions and calendar syncing.
- **Skill Feed & Matching**: Discover users whose offered skills match your wanted skills.
- **Connection System**: Send, accept, and manage connection requests with peers.
- **Real-time Messaging**: Chat live with connections to discuss skill exchanges.
- **Session Scheduling**: Propose and confirm learning sessions, automatically generating Google Meet links.
- **Reviews & Ratings**: Review sessions and rate peers to build trust within the community.

---

## 2. Technology Stack

### Frontend
- **Framework**: React 19 via Vite
- **Styling**: Tailwind CSS v4, Framer Motion (for animations)
- **State Management / Data Fetching**: React Context API, React Query (@tanstack/react-query)
- **Routing**: React Router DOM
- **Forms & Validation**: React Hook Form, Zod
- **Networking**: Axios
- **WebSockets**: @stomp/stompjs, sockjs-client

### Backend
- **Language**: Java 21
- **Framework**: Spring Boot 3.2.5 (Spring Web, Spring Security, Spring WebSockets)
- **ORM**: Spring Data JPA / Hibernate
- **Authentication**: JWT (JSON Web Tokens)
- **API Integrations**: Google Calendar API (via OAuth)

### Database
- **Primary Database**: PostgreSQL

### Tools and Platforms
- **Version Control**: Git
- **Build Tools**: Maven (Backend), Vite/npm (Frontend)

---

## 3. System Architecture

### High-level Architecture
The application follows a standard Client-Server monolithic architecture.
- **Frontend (SPA)**: Serves the user interface and communicates with the backend via RESTful APIs and WebSockets.
- **Backend (REST API)**: Handles business logic, authentication, and database operations.
- **Database**: Stores all persistent application state.

### Flow of Data
1. **Client Request**: The React application makes HTTP requests (via Axios) to the Spring Boot backend.
2. **Authentication Flow**: Upon login, the backend validates credentials and returns a JWT token. This token is included in the `Authorization` header of subsequent API requests.
3. **Real-time Flow (WebSockets)**: For real-time messaging, the client establishes a persistent STOMP over WebSocket connection with the backend (`/ws` endpoint).
4. **Third-Party Integrations**: The backend securely communicates with Google APIs to manage calendar invites on behalf of users.

### API Structure Overview
The APIs are structured logically by domain (e.g., `/api/auth`, `/api/users`, `/api/sessions`, `/api/connections`, `/api/chat`). All protected routes are secured through Spring Security filter chains that intercept requests to validate JWT signatures.

---

## 4. Module-wise Implementation

### 1. Authentication & Security (`AuthController`, `OAuth2Controller`)
- **Purpose**: Manage secure access to the platform.
- **Functionality**: Local email/password registration and login, JWT issuance, and Google OAuth callback handling.
- **Key Classes**: `User`, `AuthService`, Spring Security configurations.

### 2. User Profiles (`UserController`, `FileController`)
- **Purpose**: Manage individual user data and preferences.
- **Functionality**: Update offered/wanted skills, branch, year, and "about" me sections, as well as file handling (profile pictures/attachments).
- **Key Classes**: `User`, `FileService`.

### 3. Matchmaking / Suggestions (`SuggestionController`)
- **Purpose**: Suggest relevant skill exchange partners.
- **Functionality**: Query the database for users that offer the skills the current user wants, filtering out existing connections.
- **Key Classes**: `SuggestionService`.

### 4. Connections (`ConnectionController`)
- **Purpose**: Establish links between peers.
- **Functionality**: Send connection requests, and explicitly Accept/Reject/Block them.
- **Key Classes**: `Connection` entity, `ConnectionStatus` Enum (`PENDING`, `ACCEPTED`, etc.).

### 5. Sessions (`SessionController`)
- **Purpose**: Facilitate the core objective: scheduling real-time skill exchanges.
- **Functionality**: Propose time and duration, generate Google Meet links upon confirmation, and synchronize with Google Calendar.
- **Key Classes**: `Session` entity, `SessionStatus` Enum (`PROPOSED`, `CONFIRMED`, `COMPLETED`, `CANCELLED`), `GoogleCalendarService`.

### 6. Real-time Messaging (`ChatController`, `MessageController`)
- **Purpose**: Allow real-time communication between connected pairs.
- **Functionality**: Persist message history and broadcast incoming messages to correct users via STOMP broker.
- **Key Classes**: `Message` entity, `@MessageMapping` handlers.

---

## 5. Database Design

### Primary Tables & Relationships

1. **`users`**
   - **Fields**: `id`, `name`, `email`, `password`, `branch`, `year`, `skills_offered` (TEXT), `skills_wanted` (TEXT), `rating`, `google_refresh_token`.
   - **Relationships**: Core table, participates as foreign key in most other tables.

2. **`connections`**
   - **Fields**: `id`, `sender_id` (FK to User), `receiver_id` (FK to User), `status`, `created_at`.
   - **Relationships**: Many-to-One with two `User` entities.

3. **`sessions`**
   - **Fields**: `id`, `user1_id` (FK), `user2_id` (FK), `start_time`, `end_time`, `meet_link`, `google_event_id`, `status`.
   - **Relationships**: Links two specific users who have agreed to a skill exchange session.

4. **`messages`**
   - **Fields**: `id`, `sender_id` (FK), `receiver_id` (FK), `message`, `file_url`, `timestamp`.
   - **Relationships**: Chat history modeling.

5. **`reviews`**
   - **Fields**: `id`, `reviewer_id` (FK), `reviewed_id` (FK), `session_id` (FK), `rating`, `comment`.
   - **Relationships**: Ties a specific learning session with user feedback.

---

## 6. Features Implemented So Far

- **User Onboarding & JWT Auth**: Full sign-up flow allowing users to document their target skills.
- **Home/Feed Page**: Dynamic feed identifying mutually beneficial skill matches.
- **Connection Management**: Fully working request and approval workflow (e.g. `ConnectionsPage.jsx`).
- **Integrated Chat**: Real-time communication functioning via WebSockets, allowing peers to discuss logistics independently.
- **Session Lifecycle**: End-to-end flow to propose, agree upon, and finalize a video chat session link without leaving the application.
- **Google Calendar Integration**: Automatically blocks out time and generates a `meet_link` securely.

---

## 7. Changes & Improvements (Major Updates)

> **Refactoring & Standardization**: 
> A significant effort was invested in standardizing the database dialect to strictly enforce PostgreSQL settings for the production environment, correcting a previously misconfigured `org.hibernate.dialect.PostgreSQLDialect` property. 

- **Monorepo Setup**: Brought the completely built React frontend and Spring Boot API under a single unified project structure.
- **Bug Fixes**: Corrected duplicate email validation failure during signup and concealed the "Connect Google Account" button on the UI (`ProfilePage.jsx`) when the OAuth link is already established.
- **Failsafe Calendar API (`fix(backend)`)**: Wrapped the Google Calendar API call with fault-tolerance, ensuring that if external communication with Google fails, the session can STILL be confirmed in the DB, preventing the system from freezing users out on `500 Internal Server Error`.

---

## 8. Issues Faced & Solutions

> **Issue 1: Production 500 Errors on Session Confirmation**
> **Problem:** When confirming a session, the backend strictly mandated creating a Google Calendar event. In the production environment, rate limits or network jitter with Google APIs resulted in a hard crash (`500 Error`) for the end user, completely stopping their workflow.
> **Solution:** **Failsafe Design.** Extracted the `GoogleCalendarService` and implemented a graceful fallback. The session is now correctly designated as `CONFIRMED` in the database even if the external API call fails.

- **Issue 2: Real-time Communication Role-based Access Control**:
   - **Problem:** Malicious users could potentially accept connections they weren't assigned to or hijack websocket sessions.
   - **Solution:** Enforced strict sender/receiver checks within the STOMP interceptors and session confirm handlers, dropping unauthorized attempts.
- **Issue 3: Dialect Misconfiguration**:
   - **Problem:** JSON/Array Mapping errors mapping Hibernate entities to PostgreSQL columns (`skillsOffered` and `skillsWanted`).
   - **Solution:** Configured `StringListConverter.java` to properly serialize List items into TEXT blobs, paired with correcting the `application.properties` driver setting.

---

## 9. Integration Details

- **Google OAuth**: A secondary Auth system that fetches and securely stores a long-lived `google_refresh_token` onto the `User` object, facilitating backend-driven calendar actions.
- **Google Calendar API**: Utilizes the refresh token to programmatically create events and read back an automated Google Meet conference link for scheduled `Session` entities.
- **WebSockets / STOMP (`sockjs-client`)**: Provides a long-polling fallback wrapper around standard WebSockets, guaranteeing chat reliability across diverse campus networks.
- **JWT**: Industry standard JSON Web Tokens handle the stateless security mechanism for securing endpoints.

---

## 10. Current Project Status

- **Completed**:
  - Full Auth System (JWT + OAuth)
  - Profile Management, Connections, and Match/Suggestions Engine
  - Real-time WebSockets Chat Engine
  - End-to-end Session scheduling (Proposal -> Confirmation)
  - Google Calendar backend integration
- **Partially Done**:
  - File Uploads (Controllers defined, integration with Amazon S3 or proper frontend form handling may be incomplete).
  - Reviews & reputation system (End points and Database design exist, full UI integration pending).
- **Pending**:
  - Live push notifications or email alerts when offline.

---

## 11. Future Scope

- **In-App Video Conferencing**: Incorporate WebRTC to host video calls directly on the platform instead of routing users externally to Google Meet.
- **Email/Push Notifications**: Notify users contextually when they receive a connection request or a chat message while away from the app.
- **Gamification & Badges**: Introduce leaderboards or verifiable skill "badges" to incentivize high-quality instruction and reviews.
- **AI-Powered Matching**: Upgrade the `SuggestionService` to recommend clusters/groups based on semantic analysis of the "About" text and specific "Skills Wanted."
