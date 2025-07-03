# Product Design Requirements (PDR) - MUFC Booking System

## 1. Introduction

This document outlines the product design requirements for the MUFC Booking System. The system is designed to manage organizations, users, and match events, facilitating event subscriptions and tracking of past events. It provides both a web-based administration interface and a public interface for displaying event information.

## 2. Purpose

The primary purpose of the MUFC Booking System is to streamline the management of sports or other recurring events, allowing organizations to create, manage, and track participant subscriptions. It aims to provide a robust and scalable platform for event coordination.

## 3. Scope

The system encompasses the following key areas:

*   **Organization Management:** Creation, retrieval, update, and deletion of organizational entities.
*   **User Management:** Administration of WebUI users with distinct roles (user, organization admin, super admin) and general user profiles.
*   **Match Event Management:** Lifecycle management of events, including creation, recurrence, subscription handling, and cancellation of specific event iterations.
*   **Public Event Display:** A public-facing interface for viewing events, potentially embeddable via iframes.
*   **System Monitoring:** Endpoints for checking system health and retrieving operational statistics.

## 4. Functional Requirements

### 4.1. Organization Management

*   **FR1.1 - Create Organization:** Super administrators shall be able to create new organizations by providing a name and an optional description.
*   **FR1.2 - Retrieve Organizations:**
    *   Super administrators shall be able to retrieve a list of all organizations.
    *   Organization administrators shall be able to retrieve details of their own organization only.
*   **FR1.3 - Update Organization:** Super administrators shall be able to update the name and description of an existing organization.
*   **FR1.4 - Delete Organization:** Super administrators shall be able to delete an organization. This action shall cascade and delete all associated WebUI users and match events belonging to that organization.

### 4.2. User Management

*   **FR2.1 - WebUI User Roles:** The system shall support three roles for WebUI users: `user`, `orgAdmin`, and `superAdmin`.
*   **FR2.2 - WebUI User Authentication:** WebUI user passwords shall be securely hashed before storage.
*   **FR2.3 - User Profiles:** The system shall store user profiles including first name, last name, nickname, phone, email, active status, and associated organization.

### 4.3. Match Event Management

*   **FR3.1 - Create Match Event:** Organization administrators and super administrators shall be able to create new match events with a title, start date, and recurrence pattern (none, weekly, monthly).
*   **FR3.2 - Subscribe to Event:** Users shall be able to subscribe to a match event.
*   **FR3.3 - Unsubscribe from Event:** Users shall be able to unsubscribe from a match event.
*   **FR3.4 - Cancel Event Iteration:** Organization administrators and super administrators shall be able to cancel a specific date iteration of a recurring match event.
*   **FR3.5 - Uncancel Event Iteration:** Organization administrators and super administrators shall be able to uncancel a previously cancelled specific date iteration of a recurring match event.
*   **FR3.6 - Retrieve Match Events:** Organization administrators and super administrators shall be able to retrieve all match events associated with their organization.
*   **FR3.7 - Retrieve Match Event Count:** Organization administrators and super administrators shall be able to retrieve the total count of match events for their organization.
*   **FR3.8 - Retrieve Single Match Event:** Any authenticated user shall be able to retrieve details of a specific match event by its ID.
*   **FR3.9 - Delete Match Event:** Organization administrators and super administrators shall be able to delete a match event.

### 4.4. Public Interface

*   **FR4.1 - Main Page Display:** The system shall serve a main web page for general access.
*   **FR4.2 - Iframe Display:** The system shall serve an iframe page that can display event information, with support for different HTML templates.

### 4.5. System Monitoring

*   **FR5.1 - Health Check:** The system shall provide an endpoint (`/api/health`) to report its operational status, including database connectivity.
*   **FR5.2 - System Statistics:** The system shall provide an endpoint (`/api/stats`) to report various operational statistics, including server uptime, database status, and configuration details.

## 5. Non-Functional Requirements

### 5.1. Performance

*   The system shall respond to API requests within acceptable timeframes (e.g., under 500ms for typical operations).
*   The database queries shall be optimized for efficient data retrieval and storage.

### 5.2. Security

*   All sensitive data, especially user passwords, shall be stored securely (e.g., hashed).
*   Access to administrative functions shall be restricted based on user roles.
*   API endpoints shall be protected by appropriate authentication and authorization mechanisms.

### 5.3. Scalability

*   The system architecture shall support horizontal scaling to handle an increasing number of organizations, users, and events.
*   The database schema shall be designed to accommodate growth in data volume.

### 5.4. Usability

*   The web interface shall be intuitive and easy to navigate for administrators.
*   The public-facing event display shall be clear and informative.

### 5.5. Maintainability

*   The codebase shall be modular, well-documented, and follow consistent coding standards.
*   Dependencies shall be managed effectively to facilitate updates and reduce conflicts.

## 6. Data Model (Schemas)

### 6.1. Organization

*   `name` (String, Required)
*   `description` (String)
*   `createdAt` (Date)
*   `updatedAt` (Date)

### 6.2. WebUIUser

*   `email` (String, Required, Unique)
*   `password` (String, Required, Hashed)
*   `organizationId` (ObjectId, Ref: `Organization`, Required)
*   `role` (String, Enum: `user`, `orgAdmin`, `superAdmin`, Default: `user`)
*   `createdAt` (Date)
*   `updatedAt` (Date)

### 6.3. User

*   `firstName` (String)
*   `lastName` (String)
*   `nickName` (String)
*   `phone` (String)
*   `email` (String, Required, Unique)
*   `active` (Boolean, Default: `true`)
*   `organizationId` (ObjectId, Ref: `Organization`)

### 6.4. MatchEvent

*   `title` (String, Required)
*   `startDate` (Date, Required)
*   `repeatEach` (String, Enum: `none`, `week`, `month`, Default: `none`)
*   `subscriptions` (Array of Objects)
    *   `userId` (ObjectId, Ref: `WebUIUser`)
    *   `metadata` (Mixed)
*   `metadata` (Mixed)
*   `active` (Boolean, Default: `true`)
*   `organizationId` (ObjectId, Ref: `Organization`, Required)
*   `createdAt` (Date)
*   `updatedAt` (Date)

### 6.5. PassedMatchEvent

*   `matchEventId` (ObjectId, Ref: `MatchEvent`)
*   `eventDate` (Date, Required)
*   `subscriptions` (Array of Objects)
    *   `userId` (ObjectId, Ref: `WebUIUser`)
    *   `metadata` (Mixed)
*   `organizationId` (ObjectId, Ref: `Organization`, Required)
*   `createdAt` (Date)
*   `updatedAt` (Date)

## 7. Technical Stack

*   **Backend Framework:** Node.js with Express.js
*   **Database:** MongoDB (via Mongoose ODM)
*   **Authentication:** JWT-based (inferred)
*   **Frontend:** HTML, CSS, JavaScript (static files)
*   **Environment Management:** `dotenv`
