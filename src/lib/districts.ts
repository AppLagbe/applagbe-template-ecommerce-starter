export interface DistrictInfo {
  nameEn: string;
  nameBn: string;
  defaultZone: "inside_dhaka" | "sub_dhaka" | "outside_dhaka";
}

export const BANGLADESH_DISTRICTS: DistrictInfo[] = [
  // Dhaka Division
  { nameEn: "Dhaka", nameBn: "ঢাকা", defaultZone: "inside_dhaka" },
  { nameEn: "Gazipur", nameBn: "গাজীপুর", defaultZone: "sub_dhaka" },
  { nameEn: "Narayanganj", nameBn: "নারায়ণগঞ্জ", defaultZone: "sub_dhaka" },
  { nameEn: "Munshiganj", nameBn: "মুন্সিগঞ্জ", defaultZone: "outside_dhaka" },
  { nameEn: "Narsingdi", nameBn: "নরসিংদী", defaultZone: "outside_dhaka" },
  { nameEn: "Manikganj", nameBn: "মানিকগঞ্জ", defaultZone: "outside_dhaka" },
  { nameEn: "Tangail", nameBn: "টাঙ্গাইল", defaultZone: "outside_dhaka" },
  { nameEn: "Kishoreganj", nameBn: "কিশোরগঞ্জ", defaultZone: "outside_dhaka" },
  { nameEn: "Faridpur", nameBn: "ফরিদপুর", defaultZone: "outside_dhaka" },
  { nameEn: "Gopalganj", nameBn: "গোপালগঞ্জ", defaultZone: "outside_dhaka" },
  { nameEn: "Madaripur", nameBn: "মাদারীপুর", defaultZone: "outside_dhaka" },
  { nameEn: "Rajbari", nameBn: "রাজবাড়ী", defaultZone: "outside_dhaka" },
  { nameEn: "Shariatpur", nameBn: "শরীয়তপুর", defaultZone: "outside_dhaka" },

  // Chattogram Division
  { nameEn: "Chattogram", nameBn: "চট্টগ্রাম", defaultZone: "outside_dhaka" },
  { nameEn: "Cox's Bazar", nameBn: "কক্সবাজার", defaultZone: "outside_dhaka" },
  { nameEn: "Cumilla", nameBn: "কুমিল্লা", defaultZone: "outside_dhaka" },
  { nameEn: "Feni", nameBn: "ফেনী", defaultZone: "outside_dhaka" },
  { nameEn: "Brahmanbaria", nameBn: "ব্রাহ্মণবাড়িয়া", defaultZone: "outside_dhaka" },
  { nameEn: "Noakhali", nameBn: "নোয়াখালী", defaultZone: "outside_dhaka" },
  { nameEn: "Lakshmipur", nameBn: "লক্ষ্মীপুর", defaultZone: "outside_dhaka" },
  { nameEn: "Chandpur", nameBn: "চাঁদপুর", defaultZone: "outside_dhaka" },
  { nameEn: "Khagrachhari", nameBn: "খাগড়াছড়ি", defaultZone: "outside_dhaka" },
  { nameEn: "Rangamati", nameBn: "রাঙ্গামাটি", defaultZone: "outside_dhaka" },
  { nameEn: "Bandarban", nameBn: "বান্দরবান", defaultZone: "outside_dhaka" },

  // Sylhet Division
  { nameEn: "Sylhet", nameBn: "সিলেট", defaultZone: "outside_dhaka" },
  { nameEn: "Moulvibazar", nameBn: "মৌলভীবাজার", defaultZone: "outside_dhaka" },
  { nameEn: "Habiganj", nameBn: "হবিগঞ্জ", defaultZone: "outside_dhaka" },
  { nameEn: "Sunamganj", nameBn: "সুনামগঞ্জ", defaultZone: "outside_dhaka" },

  // Rajshahi Division
  { nameEn: "Rajshahi", nameBn: "রাজশাহী", defaultZone: "outside_dhaka" },
  { nameEn: "Bogura", nameBn: "বগুড়া", defaultZone: "outside_dhaka" },
  { nameEn: "Pabna", nameBn: "পাবনা", defaultZone: "outside_dhaka" },
  { nameEn: "Sirajganj", nameBn: "সিরাজগঞ্জ", defaultZone: "outside_dhaka" },
  { nameEn: "Naogaon", nameBn: "নওগাঁ", defaultZone: "outside_dhaka" },
  { nameEn: "Natore", nameBn: "নাটোর", defaultZone: "outside_dhaka" },
  { nameEn: "Chapai Nawabganj", nameBn: "চাঁপাইনবাবগঞ্জ", defaultZone: "outside_dhaka" },
  { nameEn: "Joypurhat", nameBn: "জয়পুরহাট", defaultZone: "outside_dhaka" },

  // Khulna Division
  { nameEn: "Khulna", nameBn: "খুলনা", defaultZone: "outside_dhaka" },
  { nameEn: "Jashore", nameBn: "যশোর", defaultZone: "outside_dhaka" },
  { nameEn: "Kushtia", nameBn: "কুষ্টিয়া", defaultZone: "outside_dhaka" },
  { nameEn: "Jhenaidah", nameBn: "ঝিনাইদহ", defaultZone: "outside_dhaka" },
  { nameEn: "Chuadanga", nameBn: "চুয়াডাঙ্গা", defaultZone: "outside_dhaka" },
  { nameEn: "Meherpur", nameBn: "মেহেরপুর", defaultZone: "outside_dhaka" },
  { nameEn: "Satkhira", nameBn: "সাতক্ষীরা", defaultZone: "outside_dhaka" },
  { nameEn: "Bagerhat", nameBn: "বাগেরহাট", defaultZone: "outside_dhaka" },
  { nameEn: "Narail", nameBn: "নড়াইল", defaultZone: "outside_dhaka" },
  { nameEn: "Magura", nameBn: "মাগুরা", defaultZone: "outside_dhaka" },

  // Barishal Division
  { nameEn: "Barishal", nameBn: "বরিশাল", defaultZone: "outside_dhaka" },
  { nameEn: "Bhola", nameBn: "ভোলা", defaultZone: "outside_dhaka" },
  { nameEn: "Jhalokathi", nameBn: "ঝালকাঠি", defaultZone: "outside_dhaka" },
  { nameEn: "Patuakhali", nameBn: "পটুয়াখালী", defaultZone: "outside_dhaka" },
  { nameEn: "Pirojpur", nameBn: "পিরোজপুর", defaultZone: "outside_dhaka" },
  { nameEn: "Barguna", nameBn: "বরগুনা", defaultZone: "outside_dhaka" },

  // Rangpur Division
  { nameEn: "Rangpur", nameBn: "রংপুর", defaultZone: "outside_dhaka" },
  { nameEn: "Dinajpur", nameBn: "দিনাজপুর", defaultZone: "outside_dhaka" },
  { nameEn: "Gaibandha", nameBn: "গাইবান্ধা", defaultZone: "outside_dhaka" },
  { nameEn: "Kurigram", nameBn: "কুড়িগ্রাম", defaultZone: "outside_dhaka" },
  { nameEn: "Lalmonirhat", nameBn: "লালমনিরহাট", defaultZone: "outside_dhaka" },
  { nameEn: "Nilphamari", nameBn: "নীলফামারী", defaultZone: "outside_dhaka" },
  { nameEn: "Panchagarh", nameBn: "পঞ্চগড়", defaultZone: "outside_dhaka" },
  { nameEn: "Thakurgaon", nameBn: "ঠাকুরগাঁও", defaultZone: "outside_dhaka" },

  // Mymensingh Division
  { nameEn: "Mymensingh", nameBn: "ময়মনসিংহ", defaultZone: "outside_dhaka" },
  { nameEn: "Jamalpur", nameBn: "জামালপুর", defaultZone: "outside_dhaka" },
  { nameEn: "Netrokona", nameBn: "নেত্রকোণা", defaultZone: "outside_dhaka" },
  { nameEn: "Sherpur", nameBn: "শেরপুর", defaultZone: "outside_dhaka" },
];
