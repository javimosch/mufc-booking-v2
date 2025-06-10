MUFC Booking V2

## Description

Fully interactive CLI + WebUI (With EmbedUI special view) to manage match events for multiple local associations.

## Workflows

- Super admins use the CLI to manage organization, organization WebUI users, organization match events and organization users.
- WebUI organization users can manage match events and match event subscriptions
- EmbedUI can be iframe into external sites (single/multi match event mode and organization specified)
- Normal match participants can use the EmbedUI to join/unjoin a organization match event by entering nickname,email.
- Use case: A super admin uses CLI to make a match event participant unjoin
- Use case: A super admin configures a new organization and a webUI organization account using WebUI

## CLI

- Can CRUD organizations name/description(optional)
- Can CRUD organizations WebUI users accounts
- Can CRUD match events. Fields: title, repeatEach (none,week,month), subscriptions [{userId, metadata}], metadata, active (default true)
- Can CRUD users. Fields: firstName, lastName, nickName, phone, email (unique, required), active (default true)
- Can make an existing user join a match event
- Can make an existing user un-join a match event

## WebUI

- WebUI: Manage Match events (CRUD)
- WebUI: Manage Users (CRUD)
- WebUI: Can make an existing user join a match event
- WebUI: Can make an existing user un-join a match event
- WebUI: Can mark match event iteration as canceled by pointing out a date (persisted in match event metadata field). The iteration will be disabled and users will not be able to join.
- WebUI: Can manage WebUI user accounts (email/password/organizationId)

## EmbedUI

Accessible via an special iframe URL (/iframe) (URL can be used as src in an iframe) (special style without webui layout shell). Can be load in single/multi match mode

- EmbedUI: (Single Match event mode): Can Join/Un-join next upcoming match event
- EmbedUI: (Multiple Match event mode): Can List/Search match events and can Join/Un-join next upcoming match event for each configured match event.

## Configuration

- Super admin username,password (Used for super admin access in WebUI)

## Tips

- For traceability, it might be wise to add a mongoose model to track passed match events over time this way we can see in the WebUI/EmbedUI when is the next match event iteration (if repeatEach is week/month) or when is match event passed (if repeatEach is none

## Coding strategy

- Create services/utils used by both CLI and webUI server
- Extract ExpressJS API endpoint logic intro controllers file for easy testing with JEST (In the future)
- Keep functions inside files tidy/small and prioritize multiple small simple functions over fewer complex ones
- Keep files at 400 LOC maximum
