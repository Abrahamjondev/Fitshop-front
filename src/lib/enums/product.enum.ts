export enum ProductSize {
  // Kiyim-kechak (Apparel)
  XS = "XS",
  S = "S",
  M = "M",
  L = "L",
  XL = "XL",
  XXL = "XXL",

  // Oyoq kiyim (Shoes) - EU o'lchamlari
  EU_38 = "38",
  EU_39 = "39",
  EU_40 = "40",
  EU_41 = "41",
  EU_42 = "42",
  EU_43 = "43",
  EU_44 = "44",
  EU_45 = "45",

  // Universal va Maxsus
  ONE_SIZE = "ONE_SIZE",
  NOT_APPLICABLE = "N/A",
}

export enum ProductWeight {
  NOT_APPLICABLE = 0,
  GRAM_250 = 250,
  GRAM_500 = 500,
  KG_1 = 1000,
  KG_2 = 2000,
  KG_2_5 = 2500,
  KG_5 = 5000,
  KG_10 = 10000,
  KG_20 = 20000,
}

export enum ProductStatus {
  ACTIVE = "ACTIVE",
  PAUSE = "PAUSE",
  OUT_OF_STOCK = "OUT_OF_STOCK",
  COMING_SOON = "COMING_SOON",
  DELETED = "DELETED",
}

export enum ProductCategory {
  NUTRITION = "NUTRITION",
  APPAREL = "APPAREL",
  SHOES = "SHOES",
  EQUIPMENT = "EQUIPMENT",
  RECOVERY = "RECOVERY",
  TECH = "TECH",
  COMBAT = "COMBAT",
  OUTDOOR = "OUTDOOR",
}
