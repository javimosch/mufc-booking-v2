# User Roles V2 Rework Plan

## 1. Objective

To refactor the application's user role system to provide clear separation of concerns and introduce a `superAdmin` role for high-level management. This will enhance security and provide the necessary tools for managing organizations and administrators.

## 2. Role Definitions

- **`user`**:
  - The default role for any new account.
  - **Permissions**: Can view public event pages and use the booking interface (iframe) to join or un-join event iterations they are eligible for.
  - **Access**: No access to the admin WebUI.

- **`orgAdmin`**:
  - An administrator for a specific organization.
  - **Permissions**: Can manage all aspects of their assigned organization, including match events and users within that organization.
  - **Access**: Full access to the admin WebUI, but actions are scoped to their own organization.

- **`superAdmin`**:
  - A top-level administrator with global permissions.
  - **Permissions**:
    - **Organization Management**: Can create, view, edit, and delete any organization.
    - **Admin Management**: Can promote any `user` to become an `orgAdmin` and assign them to an organization. Can also demote or delete `orgAdmin` accounts.
  - **Access**: Full access to the admin WebUI with additional UI elements and functionality for managing organizations and admins.

## 3. Implementation Steps

### Backend Changes

1.  **Update User Model**:
    - Add a `role` field to the `User` schema (e.g., `role: { type: String, enum: ['user', 'orgAdmin', 'superAdmin'], default: 'user' }`).
    - Existing users will need to be migrated. `orgAdmin`s will be identified by their existing access permissions.

2.  **Enhance JWT Payload**:
    - The `/api/login` endpoint must include the user's `role` in the JWT payload. This will allow the frontend to make role-based decisions without extra API calls.

3.  **Implement Role-Based Authorization Middleware**:
    - Create a middleware function that checks the `role` from the JWT payload.
    - Protect API routes based on roles:
      - `/api/organizations/**`: `superAdmin` only.
      - `/api/users/promote`: New endpoint for `superAdmin` to change a user's role.
      - `/api/match-events/**`: `orgAdmin` or `superAdmin`.
      - Other existing admin routes: `orgAdmin` or `superAdmin`.

4.  **Create SuperAdmin-Specific API Endpoints**:
    - **`PUT /api/users/:id/role`**: A new endpoint for a `superAdmin` to update a user's role and assign them to an organization.
      - **Request Body**: `{ "role": "orgAdmin", "organizationId": "..." }`
    - Modify existing endpoints to respect `superAdmin` privileges (e.g., `GET /api/users` should return all users for a `superAdmin`).

### Frontend (WebUI) Changes

1.  **Update Login Logic**:
    - When a user logs in, decode the JWT to extract and store the `role` in the `CLIWebUI` class and/or `localStorage`.

2.  **Conditional UI Rendering**:
    - Modify `app.js` to show/hide UI elements based on the user's role.
    - **`orgAdmin` View**: The view will remain largely the same, but the "Manage Organizations" panel should be hidden or disabled, as this is now a `superAdmin` task.
    - **`superAdmin` View**: 
      - The "Manage Organizations" panel will be fully functional (Add, Edit, Delete).
      - The "Manage Users" panel will be enhanced to show all users. Each user item will have a new "Promote to Admin" button.
      - The "Manage Match Events" panel will be hidden, as a `superAdmin`'s focus is on meta-management, not specific events.

### Database and Seeding

1.  **Migration Script**:
    - Create a one-off script to add the `role` field to all existing users. The script should assign `orgAdmin` to existing admins and `user` to everyone else.

2.  **SuperAdmin Seeding**:
    - Create a command-line script or manual database query to assign the `superAdmin` role to the first/primary administrator account.

## 4. Testing Plan

- **Role Scoping**: Verify that an `orgAdmin` can only see and manage data related to their own organization.
- **SuperAdmin Access**: Confirm that a `superAdmin` can perform all organization and admin management tasks.
- **UI Rendering**: Test that the UI correctly displays different elements for `orgAdmin` and `superAdmin` roles.
- **Denial of Access**: Ensure that unauthorized access attempts (e.g., an `orgAdmin` trying to call a `superAdmin` API) are properly blocked with a `403 Forbidden` status.
