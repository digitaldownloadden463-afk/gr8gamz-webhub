import type { CommerceProduct } from '@/lib/commerce/types';

const checked = '2026-08-09';

export const commerceProducts = [
  {
    id: 'razer-viper-v3-pro', merchant: 'razer', merchantProductId: 'razer-viper-v3-pro', brand: 'Razer', name: 'Razer Viper V3 Pro', slug: 'razer-viper-v3-pro', category: 'gaming-mice',
    image: 'https://assets3.razerzone.com/LQ1cxhHVvbhiSLOMjv3r4MoTo4g=/1920x1280/https%3A%2F%2Fmedias-p1.phoenix.razer.com%2Fsys-master-phoenix-images-container%2Fh08%2Fh61%2F9765618188318%2Fviper-v3-pro-black-500x500.png',
    destinationUrl: 'https://www.razer.com/gb-en/gaming-mice/razer-viper-v3-pro', shortDescription: 'A lightweight wireless esports mouse built around fast, precise movement.',
    keyFeatures: ['54 g lightweight design', 'Focus Pro 35K optical sensor', 'Up to 8,000 Hz wireless polling'], bestFor: 'Competitive FPS players who prioritise low weight', limitations: ['Right-handed symmetrical shape', 'High-performance settings can reduce battery life'], specifications: { connection: 'Wireless and wired', sensor: 'Focus Pro 35K optical', weight: '54 g' }, price: null, currency: 'GBP', availability: 'check-merchant', lastUpdated: checked
  },
  {
    id: 'razer-deathadder-v4-pro', merchant: 'razer', merchantProductId: 'razer-deathadder-v4-pro', brand: 'Razer', name: 'Razer DeathAdder V4 Pro', slug: 'razer-deathadder-v4-pro', category: 'gaming-mice',
    image: 'https://assets3.razerzone.com/VuoDC-AaOZh-67auUdz2cfLwhgg=/1920x1280/https%3A%2F%2Fmedias-p1.phoenix.razer.com%2Fsys-master-phoenix-images-container%2Fh01%2Fhf3%2F9926511951902%2Fdeathadder-v4-pro-black-500x500.png',
    destinationUrl: 'https://www.razer.com/gb-en/gaming-mice/razer-deathadder-v4-pro', shortDescription: 'A wireless ergonomic esports mouse with a familiar right-handed shape.',
    keyFeatures: ['Ergonomic right-handed shape', 'Wireless esports design', 'High polling-rate support'], bestFor: 'Players who want an ergonomic competitive mouse', limitations: ['Shape is designed for right-handed use', 'Larger than compact fingertip mice'], specifications: { connection: 'Wireless and wired', shape: 'Right-handed ergonomic', class: 'Esports mouse' }, price: null, currency: 'GBP', availability: 'check-merchant', lastUpdated: checked
  },
  {
    id: 'razer-basilisk-v3-pro-35k', merchant: 'razer', merchantProductId: 'razer-basilisk-v3-pro-35k', brand: 'Razer', name: 'Razer Basilisk V3 Pro 35K', slug: 'razer-basilisk-v3-pro-35k', category: 'gaming-mice',
    image: 'https://assets3.razerzone.com/QrFFO4KLgcSlv8V4Zhksri9dTK8=/1920x1280/https%3A%2F%2Fmedias-p1.phoenix.razer.com%2Fsys-master-phoenix-images-container%2Fh5a%2Fh1c%2F9821720576030%2Fbasilisk-v3-pro-35k-500x500.png',
    destinationUrl: 'https://www.razer.com/gb-en/gaming-mice/razer-basilisk-v3-pro-35k', shortDescription: 'A feature-rich wireless mouse with an ergonomic shape and configurable controls.',
    keyFeatures: ['Focus Pro 35K sensor', 'Configurable scroll wheel', 'Multi-zone Chroma lighting'], bestFor: 'Players who want more controls and an ergonomic grip', limitations: ['Heavier than esports-focused mice', 'Extra controls may be unnecessary for minimal setups'], specifications: { connection: 'Wireless and wired', sensor: 'Focus Pro 35K optical', shape: 'Right-handed ergonomic' }, price: null, currency: 'GBP', availability: 'check-merchant', lastUpdated: checked
  },
  {
    id: 'razer-naga-v2-pro', merchant: 'razer', merchantProductId: 'razer-naga-v2-pro', brand: 'Razer', name: 'Razer Naga V2 Pro', slug: 'razer-naga-v2-pro', category: 'gaming-mice',
    image: 'https://assets3.razerzone.com/0BTnfDndkuUtHnVK3MKm8F39AGw=/1920x1280/https%3A%2F%2Fmedias-p1.phoenix.razer.com%2Fsys-master-phoenix-images-container%2Fhb2%2Fhb9%2F9529652379678%2Fnaga-v2-pro-2-500x500.png',
    destinationUrl: 'https://www.razer.com/gb-en/gaming-mice/razer-naga-v2-pro', shortDescription: 'A modular wireless mouse designed for games and workflows that need many commands.',
    keyFeatures: ['Interchangeable side plates', 'Up to 22 programmable controls', 'Wireless connectivity'], bestFor: 'MMO and ability-heavy game players', limitations: ['Heavier and more complex than a basic mouse', 'Button-rich layout has a learning curve'], specifications: { connection: 'Wireless and wired', controls: 'Up to 22 programmable', shape: 'Right-handed ergonomic' }, price: null, currency: 'GBP', availability: 'check-merchant', lastUpdated: checked
  },
  {
    id: 'razer-blackshark-v3-pro', merchant: 'razer', merchantProductId: 'razer-blackshark-v3-pro', brand: 'Razer', name: 'Razer BlackShark V3 Pro', slug: 'razer-blackshark-v3-pro', category: 'gaming-headsets',
    image: 'https://assets3.razerzone.com/JkD-ZQuVh5kXV3bvmyyEw9aWqxs=/1920x1280/https%3A%2F%2Fmedias-p1.phoenix.razer.com%2Fsys-master-phoenix-images-container%2Fh3c%2Fh54%2F9941151088670%2Fblackshark-v3-pro-black-500x500.png',
    destinationUrl: 'https://www.razer.com/gb-en/gaming-headsets/razer-blackshark-v3-pro/RZ04-05400100-R3M1', shortDescription: 'A wireless esports headset focused on positional audio, microphone clarity and comfort.',
    keyFeatures: ['Wireless esports headset', 'Detachable microphone', 'Multi-platform models available'], bestFor: 'Competitive players who value clear comms', limitations: ['Platform compatibility varies by model', 'Esports styling is understated rather than RGB-led'], specifications: { connection: 'Wireless', microphone: 'Detachable boom', class: 'Esports headset' }, price: null, currency: 'GBP', availability: 'check-merchant', lastUpdated: checked
  },
  {
    id: 'razer-kraken-v4-pro', merchant: 'razer', merchantProductId: 'razer-kraken-v4-pro', brand: 'Razer', name: 'Razer Kraken V4 Pro', slug: 'razer-kraken-v4-pro', category: 'gaming-headsets',
    image: 'https://assets3.razerzone.com/iJyxxE2ToSt-vPPb2uIGxbeywxU=/1500x1000/https%3A%2F%2Fmedias-p1.phoenix.razer.com%2Fsys-master-phoenix-images-container%2Fhe4%2Fh1d%2F9821452468254%2Fkraken-v4-pro-2-500x500.png',
    destinationUrl: 'https://www.razer.com/gb-en/gaming-headsets/razer-kraken-v4-pro', shortDescription: 'A premium wireless headset with a dedicated control hub and haptic audio features.',
    keyFeatures: ['OLED Control Hub', 'Sensa HD Haptics', 'Four connectivity modes'], bestFor: 'Players building an immersive multi-device setup', limitations: ['Premium feature set carries a higher cost', 'Haptics may not suit every listener'], specifications: { connection: 'Wireless, Bluetooth, USB and 3.5 mm', controls: 'OLED Control Hub', audio: 'Haptic-enabled' }, price: null, currency: 'GBP', availability: 'check-merchant', lastUpdated: checked
  },
  {
    id: 'razer-huntsman-v3-pro-8khz', merchant: 'razer', merchantProductId: 'razer-huntsman-v3-pro-8khz', brand: 'Razer', name: 'Razer Huntsman V3 Pro 8KHz', slug: 'razer-huntsman-v3-pro-8khz', category: 'gaming-keyboards',
    image: 'https://assets3.razerzone.com/MjPU263TofW0UNneMSYOwBTtnbA=/1920x1280/https%3A%2F%2Fmedias-p1.phoenix.razer.com%2Fsys-master-phoenix-images-container%2Fh62%2Fh24%2F9980311044126%2Fhuntsman-v3-pro-8khz-b-500x500.png',
    destinationUrl: 'https://www.razer.com/gb-en/gaming-keyboards/razer-huntsman-v3-pro-8khz', shortDescription: 'A wired competitive keyboard with adjustable analogue optical switches.',
    keyFeatures: ['Adjustable analogue optical switches', '8,000 Hz polling', 'Rapid Trigger support'], bestFor: 'Competitive PC players who tune actuation', limitations: ['Advanced settings take time to configure', 'Wired-only competitive design'], specifications: { connection: 'Wired', switch: 'Analogue optical', polling: 'Up to 8,000 Hz' }, price: null, currency: 'GBP', availability: 'check-merchant', lastUpdated: checked
  },
  {
    id: 'razer-blackwidow-v4-pro', merchant: 'razer', merchantProductId: 'razer-blackwidow-v4-pro', brand: 'Razer', name: 'Razer BlackWidow V4 Pro', slug: 'razer-blackwidow-v4-pro', category: 'gaming-keyboards',
    image: 'https://assets3.razerzone.com/DOmBASBH3fNxsGEUbJRDDJJ06gM=/1920x1280/https%3A%2F%2Fmedias-p1.phoenix.razer.com%2Fsys-master-phoenix-images-container%2Fh2a%2Fhd3%2F9538807103518%2Fblackwidow-v3-black-5-500x500.png',
    destinationUrl: 'https://www.razer.com/gb-en/gaming-keyboards/razer-blackwidow-v4-pro', shortDescription: 'A full-size mechanical gaming keyboard with dedicated controls and extensive lighting.',
    keyFeatures: ['Mechanical switch options', 'Dedicated command dial and media keys', 'Full-size layout with macro keys'], bestFor: 'Desktop setups that need controls and full-size comfort', limitations: ['Takes more desk space than compact boards', 'Not designed for travel'], specifications: { connection: 'Wired', layout: 'Full size', switch: 'Mechanical' }, price: null, currency: 'GBP', availability: 'check-merchant', lastUpdated: checked
  },
  {
    id: 'razer-kishi-v3', merchant: 'razer', merchantProductId: 'razer-kishi-v3', brand: 'Razer', name: 'Razer Kishi V3', slug: 'razer-kishi-v3', category: 'mobile-gaming',
    image: 'https://assets3.razerzone.com/mS6cO6M3K61afi0JhgteucLDy_c=/1920x1280/https%3A%2F%2Fmedias-p1.phoenix.razer.com%2Fsys-master-phoenix-images-container%2Fh3a%2Fh14%2F9920509804574%2Fkishi-v3-2-500x500.png',
    destinationUrl: 'https://www.razer.com/gb-en/mobile-controllers/razer-kishi-v3', shortDescription: 'A full-size mobile controller that brings console-style controls to compatible phones.',
    keyFeatures: ['Full-size controller shape', 'TMR thumbsticks', 'Two mouse-click back buttons'], bestFor: 'Phone players who want direct USB-C controls', limitations: ['Compatibility depends on device dimensions and port', 'Not every mobile game supports controllers'], specifications: { connection: 'USB-C', controls: 'TMR thumbsticks', device: 'Compatible mobile devices' }, price: null, currency: 'GBP', availability: 'check-merchant', lastUpdated: checked
  },
  {
    id: 'razer-kishi-v3-pro', merchant: 'razer', merchantProductId: 'razer-kishi-v3-pro', brand: 'Razer', name: 'Razer Kishi V3 Pro', slug: 'razer-kishi-v3-pro', category: 'mobile-gaming',
    image: 'https://assets3.razerzone.com/Fcpo0ZlUexYU0ojFOpSwQxsrKss=/1920x1280/https%3A%2F%2Fmedias-p1.phoenix.razer.com%2Fsys-master-phoenix-images-container%2Fh11%2Fh47%2F9918940315678%2Fkishi-v3-pro-500x500.png',
    destinationUrl: 'https://www.razer.com/gb-en/mobile-controllers/razer-kishi-v3-pro', shortDescription: 'A larger mobile controller for compatible phones and small tablets, with swappable controls.',
    keyFeatures: ['Fits compatible phones and tablets up to 8 inches', 'Swappable TMR thumbstick caps', 'Full-size controls'], bestFor: 'Mobile and small-tablet players who want more control options', limitations: ['Check device size and USB-C placement before buying', 'Larger than a pocket controller'], specifications: { connection: 'USB-C', controls: 'Swappable TMR thumbsticks', device: 'Phones and compatible small tablets' }, price: null, currency: 'GBP', availability: 'check-merchant', lastUpdated: checked
  }
] as const satisfies readonly CommerceProduct[];
