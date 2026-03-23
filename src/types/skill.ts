export type SkillCategory = "offense" | "defense" | "utility";

export interface SkillEffect {
  type:
    | "score_bonus"
    | "combo_shield"
    | "life_regen"
    | "slow_enemies"
    | "explosion_radius"
    | "perfect_window"
    | "double_tap"
    | "critical_chance";
  value: number;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  category: SkillCategory;
  icon: string;
  effect: SkillEffect;
  rarity: "common" | "rare" | "epic";
}

export interface SkillChoice {
  options: [Skill, Skill, Skill];
  offeredAtMs: number;
}
