// utils/seasonUtils.ts
export interface SeasonInfo {
  name: string;
  nameHindi: string;
  line: string;
}

const FESTIVALS: Array<{
  start: [number, number]; // [month 0-indexed, day]
  end:   [number, number];
  name: string;
  line: string;
}> = [
  { start: [9, 15], end: [9, 22], name: 'Dussehra',  line: 'Dussehra · Victory of light.' },
  { start: [9, 29], end: [11, 5], name: 'Diwali',    line: 'Diwali · Light your practice.' },
  { start: [0, 13], end: [0, 15], name: 'Makar Sankranti', line: 'Sankranti · The sun turns north.' },
  { start: [1, 25], end: [2, 5],  name: 'Holi',       line: 'Holi · Colour and renewal.' },
  { start: [8, 19], end: [8, 28], name: 'Navratri',   line: 'Navratri · Nine nights of the divine.' },
];

const SEASONS = [
  { months: [2, 3],    name: 'Vasanta', nameHindi: 'वसंत',    line: 'The petals are opening.' },
  { months: [4, 5],    name: 'Grishma', nameHindi: 'ग्रीष्म',  line: 'The sun teaches endurance.' },
  { months: [6, 7],    name: 'Varsha',  nameHindi: 'वर्षा',   line: 'The earth is being washed clean.' },
  { months: [8, 9],    name: 'Sharad',  nameHindi: 'शरद्',    line: 'The harvest of stillness.' },
  { months: [10, 11],  name: 'Hemanta', nameHindi: 'हेमंत',   line: 'The fog that precedes clarity.' },
  { months: [0, 1],    name: 'Shishira',nameHindi: 'शिशिर',   line: 'The cold that deepens the root.' },
];

export function getCurrentSeasonInfo(): SeasonInfo {
  const now = new Date();
  const month = now.getMonth();
  const day = now.getDate();

  for (const festival of FESTIVALS) {
    const [sm, sd] = festival.start;
    const [em, ed] = festival.end;
    const afterStart = month > sm || (month === sm && day >= sd);
    const beforeEnd  = month < em || (month === em && day <= ed);
    if (afterStart && beforeEnd) {
      return { name: festival.name, nameHindi: '', line: festival.line };
    }
  }

  const season = SEASONS.find((s) => s.months.includes(month)) ?? SEASONS[4];
  return { name: season.name, nameHindi: season.nameHindi, line: season.line };
}
