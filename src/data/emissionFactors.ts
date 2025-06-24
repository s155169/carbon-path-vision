
export interface EmissionFactor {
  emissionType: string;
  greenhouse: string;
  fuel: string;
  publicName: string;
  coefficient: number;
  unit: string;
  source: string;
  gwp?: number;
  code?: string;
}

export const fixedCombustionFactors: EmissionFactor[] = [
  { emissionType: "固定燃燒", greenhouse: "CO2", fuel: "天然氣", publicName: "天然氣", coefficient: 56100, unit: "公斤/兆焦耳", source: "IPCC 2006" },
  { emissionType: "固定燃燒", greenhouse: "CH4", fuel: "天然氣", publicName: "天然氣", coefficient: 1, unit: "公斤/兆焦耳", source: "IPCC 2006" },
  { emissionType: "固定燃燒", greenhouse: "N2O", fuel: "天然氣", publicName: "天然氣", coefficient: 0.1, unit: "公斤/兆焦耳", source: "IPCC 2006" },
  { emissionType: "固定燃燒", greenhouse: "CO2", fuel: "柴油", publicName: "柴油", coefficient: 74100, unit: "公斤/兆焦耳", source: "IPCC 2006" },
  { emissionType: "固定燃燒", greenhouse: "CH4", fuel: "柴油", publicName: "柴油", coefficient: 3, unit: "公斤/兆焦耳", source: "IPCC 2006" },
  { emissionType: "固定燃燒", greenhouse: "N2O", fuel: "柴油", publicName: "柴油", coefficient: 0.6, unit: "公斤/兆焦耳", source: "IPCC 2006" },
  { emissionType: "固定燃燒", greenhouse: "CO2", fuel: "重油", publicName: "重油", coefficient: 77300, unit: "公斤/兆焦耳", source: "IPCC 2006" },
  { emissionType: "固定燃燒", greenhouse: "CH4", fuel: "重油", publicName: "重油", coefficient: 3, unit: "公斤/兆焦耳", source: "IPCC 2006" },
  { emissionType: "固定燃燒", greenhouse: "N2O", fuel: "重油", publicName: "重油", coefficient: 0.6, unit: "公斤/兆焦耳", source: "IPCC 2006" },
  { emissionType: "固定燃燒", greenhouse: "CO2", fuel: "原油", publicName: "原油", coefficient: 73300, unit: "公斤/兆焦耳", source: "IPCC 2006" },
  { emissionType: "固定燃燒", greenhouse: "CO2", fuel: "液化石油氣", publicName: "液化石油氣", coefficient: 63000, unit: "公斤/兆焦耳", source: "IPCC 2006" },
  { emissionType: "固定燃燒", greenhouse: "CO2", fuel: "汽油", publicName: "汽油", coefficient: 69300, unit: "公斤/兆焦耳", source: "IPCC 2006" },
  { emissionType: "固定燃燒", greenhouse: "CH4", fuel: "汽油", publicName: "汽油", coefficient: 3, unit: "公斤/兆焦耳", source: "IPCC 2006" },
  { emissionType: "固定燃燒", greenhouse: "N2O", fuel: "汽油", publicName: "汽油", coefficient: 0.6, unit: "公斤/兆焦耳", source: "IPCC 2006" },
  { emissionType: "固定燃燒", greenhouse: "CO2", fuel: "煤", publicName: "煤", coefficient: 94600, unit: "公斤/兆焦耳", source: "IPCC 2006" },
];

export const mobileCombustionFactors: EmissionFactor[] = [
  { emissionType: "移動燃燒", greenhouse: "CO2", fuel: "柴油(車用)", publicName: "柴油", coefficient: 74100, unit: "公斤/兆焦耳", source: "IPCC 2006" },
  { emissionType: "移動燃燒", greenhouse: "CH4", fuel: "柴油(車用)", publicName: "柴油", coefficient: 0.6, unit: "公斤/兆焦耳", source: "IPCC 2006" },
  { emissionType: "移動燃燒", greenhouse: "CO2", fuel: "汽油(車用)", publicName: "汽油", coefficient: 69300, unit: "公斤/兆焦耳", source: "IPCC 2006" },
  { emissionType: "移動燃燒", greenhouse: "CH4", fuel: "汽油(車用)", publicName: "汽油", coefficient: 0.3, unit: "公斤/兆焦耳", source: "IPCC 2006" },
  { emissionType: "移動燃燒", greenhouse: "N2O", fuel: "汽油(車用)", publicName: "汽油", coefficient: 0.03, unit: "公斤/兆焦耳", source: "IPCC 2006" },
];

export const indirectEmissionFactors: EmissionFactor[] = [
  { emissionType: "間接（用電）", greenhouse: "CO2", fuel: "市售電力", publicName: "電力", coefficient: 0.502, unit: "公斤CO2e/度", source: "112（2023）" },
  { emissionType: "間接（用水）", greenhouse: "CO2", fuel: "自來水", publicName: "用水", coefficient: 0.348, unit: "公斤CO2e/立方米", source: "112（2023）" },
  { emissionType: "間接（廢水處理）", greenhouse: "CO2", fuel: "生活污水（中央處理廠）", publicName: "廢水處理", coefficient: 0.485, unit: "公斤CO2e/立方米", source: "112（2023）" },
  { emissionType: "間接（用蒸汽）", greenhouse: "CO2", fuel: "蒸汽", publicName: "蒸汽", coefficient: 0.073, unit: "公斤CO2e/公斤", source: "112（2023）" },
  { emissionType: "間接（用冰水）", greenhouse: "CO2", fuel: "冰水", publicName: "冰水", coefficient: 0.144, unit: "公斤CO2e/冷凍噸", source: "112（2023）" },
];

export const refrigerantFactors: EmissionFactor[] = [
  { emissionType: "逸散排放", greenhouse: "HFC-134a", fuel: "R-134a", publicName: "R-134a", coefficient: 1, unit: "公斤/公斤", source: "IPCC AR4", gwp: 1430, code: "072013" },
  { emissionType: "逸散排放", greenhouse: "HFC-404A", fuel: "R-404A", publicName: "R-404A", coefficient: 1, unit: "公斤/公斤", source: "IPCC AR4", gwp: 3922, code: "072019" },
  { emissionType: "逸散排放", greenhouse: "HFC-407C", fuel: "R-407C", publicName: "R-407C", coefficient: 1, unit: "公斤/公斤", source: "IPCC AR4", gwp: 1774, code: "072017" },
  { emissionType: "逸散排放", greenhouse: "HFC-410A", fuel: "R-410A", publicName: "R-410A", coefficient: 1, unit: "公斤/公斤", source: "IPCC AR4", gwp: 2088, code: "072018" },
  { emissionType: "逸散排放", greenhouse: "HCFC-22", fuel: "R-22", publicName: "R-22", coefficient: 1, unit: "公斤/公斤", source: "IPCC AR4", gwp: 1810, code: "072008" },
  { emissionType: "逸散排放", greenhouse: "CFC-12", fuel: "R-12", publicName: "R-12", coefficient: 1, unit: "公斤/公斤", source: "IPCC AR4", gwp: 10900, code: "072003" },
  { emissionType: "逸散排放", greenhouse: "HFC-32", fuel: "R-32", publicName: "R-32", coefficient: 1, unit: "公斤/公斤", source: "IPCC AR4", gwp: 675, code: "072014" },
];

export const getAllEmissionFactors = (): EmissionFactor[] => {
  return [
    ...fixedCombustionFactors,
    ...mobileCombustionFactors,
    ...indirectEmissionFactors,
    ...refrigerantFactors
  ];
};

export const findEmissionFactor = (fuelName: string, greenhouse: string = "CO2"): EmissionFactor | null => {
  const allFactors = getAllEmissionFactors();
  return allFactors.find(factor => 
    factor.publicName.includes(fuelName) && factor.greenhouse === greenhouse
  ) || null;
};
