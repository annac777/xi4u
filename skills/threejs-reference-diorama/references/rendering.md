# Illustration and pixel rendering

## Camera and framing

An orthographic camera removes perspective scaling and suits miniature illustration; choose perspective when the reference depends on it. “Isometric” is not a requirement to use one exact angle. Tune azimuth and elevation against visible roof/floor proportions.

Fit the projected subject, not an axis-aligned world box with large imaginary corners. Sample visible persistent geometry, including instance transforms; omit weather, trails and transient effects. Project samples onto the camera right/up axes, measure their extent, and fit that extent to the initial composition area. Keep the reset silhouette horizontally aligned with the intended visual center, typically the control dock.

UI margins may guide the home pose; they must not shrink the renderer into a middle panel. Preserve user pan/zoom across routine resizes unless reset is intended. On reset, flush residual control damping so the view does not drift away immediately.

## Correct CSS pixel sampling

For a canvas displayed at W × H CSS pixels and a requested pixel cell p, render the pixel scene at approximately ceil(W/p) × ceil(H/p), then upscale using nearest-neighbor filtering. Keep the renderer's device-pixel ratio distinct from p. Verify a cell occupies about p CSS pixels on both DPR 1 and DPR 2 screens.

`image-rendering: pixelated` only controls scaling; it does not lower a full-resolution render by itself. In native mode, use normal resolution with a sensible DPR cap. Size every render target and resolution uniform on resize. Do not multiply a CSS-based pixel size by DPR twice.

Keep React/HTML labels sharp. Post-process only the scene. Prefer a small number of meaningful modes rather than several filters with barely distinguishable output.

## Color, outlines and light

Use controlled palettes and a small number of lighting bands if the reference suggests flat shading. Add subtle ordered dithering after color quantization. Dither should not become animated noise or cover every surface equally.

Derive fine outlines from depth/normal discontinuities or another suitable geometric method. Avoid turning every texture change into an outline. Thin grass, transparent glows and water ribbons may need exclusion. Native outlines should remain roughly one CSS pixel; pixel-mode outlines roughly one sample cell.

Apply restrained bloom only to genuinely luminous surfaces. Do not brighten an entire night scene to make lamps readable. Match each light source to the physical lamp anchor. Check shadow-map coverage: clipped shadows are different from clipped geometry.

Control transparency ordering for leaves, insects, rain and water. A shader-written screen-space rain width is more reliable than assuming line primitives respect a requested width on all devices. Tiny particles need a visible minimum size in pixel mode without making every insect oversized.

## Performance

Instance repeated leaves, grass and roof elements where beneficial. Reuse temporary vectors/matrices during animation. Cap expensive transparent layers and shadow-map sizes. Reuse or dispose seasonal geometry, targets, textures, listeners and animation loops. A seasonal toggle should not accumulate new GPU allocations indefinitely.
