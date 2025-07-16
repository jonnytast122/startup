// Example for Advice 5: Scalability - Centralize API calls and constants

import axios from 'axios';

// Centralized API call for fetching leaves
export const fetchLeaves = () => axios.get('/api/leaves');