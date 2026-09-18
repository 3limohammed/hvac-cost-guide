/**
 * HVAC Cost Guide - Interactive HVAC Cost Calculator Engine
 * Calculates estimated low and high cost ranges based on:
 * - Square footage (Manual J rule of thumb tonnage)
 * - System type (Central AC, Gas Furnace, Split System, Heat Pump, Mini-Split)
 * - Project scope (Replacement vs New Install with Ducts vs Major Repair)
 * - ZIP code (Regional labor rate & climate zone multiplier)
 * - Existing unit age (Advisory logic based on the $5,000 Rule)
 */

(function () {
  function getZipLaborMultiplier(zip) {
    if (!zip || zip.length < 3) return { state: "National Average", mult: 1.0, zone: "National Average" };
    const prefix = parseInt(zip.substring(0, 3), 10);

    // US ZIP Prefix mapping
    if (prefix >= 750 && prefix <= 799) return { state: "Texas", mult: 0.98, zone: "Zone 2/3 (Hot-Humid)" };
    if (prefix >= 320 && prefix <= 349) return { state: "Florida", mult: 1.02, zone: "Zone 1/2 (Very Hot-Humid)" };
    if (prefix >= 900 && prefix <= 961) return { state: "California", mult: 1.32, zone: "Zone 3/4 (Title 24 Standard)" };
    if (prefix >= 850 && prefix <= 865) return { state: "Arizona", mult: 1.04, zone: "Zone 2 (Hot-Dry Desert)" };
    if (prefix >= 300 && prefix <= 319) return { state: "Georgia", mult: 0.96, zone: "Zone 3 (Warm-Humid)" };
    if (prefix >= 270 && prefix <= 289) return { state: "North Carolina", mult: 0.94, zone: "Zone 3/4 (Mixed-Humid)" };
    if (prefix >= 100 && prefix <= 149) return { state: "New York", mult: 1.28, zone: "Zone 5/6 (Cold / Very Cold)" };
    if (prefix >= 150 && prefix <= 196) return { state: "Pennsylvania", mult: 1.05, zone: "Zone 5 (Cold)" };
    if (prefix >= 430 && prefix <= 459) return { state: "Ohio", mult: 0.97, zone: "Zone 5 (Cold / Great Lakes)" };
    if (prefix >= 480 && prefix <= 499) return { state: "Michigan", mult: 1.06, zone: "Zone 5/6 (Cold & Heavy Snow)" };
    
    // Regional Fallbacks
    if (prefix < 100) return { state: "Northeast US", mult: 1.22, zone: "Cold Region" };
    if (prefix >= 970 && prefix <= 999) return { state: "Pacific Northwest", mult: 1.18, zone: "Marine / Moderate" };
    if (prefix >= 800 && prefix <= 849) return { state: "Mountain West", mult: 1.08, zone: "Semi-Arid / Cold" };
    if (prefix >= 600 && prefix <= 699) return { state: "Midwest US", mult: 1.05, zone: "Cold / Humid" };
    if (prefix >= 700 && prefix <= 749) return { state: "South Central", mult: 0.96, zone: "Hot-Humid" };
    
    return { state: "US National Average", mult: 1.0, zone: "Moderate Zone" };
  }

  function getTonnage(sqft) {
    if (sqft <= 1000) return { tons: 1.5, btu: 18000 };
    if (sqft <= 1400) return { tons: 2.0, btu: 24000 };
    if (sqft <= 1800) return { tons: 2.5, btu: 30000 };
    if (sqft <= 2300) return { tons: 3.0, btu: 36000 };
    if (sqft <= 2800) return { tons: 3.5, btu: 42000 };
    if (sqft <= 3400) return { tons: 4.0, btu: 48000 };
    return { tons: 5.0, btu: 60000 };
  }

  function formatCurrency(val) {
    return "$" + Math.round(val).toLocaleString("en-US");
  }

  function calculateHvacCost(options) {
    const { sqft, systemType, projectType, zip, age } = options;
    const region = getZipLaborMultiplier(zip);
    const sizing = getTonnage(sqft);
    
    // Base 3-ton equipment costs
    const baseEquipMap = {
      "central-ac": { low: 2300, high: 5800 },
      "gas-furnace": { low: 1500, high: 4400 },
      "full-split": { low: 3800, high: 9800 },
      "heat-pump": { low: 2900, high: 7900 },
      "mini-split-1": { low: 1200, high: 3400 },
      "mini-split-multi": { low: 4200, high: 10800 }
    };

    // Base installation labor
    const baseLaborMap = {
      "central-ac": { low: 1500, high: 3400 },
      "gas-furnace": { low: 1300, high: 3100 },
      "full-split": { low: 2700, high: 5600 },
      "heat-pump": { low: 1800, high: 4100 },
      "mini-split-1": { low: 1100, high: 2400 },
      "mini-split-multi": { low: 2700, high: 5900 }
    };

    const equipBase = baseEquipMap[systemType] || baseEquipMap["central-ac"];
    const laborBase = baseLaborMap[systemType] || baseLaborMap["central-ac"];

    // Sizing multiplier: 3 tons is baseline (1.0). Scale equipment by 12% per 0.5 ton
    const sizeMultiplier = 1 + (sizing.tons - 3.0) * 0.15;
    
    let equipLow = equipBase.low * sizeMultiplier;
    let equipHigh = equipBase.high * sizeMultiplier;

    let laborLow = laborBase.low * region.mult;
    let laborHigh = laborBase.high * region.mult;

    let ductLow = 0;
    let ductHigh = 0;

    // Scope adjustments
    if (projectType === "new-install") {
      // Adding new ductwork & high-voltage disconnect
      ductLow = Math.max(1800, sqft * 1.5) * region.mult;
      ductHigh = Math.max(3200, sqft * 3.2) * region.mult;
      laborLow *= 1.35;
      laborHigh *= 1.45;
    } else if (projectType === "major-repair") {
      // Major repair (compressor, heat exchanger, or blower motor overhaul)
      equipLow = 600;
      equipHigh = 2200;
      laborLow = 450 * region.mult;
      laborHigh = 1600 * region.mult;
      ductLow = 0;
      ductHigh = 0;
    }

    const totalLow = equipLow + laborLow + ductLow;
    const totalHigh = equipHigh + laborHigh + ductHigh;

    // Advisory note on system age & the "$5,000 Rule"
    let advisoryNote = "";
    if (age === "15+" && projectType === "major-repair") {
      advisoryNote = "Warning: For systems 15+ years old, repairs exceeding $500–$800 are rarely cost-effective. Industry standards (the $5,000 Rule: Age × Repair Cost) recommend full replacement.";
    } else if (age === "15+") {
      advisoryNote = "Your existing unit has exceeded the typical 12–15 year operational lifespan. Upgrading to a new SEER2 system will provide immediate 20–40% utility savings.";
    } else if (age === "< 5") {
      advisoryNote = "Your system is under 5 years old and likely covered under the manufacturer 10-year parts warranty. Always confirm warranty registration before paying out-of-pocket.";
    } else {
      advisoryNote = "Mid-lifespan system (5–14 years). Minor repairs (<$1,000) are typically recommended over premature replacement unless compressor failure occurs.";
    }

    return {
      totalLow,
      totalHigh,
      equipAvg: (equipLow + equipHigh) / 2,
      laborAvg: (laborLow + laborHigh) / 2,
      ductAvg: (ductLow + ductHigh) / 2,
      sizing,
      region,
      advisoryNote
    };
  }

  function initCalculator() {
    const calcForm = document.getElementById("hvac-calc-form");
    if (!calcForm) return;

    const sqftRange = document.getElementById("calc-sqft-range");
    const sqftNumber = document.getElementById("calc-sqft-number");
    const zipInput = document.getElementById("calc-zip");
    const systemSelect = document.getElementById("calc-system");
    const projectSelect = document.getElementById("calc-project");
    const ageSelect = document.getElementById("calc-age");

    const resultRange = document.getElementById("calc-result-range");
    const barEquip = document.getElementById("bar-equip");
    const barLabor = document.getElementById("bar-labor");
    const barPermits = document.getElementById("bar-permits");
    const legendEquip = document.getElementById("legend-equip-val");
    const legendLabor = document.getElementById("legend-labor-val");
    const legendDuct = document.getElementById("legend-duct-val");

    const pillRegion = document.getElementById("calc-pill-region");
    const pillTonnage = document.getElementById("calc-pill-tonnage");
    const pillZone = document.getElementById("calc-pill-zone");
    const advisoryBox = document.getElementById("calc-advisory");

    function update(source) {
      let sqft = 1800;
      if (source === "number" && sqftNumber) {
        sqft = parseInt(sqftNumber.value, 10) || 1800;
        if (sqftRange) sqftRange.value = Math.min(Math.max(sqft, 600), 4500);
      } else if (sqftRange) {
        sqft = parseInt(sqftRange.value, 10) || 1800;
        if (sqftNumber && sqftNumber.value != sqft) {
          sqftNumber.value = sqft;
        }
      }

      const zip = zipInput ? zipInput.value.trim() : "";
      const systemType = systemSelect ? systemSelect.value : "full-split";
      const projectType = projectSelect ? projectSelect.value : "replacement";
      const age = ageSelect ? ageSelect.value : "10-15";

      const res = calculateHvacCost({ sqft, systemType, projectType, zip, age });

      // Update Result text
      if (resultRange) {
        resultRange.textContent = `${formatCurrency(res.totalLow)} – ${formatCurrency(res.totalHigh)}`;
      }

      // Proportional bar
      const totalAvg = res.equipAvg + res.laborAvg + res.ductAvg;
      const pctEquip = Math.round((res.equipAvg / totalAvg) * 100);
      const pctLabor = Math.round((res.laborAvg / totalAvg) * 100);
      const pctDuct = 100 - pctEquip - pctLabor;

      if (barEquip) barEquip.style.width = pctEquip + "%";
      if (barLabor) barLabor.style.width = pctLabor + "%";
      if (barPermits) barPermits.style.width = pctDuct + "%";

      if (legendEquip) legendEquip.textContent = `Equipment: ${pctEquip}% (${formatCurrency(res.equipAvg)})`;
      if (legendLabor) legendLabor.textContent = `Labor & Permits: ${pctLabor}% (${formatCurrency(res.laborAvg)})`;
      if (legendDuct) {
        legendDuct.textContent = projectType === "new-install"
          ? `Ductwork: ${pctDuct}% (${formatCurrency(res.ductAvg)})`
          : `Misc / Ancillaries: ${pctDuct}% (${formatCurrency(res.ductAvg)})`;
      }

      // Factor pills
      if (pillRegion) pillRegion.textContent = `Location: ${res.region.state} (${res.region.mult >= 1 ? "+" : ""}${Math.round((res.region.mult - 1) * 100)}% labor)`;
      if (pillTonnage) pillTonnage.textContent = `Est. Capacity: ${res.sizing.tons} Tons (${res.sizing.btu.toLocaleString()} BTU)`;
      if (pillZone) pillZone.textContent = `Climate: ${res.region.zone}`;

      if (advisoryBox) {
        advisoryBox.textContent = res.advisoryNote;
      }
    }

    if (sqftRange) {
      sqftRange.addEventListener("input", function () {
        update("range");
      });
    }

    if (sqftNumber) {
      sqftNumber.addEventListener("input", function () {
        update("number");
      });
    }

    [zipInput, systemSelect, projectSelect, ageSelect].forEach(function (el) {
      if (el) {
        el.addEventListener("input", update);
        el.addEventListener("change", update);
      }
    });

    // Run initial calculation
    update();
  }

  // Bind to DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCalculator);
  } else {
    initCalculator();
  }

  // Export for page usage
  window.calculateHvacCost = calculateHvacCost;
})();
