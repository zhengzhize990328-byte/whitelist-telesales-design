# Design QA

Status: **passed**

## Scope

- Angola agent App: existing Portuguese business version and Chinese explanation version retained.
- Bangladesh agent Web: Bengali business version and Chinese explanation version completed.
- Indonesia agent Web: Bahasa Indonesia business version and Chinese explanation version completed on the shared multi-country desk.
- Unified control center: Chinese cross-market allocation administration completed.
- Prototype hub: three product surfaces and PRD entry verified.

## Functional verification

- Bangladesh agent flow: assigned customer → call → end call → callback result → save → next assigned case.
- Indonesia agent flow: localized country profile, WIB time zone, +62 phone format, Rp currency, country switch, call, result, and release-request interactions.
- Multi-country follow-up flow: right-side pending/history tabs → overdue second-contact task → customer context → call result → automatic next-contact time → return to the workbench.
- Follow-up ownership: no-answer, busy-line, and scheduled-callback results create an original-agent protected task instead of entering the ordinary allocation queue.
- Agent restrictions: no pool browsing, case picking, or direct reassignment; release is request-only.
- Unified control: market switch, case center, release approval, same-market bulk transfer, protected-case warning, rule publishing, and audit trail.
- Market isolation: Angola, Bangladesh, and Indonesia cases remain in their country teams during normal allocation and transfer.
- Allocation rules: priority percentage sliders and weighted routing were removed; fixed eligibility checks, capacity control, and fair round-robin are shown instead.
- Console and page errors: 0 across nine validated pages and flows.

## Visual verification

- Compared with `direction-a.png` (Clear Operations).
- Preserved the dark navy navigation, white dense workspace, blue primary action, green success state, amber risk warning, and restrained operational layout.
- Bengali, Bahasa Indonesia, and Chinese explanation versions keep the same information hierarchy and interaction placement.
- The 318 px follow-up rail remains visible on desktop and stacks below the workbench on narrower screens.
- Screenshots saved in `prototype/screenshots/`.

## Result

The prototype is ready for stakeholder review. External publishing was not performed in this pass.
