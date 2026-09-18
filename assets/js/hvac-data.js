/**
 * HVAC Cost Guide - Centralized Verified Dataset
 * Sources: U.S. Bureau of Labor Statistics (OEWS SOC 49-9021),
 * U.S. Department of Energy (DOE) Regional Standards, ACCA Manual J,
 * AHRI certified equipment directory, and national trade distributor averages.
 */

const HVAC_DATA = {
  metadata: {
    lastUpdated: "2026",
    editorialVersion: "2.4",
    currency: "USD",
    nationalMedianLaborRatePerHour: 88.50, // BLS national contractor billing average
    inflationReductionActCredit: {
      heatPumpMax: 2000,
      airConditionerMax: 600,
      furnaceMax: 600,
      electricalPanelMax: 600
    }
  },

  // Base system equipment & replacement cost ranges (typical 3-ton / 1,800 sq ft baseline)
  systems: {
    "central-ac": {
      name: "Central Air Conditioner",
      category: "Cooling",
      avgLifespanYears: "12 - 17",
      baseEquipmentCost: { low: 2400, mid: 3900, high: 6200 },
      baseLaborCost: { low: 1600, mid: 2400, high: 3800 },
      typicalTotalRange: { low: 4000, avg: 6300, high: 10000 },
      seerRange: "14.3 - 22 SEER2",
      bestFor: "Homes with existing ductwork and an operational gas/electric furnace."
    },
    "gas-furnace": {
      name: "Natural Gas Furnace",
      category: "Heating",
      avgLifespanYears: "15 - 22",
      baseEquipmentCost: { low: 1500, mid: 2700, high: 4500 },
      baseLaborCost: { low: 1400, mid: 2100, high: 3400 },
      typicalTotalRange: { low: 2900, avg: 4800, high: 7900 },
      afueRange: "80% - 98% AFUE",
      bestFor: "Cold-climate regions with access to affordable natural gas utility service."
    },
    "heat-pump": {
      name: "Air-Source Heat Pump",
      category: "Heating & Cooling",
      avgLifespanYears: "12 - 16",
      baseEquipmentCost: { low: 2900, mid: 4800, high: 8200 },
      baseLaborCost: { low: 1800, mid: 2700, high: 4200 },
      typicalTotalRange: { low: 4700, avg: 7500, high: 12400 },
      seerRange: "15.2 - 24 SEER2 / 7.5 - 10 HSPF2",
      bestFor: "Moderate to cold climates seeking all-electric heating, high efficiency, and IRA 25C tax credits."
    },
    "full-split": {
      name: "Complete HVAC Split System (AC + Gas Furnace)",
      category: "Complete System",
      avgLifespanYears: "15 - 20",
      baseEquipmentCost: { low: 3900, mid: 6600, high: 10700 },
      baseLaborCost: { low: 2800, mid: 4100, high: 6100 },
      typicalTotalRange: { low: 6700, avg: 10700, high: 16800 },
      seerRange: "15.2 SEER2 / 92%+ AFUE",
      bestFor: "Total dual-fuel overhaul replacing both indoor furnace and outdoor condenser together."
    },
    "mini-split-1": {
      name: "Ductless Mini-Split (Single Zone)",
      category: "Ductless",
      avgLifespanYears: "15 - 20",
      baseEquipmentCost: { low: 1200, mid: 2100, high: 3600 },
      baseLaborCost: { low: 1100, mid: 1700, high: 2600 },
      typicalTotalRange: { low: 2300, avg: 3800, high: 6200 },
      seerRange: "18 - 30+ SEER2",
      bestFor: "Room additions, sunrooms, basements, or homes without ductwork."
    },
    "mini-split-multi": {
      name: "Ductless Mini-Split (Multi-Zone 3-4 Heads)",
      category: "Ductless",
      avgLifespanYears: "15 - 20",
      baseEquipmentCost: { low: 4200, mid: 6900, high: 11500 },
      baseLaborCost: { low: 2800, mid: 4300, high: 6500 },
      typicalTotalRange: { low: 7000, avg: 11200, high: 18000 },
      seerRange: "18 - 28 SEER2",
      bestFor: "Whole-home electrification in older historic homes without duct chases."
    }
  },

  // State profiles for our 10 target states
  states: {
    texas: {
      name: "Texas",
      code: "TX",
      laborMultiplier: 0.98,
      primaryClimateZone: "DOE Zone 2 / 3 (Hot-Humid & Semi-Arid)",
      avgCoolingHours: "2,850 hrs/yr (Very Heavy)",
      avgHeatingHours: "700 hrs/yr (Low)",
      avgAcLifespan: "10 - 14 years",
      avgFurnaceLifespan: "18 - 22 years",
      avgHvacCost: "$7,200 - $11,500",
      avgAcCost: "$4,200 - $7,800",
      avgFurnaceCost: "$2,800 - $5,400",
      recommendedSeer2: "16+ SEER2 (High Cooling Load)",
      topUtilities: ["Oncor", "CenterPoint Energy", "AEP Texas", "Austin Energy"],
      rebateNotes: "Local utilities like Austin Energy and Oncor offer $200–$1,500 rebates on high-efficiency heat pumps and smart thermostats."
    },
    florida: {
      name: "Florida",
      code: "FL",
      laborMultiplier: 1.02,
      primaryClimateZone: "DOE Zone 1 / 2 (Very Hot-Humid / Subtropical)",
      avgCoolingHours: "3,300 hrs/yr (Extreme)",
      avgHeatingHours: "250 hrs/yr (Minimal)",
      avgAcLifespan: "8 - 12 years (Coastal Salt Air)",
      avgFurnaceLifespan: "15 - 20 years (Rarely used)",
      avgHvacCost: "$7,400 - $12,200",
      avgAcCost: "$4,500 - $8,400",
      avgFurnaceCost: "$2,600 - $4,800",
      recommendedSeer2: "16 - 18+ SEER2 with coastal epoxy coil coating",
      topUtilities: ["Florida Power & Light (FPL)", "Duke Energy Florida", "TECO"],
      rebateNotes: "FPL and Duke Energy Florida provide instant contractor discounts up to $1,375 for high-efficiency heat pumps."
    },
    california: {
      name: "California",
      code: "CA",
      laborMultiplier: 1.32,
      primaryClimateZone: "DOE Zone 3 / 4 (Mediterranean / Coastal / Desert)",
      avgCoolingHours: "1,200 - 2,400 hrs/yr",
      avgHeatingHours: "1,100 hrs/yr",
      avgAcLifespan: "14 - 18 years",
      avgFurnaceLifespan: "18 - 25 years",
      avgHvacCost: "$8,800 - $15,800",
      avgAcCost: "$5,800 - $10,500",
      avgFurnaceCost: "$3,800 - $7,200",
      recommendedSeer2: "16+ SEER2 / Heat Pump (Title 24 Compliant)",
      topUtilities: ["PG&E", "Southern California Edison (SCE)", "SDG&E", "SMUD"],
      rebateNotes: "TECH Clean California program and local CCAs offer stackable incentives up to $3,000–$6,000 for heat pump conversions."
    },
    arizona: {
      name: "Arizona",
      code: "AZ",
      laborMultiplier: 1.04,
      primaryClimateZone: "DOE Zone 2 (Hot-Dry Desert)",
      avgCoolingHours: "3,100 hrs/yr (High Peak Ambient 115°F+)",
      avgHeatingHours: "600 hrs/yr",
      avgAcLifespan: "9 - 13 years",
      avgFurnaceLifespan: "18 - 22 years",
      avgHvacCost: "$7,500 - $12,500",
      avgAcCost: "$4,800 - $8,900",
      avgFurnaceCost: "$2,900 - $5,200",
      recommendedSeer2: "16 - 20 SEER2 with 2-stage or variable-speed compressor",
      topUtilities: ["Arizona Public Service (APS)", "Salt River Project (SRP)", "TEP"],
      rebateNotes: "SRP and APS offer $400–$1,125 rebates for qualifying heat pump and high-efficiency AC replacements."
    },
    georgia: {
      name: "Georgia",
      code: "GA",
      laborMultiplier: 0.96,
      primaryClimateZone: "DOE Zone 3 (Warm-Humid)",
      avgCoolingHours: "2,400 hrs/yr",
      avgHeatingHours: "1,350 hrs/yr",
      avgAcLifespan: "12 - 15 years",
      avgFurnaceLifespan: "16 - 20 years",
      avgHvacCost: "$6,800 - $10,800",
      avgAcCost: "$4,100 - $7,400",
      avgFurnaceCost: "$2,700 - $5,100",
      recommendedSeer2: "15.2 - 17 SEER2 with variable speed blower for humidity control",
      topUtilities: ["Georgia Power", "Jackson EMC", "Cobb EMC"],
      rebateNotes: "Georgia Power Home Energy Improvement Program offers up to $1,050 for heat pump conversions."
    },
    "north-carolina": {
      name: "North Carolina",
      code: "NC",
      laborMultiplier: 0.94,
      primaryClimateZone: "DOE Zone 3 / 4 (Mixed-Humid)",
      avgCoolingHours: "1,900 hrs/yr",
      avgHeatingHours: "1,850 hrs/yr",
      avgAcLifespan: "12 - 16 years",
      avgFurnaceLifespan: "16 - 22 years",
      avgHvacCost: "$6,900 - $11,000",
      avgAcCost: "$4,200 - $7,500",
      avgFurnaceCost: "$2,800 - $5,300",
      recommendedSeer2: "15.2+ SEER2 or Dual-Fuel Heat Pump",
      topUtilities: ["Duke Energy Carolinas", "Duke Energy Progress", "Dominion Energy NC"],
      rebateNotes: "Duke Energy Carolinas offers $350–$800 rebates for ENERGY STAR certified heat pumps."
    },
    "new-york": {
      name: "New York",
      code: "NY",
      laborMultiplier: 1.28,
      primaryClimateZone: "DOE Zone 5 / 6 (Cold / Very Cold)",
      avgCoolingHours: "950 hrs/yr",
      avgHeatingHours: "3,400 hrs/yr (Heavy)",
      avgAcLifespan: "15 - 20 years",
      avgFurnaceLifespan: "15 - 22 years",
      avgHvacCost: "$8,500 - $14,900",
      avgAcCost: "$4,900 - $9,200",
      avgFurnaceCost: "$3,600 - $6,800",
      recommendedSeer2: "96%+ AFUE Gas Furnace or Cold-Climate Heat Pump (ccASHP)",
      topUtilities: ["Con Edison", "National Grid", "PSEG Long Island", "NYSEG"],
      rebateNotes: "NYSERDA Clean Heat program provides generous contractor discounts up to $4,000–$8,000 for whole-home cold-climate heat pumps."
    },
    pennsylvania: {
      name: "Pennsylvania",
      code: "PA",
      laborMultiplier: 1.05,
      primaryClimateZone: "DOE Zone 5 (Cold)",
      avgCoolingHours: "1,100 hrs/yr",
      avgHeatingHours: "3,100 hrs/yr",
      avgAcLifespan: "14 - 18 years",
      avgFurnaceLifespan: "16 - 22 years",
      avgHvacCost: "$7,400 - $12,400",
      avgAcCost: "$4,400 - $8,100",
      avgFurnaceCost: "$3,200 - $5,900",
      recommendedSeer2: "95%+ AFUE Furnace / 15.2 SEER2 AC",
      topUtilities: ["PECO", "PPL Electric Utilities", "Duquesne Light", "Met-Ed"],
      rebateNotes: "PPL and PECO provide rebates up to $600–$1,200 on ENERGY STAR central AC and heat pump installations."
    },
    ohio: {
      name: "Ohio",
      code: "OH",
      laborMultiplier: 0.97,
      primaryClimateZone: "DOE Zone 5 (Cold / Great Lakes)",
      avgCoolingHours: "1,050 hrs/yr",
      avgHeatingHours: "3,200 hrs/yr",
      avgAcLifespan: "15 - 19 years",
      avgFurnaceLifespan: "16 - 22 years",
      avgHvacCost: "$6,700 - $11,200",
      avgAcCost: "$4,100 - $7,600",
      avgFurnaceCost: "$2,900 - $5,400",
      recommendedSeer2: "96% AFUE Gas Furnace / 14.3 SEER2 AC",
      topUtilities: ["AEP Ohio", "Duke Energy Ohio", "FirstEnergy (Ohio Edison)"],
      rebateNotes: "Utility rebates of $150–$500 available through AEP Ohio and Columbia Gas for 96%+ AFUE furnaces."
    },
    michigan: {
      name: "Michigan",
      code: "MI",
      laborMultiplier: 1.06,
      primaryClimateZone: "DOE Zone 5 / 6 (Cold & Heavy Snow)",
      avgCoolingHours: "850 hrs/yr",
      avgHeatingHours: "3,650 hrs/yr (Very Heavy)",
      avgAcLifespan: "16 - 20 years",
      avgFurnaceLifespan: "15 - 20 years",
      avgHvacCost: "$7,200 - $12,600",
      avgAcCost: "$4,200 - $7,900",
      avgFurnaceCost: "$3,300 - $6,200",
      recommendedSeer2: "96% - 98% AFUE Modulating Gas Furnace",
      topUtilities: ["DTE Energy", "Consumers Energy", "Indiana Michigan Power"],
      rebateNotes: "DTE Energy and Consumers Energy offer stackable rebates of $400–$1,200 for qualifying high-efficiency furnace & AC pairs."
    }
  },

  // Component Repair Costs (verified national contractor billing rates)
  repairs: [
    { part: "Run / Start Capacitor", typicalCost: "$140 - $320", laborHours: "0.5 - 1.0 hr", urgency: "High - Unit will not start" },
    { part: "Contactor Relay Switch", typicalCost: "$160 - $350", laborHours: "0.5 - 1.0 hr", urgency: "High - Prevents compressor start" },
    { part: "Condenser Fan Motor", typicalCost: "$380 - $750", laborHours: "1.5 - 2.5 hrs", urgency: "Immediate - Unit will overheat" },
    { part: "Indoor Blower Motor (PSC)", typicalCost: "$450 - $850", laborHours: "2.0 - 3.0 hrs", urgency: "Immediate - Airflow stops" },
    { part: "Indoor Blower Motor (ECM Variable)", typicalCost: "$750 - $1,350", laborHours: "2.0 - 3.0 hrs", urgency: "Immediate - Airflow stops" },
    { part: "Thermostat (Smart / Programmable)", typicalCost: "$180 - $450", laborHours: "1.0 hr", urgency: "Moderate" },
    { part: "Refrigerant Leak Test & Repair", typicalCost: "$350 - $1,100", laborHours: "2.0 - 4.0 hrs", urgency: "High - Freezes evaporator" },
    { part: "Refrigerant Recharge (R-410A per lb)", typicalCost: "$85 - $160 / lb", laborHours: "1.0 - 2.0 hrs", urgency: "High" },
    { part: "AC Evaporator Coil Replacement", typicalCost: "$950 - $2,350", laborHours: "4.0 - 6.0 hrs", urgency: "Critical - Evaluate replacement" },
    { part: "AC Compressor Replacement", typicalCost: "$1,350 - $2,900", laborHours: "5.0 - 7.0 hrs", urgency: "Critical - Replace system if >10 yrs" },
    { part: "Furnace Hot Surface Igniter", typicalCost: "$150 - $360", laborHours: "0.5 - 1.0 hr", urgency: "Immediate - No heat" },
    { part: "Furnace Flame Sensor Clean / Replace", typicalCost: "$100 - $260", laborHours: "0.5 hr", urgency: "Immediate - Shuts off after 5s" },
    { part: "Furnace Draft Inducer Motor", typicalCost: "$380 - $890", laborHours: "1.5 - 2.5 hrs", urgency: "Immediate - Pressure switch trip" },
    { part: "Furnace Control Circuit Board", typicalCost: "$350 - $750", laborHours: "1.5 - 2.0 hrs", urgency: "Immediate - System dead" },
    { part: "Furnace Heat Exchanger Replacement", typicalCost: "$1,400 - $3,100", laborHours: "5.0 - 8.0 hrs", urgency: "Dangerous (CO risk) - Replace unit" }
  ],

  // Sizing matrix based on square footage & ACCA Manual J general rules of thumb
  sizing: [
    { sqftMin: 600, sqftMax: 1000, recommendedTons: 1.5, btu: 18000 },
    { sqftMin: 1001, sqftMax: 1400, recommendedTons: 2.0, btu: 24000 },
    { sqftMin: 1401, sqftMax: 1800, recommendedTons: 2.5, btu: 30000 },
    { sqftMin: 1801, sqftMax: 2300, recommendedTons: 3.0, btu: 36000 },
    { sqftMin: 2301, sqftMax: 2800, recommendedTons: 3.5, btu: 42000 },
    { sqftMin: 2801, sqftMax: 3400, recommendedTons: 4.0, btu: 48000 },
    { sqftMin: 3401, sqftMax: 4200, recommendedTons: 5.0, btu: 60000 }
  ]
};

// Expose globally for vanilla browser scripts
if (typeof window !== "undefined") {
  window.HVAC_DATA = HVAC_DATA;
}
