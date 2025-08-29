
const API_BASE = (localStorage.getItem('api_base')) || 'http://localhost:5000';
 //const API_BASE = 'http://localhost:5000'; // ✅ Correct — backend API
/** Normalize and build full URL */
function buildUrl(path) {
  return API_BASE.replace(/\/+$/, '') + '/' + path.replace(/^\/+/, '');
}

/** Handle response consistently */
async function handleResponse(res) {
  if (!res.ok) {
    let msg;
    try {
      const errJson = await res.json();
      msg = errJson.error || errJson.message || res.statusText;
    } catch {
      try {
        msg = await res.text();
      } catch {
        msg = res.statusText;
      }
    }
    throw new Error(msg || 'Request failed');
  }
  return res.json();
}

/** POST request */
export async function apiPost(path, body) {
  const token = getToken();
  try {
    const res = await fetch(buildUrl(path), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: 'Bearer ' + token } : {})
      },
      body: JSON.stringify(body)
    });
    return handleResponse(res);
  } catch (e) {
    throw new Error('Network error: ' + e.message + path);
  }
}

/** GET request */
export async function apiGet(path) {
  const token = getToken();
  try {
    const res = await fetch(buildUrl(path), {
      headers: {
        ...(token ? { Authorization: 'Bearer ' + token } : {})
      }
    });
    return handleResponse(res);
  } catch (e) {
    throw new Error('Network error: ' + e.message);
  }
}

/** Token helpers */


export function setToken(t) { localStorage.setItem('token', t); }
export function getToken() { return localStorage.getItem('token'); }
export function clearToken() { localStorage.removeItem('token'); }
