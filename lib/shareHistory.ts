import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';
import type { Session, UserProfile } from '@/store/types';
import { getLanguageOption } from '@/constants/Languages';

const PAD = (n: number) => String(n).padStart(2, '0');

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${PAD(d.getMonth() + 1)}-${PAD(d.getDate())} ${PAD(d.getHours())}:${PAD(d.getMinutes())}`;
}

function formatSession(s: Session, index: number): string {
  const lines = [
    `[${index + 1}] ${formatDateTime(s.date)}`,
    `NeuroScore: ${s.neuroScore} (${s.scoreLabel})`,
    `  Vocal Stability:     ${s.vocalStabilityScore}`,
    `  Speech Rhythm:       ${s.speechRhythmScore}`,
    `  Motor Coordination:  ${s.motorCoordinationScore}`,
    `  Baseline Drift:      ${s.baselineDrift >= 0 ? '+' : ''}${s.baselineDrift}`,
  ];
  if (s.isBaseline) lines.push('  (baseline session)');
  return lines.join('\n');
}

export interface BuildReportOptions {
  sessions: Session[];
  profile: UserProfile | null;
  currentSession?: Session;
}

export function buildHistoryReport({
  sessions,
  profile,
  currentSession,
}: BuildReportOptions): string {
  const now = new Date().toISOString();
  const lang = profile?.language ? getLanguageOption(profile.language).english : 'English';

  const allSessions = currentSession ? [currentSession, ...sessions] : sessions;

  const header = [
    'SignalJam — Screening History',
    `Generated: ${formatDateTime(now)}`,
    '',
    'Profile',
    `  Name:            ${profile?.nickname ?? '(not set)'}`,
    `  Age Range:       ${profile?.ageRange ?? '(not set)'}`,
    `  Biological Sex:  ${profile?.biologicalSex ?? '(not set)'}`,
    `  Language:        ${lang}`,
    '',
    `Sessions: ${allSessions.length}`,
    '────────────────────────────────',
  ];

  const body = allSessions.length
    ? allSessions.map((s, i) => formatSession(s, i)).join('\n\n')
    : '(no sessions recorded)';

  const footer = [
    '',
    '────────────────────────────────',
    'SignalJam is a screening tool, not a diagnostic device.',
  ];

  return [...header, body, ...footer].join('\n') + '\n';
}

export async function shareHistory(options: BuildReportOptions): Promise<void> {
  const content = buildHistoryReport(options);
  const filename = `signaljam-history-${Date.now()}.txt`;
  const uri = `${FileSystem.cacheDirectory}${filename}`;

  await FileSystem.writeAsStringAsync(uri, content);

  if (!(await Sharing.isAvailableAsync())) {
    Alert.alert(
      'Sharing not available',
      'This device does not support the share sheet.'
    );
    return;
  }

  await Sharing.shareAsync(uri, {
    mimeType: 'text/plain',
    dialogTitle: 'Share SignalJam history',
    UTI: 'public.plain-text',
  });
}
