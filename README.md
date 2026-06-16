# Redemption City Incident Management Mobile App

A citizen-facing mobile application for reporting, tracking, and managing safety-related incidents within Redemption City.

This mobile app is part of the broader **Redemption City Incident Management Platform**, designed to help residents, visitors, and field reporters submit structured incident reports with evidence, location data, and response tracking.

The mobile app is intentionally separated from the Redemption City Navigator project. It focuses only on incident reporting, safety communication, lost-and-found reporting, and response visibility.

---

## Product Overview

The application provides a simple and reliable reporting flow for users who need to notify the appropriate safety or administrative body about an incident.

Users can:

* Report safety, security, medical, power, traffic, fire, facility, and other incidents
* Attach photo evidence
* Pin or capture the exact incident location
* Track submitted reports
* View report status and response progress
* Submit lost-and-found reports
* Access safety alerts and report history

The app is currently built as a mobile MVP with local/demo data storage. Backend integration with Supabase is planned as the next engineering phase.

---

## Current Build Status

This version contains the stable mobile frontend foundation.

Implemented features include:

* Branded splash screen
* Authentication welcome screen
* Sign in screen
* Create account screen
* Forgot password screen
* Home dashboard for reporters
* Incident category selection
* Incident details form
* Photo/gallery evidence capture
* Location capture and map pinning
* Report submission success screen
* Track report flow
* My Reports screen
* Report Details screen
* Lost & Found reporting flow
* Alerts screen
* Profile screen
* Shared brand logo across major screens
* Dark command-center interface design

---

## Tech Stack

* Expo
* React Native
* TypeScript
* React Native Maps
* Expo Location
* Expo Image Picker
* AsyncStorage
* Git / GitHub

Planned backend stack:

* Supabase Auth
* Supabase Database
* Supabase Storage
* Supabase Realtime
* Row Level Security policies

---

## Project Structure

```txt
src/
  components/
    AppBrandLogo.tsx
    Badge.tsx
    BottomTabBar.tsx
    Card.tsx
    Header.tsx

  screens/
    AuthScreens.tsx
    CommandHomeScreen.tsx
    CommandMapScreen.tsx
    CommandMobileScreens.tsx
    MapPickerScreen.tsx
    RouteNavigationScreen.tsx

  services/
    authService.ts
    incidentService.ts
    lostFoundService.ts

  theme/
    colors.ts
    spacing.ts

  types/
    auth.ts
    incident.ts
    lostFound.ts
    navigation.ts
```

---

## Installation

Clone the repository:

```bash
git clone https://github.com/Supreme5050/redemption-city-incident-mobile.git
```

Enter the project directory:

```bash
cd redemption-city-incident-mobile
```

Install dependencies:

```bash
npm install
```

---

## Running the App

Start the Expo development server:

```bash
npx expo start -c --lan --port 8091
```

If needed, use the configured local network host command:

```bash
set "REACT_NATIVE_PACKAGER_HOSTNAME=192.168.0.198" && npx expo start -c --lan --port 8091
```

Then open the app with Expo Go on a physical device.

---

## Current User Flow

The current MVP supports this flow:

1. User opens the app
2. Splash screen loads
3. User signs in or creates an account
4. User lands on the safety dashboard
5. User reports an incident
6. User selects the incident category
7. User adds description, evidence, location, severity, and contact details
8. User submits the report
9. User receives a report reference ID
10. User tracks the report status
11. User can also submit Lost & Found reports

---

## Data Handling

The current implementation uses local/demo storage for frontend validation and MVP testing.

At this stage:

* Authentication is local/demo-based
* Incident reports are stored locally
* Lost & Found reports are stored locally
* Media is handled locally through device picker/camera
* Admin routing is not yet connected to a backend

This is intentional for the frontend MVP phase.

---

## Planned Supabase Integration

The next engineering phase is to connect the mobile app to Supabase.

Supabase integration will provide:

* Real user authentication
* Persistent user profiles
* Secure password recovery
* Incident report database
* Lost & Found database
* Image and video storage
* Realtime report status updates
* Role-based access control
* Admin dashboard connectivity
* Responder assignment workflow

---

## Planned Platform Roles

The platform is expected to support multiple user roles:

* Reporter
* Resident
* Visitor
* Field Reporter
* Admin
* Supervisor
* Responder

The mobile app currently focuses on the reporter-side experience. Admin and responder operations will be handled through a separate web dashboard.

---

## Engineering Notes

This repository represents the stable frontend checkpoint before backend integration.

Before making major backend or database changes, create a separate Git branch:

```bash
git checkout -b supabase-auth
```

This allows Supabase integration to be developed safely without breaking the stable frontend version.

---

## Roadmap

Upcoming engineering tasks:

* Connect Supabase Auth
* Create user profile table
* Connect incident reports to Supabase database
* Connect Lost & Found reports to Supabase database
* Add media upload to Supabase Storage
* Add report status update workflow
* Connect mobile app to admin dashboard
* Add responder assignment visibility
* Add realtime notifications
* Add production-ready password recovery
* Prepare app for build and deployment

---

## Repository Status

Stable frontend version committed with:

```txt
Stable mobile frontend with auth branding and report flow
```

This build is ready for Supabase backend integration.
