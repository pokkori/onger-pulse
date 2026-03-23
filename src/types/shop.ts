export interface IAPProduct {
  id: string;
  name: string;
  description: string;
  type: "consumable" | "non_consumable" | "subscription";
  displayPrice: string;
  unlocks?: string[];
}

export interface PurchaseState {
  purchasedProducts: string[];
  isAdFree: boolean;
  isSeasonPassActive: boolean;
  isLoading: boolean;
  error: string | null;
}
