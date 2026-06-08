/**
 * TOPSIS Algorithm implementation for SmartInvest
 * 
 * Criteria configuration:
 * - C1: Modal/Capital
 * - C2: Jangka Waktu/Horizon
 * - C3: Risiko/Risk
 * - C4: Likuiditas/Liquidity
 */

export function calculateTOPSIS(userPreferences, alternatives, dbCriterias = []) {
  // 1. Prepare weights and types
  const criteriaIds = ['C1', 'C2', 'C3', 'C4']
  const userScores = [
    userPreferences.c1,
    userPreferences.c2,
    userPreferences.c3,
    userPreferences.c4
  ]

  // Default parameters fallback
  const defaultTypes = ['cost', 'benefit', 'cost', 'benefit']
  const defaultWeights = [1.0, 1.0, 1.0, 1.0]

  const criteriaTypes = []
  const combinedRawWeights = []

  criteriaIds.forEach((cId, idx) => {
    // Look up criteria in db parameters
    const dbCrit = dbCriterias.find(c => c.id === cId)
    const type = dbCrit ? dbCrit.type : defaultTypes[idx]
    const dbWeight = dbCrit ? dbCrit.weight : defaultWeights[idx]

    criteriaTypes.push(type)
    // Multiply default importance weight by user preference weight
    combinedRawWeights.push(dbWeight * userScores[idx])
  })

  // Normalize combined weights
  const sumWeights = combinedRawWeights.reduce((sum, w) => sum + w, 0)
  const weights = combinedRawWeights.map(w => (sumWeights > 0 ? w / sumWeights : 0.25))

  // 2. Normalize Decision Matrix
  const numAlternatives = alternatives.length
  const numCriteria = 4
  
  // Calculate root sum of squares for each criterion
  const rss = Array(numCriteria).fill(0)
  for (let j = 0; j < numCriteria; j++) {
    let sumSquares = 0
    for (let i = 0; i < numAlternatives; i++) {
      const score = alternatives[i].scores[j]
      sumSquares += score * score
    }
    rss[j] = Math.sqrt(sumSquares)
  }

  // Calculate normalized & weighted decision matrix
  const weightedMatrix = []
  for (let i = 0; i < numAlternatives; i++) {
    const row = []
    for (let j = 0; j < numCriteria; j++) {
      const score = alternatives[i].scores[j]
      const normalized = rss[j] > 0 ? score / rss[j] : 0
      row.push(normalized * weights[j])
    }
    weightedMatrix.push(row)
  }

  // 3. Determine Ideal Positive (A+) and Ideal Negative (A-) Solutions
  const idealPositive = []
  const idealNegative = []

  for (let j = 0; j < numCriteria; j++) {
    const columnValues = weightedMatrix.map(row => row[j])
    if (criteriaTypes[j] === 'benefit') {
      idealPositive.push(columnValues.length > 0 ? Math.max(...columnValues) : 0)
      idealNegative.push(columnValues.length > 0 ? Math.min(...columnValues) : 0)
    } else {
      idealPositive.push(columnValues.length > 0 ? Math.min(...columnValues) : 0)
      idealNegative.push(columnValues.length > 0 ? Math.max(...columnValues) : 0)
    }
  }

  // 4. Calculate Distance to Ideal Solutions and Closeness Coefficient (Vi)
  const results = alternatives.map((alt, i) => {
    let sumSquarePos = 0
    let sumSquareNeg = 0

    for (let j = 0; j < numCriteria; j++) {
      const diffPos = weightedMatrix[i][j] - idealPositive[j]
      const diffNeg = weightedMatrix[i][j] - idealNegative[j]
      sumSquarePos += diffPos * diffPos
      sumSquareNeg += diffNeg * diffNeg
    }

    const distPos = Math.sqrt(sumSquarePos)
    const distNeg = Math.sqrt(sumSquareNeg)

    // Closeness coefficient Vi
    const totalDist = distPos + distNeg
    const closeness = totalDist > 0 ? distNeg / totalDist : 0

    return {
      ...alt,
      closeness: parseFloat(closeness.toFixed(4)),
      distPos: parseFloat(distPos.toFixed(4)),
      distNeg: parseFloat(distNeg.toFixed(4))
    }
  })

  // 5. Sort descending by closeness score
  return results.sort((a, b) => b.closeness - a.closeness)
}
