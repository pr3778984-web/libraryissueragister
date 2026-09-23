// Utility to generate clean school student avatar SVG or compress user uploaded photo

export function compressImageFile(file: File, maxDim = 280, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = e => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to load image'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        // Draw image smoothed
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

// Generate friendly Indian school student vector avatar
export function getStudentDefaultAvatar(name: string, rollNo: number, standard: string): string {
  // Deterministic color & style based on name and roll number
  const hash = (name + rollNo + standard)
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);

  const isGirl =
    name.includes('પ્રિયા') ||
    name.includes('અંકિતા') ||
    name.includes('દિવ્યા') ||
    name.includes('કાવ્યા') ||
    name.includes('મનિષા') ||
    name.includes('ભાવના') ||
    name.includes('સ્નેહા') ||
    name.includes('પૂજા');

  const bgColors = [
    '#FEF3C7', // amber-100
    '#E0E7FF', // indigo-100
    '#D1FAE5', // emerald-100
    '#FCE7F3', // pink-100
    '#EDE9FE', // violet-100
    '#CFFAFE', // cyan-100
    '#FEE2E2', // red-100
    '#FFEDD5', // orange-100
  ];
  const shirtColors = [
    '#1E3A8A', // school navy blue
    '#047857', // school dark green
    '#B45309', // school maroon/amber
    '#4338CA', // school royal blue
    '#0F766E', // school teal
    '#831843', // school maroon
  ];

  const bgColor = bgColors[hash % bgColors.length];
  const shirtColor = shirtColors[hash % shirtColors.length];
  const skinTone = hash % 2 === 0 ? '#E8B991' : '#D49B6A';

  // Return crisp SVG data URL
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <rect width="100" height="100" fill="${bgColor}"/>
    <!-- Uniform Collar & Shirt -->
    <path d="M22 100 L78 100 L74 68 L50 74 L26 68 Z" fill="${shirtColor}"/>
    <path d="M50 74 L42 66 L50 63 L58 66 Z" fill="#FFFFFF"/>
    <path d="M50 67 L50 100" stroke="#FFFFFF" stroke-width="1.5" stroke-dasharray="2,2"/>
    <path d="M48 64 L52 64 L53 72 L47 72 Z" fill="#DC2626"/>
    <!-- Neck -->
    <rect x="44" y="52" width="12" height="15" rx="3" fill="${skinTone}"/>
    <!-- Head -->
    <ellipse cx="50" cy="42" rx="20" ry="23" fill="${skinTone}"/>
    <!-- Ears -->
    <circle cx="29" cy="43" r="5" fill="${skinTone}"/>
    <circle cx="71" cy="43" r="5" fill="${skinTone}"/>
    ${
      isGirl
        ? `<!-- Girl Hair with Ponytails & Bindi -->
           <path d="M26 38 C26 21, 74 21, 74 38 C74 44, 70 32, 50 31 C30 32, 26 44, 26 38 Z" fill="#1F2937"/>
           <path d="M24 38 C18 42, 16 54, 22 58 C25 60, 28 50, 27 42 Z" fill="#1F2937"/>
           <path d="M76 38 C82 42, 84 54, 78 58 C75 60, 72 50, 73 42 Z" fill="#1F2937"/>
           <circle cx="23" cy="42" r="3" fill="#EF4444"/>
           <circle cx="77" cy="42" r="3" fill="#EF4444"/>
           <circle cx="50" cy="36" r="1.5" fill="#DC2626"/>`
        : `<!-- Boy Neat School Haircut -->
           <path d="M28 35 C28 20, 72 20, 72 35 C72 37, 65 29, 50 29 C35 29, 28 37, 28 35 Z" fill="#1F2937"/>
           <path d="M27 34 L31 43 L34 38 Z" fill="#1F2937"/>
           <path d="M73 34 L69 43 L66 38 Z" fill="#1F2937"/>`
    }
    <!-- Eyes -->
    <ellipse cx="42" cy="42" rx="2.5" ry="3" fill="#1F2937"/>
    <ellipse cx="58" cy="42" rx="2.5" ry="3" fill="#1F2937"/>
    <circle cx="43" cy="41" r="0.9" fill="#FFFFFF"/>
    <circle cx="59" cy="41" r="0.9" fill="#FFFFFF"/>
    <!-- Eyebrows -->
    <path d="M39 37 Q43 35 46 37" stroke="#1F2937" stroke-width="1.2" stroke-linecap="round" fill="none"/>
    <path d="M54 37 Q57 35 61 37" stroke="#1F2937" stroke-width="1.2" stroke-linecap="round" fill="none"/>
    <!-- Nose -->
    <path d="M50 43 L48 48 L52 48" stroke="#A86E45" stroke-width="1" stroke-linecap="round" fill="none"/>
    <!-- Cheerful Smile -->
    <path d="M44 52 Q50 58 56 52" stroke="#991B1B" stroke-width="1.8" stroke-linecap="round" fill="none"/>
    <!-- Rosy Cheeks -->
    <ellipse cx="37" cy="48" rx="3.5" ry="2" fill="#F43F5E" opacity="0.3"/>
    <ellipse cx="63" cy="48" rx="3.5" ry="2" fill="#F43F5E" opacity="0.3"/>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
