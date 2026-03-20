import { UAParser } from 'ua-parser-js';

export function detectDevice(userAgent) {
  if (!userAgent) return { type: 'web', name: 'Unknown' };
  
  const parser = new UAParser(userAgent);
  const result = parser.getResult();
  
  let deviceType = 'web';
  const deviceName = [];
  
  // Detect device type
  if (result.device.type === 'mobile') {
    deviceType = 'mobile';
  } else if (result.device.type === 'tablet') {
    deviceType = 'tablet';
  } else if (result.device.type === 'desktop' || !result.device.type) {
    deviceType = 'desktop';
  }
  
  // Build device name
  if (result.device.vendor) deviceName.push(result.device.vendor);
  if (result.device.model) deviceName.push(result.device.model);
  if (result.os.name) deviceName.push(`(${result.os.name})`);
  if (result.browser.name) deviceName.push(`- ${result.browser.name}`);
  
  return {
    type: deviceType,
    name: deviceName.join(' ') || 'Unknown Device',
    browser: result.browser.name,
    os: result.os.name,
    vendor: result.device.vendor,
    model: result.device.model
  };
}

export function getClientInfo(request) {
  const userAgent = request.headers.get('user-agent') || '';
  const ipAddress = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    '0.0.0.0';
  
  const device = detectDevice(userAgent);
  
  return {
    ipAddress: ipAddress.split(',')[0].trim(),
    userAgent,
    deviceName: device.name,
    deviceType: device.type,
    deviceDetails: device
  };
}
