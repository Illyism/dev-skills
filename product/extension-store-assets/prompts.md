# Prompt patterns

## Phase 1 — concept icons (1:1)

Generate 4–6 **unrelated** brand worlds. Each prompt = one visual direction, not a literal feature diagram.

```
Square app icon, rounded corners. [Brand name] brand: [palette]. [Metaphor/visual]. 
Minimal, beautiful, no text, no words. NOT purple dev-tool clipboard cliché unless requested.
```

Good directions: sticker pop, warm ink, aurora glass, memphis candy, magnet picker.

After generation: `preview.html` grid for comparison. User picks one → delete others.

## Phase 2 — brand guide (16:9)

Use picked icon as `input_reference`.

```
Brand guide design cheat sheet poster for [Product]. Match attached app icon style: [palette].
Landscape board: wordmark, color swatches with hex, typography samples, dark UI component mocks,
icon at 128px + 24px toolbar glyph, brand voice tags. Figma brand board — no people, no desk.
```

## Phase 3 — promo tiles

**Small (440×280):** compact wordmark + hero visual + short tagline. Readable at thumbnail size.

**Marquee (1400×560):** wide cinematic — headline left, hero visual right. No fake browser frame.

## Phase 3 — store slides (1280×800)

### Full-bleed prefix (every slide)

```
Promotional marketing slide for Chrome Web Store — concept illustration explaining a benefit.
NOT a literal app screenshot, browser window, or extension popup mockup.
Full-bleed edge-to-edge composition filling the entire 16:9 frame — background color/texture extends to all four edges.
Multi-column editorial layout that fills the frame width — NOT a small centered island on empty background.
Concrete UI widgets with realistic sample data (class names, code snippets, button labels) — not abstract icon rows alone.
Keep headlines and key UI cards inset ~5% from edges; decorative elements (glows, class pills, footer bars) may bleed off edges.
```

Append brand prompt prefix + match attached icon style for slides 1–5.

### Per-slide composition

| Slide | Layout | Must include |
|-------|--------|--------------|
| **1 Hero** | Headline top + 3 benefit columns below | Product wordmark, headline, three icon columns with short copy — fill vertical space; optional edge props bleeding off sides |
| **2 How it works** | 3-step horizontal flow + bottom footer bar | Numbered step cards connected by arrows/dots; footer bar **touching bottom edge** |
| **3 Benefit** | Headline left + copy right \| two contrasting cards center \| 3 icons bottom | Gray "before" card vs glowing "after" card; sample data strip; connector between cards |
| **4 Feature depth** | 3 columns: value prop \| UI widget \| comparison card | Left: headline + bullet features. Center: **concrete widget** (picker highlight, class output, copy button). Right: format comparison card. Texture **bleeding off left edge**; footer bar at bottom |
| **5 Compare/formats** | Headline top + two card panels + controls row + bottom banner | Side-by-side cards with contrasting headers (Tailwind vs CSS); sample class strings; toggle or export callout; decorative elements **bleeding off left/right edges** |

### Slide prompt examples (fictional tab-grouping extension)

**Slide 3 — benefit:**
```
[prefix]. Navy background to all edges. Headline left "Forty tabs, four groups" + supporting copy right. Two cards center: gray cluttered tab strip vs glowing tidy stack of grouped tab cards with colored labels (Work, Reading, Shopping). Three icon columns bottom: focus, memory saved, one-click restore.
```

**Slide 4 — feature:**
```
[prefix]. Amber glow off left edge, deep navy fills frame. Three columns: left value prop + feature bullets, center popup widget listing tab groups with counts and a "Save session" button, right before/after memory usage card. Amber footer bar touching bottom edge.
```

**Slide 5 — compare:**
```
[prefix]. Dark background with faint tab outlines bleeding off left/right edges. Headline "Your tabs. Your way." top. Two card panels: Auto-group by site vs Manual groups (sample group chips). Restore callout. Bottom tagline banner.
```

### Regenerate one slide

```bash
set -a && source .env && set +a && bun .cursor/skills/extension-store-assets/scripts/generate.ts \
  --config=public/store-assets/brand.config.json --phase=store --screenshots-only
```

Edit individual slide prompts in `brand.config.json` before re-running.
