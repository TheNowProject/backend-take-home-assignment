function PathOptimizerWithoutBC(
  totalRequests: number,
  pathAC: number,
  pathBD: number
) {
  const x = Math.floor((100 / 3) * (pathAC - pathBD + totalRequests / 100))
  console.log(`
    Requests for path ABD: ${x}
    Requests for path ACD: ${totalRequests - x}
  `)

  let min = Infinity
  let requestsForPathABD
  for (let i = 0; i <= totalRequests; i++) {
    const result =
      i * (i / 100 + pathBD) +
      (totalRequests - i) * (pathAC + (totalRequests - i) / 200)
    if (result < min) {
      requestsForPathABD = i
      min = result
    }
  }
  console.log(`
    Requests for path ABD (check using loop):', ${requestsForPathABD}
  `)
}

function PathOptimizerWithBC(
  totalRequests: number,
  pathAC: number,
  pathBC: number,
  pathBD: number
) {
  const i = Math.max(0, Math.floor(50 * (2 - pathBD)))
  const j = Math.max(0, Math.floor(100 * (2 - pathAC)))
  const k = totalRequests - i - j
  console.log(`
    Requests for path ABD: ${i}
    Requests for path ACD: ${j}
    Requests for path ABCD: ${k}
  `)

  let min = Infinity
  let requestsForPathABD
  let requestsForPathACD
  let requestsForPathABCD
  for (let i = 0; i <= totalRequests; i++) {
    for (let j = 0; j <= totalRequests; j++) {
      if (i + j <= totalRequests) {
        let k = totalRequests - i - j
        const result = i * (i / 100 + pathBD) + j * (pathAC + j / 200) + k * 2
        if (result < min) {
          requestsForPathABD = i
          requestsForPathACD = j
          requestsForPathABCD = k
          min = result
        }
      }
    }
  }
  console.log(`
    Requests for path ABD (check using loop): ${requestsForPathABD}
    Requests for path ACD (check using loop): ${requestsForPathACD}
    Requests for path ABCD (check using loop): ${requestsForPathABCD}
  `)
}

PathOptimizerWithoutBC(4000, 50, 35)
console.log('===========================================================')
PathOptimizerWithBC(1000, 50, 2, 35)
