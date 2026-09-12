# MouseHunt Bulk Add Friends Userscript

A premium Tampermonkey-compatible userscript that allows you to bulk add friends in MouseHunt using their Hunter IDs.

## Features
- **Bulk Import**: Input multiple Hunter IDs separated by commas, spaces, or newlines.
- **Premium UI**: Modern dark theme design with glassmorphism backdrop-blur, clean gradients, and responsive animations.
- **Safety Delay**: Introduces an 800ms delay between actions to protect your account and respect game servers.
- **Smart Filtering**: Automatically checks relationship status before sending requests, avoiding duplicate requests if they are already your friends or have a pending request.
- **Live Logs**: Displays the profile picture, name, Hunter ID, and request status of each processed user.

## Preview of the Dialog UI
- Custom circular floating action button (FAB) at the bottom-right corner of the page.
- Sleek modern modal that opens with transition effects and handles imports smoothly.

## How to Install
1. Install a userscript manager such as [Tampermonkey](https://www.tampermonkey.net/) or [Violentmonkey](https://violentmonkey.github.io/) in your browser.
2. Create a new userscript and copy the contents of [`mh-add-friend.user.js`](file:///home/umarhasan/Git/mh-add-friend/mh-add-friend.user.js) into it.
3. Save the script.
4. Navigate to [MouseHunt](https://www.mousehuntgame.com/) and click the **Bulk Add Friends** floating action button in the bottom right corner of the page.

## Technologies Used
- Vanilla JS (ES6+) for logic
- CSS (Vanilla) for rich custom styling
- Google Fonts (Outfit & Inter) for typography
