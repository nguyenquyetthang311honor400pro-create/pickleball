# Sổ lúa Pickleball — GitHub Pages

## Upload the PWA

1. Extract the ZIP.
2. Upload **all files and folders inside the extracted directory** to the GitHub repository's Pages publishing branch, preserving the `pickleball/` project base path used by this app.
3. Wait for GitHub Pages to finish publishing, then open `https://nguyenquyetthang311honor400pro-create.github.io/pickleball/`.
4. The archive includes the static Google OAuth return page, privacy policy, app install files, and the Google Drive setup note.

## Google Drive sync

GitHub Pages hosts static frontend files only; the API routes and encrypted OAuth-token storage must also be published from the Sổ lúa WebDev project. Use `README-GOOGLE-DRIVE.md` for the required Google Cloud OAuth settings. The exact redirect URI is:

`https://nguyenquyetthang311honor400pro-create.github.io/pickleball/oauth/drive-callback.html`

Do not upload OAuth client secrets to this repository.
