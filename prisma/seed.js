const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial database...');

  // 1. Site Settings
  await prisma.siteSetting.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      storeName: 'App Lagbe Shop',
      storeTagline: '১০০% খাঁটি ও প্রিমিয়াম কোয়ালিটি পণ্য',
      logoUrl: '',
      faviconUrl: '',
      primaryColor: '#059669', // Emerald
      accentColor: '#ea580c',  // Orange
      backgroundColor: '#f8fafc',
      fontFamily: 'Inter',
      borderRadius: '0.75rem',
      supportPhone: '01711-223344',
      whatsappNumber: '8801711223344',
      supportEmail: 'contact@applagbe.com',
      officeAddress: 'House 42, Road 11, Banani, Dhaka - 1213',
      currencyCode: 'BDT',
      currencySymbol: '৳',
      defaultLanguage: 'bn',
      announcementBar: '⚡ সীমিত সময়ের ধামাকা অফার! সারাদেশে ক্যাশ অন ডেলিভারি এবং দ্রুত হোম ডেলিভারি।',
      isAnnouncementActive: true,
    },
  });

  // 2. Admin User
  const passwordHash = await bcrypt.hash('admin123', 10);
  await prisma.adminUser.upsert({
    where: { email: 'admin@applagbe.com' },
    update: { passwordHash },
    create: {
      email: 'admin@applagbe.com',
      name: 'App Lagbe Admin',
      passwordHash,
      role: 'SUPERADMIN',
    },
  });

  // 3. Delivery Zones (BD standard)
  const deliveryZones = [
    {
      code: 'inside_dhaka',
      name: 'ঢাকা সিটির ভেতরে (Inside Dhaka)',
      charge: 70.0,
      estimatedDays: '২৪-৪৮ ঘণ্টার মধ্যে ডেলিভারি',
      districts: 'Dhaka',
      sortOrder: 1,
    },
    {
      code: 'sub_dhaka',
      name: 'ঢাকা আশপাশ / সাব-এরিয়া (Gazipur, Savar, Narayanganj, Keraniganj)',
      charge: 100.0,
      estimatedDays: '৪৮-৭২ ঘণ্টার মধ্যে ডেলিভারি',
      districts: 'Gazipur,Savar,Narayanganj,Keraniganj',
      sortOrder: 2,
    },
    {
      code: 'outside_dhaka',
      name: 'ঢাকা সিটির বাইরে / সমগ্র বাংলাদেশ (Outside Dhaka)',
      charge: 130.0,
      estimatedDays: '৩-৫ দিনের মধ্যে ডেলিভারি',
      districts: '',
      sortOrder: 3,
    },
  ];

  for (const zone of deliveryZones) {
    await prisma.deliveryZone.upsert({
      where: { code: zone.code },
      update: zone,
      create: zone,
    });
  }

  // 4. Single Product Hero Catalog
  const sampleProduct = await prisma.product.upsert({
    where: { slug: 'pure-sundarbans-natural-honey' },
    update: {},
    create: {
      slug: 'pure-sundarbans-natural-honey',
      name: 'প্রিমিয়াম খাঁটি সুন্দরবনের খলিশা ফুলের প্রাকৃতিক মধু (১ কেজি)',
      subtitle: '১০০% বিশুদ্ধ, অপরিশোধিত ও সরাসরি সুন্দরবনের মৌয়ালদের থেকে সংগৃহীত। স্বাস্থ্য ও রোগ প্রতিরোধে অতুলনীয়।',
      description: 'আমাদের মধু ১০০% প্রাকৃতিকভাবে সংগৃহীত কোনো কৃত্রিম চিনি বা কেমিক্যাল মুক্ত। এতে রয়েছে অ্যান্টিঅক্সিডেন্ট, প্রাকৃতিক এনজাইম ও ভিটামিন যা দৈনন্দিন শক্তি বৃদ্ধি করে এবং সর্দি-কাশি ও হজমজনিত সমস্যায় অত্যন্ত উপকারী।',
      basePrice: 1250.0,
      comparePrice: 1650.0,
      isFeatured: true,
      isActive: true,
      sku: 'HONEY-KH-1KG',
      stockQuantity: 120,
      lowStockAlert: 10,
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
            altText: 'Sundarbans Natural Honey Jar',
            sortOrder: 0,
            isPrimary: true,
          },
          {
            url: 'https://images.unsplash.com/photo-1471943311424-646960669fbc?auto=format&fit=crop&w=800&q=80',
            altText: 'Pure Honey with Honeycomb Dipper',
            sortOrder: 1,
            isPrimary: false,
          },
          {
            url: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=800&q=80',
            altText: 'Honey Pouring Spoon',
            sortOrder: 2,
            isPrimary: false,
          },
        ],
      },
      variants: {
        create: [
          {
            title: '১ কেজি কাচের জার (1 KG Glass Jar)',
            sku: 'HONEY-1KG',
            price: 1250.0,
            stockQuantity: 80,
            attributes: JSON.stringify({ Size: '1 KG' }),
          },
          {
            title: '২ কেজি মেগা প্যাক (2 KG Mega Pack)',
            sku: 'HONEY-2KG',
            price: 2350.0,
            stockQuantity: 40,
            attributes: JSON.stringify({ Size: '2 KG' }),
          },
        ],
      },
      bundles: {
        create: [
          {
            badge: 'স্ট্যান্ডার্ড প্যাক',
            title: '১ টি জার কিনুন (১ কেজি)',
            description: 'একক পরিবারের জন্য আদর্শ',
            itemQuantity: 1,
            bundlePrice: 1250.0,
            regularPrice: 1650.0,
            freeDelivery: false,
            isDefault: false,
            sortOrder: 1,
          },
          {
            badge: 'সবচেয়ে জনপ্রিয় (Best Value)',
            title: '২ টি জার কিনুন (২ কেজি) - ৩০০৳ ছাড়!',
            description: 'ডেলিভারি চার্জ ৫০% ছাড় + সাশ্রয়ী মূল্য',
            itemQuantity: 2,
            bundlePrice: 2200.0,
            regularPrice: 3300.0,
            freeDelivery: false,
            isDefault: true,
            sortOrder: 2,
          },
          {
            badge: 'সুপার সেভার (ফ্রি ডেলিভারি)',
            title: '৩ টি জার কিনুন (৩ কেজি) - ফ্রি হোম ডেলিভারি!',
            description: 'সারাদেশে কোনো ডেলিভারি চার্জ নেই + সর্বোচ্চ সাশ্রয়',
            itemQuantity: 3,
            bundlePrice: 3150.0,
            regularPrice: 4950.0,
            freeDelivery: true,
            isDefault: false,
            sortOrder: 3,
          },
        ],
      },
    },
  });

  // 5. Landing Page Layout & Modular Sections
  const landingPage = await prisma.pageLayout.upsert({
    where: { id: 'landing-home' },
    update: {},
    create: {
      id: 'landing-home',
      title: 'Sundarbans Honey High-Converting Landing Page',
      slug: 'home',
      isPublished: true,
    },
  });

  const sectionsData = [
    {
      sectionKey: 'hero',
      title: 'Hero Section',
      sortOrder: 1,
      isEnabled: true,
      content: {
        headline: 'সুন্দরবনের খাঁটি খলিশা ফুলের প্রাকৃতিক মধু',
        highlightText: '১০০% বিশুদ্ধ ও অপরিশোধিত',
        subheadline: 'স্বাস্থ্য সচেতন মানুষের প্রতিদিনের প্রথম পছন্দ। ঘরে বসে পেয়ে যান আসল প্রাকৃতিক মধুর স্বাদ ও স্বাস্থ্য সুরক্ষা।',
        ctaButtonText: 'অর্ডার করতে ক্লিক করুন',
        badgeText: '🔥 আজকের বিশেষ অফার চলছে',
        stockLeftText: 'মাত্র ১৮টি স্টক বাকি আছে!',
        guaranteeBadge: 'ক্যাশ অন ডেলিভারি ও প্রোডাক্ট দেখে মূল্য পরিশোধের সুযোগ',
      },
    },
    {
      sectionKey: 'gallery',
      title: 'Gallery & Visual Proof',
      sortOrder: 2,
      isEnabled: true,
      content: {
        headline: 'প্রোডাক্টের বাস্তব ছবি ও প্যাকেজিং',
        subheadline: 'সুন্দরবনের গভীর জঙ্গল থেকে সরাসরি প্রক্রিয়াজাত ছাড়া কাঁচের জারে সুরক্ষিত',
        videoUrl: '', // Optional YouTube embed or direct mp4
      },
    },
    {
      sectionKey: 'benefits',
      title: 'Key Benefits',
      sortOrder: 3,
      isEnabled: true,
      content: {
        headline: 'কেন আমাদের মধু অন্যদের চেয়ে আলাদা?',
        subheadline: 'আমাদের প্রতিটি ড্রপ মধু ল্যাব টেস্টে উত্তীর্ণ এবং ১০০% নির্ভেজাল',
        items: [
          {
            title: '১০০% প্রাকৃতিক ও খাঁটি',
            desc: 'কোনো কৃত্রিম ফ্লেভার, প্রিজারভেটিভ বা চিনি মেশানো হয় না।',
            icon: 'CheckCircle2',
          },
          {
            title: 'রোগ প্রতিরোধ ক্ষমতা বৃদ্ধি',
            desc: 'ন্যাচারাল এনজাইম ও অ্যান্টিঅক্সিডেন্ট শরীরের ইমিউনিটি বাড়াতে সাহায্য করে।',
            icon: 'ShieldCheck',
          },
          {
            title: 'সর্দি-কাশি ও গলার উপশম',
            desc: 'সকালে হালকা গরম পানির সাথে বা তুলসী পাতার সাথে সেবন অত্যন্ত কার্যকর।',
            icon: 'HeartHandshake',
          },
          {
            title: 'সরাসরি মৌয়ালদের সংগ্রহ',
            desc: 'মাঝখানে কোনো মধ্যস্বত্বভোগী নেই, তাই সেরা মানের নিশ্চয়তা।',
            icon: 'Sparkles',
          },
        ],
      },
    },
    {
      sectionKey: 'steps',
      title: 'Usage & Ordering Steps',
      sortOrder: 4,
      isEnabled: true,
      content: {
        headline: 'সহজ ৩ ধাপে অর্ডার করুন',
        subheadline: 'কোনো অগ্রিম পেমেন্ট ছাড়াই অর্ডার করুন',
        steps: [
          {
            stepNumber: '০১',
            title: 'প্যাকেজ নির্বাচন করুন',
            desc: 'নিচের ফর্ম থেকে আপনার পছন্দের বান্ডিল বা পরিমাণ সিলেক্ট করুন।',
          },
          {
            stepNumber: '০২',
            title: 'নাম ও ঠিকানা দিন',
            desc: 'আপনার নাম, মোবাইল নম্বর এবং সঠিক ডেলিভারি ঠিকানা লিখুন।',
          },
          {
            stepNumber: '০৩',
            title: 'পণ্য দেখে টাকা দিন',
            desc: 'ডেলিভারি ম্যানের কাছ থেকে পার্সেল বুঝে পেয়ে মূল্য পরিশোধ করুন।',
          },
        ],
      },
    },
    {
      sectionKey: 'bundles',
      title: 'Bundle Offers',
      sortOrder: 5,
      isEnabled: true,
      content: {
        headline: 'আপনার পছন্দের অফারটি বেছে নিন',
        subheadline: 'একাধিক জার অর্ডারে আকর্ষণীয় ছাড় ও ফ্রি ডেলিভারি!',
      },
    },
    {
      sectionKey: 'reviews',
      title: 'Customer Reviews',
      sortOrder: 6,
      isEnabled: true,
      content: {
        headline: 'গ্রাহকদের সন্তুষ্টি ও রিভিউ',
        subheadline: 'আমাদের ৪,৮৫০+ সন্তুষ্ট গ্রাহকদের একাংশের মতামত',
        reviews: [
          {
            name: 'তানভীর হাসান',
            city: 'ধানমন্ডি, ঢাকা',
            rating: 5,
            comment: 'মধুর ঘ্রাণ এবং স্বাদ অসাধারণ! বাজারের প্যাকেটজাত মধুর চেয়ে অনেক ভালো। ডেলিভারিও মাত্র ২৪ ঘণ্টার মধ্যে পেয়েছি।',
            date: '২ দিন আগে',
          },
          {
            name: 'ডাঃ ফারহানা কবির',
            city: 'পাঁচলাইশ, চট্টগ্রাম',
            rating: 5,
            comment: 'আমার পরিবারের জন্য নিয়মিত মধু দরকার হয়। এই মধুর ঘনত্ব ও পিউরিটি এক কথায় চমৎকার। নিশ্চিন্তে সবাই নিতে পারেন।',
            date: '৪ দিন আগে',
          },
          {
            name: 'মোঃ রফিকুল ইসলাম',
            city: 'উপশহর, সিলেট',
            rating: 5,
            comment: '২টি জারের অফারটি নিয়েছিলাম। ক্যাশ অন ডেলিভারিতে চেক করে নিয়েছি। সার্ভিস খুবই ভালো। ধন্যবাদ App Lagbe টিমকে।',
            date: '১ সপ্তাহ আগে',
          },
        ],
      },
    },
    {
      sectionKey: 'faq',
      title: 'Frequently Asked Questions',
      sortOrder: 7,
      isEnabled: true,
      content: {
        headline: 'সচরাচর জিজ্ঞাসিত প্রশ্নাবলী (FAQ)',
        subheadline: 'আপনার মনে কোনো প্রশ্ন থাকলে নিচের উত্তরগুলো দেখতে পারেন',
        faqs: [
          {
            q: 'ডেলিভারি চার্জ কত এবং কতদিনে পাবো?',
            a: 'ঢাকা সিটির ভেতরে ডেলিভারি চার্জ মাত্র ৭০ টাকা (২৪-৪৮ ঘণ্টায় ডেলিভারি)। ঢাকা সিটির বাইরে ১৩০ টাকা (৩-৫ দিন)। তবে ৩টি জারের বান্ডিলে ডেলিভারি সম্পূর্ণ ফ্রি!',
          },
          {
            q: 'আমি কি পণ্য চেক করে টাকা দিতে পারবো?',
            a: 'হ্যাঁ, অবশ্যই! ডেলিভারি ম্যান থাকা অবস্থায় পার্সেল খুলে চেক করে তারপর মূল্য পরিশোধ করতে পারবেন।',
          },
          {
            q: 'মধু জমে গেলে কি সেটা ভেজাল?',
            a: 'না, প্রাকৃতিক খাঁটি মধু বিশেষ করে খলিশা বা সরিষা ফুলের মধু ঠান্ডা আবহাওয়ায় জমে যাওয়া একটি স্বাভাবিক প্রাকৃতিক বৈশিষ্ট্য। এতে মধুর গুণাগুণ নষ্ট হয় না।',
          },
          {
            q: 'অগ্রিম কোনো টাকা দিতে হবে কি?',
            a: 'না, আমাদের কাছে অর্ডারের জন্য কোনো অগ্রিম টাকা দেওয়ার প্রয়োজন নেই। আপনি ১০০% ক্যাশ অন ডেলিভারিতে নিতে পারবেন।',
          },
        ],
      },
    },
    {
      sectionKey: 'checkout',
      title: 'Embedded Direct Checkout Form',
      sortOrder: 8,
      isEnabled: true,
      content: {
        headline: 'অর্ডার কনফার্ম করতে নিচের তথ্যগুলো পূরণ করুন',
        subheadline: 'অনুগ্রহ করে সঠিক মোবাইল নম্বর ও সম্পূর্ণ ঠিকানা দিন',
        buttonLabel: 'অর্ডার সম্পন্ন করুন (ক্যাশ অন ডেলিভারি)',
      },
    },
  ];

  for (const sec of sectionsData) {
    const existing = await prisma.sectionConfig.findFirst({
      where: {
        pageId: landingPage.id,
        sectionKey: sec.sectionKey,
      },
    });

    const contentStr = JSON.stringify(sec.content, null, 2);

    if (existing) {
      await prisma.sectionConfig.update({
        where: { id: existing.id },
        data: {
          title: sec.title,
          sortOrder: sec.sortOrder,
          isEnabled: sec.isEnabled,
          publishedContent: contentStr,
          draftContent: contentStr,
          hasUnpublishedChanges: false,
        },
      });
    } else {
      await prisma.sectionConfig.create({
        data: {
          pageId: landingPage.id,
          sectionKey: sec.sectionKey,
          title: sec.title,
          sortOrder: sec.sortOrder,
          isEnabled: sec.isEnabled,
          publishedContent: contentStr,
          draftContent: contentStr,
          hasUnpublishedChanges: false,
        },
      });
    }
  }

  console.log('Database seeded successfully!');
  console.log('Sample Admin: admin@applagbe.com / admin123');
  console.log('Sample Product ID:', sampleProduct.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
