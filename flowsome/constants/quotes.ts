// constants/quotes.ts
import { ThemeId } from './themes';

export interface Quote {
  text: string;
  textHindi: string;
  attribution: string;
  attributionHindi: string;
}

export const QUOTES: Record<ThemeId, Quote[]> = {
  rajasthan: [
    {
      text: 'The desert teaches patience. The dunes teach impermanence.',
      textHindi: 'रेगिस्तान धैर्य सिखाता है। टीले अनित्यता सिखाते हैं।',
      attribution: 'Ancient Rajasthani Proverb',
      attributionHindi: 'प्राचीन राजस्थानी कहावत',
    },
    {
      text: 'Be still. Even a storm has its eye.',
      textHindi: 'शांत रहो। हर तूफान के बीच में शांति होती है।',
      attribution: 'Kabir',
      attributionHindi: 'कबीर',
    },
  ],
  himalaya: [
    {
      text: 'Stillness is not the absence of activity. It is the presence of everything.',
      textHindi: 'स्थिरता गतिविधि की अनुपस्थिति नहीं है। यह सब कुछ की उपस्थिति है।',
      attribution: 'Himalayan Teaching',
      attributionHindi: 'हिमालयी शिक्षा',
    },
  ],
  kerala: [
    {
      text: 'The river does not fight its banks. It finds its way to the sea.',
      textHindi: 'नदी अपने किनारों से नहीं लड़ती। वह समुद्र तक अपना रास्ता ढूंढ लेती है।',
      attribution: 'Kerala Folk Wisdom',
      attributionHindi: 'केरल की लोक बुद्धि',
    },
  ],
  assam: [
    {
      text: 'The forest does not hurry, yet everything is accomplished.',
      textHindi: 'जंगल जल्दबाज़ी नहीं करता, फिर भी सब कुछ पूरा होता है।',
      attribution: 'Adapted from Lao Tzu',
      attributionHindi: 'लाओ त्ज़ू से अनुकूलित',
    },
  ],
  andaman: [
    {
      text: 'Go to the ocean. It will remind you how small your problems are.',
      textHindi: 'समुद्र के पास जाओ। वह याद दिलाएगा कि तुम्हारी समस्याएं कितनी छोटी हैं।',
      attribution: 'Indian Coastal Wisdom',
      attributionHindi: 'भारतीय तटीय ज्ञान',
    },
  ],
};
