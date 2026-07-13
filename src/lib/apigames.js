import crypto from 'crypto';

const APIGAMES_MERCHANT_ID = process.env.APIGAMES_MERCHANT_ID;
const APIGAMES_SECRET_KEY = process.env.APIGAMES_SECRET_KEY;
const APIGAMES_BASE_URL = 'https://v1.apigames.id';

function checkEnvVars() {
  if (!APIGAMES_MERCHANT_ID || !APIGAMES_SECRET_KEY) {
    return {
      ok: false,
      error: `Missing env vars: APIGAMES_MERCHANT_ID=${APIGAMES_MERCHANT_ID ? 'SET' : 'MISSING'}, APIGAMES_SECRET_KEY=${APIGAMES_SECRET_KEY ? 'SET' : 'MISSING'}`,
    };
  }
  return { ok: true };
}

export function generateSignature(refId = null) {
  if (refId) {
    return crypto.createHash('md5').update(`${APIGAMES_MERCHANT_ID}:${APIGAMES_SECRET_KEY}:${refId}`).digest('hex');
  }
  return crypto.createHash('md5').update(`${APIGAMES_MERCHANT_ID}:${APIGAMES_SECRET_KEY}`).digest('hex');
}

export async function fetchProfile() {
  const envCheck = checkEnvVars();
  if (!envCheck.ok) {
    return { success: false, error: envCheck.error };
  }

  try {
    const signature = generateSignature();
    const url = `${APIGAMES_BASE_URL}/merchant/${APIGAMES_MERCHANT_ID}?signature=${signature}`;
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      let body = '';
      try { body = await res.text(); } catch {}
      return { success: false, error: `APIGames HTTP ${res.status}: ${res.statusText} | ${body}` };
    }

    const data = await res.json();
    return data;
  } catch (err) {
    return { success: false, error: `APIGames fetch failed: ${err.message}` };
  }
}

export async function getBalance() {
  const profile = await fetchProfile();
  if (!profile.success) return null;
  return profile.data?.saldo || 0;
}

export async function createOrder({ refId, sku, target, zoneId, callbackUrl }) {
  const envCheck = checkEnvVars();
  if (!envCheck.ok) {
    return { success: false, error: envCheck.error };
  }

  try {
    const body = {
      ref_id: refId,
      merchant_id: APIGAMES_MERCHANT_ID,
      produk: sku,
      tujuan: String(target),
      server_id: zoneId ? String(zoneId) : '',
      signature: generateSignature(refId),
    };

    console.log('[APIGames] Request body:', JSON.stringify(body, null, 2));

    const res = await fetch(`${APIGAMES_BASE_URL}/v2/transaksi`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    console.log('[APIGames] createOrder response:', JSON.stringify(data, null, 2));

    // APIGames returns HTTP 200 even on errors — check body status field
    // status: 1 = success, status: 0 = error
    if (!res.ok || data.status === 0 || data.error_msg) {
      const errMsg = data.error_msg || data.message || data.error || `APIGames HTTP ${res.status}`;
      return { success: false, error: errMsg, raw: data };
    }

    return { success: true, data: data.data || data, raw: data };
  } catch (err) {
    return { success: false, error: `APIGames order failed: ${err.message}` };
  }
}

export async function checkStatus(refId) {
  const envCheck = checkEnvVars();
  if (!envCheck.ok) {
    return { success: false, error: envCheck.error };
  }

  try {
    const signature = generateSignature(refId);
    const url = `${APIGAMES_BASE_URL}/v2/transaksi/status?merchant_id=${APIGAMES_MERCHANT_ID}&ref_id=${refId}&signature=${signature}`;
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      let bodyText = '';
      try { bodyText = await res.text(); } catch {}
      return { success: false, error: `APIGames HTTP ${res.status}: ${res.statusText} | ${bodyText}` };
    }

    const data = await res.json();
    
    // Status 0 means error
    if (!res.ok || data.status === 0 || data.error_msg) {
      const errMsg = data.error_msg || data.message || data.error || `APIGames HTTP ${res.status}`;
      return { success: false, error: errMsg, raw: data };
    }

    return { success: true, data: data.data || data, raw: data };
  } catch (err) {
    return { success: false, error: `APIGames status check failed: ${err.message}` };
  }
}

export const APIGAMES_OPERATOR_MAP = {
  1: 'Free Fire',
  2: 'Mobile Legends',
  19: 'Genshin Impact',
  92: 'Valorant',
};

export function getSkuForItem(itemName, gameTitle) {
  if (!itemName) return null;

  const name = itemName.toLowerCase();

  if (gameTitle === 'Free Fire') {
    if (name.includes('member mingguan')) return 'FFM';
    if (name.includes('member bulanan')) return 'FFOLD';
    const match = name.match(/(\d+)\s*diamond/);
    if (match) return `FF${match[1]}`;
  }

  if (gameTitle === 'Mobile Legends') {
    if (name.includes('twilight')) return 'MLTP';
    if (name.includes('weekly pass') || name.includes('weekly diamond')) {
      const xMatch = name.match(/(\d+)x/);
      if (xMatch && parseInt(xMatch[1]) > 1) return `WPMX${xMatch[1]}`;
      return 'MLWP';
    }
    if (name.includes('passe de grande valor') || name.includes('first top up')) return 'MLPDGV';
    const match = name.match(/(\d+)\s*diamond/);
    if (match) return `ML${match[1]}`;
  }

  if (gameTitle === 'Genshin Impact') {
    if (name.includes('welkin')) return 'GPBWM';
    const match = name.match(/(\d+)\s*genesis/);
    if (match) return `GPGI${match[1]}`;
  }

  if (gameTitle === 'Valorant') {
    const match = name.match(/(\d+)\s*(?:points?|vp)/);
    if (match) return `GPVLR${match[1]}`;
  }

  return null;
}

export function mapApiGamesStatus(apiStatus) {
  const statusMap = {
    'Sukses': 'completed',
    'Success': 'completed',
    'Pending': 'processing',
    'Proses': 'processing',
    'Gagal': 'failed',
    'Failed': 'failed',
    'Expired': 'expired',
  };
  return statusMap[apiStatus] || 'processing';
}
