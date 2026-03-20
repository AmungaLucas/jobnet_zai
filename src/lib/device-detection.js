import { UAParser } from 'ua-parser-js';

export function detectDevice(userAgent) {
  if (!userAgent) return { type: 'web', name: 'Unknown Device' };
  
  const parser = new UAParser(userAgent);
  const result = parser.getResult();
  
  let deviceType = 'desktop';
  const deviceName = [];
  
  // Detect device type
  if (result.device.type === 'mobile') {
    deviceType = 'mobile';
  } else if (result.device.type === 'tablet') {
    deviceType = 'tablet';
  }
  
  // Detect CLI tools and bots
  const lowerUA = userAgent.toLowerCase();
  if (lowerUA.includes('curl') || lowerUA.includes('wget') || lowerUA.includes('httpie')) {
    return {
      type: 'desktop',
      name: `CLI Tool (${result.browser.name || 'HTTP Client'})`,
      browser: result.browser.name || 'HTTP Client',
      os: result.os.name || 'Unknown',
      vendor: null,
      model: null
    };
  }
  
  if (lowerUA.includes('bot') || lowerUA.includes('spider') || lowerUA.includes('crawler')) {
    return {
      type: 'desktop',
      name: `Bot (${result.browser.name || 'Web Crawler'})`,
      browser: result.browser.name || 'Bot',
      os: result.os.name || 'Unknown',
      vendor: null,
      model: null
    };
  }
  
  // Detect Postman and similar API tools
  if (lowerUA.includes('postman') || lowerUA.includes('insomnia')) {
    return {
      type: 'desktop',
      name: `API Client (${result.browser.name || 'Postman'})`,
      browser: result.browser.name || 'API Client',
      os: result.os.name || 'Unknown',
      vendor: null,
      model: null
    };
  }
  
  // Build device name - prioritize meaningful info
  const osName = result.os?.name && result.os.name !== 'Unknown' ? result.os.name : null;
  const browserName = result.browser?.name && result.browser.name !== 'Unknown' ? result.browser.name : null;
  const vendor = result.device?.vendor && result.device.vendor !== 'Unknown' ? result.device.vendor : null;
  const model = result.device?.model && result.device.model !== 'Unknown' ? result.device.model : null;
  
  // Add vendor/model if available (mobile devices usually have this)
  if (vendor) deviceName.push(vendor);
  if (model) deviceName.push(model);
  
  // Add OS if we don't have vendor/model (desktop browsers)
  if (!vendor && !model && osName) {
    deviceName.push(osName);
  }
  
  // Add browser name
  if (browserName) {
    deviceName.push(`- ${browserName}`);
  }
  
  // Fallback
  const finalName = deviceName.join(' ').trim() || 'Unknown Device';
  
  return {
    type: deviceType,
    name: finalName,
    browser: browserName,
    os: osName,
    vendor: vendor,
    model: model
  };
}

export function getClientInfo(request) {
  const userAgent = request.headers.get('user-agent') || '';
  
  // Get IP address - check various headers
  let ipAddress = 
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    request.headers.get('cf-connecting-ip') || // Cloudflare
    request.headers.get('true-client-ip') ||   // Cloudflare Enterprise
    request.headers.get('x-client-ip') ||
    '0.0.0.0';
  
  const device = detectDevice(userAgent);
  
  return {
    ipAddress,
    userAgent,
    deviceName: device.name,
    deviceType: device.type,
    deviceDetails: device
  };
}
