# Jeremy Phone — isolated visual preview

This preview is based on the saved V5 archive. It is not a restoration of the current Vercel production deployment.

- New lock screen, iPhone frame and application styling.
- Local editor at `/studio/`: profile metrics, per-post likes, per-message timestamps, photos and content.
- All preview data uses separate browser storage. Cloud access is disabled for this build even if Supabase environment variables are present.
- Existing cloud collaboration code remains in the source as a reference. Two-person cloud editing and the production password service are not connected in this preview.
- Default scenery and instrumental audio are samples. No production user data is bundled.

Run `npm ci` and `npm run dev`. Build a static export with `npm run build`; deploy `out/`.

Validation: Next.js build and TypeScript checks; browser checks of save/reload, social metrics, message timestamps, Instagram navigation, photos and audio play/pause.
