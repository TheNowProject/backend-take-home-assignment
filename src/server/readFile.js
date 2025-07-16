const fs = require('fs')
const path = require('path')

const logFilePath = path.join(__dirname, '..', '..', 'logFile.txt')

// Read the file asynchronously
fs.readFile(logFilePath, 'utf8', (err, data) => {
  if (err) {
    //eslint-disable-next-line no-console
    console.error('Error reading file:', err)
  } else {
    let lines = data.split('\n')
    let totalTimeQ1 = 0
    let totalTimeQ2 = 0
    let totalTimeQ3 = 0
    let totalTimeQ4 = 0
    for (let i = 0; i < lines.length; i++) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (lines[i].includes('Q11') || lines[i].includes('Q12')) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        totalTimeQ1 += parseInt(lines[i].split(': ')[1]?.split('ms')[0])
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (lines[i].includes('Q21') || lines[i].includes('Q22')) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        totalTimeQ2 += parseInt(lines[i].split(': ')[1]?.split('ms')[0])
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (lines[i].includes('Q31') || lines[i].includes('Q32')) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        totalTimeQ3 += parseInt(lines[i].split(': ')[1]?.split('ms')[0])
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (lines[i].includes('Q41') || lines[i].includes('Q42')) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        totalTimeQ4 += parseInt(lines[i].split(': ')[1]?.split('ms')[0])
      }
    }
    //eslint-disable-next-line no-console
    console.log(`
      Time for Q1: ${totalTimeQ1 / 2}ms
      Time for Q2: ${totalTimeQ2}ms
      Time for Q3: ${totalTimeQ3 / 2}ms
      Time for Q4: ${totalTimeQ4 / 2}ms`)
  }
})
