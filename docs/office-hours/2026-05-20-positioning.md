# ELYS — Office Hours Design Doc (Positioning)

**Date:** 2026-05-20
**Mode:** Startup (YC diagnostic)
**Stage:** Pre-product (prototype live, no users)
**Branch:** claude/download-gestack-github-SvtSR

---

## Problem Statement

Connect any AI client (Claude, ChatGPT, Gemini, Mistral) to any web software that
lacks a usable API, by exposing it through a signed MCP URL the user pastes into
their AI. ELYS spawns/auths the session and drives the web app on the user's
behalf.

## Demand Evidence

**Validated (1 cluster):** Multiple French expert-comptable interlocutors asked
the founder whether AI could be connected to: **Pennylane**, **Cegid**, **Cegid
Quadra**, **Silae**. Same vertical, same 4 tools, recurring inbound. No specific
companies named, no payment, no behavioral commitment.

**Not validated:** Any segment outside FR expert-comptable. Founder cannot cite
a second cluster with comparable depth.

**Founder's personal need:** Stated but unspecified (which tool, which AI,
which task, what frequency — unknown).

**Verdict:** Interest (question-stage), not demand (commitment-stage). One real
vertical signal, flou on the persona.

## Status Quo

**Unknown.** Founder admitted no field observation of a collaborateur comptable
at work. Hypothesis: 4-8h/week of manual entry in Pennylane/Cegid despite
editors' native OCR. Not yet confirmed.

The status quo is the real competitor: Pennylane and Cegid already ship AI
features (OCR, pre-comptabilisation, lettrage suggestions). ELYS must justify
existence vs the editor's native AI.

## Target User & Narrowest Wedge

**Persona hypothesis (unconfirmed):** Collaborateur comptable in a French
cabinet, lives in Pennylane / Cegid daily, handles saisie / révision / lettrage.

**Wedge:** Not yet defined. Pending field observation. Candidate wedges:
1. PDF complexe → écriture Pennylane (cas que l'OCR natif rate)
2. Réponses conversationnelles aux clients sur leurs comptes
3. Croiser Pennylane + Silae sans export manuel

## Constraints

- ELYS marche sur les sites web drivables — pas les apps natives, pas les ERPs
  avec MFA hardware, probablement pas Silae (closed).
- La promesse "any AI to any software" est techniquement fausse au sens strict.

## Premises

**Founder's locked premise (after 2 rounds of pushback):** ELYS reste
**horizontal** — "any AI to any web software". Le signal comptable est traité
comme un cas d'usage parmi d'autres, pas comme un vertical de positionnement.

**Coach's dissent (recorded):** Le positionnement horizontal expose ELYS à
Anthropic Connectors, OpenAI Apps, Zapier MCP, Pipedream, Composio, Arcade,
n8n, et 50+ YC startups, sans avantage défendable. Le seul signal validé
(comptable FR) devient invisible. Le devoir n°1 (5 calls discovery) devient
impossible à cibler.

## Approaches Considered

### Approach A: Pure horizontal (founder's choice)
Landing actuelle inchangée. Signal comptable = un cas parmi d'autres.
- ✅ Optionalité max, ambition large
- ❌ Pas de wedge à vendre cette semaine
- ❌ Concurrence frontale avec géants gratuits

### Approach B: Vertical-first (coach's recommendation, refused)
Rebrand explicite vers cabinets FR. Pennylane/Cegid/Silae first-class.
- ✅ Joue sur le seul signal validé
- ✅ Défendable face aux américains qui n'iront pas sur Cegid Quadra / Silae
- ❌ TAM plus étroit, GTM par associations métier (lent)

### Approach C: Trojan horse (synthesis proposal)
Pitch publique horizontale (préserve l'ambition du fondateur), MAIS sur la
landing : 4 "deep starter packs" présentés en premier (Pennylane, Cegid, Silae,
+ 1 hors comptable). Le reste = catalogue générique.
- ✅ Réconcilie ambition horizontale et concentration du seul signal validé
- ✅ Donne un wedge actionnable cette semaine sans rebrand explicite
- ❌ Risque de paraître ni vertical ni horizontal vu de loin

### Approach D: Developer API (alternative à considérer plus tard)
Vendre ELYS comme infra/API aux autres builders d'apps IA, pas aux end-users.
- ✅ Évite le marketing end-user
- ❌ Marché B2D plus dur, moins de signal aujourd'hui

## Cross-Model Perspective

Non sollicitée dans cette session.

## Recommended Approach

**Coach recommends C (Trojan horse)** — respecte le choix horizontal du
fondateur tout en exploitant le seul signal validé. Si le fondateur refuse C,
A est sa décision assumée avec kill-switch ci-dessous.

## Kill-Switch (90 days)

**5 clients payants récurrents (mensuel), peu importe le secteur, sous 90 jours
à compter du 2026-05-20.**

Si non atteint au **2026-08-18** : pivot vertical comptable FR sans débat
supplémentaire.

## Assignment (this week, before any new code)

1. **Field discovery** — 5 calls de 20 min avec 5 collaborateurs comptables
   dans 3 cabinets différents. Observer leur écran, pas pitcher ELYS.
   - Question d'ouverture : "Qu'est-ce que tu as fait hier dans Pennylane /
     Cegid qui t'a pris plus de temps que ça aurait dû ?"
   - Noter mot-à-mot les phrases exactes.

2. **Personal-need précisé** — Le fondateur écrit en 3 lignes : quel logiciel
   précisément il voulait connecter à quelle IA pour quoi, et la dernière fois
   que cette douleur a coûté >30 min.

3. **No new product code** cette semaine. Que de la discovery + écriture
   landing.

4. **Landing update** — Même en gardant le pitch horizontal, ajouter une
   section "Logiciels first-class" listant Pennylane, Cegid, Cegid Quadra,
   Silae avec page dédiée par outil. C'est le seul signal validé, il doit être
   visible.

## Open Questions

- Q3 reste non répondue : persona observé, pas hypothétique. À résoudre cette
  semaine via les 5 calls.
- Q5 (Observation & Surprise) : skipée car pas d'observation à ce jour.
- Q6 (Future-Fit) : skipée car prématurée tant que persona non confirmé.
- Personal-need du fondateur : non spécifié (logiciel ? IA ? task ?).

---

## Session diagnostic summary

| Signal | État |
|---|---|
| Inbound interest | ✅ Réel mais non tracé |
| Vertical signal | ✅ Très serré (FR comptable, 4 logiciels nommés) |
| Persona observé | ❌ Non |
| Workflow précis qui souffre | ❌ Non |
| Quelqu'un qui a payé / s'engagé | ❌ Aucun |
| Falsifiable bet | ✅ 5 paying customers / 90 jours |
| Premise locked | ✅ Horizontal (against coach recommendation) |
