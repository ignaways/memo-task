const channel = (value) => {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};

const luminance = (hex) => {
  const [r, g, b] = [1, 3, 5].map((start) => parseInt(hex.slice(start, start + 2), 16));
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
};

// Warna ikon (putih atau stone-900) yang kontrasnya paling tinggi terhadap background.
export const getContrastText = (hex) => {
  const bg = luminance(hex);
  const white = 1.05 / (bg + 0.05);
  const dark = (bg + 0.05) / (luminance("#1c1917") + 0.05);
  return white >= dark ? "#ffffff" : "#1c1917";
};
