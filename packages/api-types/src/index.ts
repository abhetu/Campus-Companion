// Enums
export enum UserRole {
  INTERNATIONAL = 'INTERNATIONAL',
  BUDDY = 'BUDDY',
  STAFF = 'STAFF',
}

export enum CommunityMemberRole {
  MEMBER = 'MEMBER',
  MODERATOR = 'MODERATOR',
}

export enum EventRsvpStatus {
  GOING = 'GOING',
  NOT_GOING = 'NOT_GOING',
  INTERESTED = 'INTERESTED',
}

export enum BuddyOptInType {
  MENTEE = 'MENTEE',
  BUDDY = 'BUDDY',
}

export enum BuddyMatchStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export enum BuddyMeetingStatus {
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum TipCategory {
  BANKING = 'BANKING',
  PHONE_PLANS = 'PHONE_PLANS',
  GROCERIES = 'GROCERIES',
  TRANSPORT = 'TRANSPORT',
  OTHER = 'OTHER',
}

// Domain Models
export interface User {
  id: string;
  email: string;
  name: string;
  campus: string;
  role: UserRole;
  countryOrRegion: string;
  degreeLevel: string | null;
  createdAt: Date;
}

export interface UserWithInterests extends User {
  interests: string[];
  availability: UserAvailability[];
}

export interface UserAvailability {
  id: string;
  dayOfWeek: number;
  startMinutes: number;
  endMinutes: number;
}

export interface Community {
  id: string;
  campus: string;
  name: string;
  description: string;
  createdByUserId: string;
  createdAt: Date;
  memberCount?: number;
}

export interface CommunityMember {
  id: string;
  communityId: string;
  userId: string;
  role: CommunityMemberRole;
}

export interface Event {
  id: string;
  communityId: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  locationText: string;
  capacity: number | null;
  createdByUserId: string;
  createdAt: Date;
  rsvpCount?: number;
}

export interface EventRsvp {
  id: string;
  eventId: string;
  userId: string;
  status: EventRsvpStatus;
  checkedIn: boolean;
}

export interface BuddyMatch {
  id: string;
  menteeId: string;
  buddyId: string;
  campus: string;
  status: BuddyMatchStatus;
  createdAt: Date;
  lastMeetingAt: Date | null;
  mentee?: User;
  buddy?: User;
}

export interface BuddyMeeting {
  id: string;
  matchId: string;
  plannedTime: Date;
  status: BuddyMeetingStatus;
  createdAt: Date;
}

export interface Tip {
  id: string;
  campus: string;
  category: TipCategory;
  title: string;
  content: string;
  createdByUserId: string;
  approved: boolean;
  createdAt: Date;
}

// DTOs - Auth
export interface SignupDto {
  email: string;
  password: string;
  name: string;
  campus: string;
  role: UserRole;
  countryOrRegion: string;
  degreeLevel?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponseDto {
  user: User;
  accessToken: string;
}

// DTOs - Users
export interface UpdateUserDto {
  name?: string;
  campus?: string;
  countryOrRegion?: string;
  degreeLevel?: string;
}

export interface UpdateInterestsDto {
  interests: string[];
}

export interface UpdateAvailabilityDto {
  availability: Array<{
    dayOfWeek: number;
    startMinutes: number;
    endMinutes: number;
  }>;
}

// DTOs - Communities
export interface CreateCommunityDto {
  name: string;
  description: string;
  campus: string;
}

export interface JoinCommunityDto {
  userId: string;
}

// DTOs - Events
export interface CreateEventDto {
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  locationText: string;
  capacity?: number;
}

export interface RsvpEventDto {
  status: EventRsvpStatus;
}

// DTOs - Buddy
export interface OptInBuddyDto {
  type: BuddyOptInType;
}

export interface CreateBuddyMeetingDto {
  plannedTime: Date;
}

export interface UpdateMeetingStatusDto {
  status: BuddyMeetingStatus;
}

// DTOs - Tips
export interface CreateTipDto {
  campus: string;
  category: TipCategory;
  title: string;
  content: string;
}

export interface UpdateTipDto {
  title?: string;
  content?: string;
  category?: TipCategory;
  approved?: boolean;
}

// Query DTOs
export interface GetCommunitiesQuery {
  campus?: string;
}

export interface GetEventsQuery {
  communityId?: string;
}

export interface GetTipsQuery {
  campus?: string;
  category?: TipCategory;
}

