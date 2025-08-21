// Centralized HSDS-compliant service data
// This is the single source of truth for all service information

export const mockServices = [
  {
    id: 1,
    name: 'Community Food Pantry',
    organization: 'Maryland Heights Community Center',
    address: '2344 McKelvey Rd, Maryland Heights, MO 63043',
    distance: '1.2 mi',
    description: 'Provides non-perishable food items to families and individuals in need. Proof of residency required.',
    category: 'Food',
    sourceOrg: 'Alpha Org',
    contact: { 
      phone: '(314) 555-1234', 
      email: 'contact@mhcc.org', 
      website: 'mhcc.org' 
    },
    hours: { 
      Monday: '9am - 3pm', 
      Tuesday: '9am - 3pm', 
      Wednesday: 'Closed', 
      Thursday: '1pm - 6pm', 
      Friday: '9am - 12pm', 
      Saturday: 'Closed', 
      Sunday: 'Closed' 
    },
    eligibility: 'Residents of 63043 zip code. Must provide a recent utility bill.',
    application: 'Walk-in during open hours. First-time visitors need to fill out a short form.',
    coordinates: [38.7190, -90.4218]
  },
  {
    id: 2,
    name: 'West County Legal Aid Clinic',
    organization: 'St. Louis Legal Services',
    address: '11977 St Charles Rock Rd, Bridgeton, MO 63044',
    distance: '3.5 mi',
    description: 'Free legal advice and representation for low-income individuals in civil cases, including housing and family law.',
    category: 'Legal Aid',
    sourceOrg: 'Beta Community Group',
    contact: { 
      phone: '(314) 555-5678', 
      email: 'info@stlls.org', 
      website: 'stlls.org' 
    },
    hours: { 
      Monday: 'By Appointment', 
      Tuesday: '9am - 4pm', 
      Wednesday: '9am - 4pm', 
      Thursday: 'By Appointment', 
      Friday: '9am - 12pm', 
      Saturday: 'Closed', 
      Sunday: 'Closed' 
    },
    eligibility: 'Income at or below 125% of the federal poverty line.',
    application: 'Call to schedule an intake appointment.',
    coordinates: [38.7661, -90.4218]
  },
  {
    id: 3,
    name: 'Creve Coeur Mobile Food Market',
    organization: 'Operation Food Search',
    address: '12301 Olive Blvd, Creve Coeur, MO 63141',
    distance: '4.1 mi',
    description: 'Mobile market offering fresh produce and groceries at no cost. Schedule varies, check website.',
    category: 'Food',
    sourceOrg: 'Gamma County Services',
    contact: { 
      phone: '(314) 555-9999', 
      email: 'mobile@operationfoodsearch.org', 
      website: 'operationfoodsearch.org' 
    },
    hours: { 
      Monday: 'Closed', 
      Tuesday: '10am - 1pm (Every 2nd Tuesday)', 
      Wednesday: 'Closed', 
      Thursday: 'Closed', 
      Friday: 'Closed', 
      Saturday: '10am - 1pm (Every 4th Saturday)', 
      Sunday: 'Closed' 
    },
    eligibility: 'Open to all.',
    application: 'No application needed. Please bring your own bags.',
    coordinates: [38.6620, -90.4218]
  },
  {
    id: 4,
    name: 'Emergency Shelter Assistance',
    organization: 'County Crisis Intervention',
    address: '7150 Natural Bridge Rd, St. Louis, MO 63121',
    distance: '8.9 mi',
    description: 'Provides temporary emergency shelter placement and resources for individuals and families experiencing homelessness.',
    category: 'Housing',
    sourceOrg: 'Gamma County Services',
    contact: { 
      phone: '(314) 555-4321', 
      email: 'shelter@co.st-louis.mo.us', 
      website: 'stlouiscountymo.gov' 
    },
    hours: { 
      Monday: '24/7', 
      Tuesday: '24/7', 
      Wednesday: '24/7', 
      Thursday: '24/7', 
      Friday: '24/7', 
      Saturday: '24/7', 
      Sunday: '24/7' 
    },
    eligibility: 'Must be currently homeless within St. Louis County.',
    application: 'Call the 24/7 hotline for immediate assistance.',
    coordinates: [38.7301, -90.2259]
  }
];