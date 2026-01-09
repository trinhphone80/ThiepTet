
import { DesignConcept, ConceptDetails, SelectionOption } from './types';

export const BRAND_INFO = {
  name: "CÔNG TY TNHH THIẾT BỊ Y TẾ ĐỨC PHƯƠNG",
  address: "340 Âu Dương Lân, Phường Chánh Hưng, TP.HCM",
  showroom: "12 Đông Hồ, Phường Tân Hòa, TP.HCM",
  phone: "0903162808",
  email: "ducphuongmedical@gmail.com"
};

export const WISHES = [
  "Chúc mừng năm mới, vạn sự như ý!",
  "Sức khỏe dồi dào, an khang thịnh vượng.",
  "Cung chúc tân xuân, phát tài phát lộc.",
  "Năm mới thắng lợi mới, mã đáo thành công.",
  "Xuân sang hy vọng, đời thêm vui tươi.",
  "Tấn tài tấn lộc, công danh rạng rỡ.",
  "Vạn sự hanh thông, gia đạo bình an.",
  "Tiền vào như nước, tiền ra nhỏ giọt.",
  "Đong cho đầy hạnh phúc, gói cho trọn lộc tài.",
  "Năm mới bình an, sức khỏe vàng ngàn.",
  "Phúc lộc thọ toàn, vạn sự cát tường.",
  "Ngũ phúc lâm môn, vạn điều như ý.",
  "Xuân ý cát tường, tài lộc đầy nhà.",
  "Tân niên vạn phúc, đắc lộc đắc tài.",
  "Chúc Tết sum vầy, tràn đầy hạnh phúc.",
  "Năm mới giàu sang, bình an vô sự.",
  "Sự nghiệp thăng hoa, công danh toại nguyện.",
  "Sống khỏe, sống vui, sống có ích.",
  "Gặt hái thành công, rực rỡ Bính Ngọ.",
  "Đức Phương Medical chúc mừng năm mới!"
];

export const CONCEPTS: Record<DesignConcept, ConceptDetails> = {
  [DesignConcept.THAN_TAI]: {
    id: DesignConcept.THAN_TAI,
    name: "Thần Tài Y Đức",
    tagline: "Vui nhộn - Chibi - Rực rỡ",
    description: "Hình ảnh Ông Thần Tài Chibi cười tít mắt, tay cầm thỏi vàng và túi y tế chữ thập đỏ. Phù hợp phong cách gần gũi, may mắn.",
    colors: {
      primary: "#e63946",
      secondary: "#ffb703",
      accent: "#2a9d8f"
    },
    prompt: "High-end Chibi style. Background is festive bright red with gold sparkles. Vibrant colors, luxury finish."
  },
  [DesignConcept.MA_DAO]: {
    id: DesignConcept.MA_DAO,
    name: "Mã Đáo Thành Công",
    tagline: "Sang trọng - Hiện đại - 2026",
    description: "Hình ảnh chú Ngựa Chibi 2026 thồ quà Tết và trang thiết bị y tế. Nền đỏ nhung họa tiết đồng xu cổ sang trọng.",
    colors: {
      primary: "#9a031e",
      secondary: "#fb8500",
      accent: "#f4a261"
    },
    prompt: "A luxury 2026 Year of the Horse theme. Modern Chibi aesthetic. Deep red velvet texture background with subtle golden patterns."
  }
};

export const CHARACTERS: SelectionOption[] = [
  { id: 'god_wealth', label: 'Ông Thần Tài', promptSnippet: 'Cute Chibi God of Wealth holding a medical kit and a gold ingot.' },
  { id: 'horse_2026', label: 'Chú Ngựa 2026', promptSnippet: 'Playful Chibi Horse with a golden mane, carrying medical equipment baskets.' },
  { id: 'lucky_cat', label: 'Mèo Chiêu Tài', promptSnippet: 'Lucky Maneki-neko cat wearing a doctor stethoscope and holding a red envelope.' },
  { id: 'cute_child', label: 'Em Bé Chúc Tết', promptSnippet: 'A cute child in a traditional Ao Dai holding a first-aid kit and a blossom branch.' }
];

export const VECTORS: SelectionOption[] = [
  { id: 'blossoms', label: 'Hoa Mai & Đào', promptSnippet: 'Decorated with beautiful yellow apricot blossoms and pink peach flowers.' },
  { id: 'coins', label: 'Tiền Vàng & Hũ Vàng', promptSnippet: 'Surrounded by overflowing pots of gold coins and ancient golden currency.' },
  { id: 'clouds', label: 'Mây Ngũ Sắc', promptSnippet: 'Stylized traditional colorful Vietnamese clouds and auspicious patterns.' },
  { id: 'fireworks', label: 'Pháo Hoa Rực Rỡ', promptSnippet: 'Bursting vibrant fireworks in the background to celebrate the New Year.' },
  { id: 'lanterns', label: 'Đèn Lồng Đỏ', promptSnippet: 'Hanging traditional red lanterns with gold tassels.' },
  { id: 'drum', label: 'Trống Đồng', promptSnippet: 'Subtle ancient Vietnamese Dong Son drum patterns.' },
  { id: 'gold_bars', label: 'Thỏi Vàng', promptSnippet: 'Scattered solid gold bars and ingots.' },
  { id: 'swallow', label: 'Chim Én', promptSnippet: 'Graceful spring swallow birds flying in the sky.' },
  { id: 'knot', label: 'Nút Thắt May Mắn', promptSnippet: 'Traditional red and gold mystic knots for luck.' },
  { id: 'wave', label: 'Sóng Thủy Ba', promptSnippet: 'Classic Vietnamese wavy water patterns at the bottom.' }
];

export const TYPOGRAPHY: SelectionOption[] = [
  { id: 'calligraphy', label: 'Thư Pháp Cổ Điển', promptSnippet: 'Traditional elegant brush calligraphy style. Ensure all Vietnamese accents and diacritics are rendered perfectly.' },
  { id: 'modern_bold', label: 'Hiện Đại & Bold', promptSnippet: 'Modern, thick, bold typography with a gold-foil 3D effect. Text must have precise Vietnamese characters and tones.' },
  { id: 'playful_chibi', label: 'Vui Nhộn Chibi', promptSnippet: 'Rounded, playful, bubbly font. Must display Vietnamese text accurately with all marks.' },
  { id: 'minimal', label: 'Tối Giản Sang Trọng', promptSnippet: 'Clean, thin, minimalist serif font for a high-end luxury feel. Accurate Vietnamese letterforms.' }
];
