import {
  Unsubscribe,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { APP_CONFIG, DEFAULT_SITE_CONTENT } from '../constants';
import { db } from '../lib/firebase';
import { BrandingConfig, SiteContent } from '../types';

const SITE_CONFIG_PATH = 'metadata/site_config';

export interface SiteConfig {
  siteContent: SiteContent;
  branding: BrandingConfig;
  tickerMessage: string;
}

const DEFAULT_BRANDING: BrandingConfig = {
  logoHeader: APP_CONFIG.LOGO,
  logoFooter: APP_CONFIG.LOGO_FOOTER || APP_CONFIG.LOGO,
  logoAuth: APP_CONFIG.LOGO,
  favicon: APP_CONFIG.LOGO,
  pwaIcon: APP_CONFIG.LOGO,
};

const DEFAULT_TICKER_MESSAGE = `Welcome to ${APP_CONFIG.NAME} ${APP_CONFIG.TAGLINE} • Supporting Malaysian Sai devotees in their spiritual journey.`;

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  siteContent: DEFAULT_SITE_CONTENT,
  branding: DEFAULT_BRANDING,
  tickerMessage: DEFAULT_TICKER_MESSAGE,
};

const siteConfigRef = doc(db, SITE_CONFIG_PATH);

function mergeSiteConfig(data?: Partial<SiteConfig> | null): SiteConfig {
  return {
    siteContent: {
      ...DEFAULT_SITE_CONTENT,
      ...(data?.siteContent || {}),
    },
    branding: {
      ...DEFAULT_BRANDING,
      ...(data?.branding || {}),
    },
    tickerMessage: data?.tickerMessage || DEFAULT_TICKER_MESSAGE,
  };
}

export function subscribeToSiteConfig(
  onValue: (config: SiteConfig) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  return onSnapshot(
    siteConfigRef,
    (snapshot) => {
      onValue(mergeSiteConfig(snapshot.exists() ? (snapshot.data() as Partial<SiteConfig>) : null));
    },
    (error) => onError?.(error)
  );
}

export async function saveSiteContent(siteContent: SiteContent): Promise<void> {
  await setDoc(
    siteConfigRef,
    {
      siteContent,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function saveTickerMessage(tickerMessage: string): Promise<void> {
  await setDoc(
    siteConfigRef,
    {
      tickerMessage,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function saveBrandingConfig(branding: BrandingConfig): Promise<void> {
  await setDoc(
    siteConfigRef,
    {
      branding,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}
