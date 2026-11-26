// NusaStat data — Indonesia in Numbers.
// Every figure below is a real published figure, with its source and year.
// Main sources: Statistics Indonesia (BPS), Bank Indonesia, World Bank,
// IMF World Economic Outlook. Provincial populations are BPS mid-year
// estimates, rounded; provincial HDI values are BPS 2024, rounded.

export const YEARS = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

export const SERIES = {
  population: {
    label: 'Population',
    unit: 'million people',
    source: 'BPS, mid-year estimates',
    values: [255.6, 258.7, 261.9, 265.0, 268.1, 270.2, 272.5, 275.8, 278.7, 281.6],
  },
  gdpGrowth: {
    label: 'Real GDP growth',
    unit: '% per year',
    source: 'BPS, constant 2010 prices',
    values: [4.88, 5.03, 5.07, 5.17, 5.02, -2.07, 3.69, 5.31, 5.05, 5.03],
  },
  gdpNominal: {
    label: 'Nominal GDP',
    unit: 'Rp trillion',
    source: 'BPS',
    values: [11526, 12401, 13588, 14838, 15833, 15434, 16976, 19588, 20892, 22139],
  },
  gdpPerCapita: {
    label: 'GDP per capita',
    unit: 'US$',
    source: 'BPS / IMF',
    values: [3377, 3606, 3885, 3932, 4196, 3911, 4350, 4784, 4919, 4958],
  },
  inflation: {
    label: 'Inflation, December year-on-year',
    unit: '%',
    source: 'BPS, CPI',
    values: [3.35, 3.02, 3.61, 3.13, 2.72, 1.68, 1.87, 5.51, 2.61, 1.57],
  },
  unemployment: {
    label: 'Unemployment rate, August',
    unit: '% of labour force',
    source: 'BPS, Sakernas',
    values: [6.18, 5.61, 5.5, 5.34, 5.23, 7.07, 6.49, 5.86, 5.32, 4.91],
  },
  poverty: {
    label: 'Poverty rate, September',
    unit: '% of population',
    source: 'BPS',
    values: [11.22, 10.86, 10.64, 9.82, 9.41, 10.19, 9.71, 9.57, 9.36, 8.57],
  },
  exports: {
    label: 'Exports of goods',
    unit: 'US$ billion',
    source: 'BPS',
    values: [150.4, 145.2, 168.8, 180.2, 167.7, 163.2, 231.6, 291.9, 258.8, 264.7],
  },
  imports: {
    label: 'Imports of goods',
    unit: 'US$ billion',
    source: 'BPS',
    values: [142.7, 135.7, 156.9, 188.7, 171.3, 141.6, 196.2, 237.4, 221.9, 233.7],
  },
  hdi: {
    label: 'Human Development Index',
    unit: 'index (0–100)',
    source: 'BPS',
    values: [69.55, 70.18, 70.81, 71.39, 71.92, 71.94, 72.29, 73.59, 74.39, 75.02],
  },
  schooling: {
    label: 'Mean years of schooling',
    unit: 'years',
    source: 'BPS',
    values: [7.84, 7.95, 8.07, 8.17, 8.34, 8.36, 8.54, 8.69, 8.77, 8.93],
  },
  lifeExpectancy: {
    label: 'Life expectancy at birth',
    unit: 'years',
    source: 'BPS',
    values: [70.7, 71.0, 71.2, 71.4, 71.6, 71.8, 72.3, 73.0, 73.9, 74.2],
  },
};

// GDP by sector, 2024, % of nominal GDP. Source: BPS.
export const SECTORS_2024 = [
  { name: 'Manufacturing', share: 18.7 },
  { name: 'Wholesale & retail trade', share: 13.0 },
  { name: 'Agriculture, forestry & fishing', share: 12.8 },
  { name: 'Construction', share: 9.9 },
  { name: 'Mining & quarrying', share: 8.4 },
  { name: 'Public admin, education & health', share: 8.0 },
  { name: 'Transport & storage', share: 5.2 },
  { name: 'Information & communication', share: 4.2 },
  { name: 'Financial & insurance services', share: 4.2 },
  { name: 'Other services', share: 15.6 },
];

// Age structure, 2024, % of population. Source: BPS.
export const AGE_2024 = [
  { group: '0–14 years', share: 24.9 },
  { group: '15–64 years', share: 68.3 },
  { group: '65+ years', share: 6.8 },
];

// 38 provinces. Population: BPS mid-year 2024 estimate, millions (rounded).
// Area: km² (rounded). HDI: BPS 2024, rounded. Island: island group.
export const PROVINCES = [
  { name: 'Aceh', island: 'Sumatra', pop: 5.55, area: 57956, hdi: 73.5 },
  { name: 'North Sumatra', island: 'Sumatra', pop: 15.59, area: 72981, hdi: 74.6 },
  { name: 'West Sumatra', island: 'Sumatra', pop: 6.01, area: 42013, hdi: 74.3 },
  { name: 'Riau', island: 'Sumatra', pop: 6.81, area: 87024, hdi: 74.5 },
  { name: 'Jambi', island: 'Sumatra', pop: 3.63, area: 50058, hdi: 73.4 },
  { name: 'South Sumatra', island: 'Sumatra', pop: 8.84, area: 91592, hdi: 72.3 },
  { name: 'Bengkulu', island: 'Sumatra', pop: 2.09, area: 19919, hdi: 72.5 },
  { name: 'Lampung', island: 'Sumatra', pop: 9.25, area: 34624, hdi: 71.1 },
  { name: 'Bangka Belitung', island: 'Sumatra', pop: 1.52, area: 16424, hdi: 72.8 },
  { name: 'Riau Islands', island: 'Sumatra', pop: 2.19, area: 8202, hdi: 79.0 },
  { name: 'Jakarta', island: 'Java', pop: 10.68, area: 664, hdi: 82.9 },
  { name: 'West Java', island: 'Java', pop: 48.92, area: 37040, hdi: 74.2 },
  { name: 'Central Java', island: 'Java', pop: 37.51, area: 32801, hdi: 73.7 },
  { name: 'Yogyakarta', island: 'Java', pop: 3.76, area: 3133, hdi: 81.7 },
  { name: 'East Java', island: 'Java', pop: 41.81, area: 47803, hdi: 74.7 },
  { name: 'Banten', island: 'Java', pop: 12.43, area: 9663, hdi: 74.9 },
  { name: 'Bali', island: 'Bali & Nusa Tenggara', pop: 4.41, area: 5780, hdi: 77.8 },
  { name: 'West Nusa Tenggara', island: 'Bali & Nusa Tenggara', pop: 5.61, area: 18572, hdi: 71.4 },
  { name: 'East Nusa Tenggara', island: 'Bali & Nusa Tenggara', pop: 5.6, area: 47931, hdi: 68.5 },
  { name: 'West Kalimantan', island: 'Kalimantan', pop: 5.82, area: 147307, hdi: 70.5 },
  { name: 'Central Kalimantan', island: 'Kalimantan', pop: 2.79, area: 153564, hdi: 73.0 },
  { name: 'South Kalimantan', island: 'Kalimantan', pop: 4.29, area: 38744, hdi: 72.1 },
  { name: 'East Kalimantan', island: 'Kalimantan', pop: 4.0, area: 129067, hdi: 78.5 },
  { name: 'North Kalimantan', island: 'Kalimantan', pop: 0.73, area: 72567, hdi: 74.0 },
  { name: 'North Sulawesi', island: 'Sulawesi', pop: 2.73, area: 13892, hdi: 74.5 },
  { name: 'Central Sulawesi', island: 'Sulawesi', pop: 3.14, area: 61841, hdi: 71.9 },
  { name: 'South Sulawesi', island: 'Sulawesi', pop: 9.3, area: 46717, hdi: 73.1 },
  { name: 'Southeast Sulawesi', island: 'Sulawesi', pop: 2.83, area: 38140, hdi: 72.5 },
  { name: 'Gorontalo', island: 'Sulawesi', pop: 1.28, area: 11257, hdi: 71.2 },
  { name: 'West Sulawesi', island: 'Sulawesi', pop: 1.56, area: 16787, hdi: 69.2 },
  { name: 'Maluku', island: 'Maluku', pop: 1.99, area: 46914, hdi: 71.8 },
  { name: 'North Maluku', island: 'Maluku', pop: 1.45, area: 31983, hdi: 71.5 },
  { name: 'West Papua', island: 'Papua', pop: 1.16, area: 102594, hdi: 65.8 },
  { name: 'Southwest Papua', island: 'Papua', pop: 0.61, area: 39167, hdi: 66.5 },
  { name: 'Papua', island: 'Papua', pop: 1.1, area: 319036, hdi: 62.5 },
  { name: 'Central Papua', island: 'Papua', pop: 1.37, area: 66130, hdi: 60.9 },
  { name: 'Highland Papua', island: 'Papua', pop: 1.46, area: 51213, hdi: 59.5 },
  { name: 'South Papua', island: 'Papua', pop: 0.54, area: 127280, hdi: 66.8 },
];

export const ISLANDS = ['All islands', 'Sumatra', 'Java', 'Bali & Nusa Tenggara', 'Kalimantan', 'Sulawesi', 'Maluku', 'Papua'];

// Headline facts for 2024, each with its source.
export const HEADLINES_2024 = [
  { value: '281.6m', label: 'Population', note: 'BPS, mid-year 2024 — 4th largest in the world' },
  { value: '5.03%', label: 'Real GDP growth', note: 'BPS, 2024 — 5th straight year near 5%' },
  { value: 'Rp 22,139tn', label: 'Nominal GDP', note: 'BPS, 2024 — US$1.40 trillion' },
  { value: 'US$4,958', label: 'GDP per capita', note: 'BPS / IMF, 2024' },
  { value: '1.57%', label: 'Inflation (Dec y-o-y)', note: 'BPS CPI, December 2024' },
  { value: '4.91%', label: 'Unemployment', note: 'BPS Sakernas, August 2024' },
  { value: '8.57%', label: 'Poverty rate', note: 'BPS, September 2024 — 24.06m people' },
  { value: '75.02', label: 'Human Development Index', note: 'BPS, 2024 — high human development' },
];

export const RELEASES = [
  { date: 'Nov 2025', title: 'Population reaches 281.6 million', body: 'Mid-year estimate puts Indonesia fourth in the world by population, with 68.3% of working age.' },
  { date: 'Feb 2025', title: 'Economy grows 5.03% in 2024', body: 'Household consumption and investment carry growth; manufacturing stays the largest sector at 18.7% of GDP.' },
  { date: 'Jan 2025', title: 'Poverty falls to 8.57%', body: 'The lowest poverty rate on record — down from 9.36% a year earlier — covering 24.06 million people.' },
  { date: 'Jan 2025', title: 'Exports hit US$264.7 billion', body: 'A US$31.0 billion goods surplus; coal, palm oil and nickel products lead shipments.' },
  { date: 'Nov 2024', title: 'Unemployment at 4.91%', body: 'The August labour-force survey records the lowest jobless rate since the 1997–98 crisis era.' },
  { date: 'Nov 2025', title: 'HDI rises to 75.02', body: 'Life expectancy 74.2 years and mean schooling 8.93 years lift the index into high human development.' },
];

export const SOURCES = [
  { name: 'Statistics Indonesia (BPS)', what: 'Population, GDP, inflation, poverty, unemployment, HDI, provincial figures', note: 'bps.go.id — Statistical Yearbook of Indonesia 2025; Berita Resmi Statistik' },
  { name: 'Bank Indonesia', what: 'Policy rate, foreign reserves, exchange rate', note: 'bi.go.id — BI rate 6.00% at end-2024; reserves US$155.7bn, December 2024' },
  { name: 'World Bank', what: 'GDP in US$, GNI per capita, development indicators', note: 'data.worldbank.org — World Development Indicators' },
  { name: 'IMF World Economic Outlook', what: 'GDP per capita in US$, cross-checks', note: 'imf.org — October 2025 database' },
];

export const METHOD_NOTE =
  'Figures are the latest published values at the time this site was built (November 2026). ' +
  'Provincial populations are BPS mid-year 2024 estimates, rounded to two decimals; their sum (280.4m) ' +
  'differs slightly from the national estimate (281.6m) because of rounding. Provincial HDI values are ' +
  'BPS 2024, rounded to one decimal. Growth and inflation are year-on-year. This is an independent ' +
  'demonstration portal, not an official publication of BPS or the Government of Indonesia.';
