# Sổ lúa Pickleball — Google Drive sync setup

## What the integration does

- Each Google account gets its own Drive backup set. Devices connected to the **same** Google account use the same master JSON file; a different Google account sees a separate file/data set.
- Changes are sent after a short debounce while the app is open, and the app checks for changes when active and every 30 seconds while open. If the app was closed or offline, it catches up after you open it online again. This is not an OS background task while the app is closed.
- A master JSON file is visible in the account's Drive, plus a daily snapshot JSON. The snapshot for a date is updated on subsequent syncs that day; it is not a history of every edit.
- Refresh credentials are stored on the server encrypted with AES-256-GCM. Device session tokens are stored on the server as SHA-256 hashes and on the device in secure storage (web: browser storage). Drive contents themselves are ordinary readable JSON, by design.
- If the device and Drive both changed since the last sync, the app stops and asks which version to keep. It never silently merges or replaces one version. The choice **Giữ bản thiết bị** replaces the Drive master after a confirmation; **Dùng bản Drive** replaces that device's current local state. Export a manual JSON copy first if both versions contain edits you need.

## 1. Publish the project changes

1. Publish the latest WebDev project checkpoint so the API service has `/api/google-drive/connect`, `/api/google-drive/exchange`, `/api/google-drive/sync`, `/api/google-drive/status`, and `/api/google-drive/disconnect`.
2. Build the PWA using `pnpm build:web:pwa` and upload the contents of `dist-pwa/` to the repository's GitHub Pages publishing branch (keep the `pickleball` base path). The package includes `oauth/drive-callback.html` and `privacy.html`.
3. Confirm both pages are public:
   - `https://nguyenquyetthang311honor400pro-create.github.io/pickleball/oauth/drive-callback.html`
   - `https://nguyenquyetthang311honor400pro-create.github.io/pickleball/privacy.html`

## 2. Configure Google Cloud

1. In Google Cloud Console, select/create a project and enable **Google Drive API**.
2. Configure Google Auth Platform/OAuth consent screen. Add the public app home page `https://nguyenquyetthang311honor400pro-create.github.io/pickleball/`, privacy policy `https://nguyenquyetthang311honor400pro-create.github.io/pickleball/privacy.html`, and authorized domain `nguyenquyetthang311honor400pro-create.github.io`.
3. In Search Console, verify ownership of the GitHub Pages site (a URL-prefix property for `https://nguyenquyetthang311honor400pro-create.github.io/` can use the HTML verification file in the repo). Google requires authorized-domain ownership for branding/app verification. In testing mode, add the Google account that will connect as a test user.
4. Request only OpenID/email and Drive `drive.file` access. `drive.file` is scoped to files this app creates or opens; it is not full Drive access.
5. Create an OAuth client of type **Web application**:
   - Authorized JavaScript origin: `https://nguyenquyetthang311honor400pro-create.github.io`
   - Authorized redirect URI: `https://nguyenquyetthang311honor400pro-create.github.io/pickleball/oauth/drive-callback.html`
6. Store the resulting Client ID and Client Secret as server-side project secrets named `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`. Never put the Client Secret in the PWA or GitHub repository.
7. If the OAuth app remains External/Testing while requesting Drive scope, Google refresh tokens expire after **7 days**. For durable auto-backup, complete Google's consent-screen publication/verification flow. See Google's [refresh-token rules](https://developers.google.com/identity/protocols/oauth2#expiration) and [brand verification guidance](https://developers.google.com/identity/protocols/oauth2/production-readiness/brand-verification).

## 3. Use the app

1. Open the published app on the first device and select **Kết nối Google Drive**.
2. Sign in with the Google account whose Drive should hold this group's data, then approve the requested access.
3. On first connection, choose whether to use the existing Drive JSON or keep the current device's data. If the Drive file does not exist, the current device creates the initial master JSON.
4. Connect every additional device with the **same Google account** to synchronize the same data. Do not connect a different account if you expect it to show the same sổ.
5. Use **Đồng bộ ngay** to check on demand. For a conflict, export a local JSON copy before choosing either version if both contain unique edits.

Disconnecting one device revokes that device's session and leaves Drive files and other connected devices intact. Revoking app access through Google Account settings will stop refreshes; reconnect in the app to restore them.
