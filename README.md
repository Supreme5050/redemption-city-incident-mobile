# Incident Management Mobile App

This is the **citizen-facing incident reporting mobile app** for the standalone Incident Management Platform.

It is not connected to any previous navigation app.

## What this first build contains

- Home screen for everyday reporters
- Report Incident Step 1
- Add Location & Evidence Step 2
- Submit Incident success screen
- My Reports tracking screen
- Report Details screen
- Nearby alerts placeholder
- Profile placeholder
- Shared incident types and mock incident service
- Dark command-center UI style matching the admin dashboard concept

## Tech stack

- Expo
- React Native
- TypeScript
- Mock data only for this first build

## How to run

From inside this folder:

```bash
npm install
npm run start:clear
```

This runs the mobile app on a separate Expo port:

```bash
npx expo start -c --lan --port 8091
```

## Build order

This mobile app starts the real product flow:

1. Citizen reports an incident
2. Incident is saved locally in mock state
3. Citizen receives a reference ID
4. Citizen can track the report status
5. Later, the admin dashboard will consume the same incident model

## Next engineering step

After this mobile MVP is working, connect the shared incident model to the admin dashboard and then replace mock storage with Supabase.
