# Turning references into geometry

Before coding, write a short scene brief in the working project. It should answer:

- Which image determines composition? Which determines palette or detail?
- What are the three dominant silhouettes and their approximate relative sizes?
- Is the camera orthographic, weak-perspective or clearly perspective?
- What overlaps what? Which empty spaces make the scene readable?
- What surfaces and details are actually visible? What must be inferred for rotation?
- Which interactions and animations did the user request?

Do not describe everything in the image equally. Large proportions and occlusion order dominate resemblance. Match the view at a chosen home camera, then build plausible rear/side geometry for interaction. A single image cannot determine hidden construction exactly.

## Procedural object decomposition

Map visible forms to geometry families rather than one primitive per semantic object:

- House: foundation, posts, floor, roof planes, ridge, tile rows, eaves, frames and door panels.
- Tree: tapered curved trunk, structural limbs, secondary forks, fine twigs, clustered canopy masses.
- Shore: an irregular polygon with a thin edge, rocks at transitions, a water surface fitted to its banks.
- Grass: tapered curved blades with varied height, bend and grouping; avoid a uniform grid of vertical spikes.
- Props: enough profile, color and shadow to read at the default view before close-up detail.

Build tree branches as connected curves with overlapping joints and tapered ends. Avoid a flat cylinder cap at the top of a leafless trunk. Branch length alone does not create a fuller canopy: enlarge its occupied volume and add nested leaf clusters. Use instances for repeated foliage, with purposeful clusters and gaps rather than uniform random scatter.

Give each moving object an explicit parent and pivot. Keep a bird's head connected to its body throughout head motion; do not merely translate a detached sphere. Put resting objects on surfaces capable of supporting them.

Use deterministic seeds during refinement so unrelated rerenders do not move every detail. Define a small set of scene dimensions and anchor points instead of scattering magic coordinates across modules. Particle origins, lamps, animal rests and seasonal props should derive from those anchors.

## When references conflict

An illustration can supply style while a photo supplies structure. Do not merge conflicting camera projections literally. Choose one camera and explain the adaptation. When the user annotates an image, interpret arrows and outlines as requested changes to the scene, not final decorative geometry.

Avoid exporting logos, names or author details from a reference into a new work without a task reason. The goal is the user's chosen subject and visual direction, not an accidental duplicate of another project's identity.
