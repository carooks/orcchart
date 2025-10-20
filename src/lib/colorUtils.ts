const pastelColors = [
  { bg: '#FFE5E5', text: '#7F0000' },
  { bg: '#E5F5FF', text: '#003D7F' },
  { bg: '#E5FFE5', text: '#007F00' },
  { bg: '#FFF5E5', text: '#7F4F00' },
  { bg: '#F5E5FF', text: '#4F007F' },
  { bg: '#FFE5F5', text: '#7F0050' },
  { bg: '#E5FFFF', text: '#007F7F' },
  { bg: '#FFFFE5', text: '#7F7F00' },
  { bg: '#FFE5D9', text: '#7F3000' },
  { bg: '#E5E5FF', text: '#00007F' },
  { bg: '#FFD9E5', text: '#7F0030' },
  { bg: '#D9FFE5', text: '#007F30' },
  { bg: '#E5D9FF', text: '#3D007F' },
  { bg: '#FFEFD9', text: '#7F5500' },
  { bg: '#D9FFFF', text: '#007F7F' }
];

export function generateDepartmentColors(departments: string[]): Record<string, { bg: string; text: string }> {
  const colors: Record<string, { bg: string; text: string }> = {};

  departments.forEach((dept, index) => {
    colors[dept] = pastelColors[index % pastelColors.length];
  });

  return colors;
}

export function getContrastColor(hexColor: string): string {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}
