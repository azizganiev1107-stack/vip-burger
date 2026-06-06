export type Unit = 'кг' | 'шт' | 'лт' | 'блок' | 'гр';

export interface InventoryItem {
  id: string;
  name: string;
  unit: Unit;
  category: string;
  currentStock: number;
}

export type MovementType = 'incoming' | 'outgoing' | 'transfer';

export interface Movement {
  id: string;
  itemId: string;
  type: MovementType;
  quantity: number;
  date: string;
  notes?: string;
  recipient?: string; // e.g., "Aziz"
}

export const CATEGORIES = {
  UN: 'Ун',
  SUU: 'Суулар',
  LAVASH: 'Лаваш хамыр',
  BASKA: 'Баска Затлар',
  MARGARIN: 'Маргарин',
  MEAT: 'Гөш ,Феле,Грил тауык',
  UN_PRODUCTS: 'Уннан алынатын затлар',
  MEAT_PRODUCTS: 'Гоштен алынатын затлар',
  SAUCE_PRODUCTS: 'Саыуска ететин затлар',
};

export const INITIAL_ITEMS: InventoryItem[] = [
  // Кирис болатын затлар (Incoming)
  { id: 'un-kazak', name: 'Ун казак', unit: 'кг', category: CATEGORIES.UN, currentStock: 0 },
  { id: 'un-nokis', name: 'Ун нокис', unit: 'кг', category: CATEGORIES.UN, currentStock: 0 },
  
  { id: 'cola-1.5', name: 'Кола 1.5л', unit: 'шт', category: CATEGORIES.SUU, currentStock: 0 },
  { id: 'cola-2.0', name: 'Кола 2 л', unit: 'шт', category: CATEGORIES.SUU, currentStock: 0 },
  { id: 'cola-1.0', name: 'Кола 1л', unit: 'шт', category: CATEGORIES.SUU, currentStock: 0 },
  { id: 'cola-0.5', name: 'Кола 0.5', unit: 'шт', category: CATEGORIES.SUU, currentStock: 0 },
  { id: 'max-tea', name: 'Мах чай', unit: 'шт', category: CATEGORIES.SUU, currentStock: 0 },
  { id: 'ice-tea', name: 'Айсти су', unit: 'шт', category: CATEGORIES.SUU, currentStock: 0 },
  { id: 'cola-bottle', name: 'Кола Бутилки', unit: 'шт', category: CATEGORIES.SUU, currentStock: 0 },
  { id: 'dinay', name: 'Динай', unit: 'шт', category: CATEGORIES.SUU, currentStock: 0 },
  { id: 'energy', name: 'Эниргетик', unit: 'шт', category: CATEGORIES.SUU, currentStock: 0 },
  { id: 'water-1.5', name: 'Су безгаз 1.5л', unit: 'шт', category: CATEGORIES.SUU, currentStock: 0 },
  { id: 'water-0.5', name: 'Су без газ 0.5л', unit: 'шт', category: CATEGORIES.SUU, currentStock: 0 },
  
  { id: 'lavash-std', name: 'Лаваш хамыр Стандарт 20 шт', unit: 'шт', category: CATEGORIES.LAVASH, currentStock: 0 },
  { id: 'lavash-big', name: 'Лаваш хамыр Болшой 20 шт', unit: 'шт', category: CATEGORIES.LAVASH, currentStock: 0 },
  
  { id: 'tomat', name: 'Тамат', unit: 'шт', category: CATEGORIES.BASKA, currentStock: 0 },
  { id: 'coffee', name: 'Кофе', unit: 'шт', category: CATEGORIES.BASKA, currentStock: 0 },
  { id: 'napkins', name: 'Салфетки', unit: 'блок', category: CATEGORIES.BASKA, currentStock: 0 },
  { id: 'sugar', name: 'Кумшекер', unit: 'кг', category: CATEGORIES.BASKA, currentStock: 0 },
  { id: 'potatoes', name: 'Картошик', unit: 'кг', category: CATEGORIES.BASKA, currentStock: 0 },
  { id: 'carrots', name: 'Гешир', unit: 'кг', category: CATEGORIES.BASKA, currentStock: 0 },
  { id: 'eggs', name: 'Маек', unit: 'шт', category: CATEGORIES.BASKA, currentStock: 0 },
  { id: 'mayonnaise', name: 'Маенез', unit: 'шт', category: CATEGORIES.BASKA, currentStock: 0 },
  { id: 'oil-veg', name: 'Шемишки май', unit: 'лт', category: CATEGORIES.BASKA, currentStock: 0 },
  { id: 'chili', name: 'Чели', unit: 'шт', category: CATEGORIES.BASKA, currentStock: 0 },
  { id: 'oil-fries', name: 'Фри май', unit: 'лт', category: CATEGORIES.BASKA, currentStock: 0 },
  
  { id: 'margarine-unikon', name: 'Маргарин Уникон 20 кг', unit: 'кг', category: CATEGORIES.MARGARIN, currentStock: 0 },
  { id: 'margarine-milter', name: 'Милтер самса май 10 кг', unit: 'кг', category: CATEGORIES.MARGARIN, currentStock: 0 },
  
  { id: 'meat', name: 'Гош', unit: 'кг', category: CATEGORIES.MEAT, currentStock: 0 },
  { id: 'grill-chicken', name: 'Грил тауык', unit: 'шт', category: CATEGORIES.MEAT, currentStock: 0 },
  { id: 'fillet', name: 'Феле', unit: 'кг', category: CATEGORIES.MEAT, currentStock: 0 },

  // Шығын болатын затлар (Outgoing/Derived)
  { id: 'patir-lavash', name: 'Патир лаваш', unit: 'кг', category: CATEGORIES.UN_PRODUCTS, currentStock: 0 },
  { id: 'patir-shop', name: 'Патир магазинге', unit: 'кг', category: CATEGORIES.UN_PRODUCTS, currentStock: 0 },
  { id: 'buns', name: 'Болышки', unit: 'кг', category: CATEGORIES.UN_PRODUCTS, currentStock: 0 },
  { id: 'pelmeni', name: 'Пелмен', unit: 'кг', category: CATEGORIES.UN_PRODUCTS, currentStock: 0 },
  { id: 'perashki', name: 'Перашки', unit: 'кг', category: CATEGORIES.UN_PRODUCTS, currentStock: 0 },
  { id: 'samsa', name: 'Сомса', unit: 'гр', category: CATEGORIES.UN_PRODUCTS, currentStock: 0 },
  { id: 'pigodi', name: 'Пигоди', unit: 'гр', category: CATEGORIES.UN_PRODUCTS, currentStock: 0 },
  { id: 'testa', name: 'Теста', unit: 'гр', category: CATEGORIES.UN_PRODUCTS, currentStock: 0 },
  
  { id: 'sugar-derived', name: 'Кумшекер марожний хам унларга', unit: 'кг', category: CATEGORIES.BASKA, currentStock: 0 },
  
  { id: 'meat-pelmeni', name: 'Гош пелмен,сомса', unit: 'гр', category: CATEGORIES.MEAT_PRODUCTS, currentStock: 0 },
  { id: 'fillet-meat', name: 'Феле гошке', unit: 'кг', category: CATEGORIES.MEAT_PRODUCTS, currentStock: 0 },
  { id: 'fillet-lavash', name: 'Феле лавашка', unit: 'кг', category: CATEGORIES.MEAT_PRODUCTS, currentStock: 0 },

  // Aziz transfer items
  { id: 'white-sauce', name: 'Ак сауыс', unit: 'лт', category: CATEGORIES.SAUCE_PRODUCTS, currentStock: 0 },
];
