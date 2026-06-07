import { AppTheme } from '../types';

export const THEMES: AppTheme[] = [
  {
    id: 'rajasthan',
    name: 'Rajasthan',
    accentColor: '#C0713A',
    backgroundGradient: ['#2C1A0E', '#4A2C1A', '#6B3A1F'],
    particleDensity: 20,
    textColor: '#F5E6D3',
    subtextColor: '#C9A882',
    ambientSound: 'desert_wind',
  },
  {
    id: 'kerala',
    name: 'Kerala',
    accentColor: '#4CAF80',
    backgroundGradient: ['#0A1F15', '#0D2E1E', '#0F3A24'],
    particleDensity: 35,
    textColor: '#D4EDE1',
    subtextColor: '#8CC4A6',
    ambientSound: 'rain_on_leaves',
  },
  {
    id: 'assam',
    name: 'Assam',
    accentColor: '#7BAE8C',
    backgroundGradient: ['#0F1E14', '#162A1C', '#1C3524'],
    particleDensity: 28,
    textColor: '#D8E8DC',
    subtextColor: '#94B89E',
    ambientSound: 'river_flow',
  },
  {
    id: 'himalaya',
    name: 'Himalaya',
    accentColor: '#8AB4D4',
    backgroundGradient: ['#0D1520', '#121E2E', '#162540'],
    particleDensity: 15,
    textColor: '#D8E8F5',
    subtextColor: '#8AAEC8',
    ambientSound: 'mountain_wind',
  },
  {
    id: 'andaman',
    name: 'Andaman & Nicobar',
    accentColor: '#3DBCB8',
    backgroundGradient: ['#061820', '#08232E', '#0A2E3C'],
    particleDensity: 40,
    textColor: '#C8EBE9',
    subtextColor: '#6BBBB8',
    ambientSound: 'ocean_waves',
  },
];

export const DEFAULT_THEME_ID = 'kerala';
