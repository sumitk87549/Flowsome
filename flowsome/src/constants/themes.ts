import { AppTheme } from '../types';

export const THEMES: AppTheme[] = [
  {
    id: 'rajasthan',
    name: 'Rajasthan',
    accentColor: '#D4845A',
    backgroundGradient: ['#1A0F08', '#2E1A0E', '#4A2816', '#3A1E10'],
    particleDensity: 20,
    textColor: '#FAF0E4',
    subtextColor: '#B89470',
    ambientSound: 'desert_wind',
  },
  {
    id: 'kerala',
    name: 'Kerala',
    accentColor: '#5CC98E',
    backgroundGradient: ['#060F0A', '#0A1F15', '#0D2E1E', '#081A10'],
    particleDensity: 35,
    textColor: '#E2F5EB',
    subtextColor: '#78B494',
    ambientSound: 'rain_on_leaves',
  },
  {
    id: 'assam',
    name: 'Assam',
    accentColor: '#8FC49E',
    backgroundGradient: ['#0A150E', '#122218', '#1A3020', '#0F1C13'],
    particleDensity: 28,
    textColor: '#E4F0E8',
    subtextColor: '#82A88D',
    ambientSound: 'river_flow',
  },
  {
    id: 'himalaya',
    name: 'Himalaya',
    accentColor: '#94C0DE',
    backgroundGradient: ['#080E18', '#0E1826', '#152236', '#0B1420'],
    particleDensity: 15,
    textColor: '#E4EEF8',
    subtextColor: '#7AA2BE',
    ambientSound: 'mountain_wind',
  },
  {
    id: 'andaman',
    name: 'Andaman & Nicobar',
    accentColor: '#4DD4CF',
    backgroundGradient: ['#040E14', '#081C26', '#0C2A38', '#061620'],
    particleDensity: 40,
    textColor: '#D8F4F2',
    subtextColor: '#5EB8B4',
    ambientSound: 'ocean_waves',
  },
];

export const DEFAULT_THEME_ID = 'kerala';
