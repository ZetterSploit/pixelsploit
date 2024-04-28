addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});
async function handleRequest(request) {
  const url = new URL(request.url);
  const rid = url.pathname.substring(1);
  if (!rid || !isValidMD5(rid)) {
    return new Response("Invalid request", { status: 400 });
  }
  const cf = request.cf || {};
  const ip = request.headers.get('CF-Connecting-IP');
  const userAgent = request.headers.get('user-agent');
  const date = new Date();
  const formattedDate = date.toLocaleString('fr-FR', { timeZone: 'Europe/Paris' });
  const key = `${rid} - ${formattedDate}`;
  const dataToSave = {
    ip,
    userAgent,
    country: cf.country || 'Unknown',
    city: cf.city || 'Unknown',
    timezone: cf.timezone || 'Unknown',
    latitude: cf.latitude || 'Unknown',
    longitude: cf.longitude || 'Unknown',
    asn: cf.asn || 'Unknown',
    colo: cf.colo || 'Unknown'
  };
  await pixelsploit.put(key, JSON.stringify(dataToSave));
  const pixel = new Uint8Array([71, 73, 70, 56, 57, 97, 1, 0, 1, 0, 128, 0, 0, 255, 255, 255, 0, 0, 0, 33, 249, 4, 1, 0, 0, 0, 0, 44, 0, 0, 0, 0, 1, 0, 1, 0, 0, 2, 2, 68, 1, 0, 59]);
  return new Response(pixel.buffer, {
    headers: {
      'Content-Type': 'image/gif',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  });
}
function isValidMD5(str) {
  return /^[a-f0-9]{32}$/i.test(str);
}
