import { Incident } from '../types/incident';

export const mockIncidents: Incident[] = [
  {
    id: 'RCC-2026-0248',
    title: 'Major fire reported near utility area',
    type: 'Fire / Smoke',
    severity: 'Critical',
    status: 'Assigned',
    location: 'Utility Area',
    address: 'Utility Area, Redemption City Camp',
    latitude: 6.8158,
    longitude: 3.4898,
    distanceKm: 0.6,
    reportedAt: 'Today, 9:39 AM',
    reporterName: 'Mobile Reporter',
    reporterContact: 'Mobile App',
    description:
      'Heavy smoke and visible flames reported near a utility area. People nearby should avoid the area while the report is reviewed and routed.',
    anonymous: false,
    attachments: [],
    assignedUnitName: 'Fire Response / Management Department',
    routingNote: 'Critical fire/smoke report routed for rapid response.',
    responseEta: 'Urgent',
    timeline: [
      {
        id: 'rcc-0248-submitted',
        status: 'Submitted',
        title: 'Report received',
        description: 'Fire/smoke concern submitted to Admin Control Desk.',
        actor: 'Mobile App',
        timestamp: 'Today, 9:39 AM'
      },
      {
        id: 'rcc-0248-review',
        status: 'In Review',
        title: 'Admin review started',
        description: 'Admin Control Desk started reviewing the report.',
        actor: 'Admin Control Desk',
        timestamp: 'Today, 9:40 AM'
      },
      {
        id: 'rcc-0248-assigned',
        status: 'Assigned',
        title: 'Response body assigned',
        description: 'Report routed to the appropriate fire response body.',
        actor: 'Admin Control Desk',
        timestamp: 'Today, 9:41 AM'
      }
    ]
  },
  {
    id: 'RCC-2026-0247',
    title: 'Theft suspect held near Chalet Area',
    type: 'Theft / Security Issue',
    severity: 'High',
    status: 'In Review',
    location: 'Chalet Area',
    address: 'Chalet Area, Redemption City Camp',
    latitude: 6.8172,
    longitude: 3.4878,
    distanceKm: 0.9,
    reportedAt: 'Today, 9:45 AM',
    reporterName: 'Camp Reporter',
    reporterContact: 'Mobile App',
    description:
      'A theft-related incident was reported near the Chalet Area. Admin Control Desk should verify and route to the appropriate verified body.',
    anonymous: false,
    attachments: [],
    timeline: [
      {
        id: 'rcc-0247-submitted',
        status: 'Submitted',
        title: 'Report received',
        description: 'Security-related concern submitted to Admin Control Desk.',
        actor: 'Mobile App',
        timestamp: 'Today, 9:45 AM'
      },
      {
        id: 'rcc-0247-review',
        status: 'In Review',
        title: 'Admin review started',
        description: 'Admin is checking the report details before routing.',
        actor: 'Admin Control Desk',
        timestamp: 'Current'
      }
    ]
  },
  {
    id: 'RCC-2026-0246',
    title: 'Medical assistance required',
    type: 'Medical / First Aid',
    severity: 'Medium',
    status: 'Responder En Route',
    location: 'Main Auditorium Area',
    address: 'Main Auditorium Area, Redemption City Camp',
    latitude: 6.8144,
    longitude: 3.4912,
    distanceKm: 1.1,
    reportedAt: 'Today, 10:02 AM',
    reporterName: 'Mobile Reporter',
    reporterContact: 'Mobile App',
    description:
      'A person needs medical support near the Main Auditorium Area. Admin has routed the case for medical attention.',
    anonymous: false,
    attachments: [],
    assignedUnitName: 'Medical / First Aid Desk',
    routingNote: 'Medical report routed for quick attention.',
    responseEta: '8–15 mins',
    timeline: [
      {
        id: 'rcc-0246-submitted',
        status: 'Submitted',
        title: 'Report received',
        description: 'Medical report submitted.',
        actor: 'Mobile App',
        timestamp: 'Today, 10:02 AM'
      },
      {
        id: 'rcc-0246-assigned',
        status: 'Assigned',
        title: 'Routed to response body',
        description: 'Assigned to Medical / First Aid Desk.',
        actor: 'Admin Control Desk',
        timestamp: 'Today, 10:04 AM'
      },
      {
        id: 'rcc-0246-enroute',
        status: 'Responder En Route',
        title: 'Responder en route',
        description: 'Medical response has been notified.',
        actor: 'Admin Control Desk',
        timestamp: 'Today, 10:06 AM'
      }
    ]
  },
  {
    id: 'RCC-2026-0245',
    title: 'Power fluctuation around Diligence Road',
    type: 'Electricity / Power Issue',
    severity: 'Low',
    status: 'Submitted',
    location: 'Diligence Road',
    address: 'Diligence Road, Redemption City Camp',
    latitude: 6.8128,
    longitude: 3.4868,
    distanceKm: 1.3,
    reportedAt: 'Today, 10:20 AM',
    reporterName: 'Mobile Reporter',
    reporterContact: 'Mobile App',
    description:
      'Temporary power fluctuation was noticed around Diligence Road. Admin should verify and route to the appropriate power office.',
    anonymous: false,
    attachments: [],
    timeline: [
      {
        id: 'rcc-0245-submitted',
        status: 'Submitted',
        title: 'Report received',
        description: 'Power issue submitted to Admin Control Desk.',
        actor: 'Mobile App',
        timestamp: 'Today, 10:20 AM'
      }
    ]
  }
];

export const nearbyAlerts = mockIncidents.slice(0, 4);