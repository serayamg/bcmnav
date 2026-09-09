export interface BcmImpactInput {
  category: string;
  timeframe: string;
  severityScore: number;
}

export interface BcmCalculationResult {
  suggestedMtpd: string;
  criticalityScore: number;
  criticalityTier: 'Tier 1 — Mission Critical' | 'Tier 2 — Critical' | 'Tier 3 — Important' | 'Tier 4 — Non-Critical';
  recoveryPriority: 'P1' | 'P2' | 'P3' | 'P4';
  isSpofDetected: boolean;
  spofReasons: string[];
  completenessScore: number;
}

const TIMEFRAME_ORDER = ['<1h', '1-2h', '2-4h', '4-8h', '8-24h', '2d', '3d', '7d'];

export function calculateSuggestedMtpd(scores: BcmImpactInput[]): string {
  for (const tf of TIMEFRAME_ORDER) {
    const scoresInTf = scores.filter((s) => s.timeframe === tf);
    const hasSevere = scoresInTf.some((s) => s.severityScore >= 5);
    const majorCount = scoresInTf.filter((s) => s.severityScore >= 4).length;

    if (hasSevere || majorCount >= 2) {
      if (tf === '<1h') return '1 Hour';
      if (tf === '1-2h') return '2 Hours';
      if (tf === '2-4h') return '4 Hours';
      if (tf === '4-8h') return '8 Hours';
      if (tf === '8-24h') return '24 Hours';
      if (tf === '2d') return '2 Days';
      if (tf === '3d') return '3 Days';
      if (tf === '7d') return '7 Days';
    }
  }
  return '24 Hours';
}

export function validateRtoAgainstMtpd(rtoHours: number, mtpdHours: number): { isValid: boolean; warning?: string } {
  if (rtoHours > mtpdHours) {
    return {
      isValid: false,
      warning: `RTO (${rtoHours} jam) tidak boleh melampaui MTPD (${mtpdHours} jam). Berdasarkan ISO 22301, sistem harus pulih sebelum dampak menjadi tidak dapat diterima.`,
    };
  }
  return { isValid: true };
}

export function parseHoursFromString(val: string): number {
  const clean = val.toLowerCase();
  if (clean.includes('15 min') || clean.includes('15-min')) return 0.25;
  if (clean.includes('30 min') || clean.includes('30-min')) return 0.5;
  if (clean.includes('1 hour') || clean.includes('1 jam')) return 1;
  if (clean.includes('2 hour') || clean.includes('2 jam')) return 2;
  if (clean.includes('4 hour') || clean.includes('4 jam')) return 4;
  if (clean.includes('8 hour') || clean.includes('8 jam')) return 8;
  if (clean.includes('12 hour') || clean.includes('12 jam')) return 12;
  if (clean.includes('24 hour') || clean.includes('24 jam') || clean.includes('1 day')) return 24;
  if (clean.includes('2 day') || clean.includes('2 hari')) return 48;
  if (clean.includes('3 day') || clean.includes('3 hari')) return 72;
  if (clean.includes('7 day') || clean.includes('7 hari')) return 168;
  return 24;
}

export function evaluateCriticality({
  impactScores,
  rtoHours,
  hasSingleVendor,
  hasManualWorkaround,
  isCriticalRegulator,
}: {
  impactScores: BcmImpactInput[];
  rtoHours: number;
  hasSingleVendor: boolean;
  hasManualWorkaround: boolean;
  isCriticalRegulator: boolean;
}): BcmCalculationResult {
  const suggestedMtpd = calculateSuggestedMtpd(impactScores);
  const maxScore = impactScores.reduce((max, cur) => Math.max(max, cur.severityScore), 1);
  const avgScore = impactScores.length > 0 
    ? impactScores.reduce((sum, cur) => sum + cur.severityScore, 0) / impactScores.length 
    : 1;

  let timeScore = 10;
  if (rtoHours <= 2) timeScore = 30;
  else if (rtoHours <= 4) timeScore = 25;
  else if (rtoHours <= 8) timeScore = 20;
  else if (rtoHours <= 24) timeScore = 15;

  const impactFactor = (maxScore * 0.6 + avgScore * 0.4) * 8;

  let extraScore = 0;
  if (isCriticalRegulator) extraScore += 15;
  if (!hasManualWorkaround) extraScore += 10;
  if (hasSingleVendor) extraScore += 5;

  const totalScore = Math.min(100, Math.round(timeScore + impactFactor + extraScore));

  let criticalityTier: 'Tier 1 — Mission Critical' | 'Tier 2 — Critical' | 'Tier 3 — Important' | 'Tier 4 — Non-Critical';
  let recoveryPriority: 'P1' | 'P2' | 'P3' | 'P4';

  if (totalScore >= 80 || rtoHours <= 2) {
    criticalityTier = 'Tier 1 — Mission Critical';
    recoveryPriority = 'P1';
  } else if (totalScore >= 65 || rtoHours <= 4) {
    criticalityTier = 'Tier 2 — Critical';
    recoveryPriority = 'P2';
  } else if (totalScore >= 45 || rtoHours <= 24) {
    criticalityTier = 'Tier 3 — Important';
    recoveryPriority = 'P3';
  } else {
    criticalityTier = 'Tier 4 — Non-Critical';
    recoveryPriority = 'P4';
  }

  const spofReasons: string[] = [];
  if (hasSingleVendor) {
    spofReasons.push('Ketergantungan kritis pada satu vendor tunggal tanpa alternatif cadangan');
  }
  if (!hasManualWorkaround) {
    spofReasons.push('Tidak tersedianya prosedur pemulihan manual (manual workaround) jika sistem padam total');
  }
  if (rtoHours <= 2 && !hasManualWorkaround) {
    spofReasons.push('RTO sangat singkat (≤ 2 jam) namun bergantung penuh pada otomasi tanpa fallback');
  }

  return {
    suggestedMtpd,
    criticalityScore: totalScore,
    criticalityTier,
    recoveryPriority,
    isSpofDetected: spofReasons.length > 0,
    spofReasons,
    completenessScore: 88,
  };
}
