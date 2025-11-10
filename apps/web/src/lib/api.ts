import axios from 'axios';
import type {
  SignupDto,
  LoginDto,
  AuthResponseDto,
  User,
  Community,
  Event,
  BuddyMatch,
  Tip,
  CreateCommunityDto,
  CreateEventDto,
  RsvpEventDto,
  OptInBuddyDto,
  CreateTipDto,
} from '@campus-companion/api-types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const authApi = {
  signup: async (data: SignupDto): Promise<AuthResponseDto> => {
    const response = await api.post('/auth/signup', data);
    if (response.data.accessToken) {
      localStorage.setItem('token', response.data.accessToken);
    }
    return response.data;
  },
  login: async (data: LoginDto): Promise<AuthResponseDto> => {
    const response = await api.post('/auth/login', data);
    if (response.data.accessToken) {
      localStorage.setItem('token', response.data.accessToken);
    }
    return response.data;
  },
  me: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
  },
};

// Users
export const usersApi = {
  getMe: async (): Promise<any> => {
    const response = await api.get('/users/me');
    return response.data;
  },
  updateMe: async (data: any) => {
    const response = await api.put('/users/me', data);
    return response.data;
  },
  updateInterests: async (interests: string[]) => {
    const response = await api.put('/users/me/interests', { interests });
    return response.data;
  },
  updateAvailability: async (availability: any[]) => {
    const response = await api.put('/users/me/availability', { availability });
    return response.data;
  },
};

// Communities
export const communitiesApi = {
  list: async (campus?: string): Promise<Community[]> => {
    const params = campus ? { campus } : {};
    const response = await api.get('/communities', { params });
    return response.data;
  },
  get: async (id: string): Promise<Community> => {
    const response = await api.get(`/communities/${id}`);
    return response.data;
  },
  create: async (data: CreateCommunityDto): Promise<Community> => {
    const response = await api.post('/communities', data);
    return response.data;
  },
  join: async (id: string) => {
    const response = await api.post(`/communities/${id}/join`);
    return response.data;
  },
  leave: async (id: string) => {
    const response = await api.post(`/communities/${id}/leave`);
    return response.data;
  },
};

// Events
export const eventsApi = {
  listByCommunity: async (communityId: string): Promise<Event[]> => {
    const response = await api.get(`/communities/${communityId}/events`);
    return response.data;
  },
  get: async (id: string): Promise<Event> => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },
  create: async (communityId: string, data: CreateEventDto): Promise<Event> => {
    const response = await api.post(`/communities/${communityId}/events`, data);
    return response.data;
  },
  rsvp: async (id: string, data: RsvpEventDto) => {
    const response = await api.post(`/events/${id}/rsvp`, data);
    return response.data;
  },
};

// Buddy
export const buddyApi = {
  optIn: async (data: OptInBuddyDto) => {
    const response = await api.post('/buddy/optin', data);
    return response.data;
  },
  optOut: async (type: string) => {
    const response = await api.post('/buddy/optout', { type });
    return response.data;
  },
  getMatch: async (): Promise<BuddyMatch | null> => {
    const response = await api.get('/buddy/match');
    return response.data;
  },
  createMeeting: async (matchId: string, plannedTime: Date) => {
    const response = await api.post(`/buddy/match/${matchId}/meeting`, {
      plannedTime,
    });
    return response.data;
  },
  updateMeetingStatus: async (meetingId: string, status: string) => {
    const response = await api.post(`/buddy/meeting/${meetingId}/status`, {
      status,
    });
    return response.data;
  },
};

// Tips
export const tipsApi = {
  list: async (campus?: string, category?: string): Promise<Tip[]> => {
    const params: any = {};
    if (campus) params.campus = campus;
    if (category) params.category = category;
    const response = await api.get('/tips', { params });
    return response.data;
  },
  get: async (id: string): Promise<Tip> => {
    const response = await api.get(`/tips/${id}`);
    return response.data;
  },
  create: async (data: CreateTipDto): Promise<Tip> => {
    const response = await api.post('/tips', data);
    return response.data;
  },
};

