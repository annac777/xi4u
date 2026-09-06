# Acceptance checks

Select checks for features actually implemented. Use available browser tooling only within the task's permitted scope. If visual inspection is unavailable, provide a precise manual check rather than declaring a pass.

## Basic scene

- At the home view, dominant silhouettes, overlaps and negative spaces follow the reference brief.
- Orbit reveals plausible connected geometry, not only a front-facing illusion unless that was requested.
- Pan works in all intended directions; reset clears inertia and returns to the home pose.
- Canvas covers the intended webpage surface; no accidental ancestor mask clips it internally.
- Desktop, narrow portrait and short landscape layouts keep controls usable and subject centered.

## Pixel pipeline

- Compare native and pixel modes side by side at the same camera pose.
- Check physical cell size in CSS coordinates at DPR 1 and DPR 2.
- Resize and rotate the device; render targets, camera, outlines and particles remain aligned.
- Text remains sharp; foliage does not become a solid dark mass; fine particle effects remain visible.

## Optional simulation

- Sweep time across dawn/dusk and inspect shadow direction and intensity for jumps or double shadows.
- Switch season while raining/snowing; forbidden weather does not remain active.
- Verify the intended day/night object table, including lighting after doors close.
- Inspect an animal through its full motion, including head bends and final landing heading.
- Repeatedly toggle seasons and modes; geometry counts/memory should not grow without bound.
- Test sound before and after first interaction, not just the button's selected state.

## Shipping

Run the project's actual type/build checks, and relevant existing tests. Do not add tests that merely search for a CSS string as proof of a visual fix. For platform packages, inspect file entries and extensions, script/asset loading and restrictions before packaging. Do not include auth config, local environment files or unrequested reference assets.

Report three separate facts: what was implemented, what was tested and what remains unverified. A compilation pass does not establish mobile compatibility. An uploaded deployment does not establish that the production alias serves the new version yet. A documented feature is not proof it exists in source.
