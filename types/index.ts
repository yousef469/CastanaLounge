export type Language = 'ar' | 'en';

export type Category = 
  | 'hotAppetizers'
  | 'coldAppetizers'
  | 'pizzaPasta'
  | 'sandwiches'
  | 'mainCourses'
  | 'grilled'
  | 'breakfast'
  | 'sweets'
  | 'hotDrinks'
  | 'coldDrinks';

export interface MenuItem {
  id: string;
  nameAr: string;
  nameEn: string;
  price: number;
  category: Category;
}

export interface Translation {
  [key: string]: string;
}

export interface Translations {
  ar: Translation;
  en: Translation;
}
