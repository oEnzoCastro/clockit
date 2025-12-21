const fs = require('fs');
const csv = require('csv-parser');

const results = [];//no momento vai ser com um csv fixo mais depois receber um arquivo como parâmetro



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