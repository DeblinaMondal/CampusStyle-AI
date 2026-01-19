export enum Season {
  SPRING = 'Spring',
  SUMMER = 'Summer',
  AUTUMN = 'Autumn',
  WINTER = 'Winter',
}

export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  NON_BINARY = 'Non-binary',
  UNISEX = 'Unisex / No Preference',
}

export enum DayOfWeek {
  MONDAY = 'Monday',
  TUESDAY = 'Tuesday',
  WEDNESDAY = 'Wednesday',
  THURSDAY = 'Thursday',
  FRIDAY = 'Friday',
  SATURDAY = 'Saturday',
  SUNDAY = 'Sunday',
}

export enum StylePreference {
  CASUAL = 'Casual & Comfy',
  CHIC = 'Chic & Trendy',
  FORMAL = 'Academic Formal',
  STREETWEAR = 'Streetwear',
  MINIMALIST = 'Minimalist',
  VINTAGE = 'Vintage / Retro',
}

export interface UserPreferences {
  gender: Gender;
  collegeDays: DayOfWeek[];
  startTime: string;
  endTime: string;
  season: Season;
  style: StylePreference;
  additionalInstructions: string;
  userPhotoBase64?: string; // Base64 encoded string of the user's photo
}

export interface OutfitItem {
  id: string;
  name: string;
  type: 'top' | 'bottom' | 'outerwear' | 'shoes' | 'accessory' | 'other';
  color?: string;
}

export interface DailyPlan {
  day: DayOfWeek;
  hasCollege: boolean;
  outfitItems: OutfitItem[];
  reasoning: string; // Why this outfit?
  weatherTip: string;
}

export interface ShoppingSuggestion {
  title: string;
  price?: string;
  source: string;
  link: string;
  thumbnail?: string;
}