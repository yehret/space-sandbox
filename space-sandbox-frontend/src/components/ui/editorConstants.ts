export const TEXTURE_PRESETS = [
  { name: 'No Texture (Solid Color)', url: '' },
  { name: 'Mercury', url: '/textures/2k_mercury.jpg' },
  { name: 'Venus (Surface)', url: '/textures/2k_venus_surface.jpg' },
  { name: 'Venus (Atmosphere)', url: '/textures/2k_venus_atmosphere.jpg' },
  { name: 'Earth', url: '/textures/2k_earth.jpg' },
  { name: 'Mars', url: '/textures/2k_mars.jpg' },
  { name: 'Jupiter', url: '/textures/2k_jupiter.jpg' },
  { name: 'Saturn', url: '/textures/2k_saturn.jpg' },
  { name: 'Uranus', url: '/textures/2k_uranus.jpg' },
  { name: 'Neptune', url: '/textures/2k_neptune.jpg' },
  { name: 'Pluto (16k)', url: '/textures/16k_pluto.jpg' },
  { name: 'Moon', url: '/textures/2k_moon.jpg' },
  { name: 'Io', url: '/textures/io.jpg' },
  { name: 'Phobos', url: '/textures/phobos.png' },
  { name: 'Deimos', url: '/textures/deimos.jpg' },
  { name: 'Charon', url: '/textures/2k_charon.jpg' },
  { name: 'Ceres (Fictional)', url: '/textures/2k_ceres_fictional.jpg' },
  { name: 'Eris (Fictional)', url: '/textures/2k_eris_fictional.jpg' },
  { name: 'Haumea', url: '/textures/haumea.jpg' },
  { name: 'Makemake', url: '/textures/2k_makemake_fictional.jpg' },
  { name: 'TRAPPIST-1d', url: '/textures/2k_trappist1d.jpg' },
  { name: 'TRAPPIST-1f', url: '/textures/2k_trappist1f.jpg' },
  { name: 'Proxima b', url: '/textures/proximab.jpg' },
  { name: 'Laythe', url: '/textures/2k_laythe.jpg' },
];

export const RING_TEXTURE_PRESETS = [
  { name: 'No Texture (Solid Color)', url: '' },
  { name: 'Saturn Rings', url: '/textures/2k_saturn_ring_alpha.png' },
];

export const STAR_CLASSES = [
  { id: 'O', name: 'Blue Giant', color: '#8A9AFA', desc: '30,000K+' },
  { id: 'B', name: 'Blue', color: '#A5B9FA', desc: '10,000K - 30,000K' },
  { id: 'A', name: 'White', color: '#FFFFFF', desc: '7,500K - 10,000K' },
  { id: 'F', name: 'Yellow-White', color: '#FFF4E8', desc: '6,000K - 7,500K' },
  { id: 'G', name: 'Yellow Dwarf', color: '#FFD2A1', desc: '5,200K - 6,000K (Sun)' },
  { id: 'K', name: 'Orange', color: '#FF8C00', desc: '3,700K - 5,200K' },
  { id: 'M', name: 'Red Dwarf', color: '#FF2400', desc: '2,400K - 3,700K' },
];

export const radToDeg = (rad: number) => (rad * 180) / Math.PI;
export const degToRad = (deg: number) => (deg * Math.PI) / 180;
