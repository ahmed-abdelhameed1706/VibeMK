# Application Design Document

## Introduction

This document provides an overview of the application's design, including its features, functionalities, and technical details. It is intended to serve as a comprehensive guide for my personal reference during the development and maintenance of the application. It outlines the core components and structure of the project, ensuring that all aspects are clearly defined for my own use.

## Features

- User registration, login, and logout
- Email verification and password reset
- Group management (create, join, leave, and invitations)
- Video management (add, update, delete, and view)
- Group membership and video access control

## Functionalities

### Auth Controller

#### register

- **Purpose:** Collects user details and sends verification email.
- **Endpoints:**
  - **POST /api/auth/register**
  - **Request Body:** `{ name, email, password, confirmPassword }`
  - **Responses:** 200 OK, 400 Bad Request

#### login

- **Purpose:** Authenticates user and returns JWT.
- **Endpoints:**
  - **POST /api/auth/login**
  - **Request Body:** `{ email, password }`
  - **Responses:** 200 OK, 401 Unauthorized

#### logout

- **Purpose:** Terminates the user’s session by invalidating the current JWT.
- **Endpoints:**
  - **POST /api/auth/logout**
  - **Request Body:** `{}` (JWT in Authorization header)
  - **Responses:** 200 OK, 401 Unauthorized

#### verifyEmail

- **Purpose:** Confirms the user's email address by verifying the token.
- **Endpoints:**
  - **GET /api/auth/verify-email**
  - **Parameters:** `token` (verification token)
  - **Responses:** 200 OK, 400 Bad Request

#### getMe

- **Purpose:** Fetches the currently logged-in user’s profile data.
- **Endpoints:**
  - **GET /api/auth/me**
  - **Cookies:** `<JWT>`
  - **Responses:** 200 OK, 401 Unauthorized

#### forgotPassword

- **Purpose:** Initiates the password reset process by generating a reset token.
- **Endpoints:**
  - **POST /api/auth/forgot-password**
  - **Request Body:** `{ email }`
  - **Responses:** 200 OK, 400 Bad Request

#### resetPassword

- **Purpose:** Resets the user's password by validating the provided reset token.
- **Endpoints:**
  - **POST /api/auth/reset-password/:token**
  - **Request Body:** `{ token, newPassword, confirmPassword }`
  - **Responses:** 200 OK, 400 Bad Request

#### resendVerificationEmail

- **Purpose:** Resends the email verification link to the user’s registered email address.
- **Endpoints:**
  - **POST /api/auth/resend-verification-email**
  - **Request Body:** `{ email }`
  - **Responses:** 200 OK, 400 Bad Request

#### isTokenValid

- **Purpose:** Checks if the password reset token is still valid.
- **Endpoints:**
  - **GET /api/auth/validate-token**
  - **Parameters:** `token` (reset token)
  - **Responses:** 200 OK, 400 Bad Request

### Group Controller

#### createGroup

- **Purpose:** Creates a new group with a unique code and adds the current user as a member.
- **Endpoints:**
  - **POST /api/groups/create**
  - **Request Body:** `{ name }`
  - **Responses:** 200 OK, 400 Bad Request

#### getGroup

- **Purpose:** Retrieves a group based on its code and checks if the current user is a member.
- **Endpoints:**
  - **GET /api/groups/:code**
  - **Parameters:** `code` (group code)
  - **Responses:** 200 OK, 404 Not Found

#### getGroupsForUser

- **Purpose:** Fetches all groups the current user is a member of.
- **Endpoints:**
  - **GET /api/groups/user-groups**
  - **Cookies:** `<JWT>`
  - **Responses:** 200 OK, 401 Unauthorized

#### leaveGroup

- **Purpose:** Allows a user to leave a group and deletes the group if it becomes empty.
- **Endpoints:**
  - **POST /api/groups/:id/leave**
  - **Parameters:** `{ groupId }`
  - **Responses:** 200 OK, 400 Bad Request

#### joinGroup

- **Purpose:** Enables a user to join a group by adding them to the group's members.
- **Endpoints:**
  - **POST /api/groups/join**
  - **Request Body:** `{ code }`
  - **Responses:** 200 OK, 400 Bad Request

#### sendInvitationEmail

- **Purpose:** Sends an invitation email to join a group.
- **Endpoints:**
  - **POST /api/groups/send-invitation**
  - **Request Body:** `{ email, groupId }`
  - **Responses:** 200 OK, 400 Bad Request

### Video Controller

#### addVideo

- **Purpose:** Adds a new video to a group, associating it with the current user.
- **Endpoints:**
  - **POST /api/videos/add**
  - **Request Body:** `{ url, groupId }`
  - **Responses:** 200 OK, 400 Bad Request

#### updateVideo

- **Purpose:** Updates the URL of an existing video owned by the current user.
- **Endpoints:**
  - **PUT /api/videos/update/:id**
  - **Parameters:** `id` (video ID)
  - **Request Body:** `{ url }`
  - **Responses:** 200 OK, 400 Bad Request

#### deleteVideo

- **Purpose:** Deletes a video owned by the current user and removes its references.
- **Endpoints:**
  - **DELETE /api/videos/delete/:id**
  - **Parameters:** `id` (video ID)
  - **Responses:** 200 OK, 400 Bad Request

#### getVideosForUserPerGroup

- **Purpose:** Retrieves the list of videos uploaded by the selected user in a particular group.
- **Endpoints:**
  - **GET /api/videos/user/:userId/group/:groupId**
  - **Parameters:** `userId` (user ID), `groupId` (group ID)
  - **Responses:** 200 OK, 404 Not Found

#### addUserToSeenBy

- **Purpose:** Updates the video’s seenBy field to track which users have viewed the video.
- **Endpoints:**
  - **POST /api/videos/seen-by**
  - **Request Body:** `{ videoId, userId }`
  - **Responses:** 200 OK, 400 Bad Request

## Data Models

### User

- **Fields:**
  - `email: String` (required, unique)
  - `password: String` (required)
  - `fullName: String` (required)
  - `lastLogin: Date` (default: Date.now)
  - `isVerified: Boolean` (default: false)
  - `videos: [Video]` (reference to Video model)
  - `groups: [Group]` (reference to Group model)
  - `isAdmin: Boolean` (default: false)
  - `resetPasswordToken: String`
  - `resetPasswordExpiresAt: Date`
  - `verificationToken: String`
  - `verificationTokenExpiresAt: Date`

### Group

- **Fields:**
  - `name: String` (required, maxLength: 32, minLength: 3)
  - `code: String` (required, unique)
  - `videos: [Video]` (reference to Video model)
  - `members: [User]` (reference to User model)

### Video

- **Fields:**
  - `url: String` (required)
  - `owner: User` (reference to User model)
  - `group: Group` (reference to Group model)
  - `seenBy: [User]` (reference to User model)

## Authorization and Permissions

- **Register:** Public access
- **Login:** Public access
- **Add Video:** Authenticated users, must be a member of the group
- **Update Video:** Authenticated users, must be the owner of the video
- **Delete Video:** Authenticated users, must be the owner of the video
- **Create Group:** Authenticated users
- **Join Group:** Authenticated users
- **Leave Group:** Authenticated users
- **Send Invitation Email:** Authenticated users, must be a member of the group

## Error Handling

- **400 Bad Request:** Invalid input parameters
- **401 Unauthorized:** Invalid credentials or missing token
- **404 Not Found:** Resource not found
- **500 Internal Server Error:** Server-side errors

## Testing

- **Unit Tests:** Cover core functionality for controllers and models - **WORK ON PROGRESS**
- **Integration Tests:** Test interactions between controllers and the database - **NOT IMPLMENETED YET**
- **End-to-End Tests:** Validate complete workflows and user scenarios - **NOT IMPLMENETED YET**

## Deployment

- **Steps:**

  1. **Clone the Repository:**
     - `git clone https://github.com/ahmed-abdelhameed1706/VibeMK`
  2. **Install Backend Dependencies:**
     - Navigate to the repository directory: `cd VibeMK`
     - Install dependencies: `npm install`
  3. **Install Frontend Dependencies:**
     - Navigate to the frontend directory: `cd frontend`
     - Install dependencies: `npm install`
  4. **Build the Frontend:**
     - Return to the root directory: `cd ..`
     - Build the frontend: `npm run build`
  5. **Start the Application:**
     - For Production Environment:
       - Start the backend server: `npm start` (in the root directory)
     - For Development Environment:
       - Start the root server: `npm run dev` (in the root directory)
       - Start the frontend server: `npm run dev` (in the frontend directory)

- **Environments:**
  - **Development:** Use `npm run dev` for both frontend and backend to enable development mode with live reloading and debugging features.
  - **Production:** Use `npm start` for the backend and ensure the frontend is built using `npm run build` before starting the server.

## Security Considerations

- **Encryption:** Data encrypted in transit using TLS
- **Authentication:** JWT for user sessions
- **Authorization:** Role-based access control
- **Password Management:** Secure password hashing

## Glossary

- **JWT:** JSON Web Token
- **API:** Application Programming Interface
- **TLS:** Transport Layer Security
- **CRUD:** Create, Read, Update, Delete
