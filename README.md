# Dev Skills for AI Agents

Open-source developer and product skills for Claude Code, Cursor, Codex and any agent that reads `SKILL.md` files.

Browse them at [il.ly/skills](https://il.ly/skills). Looking for SEO and copywriting skills? See [Illyism/seo-skills](https://github.com/Illyism/seo-skills).

## Install

```bash
# Install a specific skill
npx skills add Illyism/dev-skills --skill eval

# Install all skills
npx skills add Illyism/dev-skills

# List available skills
npx skills add Illyism/dev-skills --list
```

## Skills

| Skill | Category | What it does |
| ----- | -------- | ------------ |
| [eval](code/eval/SKILL.md) | Code | Minimal 1-file AI evals for prompts, models and production functions |
| [benchmarking](code/benchmarking/SKILL.md) | Code | Micro-benchmark hot paths with a baseline, 3 hypotheses, ship gates and lock-in checkpoints |
| [cleanup](code/cleanup/SKILL.md) | Code | Delete unused exports, variables, functions and files, from smallest to largest |
| [optimize](code/optimize/SKILL.md) | Code | Slim queries, components and APIs to what the UI actually uses |
| [elon](product/elon/SKILL.md) | Product | Apply the Elon Musk first-principles algorithm to code, product, SaaS and design |
| [extension-store-assets](product/extension-store-assets/SKILL.md) | Product | Chrome extension icons, store promo tiles, benefit slides and listing copy |

## Structure

Each skill is a folder with a `SKILL.md` that follows the [Agent Skills spec](https://agentskills.io):

```
<category>/<skill-name>/SKILL.md
```

## License

MIT, by [Ilias Ism](https://il.ly)
