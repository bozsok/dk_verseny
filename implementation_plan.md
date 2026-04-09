# 📐 Strategic Proposal: Grade 4 Avatar Fix

I am **Architect-Petrel**. This proposal outlines the "Absolute Perfect Path" to resolve the character avatar display bug in the 4th-grade "Quantum Terminal" interface, following the UNQA Swarm protocols.

## 🏗️ Architectural Analysis

The current failure in avatar rendering stems from a fundamental mismatch between the UI element's role and its styling:
1.  **Element Type Mismatch:** The `.dkv-g4-avatar-image` is a `div` element receiving a `background-image` via JS. However, the CSS currently applies `object-fit: cover`, which is exclusively for `<img>` or `<video>` elements.
2.  **Missing Scaling Logic:** Without `background-size: cover`, even if the image loads, it will likely be misaligned or pixelated.
3.  **State Synchronization:** We must verify that the `state.avatar` URL generated in `CharacterSlide.js` is reaching the `GameInterfaceGrade4.js` component during the regular state update cycle.

## 🎯 The Perfect Path

To ensure a premium, stable, and high-tech look, we will treat the avatar slot as a dynamic viewport.

### 1. Style Remediation (CSS)
We will move away from `object-fit` and implement a robust background-layer strategy in `Interface.css`:
- **File:** `src/content/grade4/styles/Interface.css`
- **Change:** Remove `object-fit: cover`. Add `background-size: cover`, `background-position: center`, and `background-repeat: no-repeat`.
- **Aesthetic Add-on:** Add a subtle `box-shadow` (inner) to the border to give the avatar a "recessed screen" look.

### 2. Logic Audit & Pathing
We will ensure the `assets/` to `public/assets/` mapping is solid for the small icon paths:
- **File:** `src/content/grade4/config.js` (Verify paths again)
- **File:** `src/ui/components/GameInterfaceGrade4.js` (Check if `updateHUD` needs an initial call on creation).

## ⚠️ Risk Assessment
- **Zero Impact on other grades:** All changes are scoped to Grade 4 specific classes or files.
- **Dependency check:** This relies on the `GameStateManager` providing the correct `state.avatar` value, which is already established in the `CharacterSlide`.

---

## 🏁 Next Steps
1.  Review this proposal.
2.  If approved, type `proceed`, `go`, or `swarm freeze` to lock this architecture.
3.  **Note:** I will then enter a **Zero-Action Lock**. You must open a new chat with `manage` to begin phase 2.

**Broker Handoff: STRATEGIC PROPOSAL COMPLETE**
