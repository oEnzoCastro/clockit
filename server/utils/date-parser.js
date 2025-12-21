const fs = require('fs');
const csv = require('csv-parser');

const results = [];//no momento vai ser com um csv fixo mais depois receber um arquivo como parâmetro

/*[
  {
    group: 'Lourdes',
    title: 'AEDS1',
    description: 'Monitoria de AEDS1',
    theme: 'Ciência da Computação',
    theme_abbreviation: 'CC',
    sector: '1° Período',
    sector_abbreviation: '1°',
    agent: 'Monitor',
    location: 'Sala 1103',
    dates: [ '2025-10-11(10:00-13:30;15:00-16:00)', 'MON(13:45-18:00)' ]
  }
]
fas*/ 

fs.createReadStream('test.csv')
  .pipe(csv())
  .on('data', (row) => {

    if (row.dates && row.dates.includes('|')) {
      row.dates = row.dates.split('|').map(d => d.trim());
    }

    results.push(row);
  })
  .on('end', () => {
    console.log(results);
  });