function PathOptimizerWithoutBC(
  totalRequests: number,
  pathAC: number,
  pathBD: number
) {
  const result: unknown[] = []
  for (let i = 1; i <= 4000; i++) {
    if (i / 100 + pathBD >= pathAC + (totalRequests - i) / 200) {
      result.push({
        numberOfConcurrentRequests: i,
        pathForNewRequest: 'A->C->D',
      })
    } else {
      result.push({
        numberOfConcurrentRequests: i,
        pathForNewRequest: 'A->B->D',
      })
    }
  }
  console.log(result)
}

function PathOptimizerWithBC(
  totalRequests: number,
  pathAC: number,
  pathBC: number,
  pathBD: number
) {
  const result: unknown[] = []
  for (let i = 1; i <= 4000; i++) {
    const pathABD = i / 100 + pathBD
    const pathACD = pathAC + (totalRequests - i) / 200
    const pathABCD = i / 100 + pathBC + (totalRequests - i) / 200
    const min = Math.min(pathABD, pathACD, pathABCD)
    if (min == pathABD) {
      result.push({
        numberOfConcurrentRequests: i,
        pathForNewRequest: 'A->B->D',
      })
    } else if (min == pathACD) {
      result.push({
        numberOfConcurrentRequests: i,
        pathForNewRequest: 'A->C->D',
      })
    } else {
      result.push({
        numberOfConcurrentRequests: i,
        pathForNewRequest: 'A->B->C->D',
      })
    }
  }
  console.log(result)
}

PathOptimizerWithoutBC(4000, 50, 35)
PathOptimizerWithBC(4000, 50, 2, 35)
