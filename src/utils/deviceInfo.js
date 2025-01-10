export const getDeviceInfo = (req) => {
    const userAgent = req.headers['user-agent'];
    const ip = req.ip || req.connection.remoteAddress;
  
    return {
      device: parseDevice(userAgent),
      browser: parseBrowser(userAgent),
      location: 'Secure Location', // In production, use a geolocation service
      ip: anonymizeIP(ip)
    };
  };
  
  const parseDevice = (userAgent) => {
    if (/mobile/i.test(userAgent)) return 'Mobile Device';
    if (/tablet/i.test(userAgent)) return 'Tablet';
    return 'Desktop Computer';
  };
  
  const parseBrowser = (userAgent) => {
    if (/firefox/i.test(userAgent)) return 'Firefox';
    if (/chrome/i.test(userAgent)) return 'Chrome';
    if (/safari/i.test(userAgent)) return 'Safari';
    if (/edge/i.test(userAgent)) return 'Edge';
    return 'Unknown Browser';
  };
  
  const anonymizeIP = (ip) => {
    return ip.replace(/\d+$/g, 'xxx');
  };