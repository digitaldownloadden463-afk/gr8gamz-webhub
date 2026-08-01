'use client';

import { useEffect } from 'react';
import { recordChallengeHistory } from '@/lib/playerEngagement';

type ChallengeOpenRecorderProps = {
  slug: string;
  kind: 'original' | 'select';
  url: string;
  label: string;
};

export function ChallengeOpenRecorder({ slug, kind, url, label }: ChallengeOpenRecorderProps) {
  useEffect(() => {
    recordChallengeHistory({ slug, kind, url, label });
  }, [kind, label, slug, url]);
  return null;
}

export default ChallengeOpenRecorder;
