import crypto from 'crypto';

const CELESTIAL_API_KEY = process.env.CELESTIAL_API_KEY;
const CELESTIAL_API_SECRET = process.env.CELESTIAL_API_SECRET;
const CELESTIAL_BASE_URL = process.env.CELESTIAL_BASE_URL || 'https://celestialtopup.com/api/v1';

function checkEnvVars() {
  if (!CELESTIAL_API_KEY || !CELESTIAL_API_SECRET) {
    return {
      ok: false,
      error: `Missing env vars: CELESTIAL_API_KEY=${CELESTIAL_API_KEY ? 'SET' : 'MISSING'}, CELESTIAL_API_SECRET=${CELESTIAL_API_SECRET ? 'SET' : 'MISSING'}`,
    };
  }
  if (CELESTIAL_API_KEY.length < 5 || CELESTIAL_API_SECRET.length < 5) {
    return {
      ok: false,
      error: `Env vars too short: key=${CELESTIAL_API_KEY.length} chars, secret=${CELESTIAL_API_SECRET.length} chars`,
    };
  }
  return { ok: true };
}

function generateSignature() {
  return crypto.createHash('md5').update(CELESTIAL_API_KEY + CELESTIAL_API_SECRET).digest('hex');
}

export function generateCallbackSignature(trxId) {
  return crypto.createHash('md5').update(CELESTIAL_API_KEY + ':' + CELESTIAL_API_SECRET + ':' + trxId).digest('hex');
}

export async function fetchProfile() {
  const envCheck = checkEnvVars();
  if (!envCheck.ok) {
    return { success: false, error: envCheck.error };
  }

  try {
    const res = await fetch(`${CELESTIAL_BASE_URL}/profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: CELESTIAL_API_KEY,
        signature: generateSignature(),
      }),
    });
    if (!res.ok) {
      let body = '';
      try { body = await res.text(); } catch {}
      return { success: false, error: `Celestial API HTTP ${res.status}: ${res.statusText} | ${body}` };
    }
    const data = await res.json();
    return data;
  } catch (err) {
    return { success: false, error: `Celestial fetch failed: ${err.message}` };
  }
}

export async function fetchProducts() {
  const envCheck = checkEnvVars();
  if (!envCheck.ok) {
    return { success: false, error: envCheck.error };
  }

  try {
    const res = await fetch(`${CELESTIAL_BASE_URL}/produk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: CELESTIAL_API_KEY,
        signature: generateSignature(),
      }),
    });
    if (!res.ok) {
      let body = '';
      try { body = await res.text(); } catch {}
      return { success: false, error: `Celestial API HTTP ${res.status}: ${res.statusText} | ${body}` };
    }
    const data = await res.json();
    return data;
  } catch (err) {
    return { success: false, error: `Celestial fetch failed: ${err.message}` };
  }
}

export async function createOrder({ refId, sku, target, zoneId, callbackUrl }) {
  const envCheck = checkEnvVars();
  if (!envCheck.ok) {
    return { success: false, error: envCheck.error };
  }

  const body = {
    api_key: CELESTIAL_API_KEY,
    signature: generateSignature(),
    ref_id: refId,
    sku,
    target,
  };

  if (zoneId) {
    body.zone_id = zoneId;
  }

  if (callbackUrl) {
    body.callback_url = callbackUrl;
  }

  const res = await fetch(`${CELESTIAL_BASE_URL}/order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function checkStatus(trxId) {
  const res = await fetch(`${CELESTIAL_BASE_URL}/status`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: CELESTIAL_API_KEY,
      signature: generateSignature(),
      trx_id: trxId,
    }),
  });
  return res.json();
}

export async function createDeposit({ jumlah, callbackUrl }) {
  const body = {
    api_key: CELESTIAL_API_KEY,
    signature: generateSignature(),
    jumlah,
  };

  if (callbackUrl) {
    body.callback_url = callbackUrl;
  }

  const res = await fetch(`${CELESTIAL_BASE_URL}/deposit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function checkDepositStatus(depositId) {
  const res = await fetch(`${CELESTIAL_BASE_URL}/deposit/status`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: CELESTIAL_API_KEY,
      signature: generateSignature(),
      deposit_id: depositId,
    }),
  });
  return res.json();
}

export const MLBB_INDONESIA_SKUS = {
  '50+Bonus Diamonds': 'MLIF1',
  '150+Bonus Diamonds': 'MLIF2',
  '250+Bonus Diamonds': 'MLIF3',
  '500+Bonus Diamonds': 'MLIF4',
  'Weekly Diamond Pass': 'MLWP1',
  'Weekly Diamond Pass 2x': 'MLWP2',
  'Weekly Diamond Pass 3x': 'MLWP3',
};

export function getSkuForItem(itemName) {
  for (const [key, sku] of Object.entries(MLBB_INDONESIA_SKUS)) {
    if (itemName.toLowerCase().includes(key.toLowerCase())) {
      return sku;
    }
  }

  const match = itemName.match(/(\d+)\s*(?:\+\s*\d+\s*)?diamond/i);
  if (match) {
    const diamonds = parseInt(match[1]);
    if (diamonds <= 55) return 'MLIF1';
    if (diamonds <= 165) return 'MLIF2';
    if (diamonds <= 275) return 'MLIF3';
    if (diamonds <= 565) return 'MLIF4';
  }

  return null;
}
