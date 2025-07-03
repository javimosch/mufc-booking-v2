# Deployment Overview - MUFC Booking System

## 1. Introduction

This document provides an overview of the deployment process for the MUFC Booking System, primarily leveraging the `manage.sh` script for automation. The deployment strategy distinguishes between deploying the application itself to a remote server and configuring domain access via a Traefik gateway (e.g., a Coolify instance).

## 2. Prerequisites

Before initiating deployment, ensure the following are in place:

*   **Remote Server:** A remote server accessible via SSH, where the application's Docker containers will run.
*   **Docker and Docker Compose:** Installed on the remote server.
*   **Traefik Gateway:** A Traefik instance (e.g., Coolify) configured to handle incoming traffic and route it to the application.
*   **.env File:** A `.env` file in the project root containing necessary environment variables for both application and domain deployment.
*   **SSH Access:** SSH keys configured for passwordless access to both the application server and the Traefik gateway.

## 3. Configuration (`.env` variables)

The `manage.sh` script relies heavily on environment variables defined in the `.env` file. Key variables include:

### Application Deployment Variables:

*   `REMOTE_HOST`: The IP address or hostname of the remote server where the application will be deployed.
*   `REMOTE_HOST_USER` (Optional, default: `ubuntu`): The SSH username for the remote host.
*   `REMOTE_HOST_PORT` (Optional, default: `22`): The SSH port for the remote host.
*   `REMOTE_HOST_PATH` (Optional, default: `~/docker/mufc-booking-v2`): The path on the remote host where the application files will be stored.
*   `APP_NAME`: The name of the application (e.g., `MUFC Booking V2`). Used for naming conventions.

### Domain Deployment Variables:

*   `REMOTE_DOMAIN_HOST`: The IP address or hostname of the Traefik gateway server.
*   `REMOTE_DOMAIN_PORT` (Optional, default: `22`): The SSH port for the Traefik gateway.
*   `REMOTE_SERVICE_IP`: The internal IP address or hostname of the deployed application service, accessible from the Traefik gateway.
*   `PUBLISHED_DOMAIN`: The public domain name (e.g., `app.example.com`) through which the application will be accessible.
*   `REMOTE_DOMAIN_CONFIG_FILENAME` (Optional, default: derived from `APP_NAME`): The filename for the Traefik dynamic configuration file on the gateway.

## 4. Deployment Process

The `manage.sh` script orchestrates the deployment through several commands:

### 4.1. Application Deployment (`./manage.sh deploy`)

This command deploys the application to the specified remote server.

1.  **Validation:** Checks for the presence of required `REMOTE_HOST` and `REMOTE_USER` environment variables.
2.  **Remote Directory Setup:** Ensures the target directory on the remote server (`REMOTE_HOST_PATH`) exists.
3.  **File Synchronization:** Uses `rsync` to securely copy all local project files to the remote `REMOTE_HOST_PATH`.
4.  **Docker Compose Up:** Executes `docker-compose up -d --force-recreate` on the remote server within the application directory. This builds (if necessary) and starts the Docker containers in detached mode, recreating them if they already exist.
5.  **Log Tailing:** Displays the last 100 lines of logs from the `web` service to provide immediate feedback on application startup.

### 4.2. Domain Configuration Deployment (`./manage.sh domain`)

This command deploys the Traefik dynamic configuration file to the gateway server, making the application accessible via its public domain.

1.  **Validation:** Checks for `REMOTE_DOMAIN_HOST`, `REMOTE_SERVICE_IP`, `PUBLISHED_DOMAIN`, and the existence of the local proxy configuration file (`.manage-proxy-file.yml`).
2.  **Proxy File Creation (Prerequisite):** The proxy configuration file must first be generated using `./manage.sh proxy`.
3.  **User Confirmation:** Prompts the user to confirm the deployment after previewing the generated Traefik configuration.
4.  **Remote Directory Setup:** Ensures the Traefik dynamic configuration directory on the gateway (`/data/coolify/proxy/dynamic`) exists.
5.  **File Copy:** Uses `scp` to copy the local `.manage-proxy-file.yml` to the Traefik gateway's dynamic configuration directory.
6.  **Verification:** Lists the copied file on the remote gateway to confirm successful transfer.
7.  **API Accessibility Check:** Continuously `curl`s the `/health` endpoint of the `PUBLISHED_DOMAIN` until it returns an "ok" status, indicating the API is accessible.

### 4.3. Proxy Configuration File Generation (`./manage.sh proxy`)

This command generates the Traefik dynamic configuration file (`.manage-proxy-file.yml`) locally.

1.  **Validation:** Requires `REMOTE_SERVICE_IP` and `PUBLISHED_DOMAIN` to be set in `.env`.
2.  **Service Name Prompt:** Prompts the user for a Traefik service name (defaults to a sanitized version of `APP_NAME`).
3.  **Template Population:** Populates a predefined Traefik router and service template with the provided service name, published domain, and remote service IP.
4.  **File Creation:** Saves the generated configuration to `.manage-proxy-file.yml` in the local project directory.

## 5. Management Utilities

The `manage.sh` script also provides utility functions:

*   **`./manage.sh logs`**: Follows the Docker Compose logs of the application on the remote server.
*   **`./manage.sh env`**: Displays the currently configured environment variables used by the script.
*   **`./manage.sh help`**: Shows a help message with available options.
*   **Interactive Menu**: If no arguments are provided, the script presents an interactive menu for easier operation.

## 6. Traefik Configuration Template Example

The generated Traefik dynamic configuration file follows a structure similar to this:

```yaml
http:
  routers:
    <SERVICE_NAME>:
      entryPoints:
        - https
      service: <SERVICE_NAME>
      rule: Host(`PUBLISHED_DOMAIN`)
      tls:
        certresolver: letsencrypt
  services:
    <SERVICE_NAME>:
      loadBalancer:
        servers:
          -
            url: 'REMOTE_SERVICE_IP'
```

Where `<SERVICE_NAME>`, `PUBLISHED_DOMAIN`, and `REMOTE_SERVICE_IP` are replaced with values from the `.env` file and user input.
