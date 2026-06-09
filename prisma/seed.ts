import "dotenv/config"
import { PrismaClient } from "../src/generated/prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800",
  "https://images.unsplash.com/photo-1544568100-847a188ada38?w=800",
  "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800",
  "https://images.unsplash.com/photo-1601979031925-424e53b6caaa?w=800",
  "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=800",
  "https://images.unsplash.com/photo-1612195583950-b8fd34c87093?w=800",
]

function img(i = 0) {
  return PLACEHOLDER_IMAGES[i % PLACEHOLDER_IMAGES.length]
}

async function main() {
  console.log("🌱 Seeding database...")

  // Users
  const adminPassword = await bcrypt.hash("admin123", 12)
  const userPassword = await bcrypt.hash("user1234", 12)

  const admin = await prisma.user.upsert({
    where: { email: "admin@furmey.com" },
    update: {},
    create: {
      name: "Furmey Admin",
      email: "admin@furmey.com",
      password: adminPassword,
      role: "ADMIN",
    },
  })

  const customer = await prisma.user.upsert({
    where: { email: "user@furmey.com" },
    update: {},
    create: {
      name: "Jane Pet",
      email: "user@furmey.com",
      password: userPassword,
      role: "USER",
    },
  })

  console.log("✅ Users created")

  // Categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "collars-leads" },
      update: {},
      create: { name: "Collars & Leads", slug: "collars-leads", description: "Premium collars, leads and harnesses", image: img(0) },
    }),
    prisma.category.upsert({
      where: { slug: "clothing" },
      update: {},
      create: { name: "Clothing", slug: "clothing", description: "Designer pet clothing and outfits", image: img(1) },
    }),
    prisma.category.upsert({
      where: { slug: "accessories" },
      update: {},
      create: { name: "Accessories", slug: "accessories", description: "Stylish pet accessories", image: img(2) },
    }),
    prisma.category.upsert({
      where: { slug: "beds-loungers" },
      update: {},
      create: { name: "Beds & Loungers", slug: "beds-loungers", description: "Luxury beds and loungers", image: img(3) },
    }),
    prisma.category.upsert({
      where: { slug: "travel" },
      update: {},
      create: { name: "Travel", slug: "travel", description: "Premium carriers and travel accessories", image: img(4) },
    }),
  ])

  console.log("✅ Categories created")

  // Collections
  const summerCollection = await prisma.collection.upsert({
    where: { slug: "summer-luxe" },
    update: {},
    create: {
      name: "Summer Luxe",
      slug: "summer-luxe",
      description: "Light, breezy, and effortlessly chic — the summer collection for the modern pet.",
      featured: true,
    },
  })

  const royalCollection = await prisma.collection.upsert({
    where: { slug: "royal-court" },
    update: {},
    create: {
      name: "Royal Court",
      slug: "royal-court",
      description: "Opulent designs fit for royalty. The ultimate in pet luxury.",
      featured: true,
    },
  })

  const urbanCollection = await prisma.collection.upsert({
    where: { slug: "urban-chic" },
    update: {},
    create: {
      name: "Urban Chic",
      slug: "urban-chic",
      description: "Street-ready style meets premium craftsmanship.",
      featured: true,
    },
  })

  console.log("✅ Collections created")

  // Products
  const products = [
    {
      name: "Velvet Royale Collar",
      slug: "velvet-royale-collar",
      description: "Hand-stitched Italian velvet collar with 18k gold-plated hardware. Adjustable fit for all neck sizes. The collar your pet deserves.",
      price: 89.0,
      comparePrice: 120.0,
      sku: "COL-VLV-001",
      categorySlug: "collars-leads",
      featured: true,
      tags: ["collar", "velvet", "luxury", "gold"],
      images: [img(0), img(1)],
      variants: [
        { name: "Size", value: "XS", stock: 15 },
        { name: "Size", value: "S", stock: 20 },
        { name: "Size", value: "M", stock: 18 },
        { name: "Size", value: "L", stock: 12 },
        { name: "Size", value: "XL", stock: 8 },
      ],
      stock: 73,
      collections: ["royal-court"],
    },
    {
      name: "Cashmere Cloud Sweater",
      slug: "cashmere-cloud-sweater",
      description: "Pure Mongolian cashmere pet sweater. Feather-light warmth with a supremely soft hand feel. Hand-wash only.",
      price: 145.0,
      comparePrice: 180.0,
      sku: "CLT-CAS-001",
      categorySlug: "clothing",
      featured: true,
      tags: ["sweater", "cashmere", "winter", "luxury"],
      images: [img(1), img(2)],
      variants: [
        { name: "Size", value: "XS", stock: 8 },
        { name: "Size", value: "S", stock: 12 },
        { name: "Size", value: "M", stock: 10 },
        { name: "Size", value: "L", stock: 6 },
      ],
      stock: 36,
      collections: ["summer-luxe", "royal-court"],
    },
    {
      name: "Silk Bandana Scarf",
      slug: "silk-bandana-scarf",
      description: "100% pure mulberry silk pet bandana. Hand-rolled edges, available in our signature prints.",
      price: 49.0,
      comparePrice: null,
      sku: "ACC-SLK-001",
      categorySlug: "accessories",
      featured: false,
      tags: ["bandana", "silk", "accessories"],
      images: [img(2), img(3)],
      variants: [
        { name: "Color", value: "Champagne", stock: 25 },
        { name: "Color", value: "Midnight Blue", stock: 20 },
        { name: "Color", value: "Rose Gold", stock: 18 },
      ],
      stock: 63,
      collections: ["urban-chic"],
    },
    {
      name: "Merino Wool Trench Coat",
      slug: "merino-wool-trench-coat",
      description: "Tailored merino wool trench coat with satin lining. Secure leg straps. A sartorial statement for the distinguished pet.",
      price: 220.0,
      comparePrice: 280.0,
      sku: "CLT-MRN-001",
      categorySlug: "clothing",
      featured: true,
      tags: ["coat", "merino", "luxury", "formal"],
      images: [img(3), img(4)],
      variants: [
        { name: "Size", value: "XS", stock: 5 },
        { name: "Size", value: "S", stock: 8 },
        { name: "Size", value: "M", stock: 7 },
        { name: "Size", value: "L", stock: 4 },
      ],
      stock: 24,
      collections: ["royal-court"],
    },
    {
      name: "Leather Heritage Lead",
      slug: "leather-heritage-lead",
      description: "Full-grain vegetable-tanned leather lead with solid brass clasps. Built to last a lifetime, looks better with age.",
      price: 75.0,
      comparePrice: null,
      sku: "COL-LTH-002",
      categorySlug: "collars-leads",
      featured: false,
      tags: ["lead", "leather", "handmade"],
      images: [img(4), img(5)],
      variants: [
        { name: "Color", value: "Cognac", stock: 30 },
        { name: "Color", value: "Ebony", stock: 25 },
        { name: "Color", value: "Tan", stock: 20 },
      ],
      stock: 75,
      collections: ["urban-chic"],
    },
    {
      name: "Bamboo Cloud Bed",
      slug: "bamboo-cloud-bed",
      description: "Orthopedic memory foam pet bed with bamboo linen cover. Hypoallergenic, temperature-regulating, removable cover.",
      price: 199.0,
      comparePrice: 249.0,
      sku: "BED-BMB-001",
      categorySlug: "beds-loungers",
      featured: true,
      tags: ["bed", "orthopedic", "bamboo", "comfort"],
      images: [img(5), img(0)],
      variants: [
        { name: "Size", value: "Small (50×40cm)", stock: 10 },
        { name: "Size", value: "Medium (70×55cm)", stock: 8 },
        { name: "Size", value: "Large (90×70cm)", stock: 5 },
      ],
      stock: 23,
      collections: ["summer-luxe"],
    },
    {
      name: "Crystal Bow Hair Clip",
      slug: "crystal-bow-hair-clip",
      description: "Hand-set Swarovski crystals on a hypoallergenic titanium clip. For the pet who sparkles.",
      price: 38.0,
      comparePrice: null,
      sku: "ACC-CRY-001",
      categorySlug: "accessories",
      featured: false,
      tags: ["hair", "accessories", "crystal", "bling"],
      images: [img(1), img(2)],
      variants: [
        { name: "Color", value: "Clear", stock: 40 },
        { name: "Color", value: "Rose", stock: 35 },
        { name: "Color", value: "Blue Sapphire", stock: 28 },
      ],
      stock: 103,
      collections: ["royal-court", "urban-chic"],
    },
    {
      name: "Woven Leather Harness",
      slug: "woven-leather-harness",
      description: "Braided genuine leather harness with padded chest plate. Fully adjustable, escape-proof design.",
      price: 115.0,
      comparePrice: 140.0,
      sku: "COL-HRN-001",
      categorySlug: "collars-leads",
      featured: true,
      tags: ["harness", "leather", "luxury", "woven"],
      images: [img(3), img(4)],
      variants: [
        { name: "Size", value: "XS", stock: 10 },
        { name: "Size", value: "S", stock: 15 },
        { name: "Size", value: "M", stock: 12 },
        { name: "Size", value: "L", stock: 8 },
      ],
      stock: 45,
      collections: ["urban-chic"],
    },
    {
      name: "Linen Summer Romper",
      slug: "linen-summer-romper",
      description: "Breathable stonewashed linen romper. Perfect for beach days and summer adventures.",
      price: 65.0,
      comparePrice: null,
      sku: "CLT-LNN-001",
      categorySlug: "clothing",
      featured: false,
      tags: ["romper", "linen", "summer", "casual"],
      images: [img(5), img(0)],
      variants: [
        { name: "Size", value: "XS", stock: 15 },
        { name: "Size", value: "S", stock: 18 },
        { name: "Size", value: "M", stock: 14 },
        { name: "Size", value: "L", stock: 9 },
      ],
      stock: 56,
      collections: ["summer-luxe"],
    },
    {
      name: "Monogram Travel Carrier",
      slug: "monogram-travel-carrier",
      description: "Full-grain leather soft-sided carrier with breathable mesh panels. Airline cabin-approved dimensions. Monogram embossing available.",
      price: 385.0,
      comparePrice: 450.0,
      sku: "TRV-CAR-001",
      categorySlug: "travel",
      featured: true,
      tags: ["carrier", "travel", "leather", "monogram"],
      images: [img(2), img(3)],
      variants: [
        { name: "Color", value: "Cognac", stock: 6 },
        { name: "Color", value: "Black", stock: 8 },
        { name: "Color", value: "Cream", stock: 4 },
      ],
      stock: 18,
      collections: ["royal-court"],
    },
    {
      name: "Chenille Knit Hoodie",
      slug: "chenille-knit-hoodie",
      description: "Chunky chenille knit hoodie with kangaroo pocket. Ultra-soft, warm, and irresistibly cute.",
      price: 95.0,
      comparePrice: null,
      sku: "CLT-CHN-001",
      categorySlug: "clothing",
      featured: false,
      tags: ["hoodie", "knit", "cozy", "winter"],
      images: [img(4), img(5)],
      variants: [
        { name: "Size", value: "XS", stock: 12 },
        { name: "Size", value: "S", stock: 16 },
        { name: "Size", value: "M", stock: 14 },
        { name: "Size", value: "L", stock: 8 },
      ],
      stock: 50,
      collections: ["urban-chic"],
    },
    {
      name: "Pearl Drop Collar",
      slug: "pearl-drop-collar",
      description: "Freshwater pearl droplet collar on sterling silver chain. Perfect for special occasions.",
      price: 165.0,
      comparePrice: 200.0,
      sku: "ACC-PRL-001",
      categorySlug: "accessories",
      featured: true,
      tags: ["collar", "pearl", "silver", "occasion"],
      images: [img(0), img(1)],
      variants: [
        { name: "Size", value: "XS", stock: 8 },
        { name: "Size", value: "S", stock: 10 },
        { name: "Size", value: "M", stock: 7 },
      ],
      stock: 25,
      collections: ["royal-court"],
    },
  ]

  for (const p of products) {
    const category = categories.find((c) => c.slug === p.categorySlug)!

    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        comparePrice: p.comparePrice,
        sku: p.sku,
        categoryId: category.id,
        featured: p.featured,
        published: true,
        tags: p.tags,
        images: {
          create: p.images.map((url, i) => ({
            url,
            alt: `${p.name} ${i + 1}`,
            isPrimary: i === 0,
            order: i,
          })),
        },
        variants: {
          create: p.variants.map((v, i) => ({
            name: v.name,
            value: v.value,
            sku: `${p.sku}-${v.value.toUpperCase().replace(/\s/g, "-")}`,
            stock: v.stock,
          })),
        },
        inventory: {
          create: { quantity: p.stock, reserved: 0 },
        },
      },
    })

    // Add to collections
    for (const collectionSlug of p.collections) {
      const collection =
        collectionSlug === "summer-luxe"
          ? summerCollection
          : collectionSlug === "royal-court"
          ? royalCollection
          : urbanCollection

      await prisma.collectionProduct.upsert({
        where: { collectionId_productId: { collectionId: collection.id, productId: product.id } },
        update: {},
        create: { collectionId: collection.id, productId: product.id },
      })
    }

    console.log(`  ✅ ${p.name}`)
  }

  console.log("✅ Products created")

  // Sample reviews
  const allProducts = await prisma.product.findMany({ take: 5 })
  const reviewData = [
    { rating: 5, title: "Absolutely stunning", body: "The quality is beyond what I expected. My dog looked like royalty at the dog park!" },
    { rating: 5, title: "Perfect fit", body: "Ordered size S and it fits perfectly. The material is so soft and luxurious." },
    { rating: 4, title: "Beautiful but delicate", body: "Gorgeous product, just handle with care. Dry clean only." },
    { rating: 5, title: "Worth every penny", body: "I was hesitant at the price point but this is genuinely exceptional quality." },
    { rating: 4, title: "Great gift", body: "Bought this as a birthday gift for my friend's dog. She loved it!" },
  ]

  for (let i = 0; i < Math.min(5, allProducts.length); i++) {
    const r = reviewData[i]
    await prisma.review.upsert({
      where: { productId_userId: { productId: allProducts[i].id, userId: customer.id } },
      update: {},
      create: {
        productId: allProducts[i].id,
        userId: customer.id,
        rating: r.rating,
        title: r.title,
        body: r.body,
        verified: true,
      },
    })
  }

  console.log("✅ Reviews created")

  // Sample cart for user
  const cart = await prisma.cart.upsert({
    where: { userId: customer.id },
    update: {},
    create: { userId: customer.id },
  })

  if (allProducts[0]) {
    await prisma.cartItem.upsert({
      where: { id: `${cart.id}-sample` },
      update: {},
      create: {
        id: `${cart.id}-sample`,
        cartId: cart.id,
        productId: allProducts[0].id,
        quantity: 1,
      },
    }).catch(() => {})
  }

  // Sample order
  if (allProducts[0] && allProducts[1]) {
    await prisma.order.upsert({
      where: { orderNumber: "FRM-2024-001" },
      update: {},
      create: {
        orderNumber: "FRM-2024-001",
        userId: customer.id,
        status: "DELIVERED",
        subtotal: allProducts[0].price + allProducts[1].price,
        shippingCost: 0,
        tax: (allProducts[0].price + allProducts[1].price) * 0.1,
        total: (allProducts[0].price + allProducts[1].price) * 1.1,
        shippingAddress: {
          firstName: "Jane",
          lastName: "Pet",
          street: "123 Luxury Lane",
          city: "London",
          state: "England",
          country: "UK",
          postalCode: "SW1A 1AA",
        },
        items: {
          create: [
            { productId: allProducts[0].id, quantity: 1, price: allProducts[0].price },
            { productId: allProducts[1].id, quantity: 1, price: allProducts[1].price },
          ],
        },
      },
    })
  }

  console.log("✅ Sample orders created")

  // Address for user
  await prisma.address.upsert({
    where: { id: `${customer.id}-addr` },
    update: {},
    create: {
      id: `${customer.id}-addr`,
      userId: customer.id,
      label: "Home",
      firstName: "Jane",
      lastName: "Pet",
      street: "123 Luxury Lane",
      city: "London",
      state: "England",
      country: "UK",
      postalCode: "SW1A 1AA",
      isDefault: true,
    },
  }).catch(() => {})

  console.log("\n🎉 Seeding complete!\n")
  console.log("📧 Admin:    admin@furmey.com  /  admin123")
  console.log("📧 Customer: user@furmey.com   /  user1234")
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
