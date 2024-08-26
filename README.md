# VibeMK

VibeMK is a video sharing platform built with the MERN stack (MongoDB, Express.js, React.js, Node.js). This application allows users to create groups, share videos within those groups, and manage their interactions. It includes features such as user registration, email verification, group management, and video management.

## Features

- **User Authentication**: Register, login, and logout with email verification and password reset functionality.
- **Group Management**: Create, join, leave, and send invitations to groups.
- **Video Management**: Add, update, delete, and view videos within groups.
- **Access Control**: Manage group membership and control video access based on user interactions.

## Functionalities

- **Auth Controller**: Handles user registration, login, email verification, password management, and session management.
- **Group Controller**: Manages group creation, membership, invitations, and retrieval of user groups.
- **Video Controller**: Manages video addition, updates, deletion, and tracking of video views.

## Data Models

- **User**: Stores user details, including email, password, profile information, and group memberships.
- **Group**: Contains information about groups, including names, unique codes, and memberships.
- **Video**: Manages video details, including URLs, ownership, and view tracking.

## Design Document

For a detailed overview of the application's design, including its features, functionalities, and technical details, please refer to the [Application Design Document](design-doc.md).

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
