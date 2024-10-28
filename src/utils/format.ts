export const formatNumber = (value: number, type: 'currency' | 'number' | 'percent'): string => {
  if (value === 0) return '0';

  const formatter = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
    ...(type === 'currency' && {
      style: 'currency',
      currency: 'USD'
    }),
    ...(type === 'percent' && {
      style: 'percent',
      minimumFractionDigits: 2
    })
  });

  return formatter.format(value);
};

export const formatAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatTimestamp = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};