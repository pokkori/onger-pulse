export type SkinCategory = "pulse" | "hitEffect" | "trail" | "background";

export interface SkinDef {
  id: string;
  name: string;
  description: string;
  category: SkinCategory;
  previewImage: string;
  unlockCondition: {
    type: "default" | "achievement" | "purchase" | "combo";
    achievementId?: string;
    iapProductId?: string;
    requiredCombo?: number;
  };
  effectParams: {
    primaryColor: string;
    secondaryColor: string;
    particleCount: number;
    particleSize: number;
    glowRadius: number;
    animationSpeed: number;
  };
}
