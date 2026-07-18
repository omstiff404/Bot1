// Toolkit/simple.js - small helpers
export function formatBytes(n){
  if (n===0) return '0 B';
  const units=['B','KB','MB','GB','TB'];
  const i=Math.floor(Math.log(n)/Math.log(1024));
  return `${(n/Math.pow(1024,i)).toFixed(2)} ${units[i]}`;
}
