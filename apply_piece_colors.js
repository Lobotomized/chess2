const fs = require('fs');

let file = 'lobby.html';
let content = fs.readFileSync(file, 'utf8');

// 1. Use the exact board and piece colors for the main container
content = content.replace(/\.container\s*\{[^}]+\}/, `.container {
            width: 95%;
            max-width: 1200px;
            margin-top: 40px;
            margin-bottom: 40px;
            display: grid;
            grid-template-columns: 1fr 1.5fr;
            gap: 30px;
            background: var(--board-light); /* Light square color */
            border: 4px solid var(--piece-black); /* Black piece color */
            border-radius: 12px;
            box-shadow: 0 12px 0px rgba(0,0,0,0.8);
            padding: 40px;
            position: relative;
        }`);

// 2. Use the dark square color for the inner panels
content = content.replace(/\.create-game\s*\{[^}]+\}/, `.create-game {
            background: var(--board-dark); /* Dark square color */
            padding: 30px;
            border-radius: 8px;
            box-sizing: border-box;
            border: 4px solid var(--piece-black);
            box-shadow: inset 0 0 15px rgba(0,0,0,0.4);
            display: flex;
            flex-direction: column;
        }`);

content = content.replace(/\.games-list\s*\{[^}]+\}/, `.games-list {
            background: var(--board-dark); /* Dark square color */
            padding: 30px;
            border-radius: 8px;
            min-height: 400px;
            border: 4px solid var(--piece-black);
            box-shadow: inset 0 0 15px rgba(0,0,0,0.4);
            display: flex;
            flex-direction: column;
        }`);

// 3. Headers: White piece text with Black piece outline/shadow
content = content.replace(/h2\s*\{[\s\S]*?text-shadow:[^;]+;/g, `h2 {
            font-family: 'Lilita One', cursive; font-weight: normal; letter-spacing: 2px;
            color: var(--piece-white);
            text-align: center;
            margin-bottom: 30px;
            margin-top: 0;
            font-size: 42px;
            -webkit-text-stroke: 2px var(--piece-black);
            text-shadow: 0px 6px 0px var(--piece-black);`);

// 4. Inputs: White piece background, Black piece text
content = content.replace(/\.create-game input, \.create-game select\s*\{[^}]+\}/, `.create-game input, .create-game select {
            width: 100%;
            padding: 15px;
            margin-bottom: 25px;
            background: var(--piece-white);
            border: 4px solid var(--piece-black);
            color: var(--piece-black); 
            font-family: 'Quicksand', sans-serif; font-weight: 900;
            font-size: 24px;
            box-sizing: border-box;
            border-radius: 8px;
            box-shadow: 0 4px 0px var(--piece-black);
            transition: all 0.1s ease;
        }`);

// 5. Labels: White piece text with Black piece shadow
content = content.replace(/\.create-game label\s*\{[^}]+\}/, `.create-game label {
            color: var(--piece-white);
            font-weight: 900;
            margin-bottom: 10px;
            display: block;
            font-size: 26px;
            font-family: 'Quicksand', sans-serif;
            -webkit-text-stroke: 1px var(--piece-black);
            text-shadow: 1px 2px 0px var(--piece-black);
        }`);

// 6. Buttons: Light square background, Black piece text
content = content.replace(/\.createButton\s*\{[^}]+\}/, `.createButton {
            font-family: 'Lilita One', cursive;
            width: 100%;
            padding: 15px;
            background: var(--board-light);
            color: var(--piece-black);
            border: 4px solid var(--piece-black);
            font-size: 28px;
            box-sizing: border-box;
            border-radius: 8px;
            text-transform: uppercase;
            letter-spacing: 1px;
            transition: all 0.1s ease;
            box-shadow: 0 6px 0px var(--piece-black);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            margin-top: 10px;
            cursor: pointer;
        }`);
content = content.replace(/\.createButton:hover\s*\{[^}]+\}/, `.createButton:hover {
            background: var(--piece-white);
            transform: translateY(4px);
            box-shadow: 0 2px 0px var(--piece-black);
        }`);

// 7. Lobby Games: Light square background, Black piece text/border
content = content.replace(/\.lobbyGame\s*\{[^}]+\}/, `.lobbyGame {
            background: var(--board-light);
            margin-bottom: 20px;
            padding: 20px;
            border: 4px solid var(--piece-black);
            border-radius: 8px;
            box-shadow: 0 6px 0px var(--piece-black);
            transition: all 0.1s ease;
            position: relative;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
        }`);
content = content.replace(/\.lobbyGame:hover\s*\{[^}]+\}/, `.lobbyGame:hover {
            transform: translateY(4px);
            box-shadow: 0 2px 0px var(--piece-black);
            background: var(--piece-white);
        }`);

// 8. Internal Game item text
content = content.replace(/\.linkHeader\s*\{[^}]+\}/, `.linkHeader {
            font-family: 'Lilita One', cursive; font-weight: normal; letter-spacing: 1px;
            font-size: 32px;
            color: var(--piece-black);
            text-decoration: none;
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            transition: color 0.2s ease;
        }`);
content = content.replace(/\.span\s*\{[^}]+\}/, `.span {
            display: block;
            color: var(--piece-black);
            font-size: 22px;
            margin-bottom: 15px;
            font-weight: 800;
        }`);

// 9. Start Game button inside lobby game item
content = content.replace(/\.startGame\s*\{[^}]+\}/, `.startGame {
            font-family: 'Lilita One', cursive;
            display: inline-flex;
            align-items: center;
            padding: 8px 20px;
            background: var(--board-dark);
            color: var(--piece-white);
            -webkit-text-stroke: 1px var(--piece-black);
            text-shadow: 0px 2px 0px var(--piece-black);
            text-decoration: none;
            font-size: 24px;
            border-radius: 8px;
            border: 4px solid var(--piece-black);
            box-shadow: 0 4px 0px var(--piece-black);
            transition: all 0.1s ease;
        }`);
content = content.replace(/\.startGame:hover\s*\{[^}]+\}/, `.startGame:hover {
            background: var(--highlight);
            transform: translateY(2px);
            box-shadow: 0 2px 0px var(--piece-black);
        }`);

// 10. Fix inline styles generated by JS
content = content.replace(/style="color: #f7e98e; font-weight: normal; padding-right: 15px; font-size: 28px; font-family: 'Lilita One', cursive; text-align: right;"/g, 'style="color: var(--piece-black); padding-right: 15px; font-size: 32px; font-family: \'Lilita One\', cursive; text-align: right;"');
content = content.replace(/<div style="color: #e4d8a5; text-align: center; font-family: 'Lilita One', cursive; margin-top: 50px; font-size: 32px;">\s*Loading games...\s*<\/div>/g, '<div style="color: var(--piece-white); -webkit-text-stroke: 2px var(--piece-black); text-shadow: 0px 4px 0px var(--piece-black); text-align: center; font-family: \'Lilita One\', cursive; margin-top: 50px; font-size: 36px;">Loading games...</div>');
content = content.replace(/<h3 style="color: #e4d8a5; text-align: center; font-family: 'Lilita One', cursive; margin-top: 50px; font-size: 32px;">(.*?)<\/h3>/g, '<h3 style="color: var(--piece-white); -webkit-text-stroke: 2px var(--piece-black); text-shadow: 0px 4px 0px var(--piece-black); text-align: center; font-family: \'Lilita One\', cursive; margin-top: 50px; font-size: 36px;">$1</h3>');


fs.writeFileSync(file, content);
console.log('Applied piece/board colors to lobby page');
