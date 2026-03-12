import { auth, db } from '../firebase/config';
import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';

// Simple LZ compression using built-in browser APIs
function compress(input: string): string {
  // Use base64 + simple RLE-like encoding
  try {
    return btoa(encodeURIComponent(input));
  } catch {
    return btoa(unescape(encodeURIComponent(input)));
  }
}

function decompress(input: string): string | null {
  try {
    return decodeURIComponent(atob(input));
  } catch {
    try {
      return decodeURIComponent(escape(atob(input)));
    } catch {
      return null;
    }
  }
}

export interface CampaignSave {
  campaignId: string;
  campaignName: string;
  timestamp: number;
  gameState: Record<string, unknown>;
}

// Local save
export function saveLocal(campaignId: string, gameState: Record<string, unknown>, campaignName: string): void {
  const save: CampaignSave = {
    campaignId,
    campaignName,
    timestamp: Date.now(),
    gameState
  };
  localStorage.setItem(`campaign_save_${campaignId}`, JSON.stringify(save));
}

// Load local
export function loadLocal(campaignId: string): CampaignSave | null {
  const raw = localStorage.getItem(`campaign_save_${campaignId}`);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as CampaignSave;
  } catch {
    return null;
  }
}

// Delete local
export function deleteLocal(campaignId: string): void {
  localStorage.removeItem(`campaign_save_${campaignId}`);
}

// Get all local saves
export function getAllLocalSaves(): CampaignSave[] {
  const saves: CampaignSave[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('campaign_save_')) {
      try {
        saves.push(JSON.parse(localStorage.getItem(key) || '') as CampaignSave);
      } catch { /* skip */ }
    }
  }
  return saves;
}

function deepEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export type SaveStatus = 'idle' | 'compressing' | 'verifying' | 'uploading' | 'downloading' | 'final_check' | 'success' | 'error';

export interface SaveResult {
  success: boolean;
  message: string;
}

// Server save with full verification
export async function saveToServer(
  campaignId: string,
  gameState: Record<string, unknown>,
  campaignName: string,
  onStatus?: (s: SaveStatus) => void
): Promise<SaveResult> {
  if (!auth || !auth.currentUser || !db) {
    return { success: false, message: 'Войдите в Google аккаунт.\nПрогресс сохранён только локально.' };
  }

  saveLocal(campaignId, gameState, campaignName);

  return new Promise<SaveResult>((resolve) => {
    const timeout = setTimeout(() => {
      resolve({ success: false, message: 'Таймаут (20 сек).\nПрогресс сохранён только локально.' });
    }, 20000);

    (async () => {
      try {
        onStatus?.('compressing');
        const json = JSON.stringify(gameState);
        const compressed = compress(json);

        onStatus?.('verifying');
        const dec = decompress(compressed);
        if (!dec || !deepEqual(gameState, JSON.parse(dec))) {
          clearTimeout(timeout);
          resolve({ success: false, message: 'Ошибка сжатия.\nПрогресс сохранён только локально.' });
          return;
        }

        onStatus?.('uploading');
        const ref = doc(db!, 'users', auth!.currentUser!.uid, 'saves', campaignId);
        await setDoc(ref, { campaignId, campaignName, timestamp: Date.now(), compressed });

        onStatus?.('downloading');
        const snap = await getDoc(ref);
        if (!snap.exists()) {
          clearTimeout(timeout);
          resolve({ success: false, message: 'Сервер не подтвердил.\nПрогресс сохранён только локально.' });
          return;
        }

        onStatus?.('final_check');
        const serverDec = decompress(snap.data().compressed);
        if (!serverDec || !deepEqual(gameState, JSON.parse(serverDec))) {
          clearTimeout(timeout);
          await deleteDoc(ref).catch(() => {});
          resolve({ success: false, message: 'Верификация не пройдена.\nПрогресс сохранён только локально.' });
          return;
        }

        clearTimeout(timeout);
        onStatus?.('success');
        resolve({ success: true, message: 'Сохранение прошло успешно!' });
      } catch (err) {
        clearTimeout(timeout);
        resolve({ success: false, message: `Ошибка: ${err instanceof Error ? err.message : '?'}.\nСохранено локально.` });
      }
    })();
  });
}

// Load from server
export async function loadFromServer(campaignId: string): Promise<CampaignSave | null> {
  if (!auth || !auth.currentUser || !db) return null;
  try {
    const ref = doc(db, 'users', auth.currentUser.uid, 'saves', campaignId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    const data = snap.data();
    const dec = decompress(data.compressed);
    if (!dec) return null;
    return { campaignId: data.campaignId, campaignName: data.campaignName, timestamp: data.timestamp, gameState: JSON.parse(dec) };
  } catch {
    return null;
  }
}

// Delete from server
export async function deleteFromServer(campaignId: string): Promise<void> {
  if (!auth || !auth.currentUser || !db) return;
  try {
    await deleteDoc(doc(db, 'users', auth.currentUser.uid, 'saves', campaignId));
  } catch { /* ignore */ }
}
