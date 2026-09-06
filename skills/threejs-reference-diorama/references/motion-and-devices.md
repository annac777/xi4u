# Motion, seasonal simulation and device boundaries

Read the sections relevant to requested features; do not add this entire simulation to every reference-based scene.

## Interaction and viewport

Useful miniature defaults: left mouse/one finger rotates, right mouse/two fingers pans, wheel/pinch zooms. Enable screen-space pan and avoid overly tight target bounds. Set touch-action on the canvas so scene gestures do not fight page gestures. Keep buttons independently operable and keyboard accessible.

Test home framing, reset and interactive movement separately. Zooming naturally moves geometry beyond the screen: the defect to eliminate is an internal mask or a wrong canvas size, not normal viewport clipping.

On Safari, `viewport-fit=cover`, safe-area padding, html/body background and dynamic theme-color can make page edges visually consistent. They cannot force web content over the browser's own status/address bars. Do not claim that 100lvh, overflow:visible or an oversized canvas removes system clipping. Overscan can increase work, alter framing and break pointer coordinate assumptions. Use it only for an identified benefit and validate input mapping.

Treat large, small and dynamic viewport heights as distinct. Keep controls visible as browser bars change. Independent home-screen display requires appropriate app metadata/manifest and device testing; an optional requestFullscreen call is not evidence it works on a given iPhone.

## One source of time

Use a shared simulation time for sun/moon, props, weather and fauna. Keep animation pause and automatic clock pause distinct if both are exposed. Avoid accumulating hidden-tab elapsed time into a sudden jump.

Example pacing for a contemplative garden: 6 real minutes/day, 12 minutes/season. Make these configuration values, not assumptions about all projects.

Compute light direction and intensity continuously through sunrise and sunset. Reduce sun intensity and shadow visibility near the horizon. Weak moon fill can omit cast shadows; do not blend two strong contradictory directional shadows. Keep UI outside scene crossfades. When rendering snapshots for transitions, cancel or rebuild them on resize and dispose them after use.

## Seasonal state and weather

Represent seasonal/day-night props with an explicit state table. Derive visibility from state, rather than stacking independent toggles that leave old items visible. Closed room doors should also change the lighting that previously spilled outside.

Limit valid weather by season when appropriate: rain in warm seasons, snow in winter. Validate a weather selection when the season changes. Automatic weather should use weighted choices with a dwell time, and manual choices should persist for a defined interval. Do not reroll every frame. Spring-biased rain and winter-night-biased snow are optional artistic choices.

Use a shared smooth gust signal to move leaves, grass, hanging ornaments and falling particles. Particle launch anchors must follow the actual canopy. Snow accumulation can use bounded animated geometry or masks rather than expensive rigid-body simulation; label this as an artistic approximation. Cap accumulation and active falling chunks. Ice should preserve open water when partial freezing is intended.

## Animal paths

Use connected poses and paths with coherent heading. A landing curve should approach the destination with the final tangent already aligned; avoid forcing a 180-degree turn just before contact. Choose stable perch anchors on plausible branches. Inspect takeoff, cruise, approach and touchdown, not just one resting frame.

## Audio

If requested, use supplied or appropriately licensed tracks. An “enabled” toggle is not proof of playback. Call play within a user gesture when autoplay is blocked, handle rejection, and keep controls truthful. Do not promise unprompted audible autoplay. Test first interaction, mute/unmute, track end and background/resume. Do not add procedural sound effects merely because the scene has wind or rain.
