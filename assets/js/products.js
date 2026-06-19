/* =====================================================================
   Aesthetic Protocol — product recommendations for the Plan page.
   Data + renderer. Each plan card (matched by its action title) gets a
   collapsed "Recommended products" panel that rolls down on click.
   Prices are approximate EUR (June 2026); links go to official brand
   sites or EU/French pharmacies. Not medical advice.
   ===================================================================== */
(function () {
  "use strict";

  // m: small 1–5 ratings for the comparison bar-meters (s=strength/efficacy, g=gentleness, v=value)
  var DATA = {
    "Morning skincare": [
      {
        type: "Cleanser",
        premium: { name: "La Roche-Posay Toleriane Purifying Foaming Gel", price: "≈ €13–15", why: "Gentle gel for combination, sensitive skin — cleans without stripping.", actives: "LRP thermal water, glycerin; fragrance-free", caution: "", source: "laroche-posay.fr", url: "https://www.laroche-posay.fr", m: { s: 3, g: 5, v: 4 } },
        value: { name: "CeraVe Foaming Facial Cleanser", price: "≈ €10–13", why: "Barrier-friendly foaming cleanser for normal-to-oily skin.", actives: "Ceramides, niacinamide, hyaluronic acid", caution: "", source: "cerave.fr", url: "https://www.cerave.fr", m: { s: 3, g: 4, v: 5 } },
        compare: [["Form", "Foaming gel", "Foaming gel"], ["Key active", "Thermal water", "Ceramides + B3"], ["Best for", "Sensitive combo", "Barrier support"], ["Fragrance", "None", "None"]]
      },
      {
        type: "Vitamin C serum",
        premium: { name: "Medik8 C-Tetra", price: "≈ €42–47", why: "Stable, oil-soluble vitamin C — 96% of sensitive skins found it gentle.", actives: "Tetrahexyldecyl ascorbate, vitamin E", caution: "Oil-textured; apply before SPF.", source: "medik8.com", url: "https://www.medik8.com", m: { s: 4, g: 5, v: 4 } },
        value: { name: "The Ordinary Ascorbyl Tetraisopalmitate 20% (Vitamin F)", price: "≈ €16–19", why: "Mild oil-based vitamin C, well-tolerated by reactive skin.", actives: "THD ascorbate 20%, vitamin F", caution: "Oily finish; let it absorb.", source: "theordinary.com", url: "https://theordinary.com", m: { s: 3, g: 5, v: 5 } },
        compare: [["Form", "Gel-serum", "Oil"], ["C type", "THD ascorbate", "THD ascorbate"], ["Best for", "Brightening", "Sensitive starter"], ["Fragrance", "None", "None"]]
      },
      {
        type: "Moisturiser",
        premium: { name: "La Roche-Posay Toleriane Double Repair", price: "≈ €18–22", why: "Light daily moisturiser that rebuilds the barrier.", actives: "Ceramide-3, niacinamide, glycerin", caution: "", source: "laroche-posay.fr", url: "https://www.laroche-posay.fr", m: { s: 4, g: 5, v: 4 } },
        value: { name: "CeraVe Facial Moisturising Lotion", price: "≈ €12–14", why: "Lightweight, fragrance-free hydration for combination skin.", actives: "3 ceramides, hyaluronic acid", caution: "", source: "cerave.fr", url: "https://www.cerave.fr", m: { s: 3, g: 5, v: 5 } },
        compare: [["Texture", "Light cream", "Lotion"], ["Key active", "Ceramide + B3", "Ceramides + HA"], ["Best for", "Daily repair", "Everyday value"], ["Fragrance", "None", "None"]]
      },
      {
        type: "Sunscreen SPF 50",
        premium: { name: "LRP Anthelios UVMune 400 Oil Control SPF50+", price: "≈ €20–26", why: "Long-UVA protection, matte finish that suits oily T-zones.", actives: "UVMune 400 filter, silica; fragrance-free", caution: "Reapply across the day.", source: "laroche-posay.fr", url: "https://www.laroche-posay.fr", m: { s: 5, g: 4, v: 4 } },
        value: { name: "Avène Cleanance Solar SPF50+", price: "≈ €18–24", why: "Mattifying sunscreen made for oily, blemish-prone skin.", actives: "Sun filters, monolaurin (sebum control)", caution: "Light scent; patch-test if reactive.", source: "eau-thermale-avene.fr", url: "https://www.eau-thermale-avene.fr", m: { s: 4, g: 4, v: 4 } },
        compare: [["Finish", "Matte", "Matte"], ["Strength", "SPF50+ UVA+", "SPF50+"], ["Best for", "Oily T-zone", "Oily/acne-prone"], ["Fragrance", "None", "Slight"]]
      }
    ],
    "Evening skincare": [
      {
        type: "Retinoid",
        premium: { name: "Medik8 Crystal Retinal 1 (or 3)", price: "≈ €42–50", why: "Retinaldehyde works faster than retinol yet stays tolerable.", actives: "Retinaldehyde, hyaluronic acid, vitamin E", caution: "Start 2–3×/week, SPF next day. Avoid in pregnancy/breastfeeding.", source: "medik8.com", url: "https://www.medik8.com", m: { s: 5, g: 4, v: 4 } },
        value: { name: "The Ordinary Retinol 0.5% in Squalane", price: "≈ €8–12", why: "Simple, effective beginner retinol in a cushioning oil.", actives: "Retinol 0.5%, squalane", caution: "Introduce slowly; SPF next day. Avoid in pregnancy.", source: "theordinary.com", url: "https://theordinary.com", m: { s: 3, g: 4, v: 5 } },
        compare: [["Retinoid", "Retinal (strong)", "Retinol (mild)"], ["Extras", "HA + vit E", "Squalane"], ["Best for", "Faster results", "Gentle start"], ["Fragrance", "None", "None"]]
      },
      {
        type: "Night moisturiser",
        premium: { name: "Reuse your daytime moisturiser", price: "—", why: "No separate night cream needed — the same repair moisturiser works after retinol.", actives: "See morning moisturiser", caution: "", source: "—", url: "", m: { s: 3, g: 5, v: 5 } },
        value: { name: "CeraVe PM Facial Moisturising Lotion", price: "≈ €13", why: "If you want a dedicated PM option: light, niacinamide-rich.", actives: "Niacinamide, ceramides, HA", caution: "", source: "cerave.fr", url: "https://www.cerave.fr", m: { s: 3, g: 5, v: 5 } },
        compare: [["Texture", "—", "Light lotion"], ["Key active", "—", "Niacinamide"], ["Best for", "Simplicity", "PM hydration"], ["Fragrance", "—", "None"]]
      }
    ],
    "Eye care": [
      {
        type: "Eye serum",
        premium: { name: "La Roche-Posay Hyalu B5 Eyes", price: "≈ €26–30", why: "Hydrates the tear-trough and de-puffs with a cooling rollerball.", actives: "2× hyaluronic acid, caffeine, niacinamide", caution: "Avoid direct contact with the eye.", source: "laroche-posay.fr", url: "https://www.laroche-posay.fr", m: { s: 4, g: 5, v: 4 } },
        value: { name: "The Ordinary Caffeine Solution 5% + EGCG", price: "≈ €8–11", why: "Budget de-puffer with clinical caffeine for tired eyes.", actives: "Caffeine 5%, EGCG (green tea)", caution: "Patch-test; can pill if over-applied.", source: "theordinary.com", url: "https://theordinary.com", m: { s: 3, g: 4, v: 5 } },
        compare: [["Format", "Rollerball", "Dropper"], ["Key active", "HA + caffeine", "Caffeine + EGCG"], ["Best for", "Hydration + puff", "Puffiness/value"], ["Fragrance", "None", "None"]]
      }
    ],
    "Lip care": [
      {
        type: "Repair balm",
        premium: { name: "La Roche-Posay Cicaplast Lips B5", price: "≈ €6–9", why: "Repairing, non-greasy balm for dry or cracked lips.", actives: "Panthenol (B5), shea, madecassoside", caution: "", source: "laroche-posay.fr", url: "https://www.laroche-posay.fr", m: { s: 4, g: 5, v: 5 } },
        value: { name: "Avène Cold Cream Lip Cream", price: "≈ €4–6", why: "Simple soothing balm for sensitive lips.", actives: "Cold cream, glycerin", caution: "", source: "eau-thermale-avene.fr", url: "https://www.eau-thermale-avene.fr", m: { s: 3, g: 5, v: 5 } },
        compare: [["Texture", "Rich balm", "Cold cream"], ["Key active", "B5 + shea", "Cold cream"], ["Best for", "Repair", "Daily soothing"], ["Fragrance", "None", "None"]]
      },
      {
        type: "Lip sunscreen",
        premium: { name: "Uriage Bariésun Lipstick SPF30", price: "≈ €6–9", why: "High-protection lip stick for sun exposure days.", actives: "UVA/UVB filters, thermal water, shea", caution: "Reapply after eating/drinking.", source: "uriage.com", url: "https://www.uriage.com", m: { s: 4, g: 5, v: 5 } }
      }
    ],
    "Sleep & hydration": [
      {
        type: "Omega-3 (from the inside)",
        premium: { name: "Nordic Naturals Ultimate Omega", price: "≈ €30–40", why: "Reputable, third-party-tested fish oil; supports the skin barrier and general health.", actives: "EPA + DHA (high potency)", caution: "Optional, modest skin evidence. Ask a pharmacist; caution with blood thinners.", source: "nordic.com", url: "https://www.nordic.com/products/ultimate-omega/", m: { s: 3, g: 5, v: 4 } },
        value: { name: "Nutri&Co Oméga-3 (EPAX)", price: "≈ €20–28", why: "French brand, sustainably sourced EPAX oil at a friendlier price.", actives: "EPA + DHA, vitamin E", caution: "Optional supplement — not a treatment.", source: "nutriandco.com", url: "https://nutriandco.com", m: { s: 3, g: 5, v: 5 } },
        compare: [["Source", "Wild-caught", "EPAX certified"], ["Key", "EPA + DHA", "EPA + DHA"], ["Best for", "Proven brand", "Value/EU"], ["Note", "Ask pharmacist", "Ask pharmacist"]]
      },
      {
        type: "Vitamin D3",
        premium: { name: "Reputable EU vitamin D3 (e.g. Nutri&Co / Novoma)", price: "≈ €10–15", why: "Common deficiency in winter; supports immunity and skin.", actives: "Vitamin D3 (cholecalciferol)", caution: "Test your levels first; don't megadose. Ask a pharmacist/doctor.", source: "pharmacy / official", url: "https://nutriandco.com", m: { s: 3, g: 5, v: 5 } }
      }
    ],
    "Sea-salt styling": [
      {
        type: "Sea-salt spray",
        premium: { name: "Davines This Is A Sea Salt Spray", price: "≈ €22–26", why: "Matte, tousled texture for waves without the dry, crunchy feel.", actives: "Mineral salts, no oils", caution: "Salt is drying — follow with conditioner on wash days.", source: "davines.com", url: "https://www.davines.com", m: { s: 4, g: 4, v: 4 } },
        value: { name: "Schwarzkopf OSiS+ Beach Texture Salt Spray", price: "≈ €12–15", why: "Strong, gritty beachy texture at a salon-value price.", actives: "Sea salt complex", caution: "Stronger hold; can feel drier.", source: "salon retailers (EU)", url: "https://www.schwarzkopf-professional.com", m: { s: 4, g: 3, v: 5 } },
        compare: [["Finish", "Soft matte", "Gritty matte"], ["Hold", "Light–medium", "Medium"], ["Best for", "Natural wave", "Maximum texture"], ["Feel", "Non-drying", "Drier"]]
      }
    ],
    "Beard shaping": [
      {
        type: "Trimmer",
        premium: { name: "Philips OneBlade Pro 360", price: "≈ €75–90", why: "Best-in-class for clean jaw/neck lines plus an adjustable length comb.", actives: "Pivoting blade, 14-length dial", caution: "Trims close but isn't a full shave.", source: "philips.fr", url: "https://www.philips.fr", m: { s: 5, g: 5, v: 4 } },
        value: { name: "Philips OneBlade (face)", price: "≈ €25–35", why: "Same blade tech for precise edging at a fraction of the price.", actives: "Dual-sided blade, click-on combs", caution: "Fewer length settings.", source: "philips.fr", url: "https://www.philips.fr", m: { s: 4, g: 5, v: 5 } },
        compare: [["Edging", "Excellent", "Excellent"], ["Lengths", "Dial 0.4–10mm", "Fixed combs"], ["Best for", "Shape + fade", "Lines/value"], ["Wet use", "Yes", "Yes"]]
      },
      {
        type: "Beard care (optional)",
        premium: { name: "Horace Beard Oil", price: "≈ €15–19", why: "French men's-grooming oil that softens stubble and skin.", actives: "Jojoba, plant oils", caution: "Patch-test if fragrance-sensitive.", source: "horace.co", url: "https://horace.co", m: { s: 3, g: 4, v: 4 } }
      }
    ],
    "Eyebrow grooming": [
      {
        type: "Brow gel",
        premium: { name: "Benefit 24-HR Brow Setter (clear)", price: "≈ €25–28", why: "Strong, natural-looking hold to tidy and set brows all day.", actives: "Clear flexible-hold gel", caution: "", source: "benefitcosmetics.com", url: "https://www.benefitcosmetics.com/fr-fr", m: { s: 5, g: 5, v: 3 } },
        value: { name: "essence Make Me Brow / Clear Brow Gel", price: "≈ €3–6", why: "Drugstore clear gel that grooms brows discreetly.", actives: "Clear setting gel", caution: "Lighter hold.", source: "essence (EU drugstores)", url: "https://www.essence.eu", m: { s: 3, g: 5, v: 5 } },
        compare: [["Hold", "Strong 24h", "Light–medium"], ["Tint", "Clear", "Clear/tinted"], ["Best for", "All-day set", "Quick tidy"], ["Note", "—", "Tinted = density"]]
      }
    ],
    "Neck training": [
      {
        type: "Neck harness",
        premium: { name: "Gorilla Sports Head & Neck Trainer", price: "≈ €25–35", why: "Neoprene head harness + steel chain to add controlled resistance.", actives: "Velcro fixation, weight-plate chain", caution: "Start very light (2.5–5 kg), slow controlled reps. Skip if you have neck/cervical issues — ask a physio.", source: "gorillasports (EU)", url: "https://www.gorillasports.co.uk/products/neck-harness", m: { s: 4, g: 3, v: 4 } },
        value: { name: "Basic adjustable neck harness", price: "≈ €12–18", why: "Simple padded Velcro harness from EU sports retailers.", actives: "Padded strap, D-rings", caution: "Same safety rules — light weight, controlled tempo.", source: "EU sports retailers", url: "https://www.gorillasports.co.uk/products/neck-harness", m: { s: 3, g: 3, v: 5 } },
        compare: [["Build", "Neoprene + chain", "Padded strap"], ["Load", "Plates", "Plates/light"], ["Best for", "Progression", "Trying it out"], ["Safety", "Go light", "Go light"]]
      }
    ],
    "Neck skin care": [
      {
        type: "Approach",
        premium: { name: "Extend your face retinol + SPF onto the neck", price: "—", why: "No new product needed — take your PM retinol and morning SPF down onto the neck and sides.", actives: "See evening retinoid + morning SPF", caution: "Neck skin is thinner — use retinol less often there at first.", source: "—", url: "", m: { s: 3, g: 4, v: 5 } }
      }
    ],
    "Whitening eye drops": [
      {
        type: "Brightening drops",
        premium: { name: "Innoxa Gouttes Bleues", price: "≈ €8–12", why: "French-pharmacy classic; blue tint visually neutralises redness/yellow.", actives: "Plant extracts, blue colourant", caution: "Cosmetic only, used sparingly. Remove contact lenses; not for medical eye conditions.", source: "FR pharmacies", url: "https://www.cocooncenter.com", m: { s: 3, g: 4, v: 5 } },
        value: { name: "Preservative-free lubricating drops (artificial tears)", price: "≈ €6–10", why: "Safer everyday choice for genuinely tired, dry, screen-strained eyes.", actives: "Hyaluronate / hypromellose", caution: "Choose preservative-free; see a doctor for persistent redness.", source: "any pharmacy", url: "https://www.cocooncenter.com", m: { s: 2, g: 5, v: 5 } },
        compare: [["Effect", "Cosmetic brightening", "Soothes/hydrates"], ["Use", "Occasional", "As needed"], ["Best for", "Quick refresh", "Daily comfort"], ["Safety", "Sparingly", "Gentle"]]
      }
    ],
    "Colour-correcting concealer": [
      {
        type: "Peach corrector",
        premium: { name: "Clinique Even Better Colour Corrector – Peach", price: "≈ €28–32", why: "Refined, buildable peach tone to cancel under-eye shadow.", actives: "Peach colour-correct pigments", caution: "Apply minimally on the deepest shadow only.", source: "Boots / clinique.fr", url: "https://www.clinique.fr", m: { s: 4, g: 5, v: 3 } },
        value: { name: "Catrice / essence Peach Colour Corrector", price: "≈ €4–6", why: "Drugstore peach corrector that does the same job for less.", actives: "Peach-toned corrector", caution: "Blend well; a little goes far.", source: "EU drugstores", url: "https://www.essence.eu", m: { s: 3, g: 5, v: 5 } },
        compare: [["Coverage", "Buildable", "Light–medium"], ["Finish", "Natural", "Natural"], ["Best for", "Refined look", "Value"], ["Amount", "Tiny", "Tiny"]]
      }
    ],
    "Topical azelaic acid": [
      {
        type: "Azelaic acid",
        premium: { name: "Paula's Choice 10% Azelaic Acid Booster", price: "≈ €38–42", why: "Smooth, leave-on azelaic with calming extras for redness + tone.", actives: "Azelaic 10%, salicylic, liquorice", caution: "Can tingle; introduce slowly, not with other strong actives same time.", source: "paulaschoice.eu", url: "https://www.paulaschoice.eu", m: { s: 4, g: 4, v: 3 } },
        value: { name: "The Ordinary Azelaic Acid Suspension 10%", price: "≈ €10–13", why: "Effective fragrance-free azelaic at a fraction of the price.", actives: "Azelaic acid 10%", caution: "Can pill/tingle; apply to dry skin.", source: "theordinary.com", url: "https://theordinary.com", m: { s: 4, g: 4, v: 5 } },
        compare: [["Texture", "Smooth cream-gel", "Thicker suspension"], ["Extras", "Liquorice + BHA", "None"], ["Best for", "Comfort + tone", "Value"], ["Fragrance", "None", "None"]]
      }
    ]
  };

  /* ---- Rendering ----------------------------------------------------- */
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]; }); }

  function meterBar(v) {
    return '<span class="meter"><span class="meter__fill" style="width:' + (v / 5 * 100) + '%"></span></span>';
  }

  function productCard(p, tier) {
    if (!p) return "";
    var link = p.url
      ? '<a class="pcard__link" href="' + p.url + '" target="_blank" rel="noopener noreferrer">View at ' + esc(p.source) + ' <span aria-hidden="true">↗</span></a>'
      : '<span class="pcard__link pcard__link--none">No purchase needed</span>';
    return '<article class="pcard' + (tier === "premium" ? " pcard--premium" : "") + '">'
      + '<div class="pcard__top"><span class="pbadge pbadge--' + tier + '">' + (tier === "premium" ? "Premium pick" : "Smart value") + '</span><span class="pcard__price">' + esc(p.price) + '</span></div>'
      + '<h4 class="pcard__name">' + esc(p.name) + '</h4>'
      + '<p class="pcard__why">' + esc(p.why) + '</p>'
      + '<p class="pcard__key"><span>Key</span>' + esc(p.actives) + '</p>'
      + (p.caution ? '<p class="pcard__caution"><i class="caution-dot" aria-hidden="true"></i>' + esc(p.caution) + '</p>' : "")
      + link
      + '</article>';
  }

  function compareBlock(g) {
    if (!g.value) return "";
    var rows = (g.compare || []).map(function (r) {
      return '<tr><th scope="row">' + esc(r[0]) + '</th><td>' + esc(r[1]) + '</td><td>' + esc(r[2]) + '</td></tr>';
    }).join("");
    var axes = [["Strength", "s"], ["Gentleness", "g"], ["Value", "v"]];
    var meters = axes.map(function (a) {
      return '<div class="pmeter"><span class="pmeter__label">' + a[0] + '</span>'
        + '<span class="pmeter__row"><span class="pmeter__tag">P</span>' + meterBar(g.premium.m[a[1]]) + '</span>'
        + '<span class="pmeter__row"><span class="pmeter__tag">V</span>' + meterBar(g.value.m[a[1]]) + '</span></div>';
    }).join("");
    return '<div class="pcompare">'
      + '<table class="pcompare__table"><thead><tr><th></th><th>Premium</th><th>Value</th></tr></thead><tbody>' + rows + '</tbody></table>'
      + '<div class="pcompare__meters"><p class="pcompare__cap">P = premium · V = value</p>' + meters + '</div>'
      + '</div>';
  }

  function groupBlock(g) {
    return '<div class="pgroup">'
      + '<p class="pgroup__label">' + esc(g.type) + '</p>'
      + '<div class="pgrid">' + productCard(g.premium, "premium") + productCard(g.value, "value") + '</div>'
      + compareBlock(g)
      + '</div>';
  }

  function buildPanel(groups) {
    return groups.map(groupBlock).join("");
  }

  document.querySelectorAll(".action").forEach(function (action, i) {
    var titleEl = action.querySelector(".action__title");
    if (!titleEl) return;
    var title = titleEl.textContent.trim();
    var groups = DATA[title];
    if (!groups) return;

    var id = "prodpanel-" + i;
    var wrap = document.createElement("div");
    wrap.className = "prod";
    wrap.innerHTML =
      '<button class="prod__toggle" type="button" aria-expanded="false" aria-controls="' + id + '">'
      + '<span class="prod__toggle-label">Recommended products</span>'
      + '<span class="prod__chev" aria-hidden="true"></span>'
      + '</button>'
      + '<div class="prod__panel" id="' + id + '" hidden><div class="prod__inner">' + buildPanel(groups) + '</div></div>';
    action.appendChild(wrap);

    var btn = wrap.querySelector(".prod__toggle");
    var panel = wrap.querySelector(".prod__panel");

    function onlyMaxHeight(fn) {
      return function te(e) {
        if (e.target !== panel || e.propertyName !== "max-height") return;
        panel.removeEventListener("transitionend", te);
        fn();
      };
    }

    function setOpen(yes) {
      if (yes) {
        panel.hidden = false;
        btn.setAttribute("aria-expanded", "true");
        wrap.classList.add("is-open");
        panel.style.maxHeight = "0px";
        void panel.offsetWidth;                       // commit collapsed start
        panel.style.maxHeight = panel.scrollHeight + "px";
        panel.addEventListener("transitionend", onlyMaxHeight(function () { panel.style.maxHeight = "none"; }));
      } else {
        btn.setAttribute("aria-expanded", "false");
        wrap.classList.remove("is-open");
        panel.style.maxHeight = panel.scrollHeight + "px";
        void panel.offsetWidth;                       // commit current height before collapsing
        panel.style.maxHeight = "0px";
        panel.addEventListener("transitionend", onlyMaxHeight(function () { panel.hidden = true; panel.style.maxHeight = ""; }));
      }
    }

    btn.addEventListener("click", function () { setOpen(btn.getAttribute("aria-expanded") !== "true"); });
  });
})();
