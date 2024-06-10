let folderSrc =  "lg"
function setImageSource() { 
    const screenWidth = window.innerWidth;
    if (screenWidth < 700) {
        console.log('vliza li tuka!?')
        folderSrc = 'sm';
    } else {
        console.log('asdf')
        folderSrc = 'lg';
    }
  }

// Call the function to set the image source initially
setImageSource();

// const Move = new Image();
// Move.src = '/static/'+folderSrc+'/move.png'

const bBishop = new Image();
bBishop.src = '/static/'+folderSrc+'/blackBishop.png';


const wBishop = new Image();
wBishop.src = '/static/'+folderSrc+'/whiteBishop.png';

const bKnight = new Image();
bKnight.src = '/static/'+folderSrc+'/blackKnight.png';

const wKnight = new Image();
wKnight.src = '/static/'+folderSrc+'/whiteKnight.png';


const bRook = new Image();
bRook.src = '/static/'+folderSrc+'/blackRook.png';

const wRook = new Image();
wRook.src = '/static/'+folderSrc+'/whiteRook.png';

const bKing = new Image();
bKing.src = '/static/'+folderSrc+'/blackKing.png';


const wKing = new Image(); 
wKing.src = '/static/'+folderSrc+'/whiteKing.png';


const bPawn = new Image();
bPawn.src = '/static/'+folderSrc+'/blackPawn.png';

const wPawn = new Image();
wPawn.src = '/static/'+folderSrc+'/whitePawn.png';

const bQueen = new Image();
bQueen.src = '/static/'+folderSrc+'/blackQueen.png';

const wQueen = new Image();
wQueen.src = '/static/'+folderSrc+'/whiteQueen.png';



const bPig = new Image();
bPig.src = '/static/'+folderSrc+'/blackPig.png';

const wPig = new Image();
wPig.src = '/static/'+folderSrc+'/whitePig.png';


const wClown = new Image();
wClown.src = '/static/'+folderSrc+'/whiteClown.png';

const bClown = new Image();
bClown.src = '/static/'+folderSrc+'/blackClown.png';

const wHat = new Image();
wHat.src = '/static/'+folderSrc+'/whiteHat.png';

const bHat = new Image();
bHat.src = '/static/'+folderSrc+'/blackHat.png';

const bHorse = new Image();
bHorse.src = '/static/'+folderSrc+'/blackHorse.png';

const wHorse = new Image();
wHorse.src = '/static/'+folderSrc+'/whiteHorse.png';

const wGhost = new Image();
wGhost.src = '/static/'+folderSrc+'/whiteGhost.png';

const bGhost = new Image();
bGhost.src = '/static/'+folderSrc+'/blackGhost.png';

const wRicar = new Image();
wRicar.src = '/static/'+folderSrc+'/whiteRicar.png';

const bRicar = new Image();
bRicar.src = '/static/'+folderSrc+'/blackRicar.png';




//
const bLadyBug = new Image();
bLadyBug.src = '/static/'+folderSrc+'/blackLadyBug.png';

const bSpider = new Image();
bSpider.src = '/static/'+folderSrc+'/blackSpider.png';

const bGoliathBug = new Image();
bGoliathBug.src = '/static/'+folderSrc+'/blackGoliathBug.png';

const bShroom = new Image();
bShroom.src = '/static/'+folderSrc+'/blackShroom.png';

const bAnt = new Image();
bAnt.src = '/static/'+folderSrc+'/blackAnt.png';

const bQueenBug = new Image();
bQueenBug.src = '/static/'+folderSrc+'/blackQueenBug.png';

const bBrainBug = new Image();
bBrainBug.src = '/static/'+folderSrc+'/blackBrainBug.png';

const wLadyBug = new Image();
wLadyBug.src = '/static/'+folderSrc+'/whiteLadyBug.png';

const wSpider = new Image();
wSpider.src = '/static/'+folderSrc+'/whiteSpider.png';

const wGoliathBug = new Image();
wGoliathBug.src = '/static/'+folderSrc+'/whiteGoliathBug.png';

const wShroom = new Image();
wShroom.src = '/static/'+folderSrc+'/whiteShroom.png';

const wAnt = new Image();
wAnt.src = '/static/'+folderSrc+'/whiteAnt.png';

const wBrainBug = new Image();
wBrainBug.src = '/static/'+folderSrc+'/whiteBrainBug.png'


const wQueenBug = new Image();
wQueenBug.src = '/static/'+folderSrc+'/whiteQueenBug.png';


//New pieces

const wSwordsmen = new Image();
wSwordsmen.src = '/static/'+folderSrc+'/whiteSwordsmen.png';

const bSwordsmen = new Image();
bSwordsmen.src = '/static/'+folderSrc+'/blackSwordsmen.png';

const wPlagueDoctor = new Image();
wPlagueDoctor.src = '/static/'+folderSrc+'/whitePlagueDoctor.png'

const bPlagueDoctor = new Image();
bPlagueDoctor.src = '/static/'+folderSrc+'/blackPlagueDoctor.png'

const wGeneral = new Image();
wGeneral.src = '/static/'+folderSrc+'/whiteGeneral.png'

const bGeneral = new Image();
bGeneral.src = '/static/'+folderSrc+'/blackGeneral.png'

const wStarMan = new Image();
wStarMan.src = '/static/'+folderSrc+'/whiteStarMan.png'

const bStarMan = new Image();
bStarMan.src = '/static/'+folderSrc+'/blackStarMan.png'

const bFencer = new Image();
bFencer.src = '/static/'+folderSrc+'/blackFencer.png'

const wFencer = new Image();
wFencer.src = '/static/'+folderSrc+'/whiteFencer.png'

const wKolba = new Image();
wKolba.src = '/static/'+folderSrc+'/whiteKolba.png'

const bKolba = new Image();
bKolba.src = '/static/'+folderSrc+'/blackKolba.png'

const wGargoyle = new Image();
wGargoyle.src = '/static/'+folderSrc+'/whiteGargoyle.png'

const bGargoyle = new Image();
bGargoyle.src = '/static/'+folderSrc+'/blackGargoyle.png'

const wNorthernKing = new Image();
wNorthernKing.src = '/static/'+folderSrc+'/whiteNorthernKing.png'

const bNorthernKing = new Image();
bNorthernKing.src = '/static/'+folderSrc+'/blackNorthernKing.png'


const wShield = new Image();
wShield.src = '/static/'+folderSrc+'/whiteShield.png'

const bShield = new Image();
bShield.src = '/static/'+folderSrc+'/blackShield.png'

const wPikeman = new Image();
wPikeman.src = '/static/'+folderSrc+'/whitePikeman.png'

const bPikeman = new Image();
bPikeman.src = '/static/'+folderSrc+'/blackPikeman.png'

const wDragon = new Image();
wDragon.src = '/static/'+folderSrc+'/whiteDragon.png'

const bDragon = new Image();
bDragon.src = '/static/'+folderSrc+'/blackDragon.png'

const wSleepingDragon = new Image();
wSleepingDragon.src = '/static/'+folderSrc+'/whiteSleepingDragon.png'

const bSleepingDragon = new Image();
bSleepingDragon.src = '/static/'+folderSrc+'/blackSleepingDragon.png'


//

const wCyborg = new Image();
wCyborg.src = '/static/'+folderSrc+'/whiteCyborg.png'

const bCyborg = new Image();
bCyborg.src = '/static/'+folderSrc+'/blackCyborg.png'

const wBootvessel = new Image();
wBootvessel.src = '/static/'+folderSrc+'/whiteBootvessel.png'

const bBootvessel = new Image();
bBootvessel.src = '/static/'+folderSrc+'/blackBootvessel.png'

const wCrystal = new Image();
wCrystal.src = '/static/'+folderSrc+'/whiteCrystal.png'

const bCrystal = new Image();
bCrystal.src = '/static/'+folderSrc+'/blackCrystal.png'


const wCrystalEmpowered = new Image();
wCrystalEmpowered.src = '/static/'+folderSrc+'/whiteCrystalEmpowered.png'

const bCrystalEmpowered = new Image();
bCrystalEmpowered.src = '/static/'+folderSrc+'/blackCrystalEmpowered.png'

const wExecutor = new Image();
wExecutor.src = '/static/'+folderSrc+'/whiteExecutor.png'

const bExecutor = new Image();
bExecutor.src = '/static/'+folderSrc+'/blackExecutor.png'

const bJuggernaut = new Image();
bJuggernaut.src = '/static/'+folderSrc+'/blackJuggernaut.png'

const wJuggernaut = new Image();
wJuggernaut.src = '/static/'+folderSrc+'/whiteJuggernaut.png'




const bBlindCat = new Image();
bBlindCat.src = '/static/'+folderSrc+'/blackBlindCat.png'

const wBlindCat = new Image();
wBlindCat.src = '/static/'+folderSrc+'/whiteBlindCat.png'

const bCuteCat = new Image();
bCuteCat.src = '/static/'+folderSrc+'/blackCuteCat.png'

const wCuteCat = new Image();
wCuteCat.src = '/static/'+folderSrc+'/whiteCuteCat.png'

const bElectricCat = new Image();
bElectricCat.src = '/static/'+folderSrc+'/blackElectricCat.png'

const wElectricCat = new Image();
wElectricCat.src = '/static/'+folderSrc+'/whiteElectricCat.png'


const bFatCat = new Image();
bFatCat.src = '/static/'+folderSrc+'/blackFatCat.png'

const wFatCat = new Image();
wFatCat.src = '/static/'+folderSrc+'/whiteFatCat.png'

const bLongCat = new Image();
bLongCat.src = '/static/'+folderSrc+'/blackLongCat.png'

const wLongCat = new Image();
wLongCat.src = '/static/'+folderSrc+'/whiteLongCat.png'

const bScaryCat = new Image();
bScaryCat.src = '/static/'+folderSrc+'/blackScaryCat.png'

const wScaryCat = new Image();
wScaryCat.src = '/static/'+folderSrc+'/whiteScaryCat.png'

function drawPiece(x, y, img, size) {
    if(size == undefined){
        size = 500
    }
    size = squareLength
    if(folderSrc === 'sm'){
        sizePiece = size*10
    }
    else{
        sizePiece = size;
    }
    console.log(sizePiece)
    switch (img) {
        case 'blackBishop.png':
            
            ctx.drawImage(bBishop, 0, 0, 500, 500, x * size, y * size, sizePiece, sizePiece);
            break;
        case 'dragonImage':
            ctx.drawImage(dragonImage, 0, 0, 500, 500, x * size, y * size, sizePiece, sizePiece);
            break;
        case 'whiteBishop.png':
            ctx.drawImage(wBishop, 0, 0, 500, 500, x * size, y * size, sizePiece, sizePiece);
            break;
        case 'blackKnight.png':
            ctx.drawImage(bKnight, 0, 0, 500, 500, x * size, y * size, sizePiece, sizePiece);
            break;
        case 'whiteKnight.png':
            wKnight.width = size;
            wKnight.height = size;
            ctx.drawImage(wKnight, 0, 0, 500, 500, x * size, y * size, sizePiece, sizePiece);
            break;
        case 'blackRook.png':
            ctx.drawImage(bRook, 0, 0, 500, 500, x * size, y * size, sizePiece, sizePiece);
            break;
        case 'whiteRook.png':
            ctx.drawImage(wRook, 0, 0, 500, 500, x * size, y * size, sizePiece, sizePiece);
            break;
        case 'blackPawn.png':
            ctx.drawImage(bPawn, 0, 0, 500, 500, x * size, y * size, sizePiece, sizePiece);
            break;
        case 'whitePawn.png':
            ctx.drawImage(wPawn, 0, 0, 500, 500, x * size, y * size, sizePiece, sizePiece);
            break;
        case 'blackQueen.png':
            ctx.drawImage(bQueen, 0, 0, 500, 500, x * size, y * size, sizePiece, sizePiece);
            break;
        case 'whiteQueen.png':
            ctx.drawImage(wQueen, 0, 0, 500, 500, x * size, y * size, sizePiece, sizePiece);
            break;
        case 'blackKing.png':
            ctx.drawImage(bKing, 0, 0, 500, 500, x * size, y * size, sizePiece, sizePiece);
            break;
        case 'whiteKing.png':
            ctx.drawImage(wKing, 0, 0, 500, 500, x * size, y * size, sizePiece, sizePiece);
            break;
        case 'blackPig.png':
            ctx.drawImage(bPig, 0, 0, 500, 500, x * size, y * size, sizePiece, sizePiece);
            break;
        case 'whitePig.png':
            ctx.drawImage(wPig, 0, 0, 500, 500, x * size, y * size, sizePiece, sizePiece);
            break;
        case 'blackHorse.png':
            ctx.drawImage(bHorse, 0, 0, 500, 500, x * size, y * size, sizePiece, sizePiece);
            break;
        case 'whiteHorse.png':
            ctx.drawImage(wHorse, 0, 0, 500, 500, x * size, y * size, sizePiece, sizePiece);
            break;
        case 'blackRicar.png':
            ctx.drawImage(bRicar, 0, 0, 500, 500, x * size, y * size, sizePiece, sizePiece);
            break;
        case 'whiteRicar.png':
            ctx.drawImage(wRicar, 0, 0, 500, 500, x * size, y * size, sizePiece, sizePiece);
            break;
        case 'blackPlagueDoctor.png':
            ctx.drawImage(bPlagueDoctor, 0, 0, 500, 500, x * size, y * size, sizePiece, sizePiece);
            break;
        case 'whitePlagueDoctor.png':
            ctx.drawImage(wPlagueDoctor, 0, 0, 500, 500, x * size, y * size, sizePiece, sizePiece);
            break;

        case 'blackStarMan.png':
            ctx.drawImage(bStarMan, 0, 0, 500, 500, x * size, y * size, sizePiece, sizePiece);
            break;
        case 'whiteStarMan.png':
            ctx.drawImage(wStarMan, 0, 0, 500, 500, x * size, y * size, sizePiece, sizePiece);
            break;
        case 'blackClown.png':
            ctx.drawImage(bClown, 0, 0, 500, 500, x * size, y * size, sizePiece, sizePiece);
            break;
        case 'whiteClown.png':
            ctx.drawImage(wClown, 0, 0, 500, 500, x * size, y * size, sizePiece, sizePiece);
            break;
        case 'blackGhost.png':
            ctx.drawImage(bGhost, 0, 0, 500, 500, x * size, y * size, sizePiece, sizePiece);
            break;
        case 'whiteGhost.png':
            ctx.drawImage(wGhost, 0, 0, 500, 500, x * size, y * size, sizePiece, sizePiece);
            break;
        case 'blackHat.png':
            ctx.drawImage(bHat, 0, 0, 500, 500, x * size, y * size, sizePiece, sizePiece);
            break;
        case 'whiteHat.png':
            ctx.drawImage(wHat, 0, 0, 500, 500, x * size, y * size, sizePiece, sizePiece);
            break;
        // 
        case 'blackAnt.png':
            ctx.drawImage(bAnt, 0, 0, 500, 500, x * size, y * size, sizePiece, sizePiece);
            break;
        case 'blackGoliathBug.png':
            ctx.drawImage(bGoliathBug, 0, 0, 500, 500, x * size, y * size, sizePiece, sizePiece);
            break;
        case 'blackLadyBug.png':
            ctx.drawImage(bLadyBug, 0, 0, 500, 500, x * size, y * size, sizePiece, sizePiece);
            break;
        case 'blackSpider.png':
            ctx.drawImage(bSpider, 0, 0, 500, 500, x * size, y * size, sizePiece, sizePiece);
            break;
        case 'blackQueenBug.png':
            ctx.drawImage(bQueenBug, 0, 0, 500, 500, x * size, y * size, sizePiece, sizePiece);
            break;
        case 'blackShroom.png':
            ctx.drawImage(bShroom, 0, 0, 500, 500, x * size, y * size, sizePiece, sizePiece);
            break;
        case 'blackBrainBug.png':
            ctx.drawImage(bBrainBug, 0, 0, 1500, 1500, x * size, y * size, sizePiece, sizePiece);
            break;

        case 'whiteAnt.png':
            ctx.drawImage(wAnt, 0, 0, 500, 500, x * size, y * size, sizePiece, sizePiece);
            break;
        case 'whiteGoliathBug.png':
            ctx.drawImage(wGoliathBug, 0, 0, 500, 500, x * size, y * size, sizePiece, sizePiece);
            break;
        case 'whiteLadyBug.png':
            ctx.drawImage(wLadyBug, 0, 0, 500, 500, x * size, y * size, sizePiece, sizePiece);
            break;
        case 'whiteSpider.png':
            ctx.drawImage(wSpider, 0, 0, 500, 500, x * size, y * size, sizePiece, sizePiece);
            break;
        case 'whiteQueenBug.png':
            ctx.drawImage(wQueenBug, 0, 0, 500, 500, x * size, y * size, sizePiece, sizePiece);
            break;
        case 'whiteShroom.png':
            ctx.drawImage(wShroom, 0, 0, 500, 500, x * size, y * size, sizePiece, sizePiece);
            break;
        case 'whiteBrainBug.png':
            ctx.drawImage(wBrainBug, 0, 0, 1500, 1500, x * size, y * size, sizePiece, sizePiece);
            break;
    

            //New
        case 'whiteSwordsmen.png':
            ctx.drawImage(wSwordsmen, 0, 0, 700, 700, x * size, y * size, sizePiece, sizePiece);
            break;
        case 'blackSwordsmen.png':
            ctx.drawImage(bSwordsmen, 0, 0, 700, 700, x * size, y * size, sizePiece, sizePiece);
            break;
        case 'whitePlagueDoctor.png':
            ctx.drawImage(wSwordsmen, 0, 0, 500, 500, x * size, y * size, sizePiece, sizePiece);
            break;
        case 'blackPlagueDoctor.png':
            ctx.drawImage(bSwordsmen, 0, 0, 500, 500, x * size, y * size, sizePiece, sizePiece);
            break;
        case 'whiteStarMan.png':
            ctx.drawImage(wStarMan, 0, 0, 500, 500, x * size, y * size, sizePiece, sizePiece);
            break;
        case 'blackStarMan.png':
            ctx.drawImage(bStarMan, 0, 0, 500, 500, x * size, y * size, sizePiece, sizePiece);
            break;

        case 'whiteKolba.png':
            ctx.drawImage(wKolba, 0, 0,1050, 1050, x * size, y * size, sizePiece, sizePiece);
            break;
        case 'blackKolba.png':
            ctx.drawImage(bKolba, 0, 0, 1050, 1050, x * size, y * size, sizePiece, sizePiece);
            break;

        case 'whiteGargoyle.png':
            ctx.drawImage(wGargoyle, 0, 0, 1400, 1400, x * size, y * size, sizePiece, sizePiece);
            break;
        case 'blackGargoyle.png':
            ctx.drawImage(bGargoyle, 0, 0, 1400, 1400, x * size, y * size, sizePiece, sizePiece);
            break;
            
        case 'whiteFencer.png':
            ctx.drawImage(wFencer, 0, 0, 700, 700, x * size, y * size, sizePiece, sizePiece);
            break;
        case 'blackFencer.png':
            ctx.drawImage(bFencer, 0, 0, 700, 700, x * size, y * size, sizePiece, sizePiece);
            break;

        case 'whiteNorthernKing.png':
            ctx.drawImage(wNorthernKing, 0, 0, 700, 700, x * size, y * size, sizePiece, sizePiece);
            break;
        case 'blackNorthernKing.png':
            ctx.drawImage(bNorthernKing, 0, 0, 700, 700, x * size, y * size, sizePiece, sizePiece);
            break;
        case 'whiteShield.png':
            ctx.drawImage(wShield, 0, 0, 700, 700, x * size, y * size, sizePiece, sizePiece);
            break;
        case 'blackShield.png':
            ctx.drawImage(bShield, 0, 0, 700, 700, x * size, y * size, sizePiece, sizePiece);
            break;
        case 'whitePikeman.png':
            ctx.drawImage(wPikeman, 0, 0, 800, 800, x * size, y * size, sizePiece, sizePiece);
            break;
        case 'blackPikeman.png':
            ctx.drawImage(bPikeman, 0, 0, 800, 800, x * size, y * size, sizePiece, sizePiece);
            break;

        case 'whiteGeneral.png':
            ctx.drawImage(wGeneral, 0, 0, 600, 600, x * size, y * size, sizePiece, sizePiece);
            break;
        case 'blackGeneral.png':
            ctx.drawImage(bGeneral, 0, 0, 600, 600, x * size, y * size, sizePiece, sizePiece);
            break;

        case 'whiteDragon.png':
            ctx.drawImage(wDragon, 0, 0, 600, 600, x * size, y * size, sizePiece, sizePiece);
            break;
        case 'blackDragon.png':
            ctx.drawImage(bDragon, 0, 0, 600, 600, x * size, y * size, sizePiece, sizePiece);
            break;
        case 'whiteSleepingDragon.png':
            ctx.drawImage(wSleepingDragon, 0, 0, 600, 600, x * size, y * size, sizePiece, sizePiece);
            break;
        case 'blackSleepingDragon.png':
            ctx.drawImage(bSleepingDragon, 0, 0, 600, 600, x * size, y * size, sizePiece, sizePiece);
            break;

        //
        case 'whiteCyborg.png':
            ctx.drawImage(wCyborg, 0, 0, 600, 600, x * size, y * size, sizePiece, sizePiece);
        break;
        case 'blackCyborg.png':
            ctx.drawImage(bCyborg, 0, 0, 600, 600, x * size, y * size, sizePiece, sizePiece);
        break;

        case 'whiteBootvessel.png':
            ctx.drawImage(wBootvessel, -40, -80, 600, 600, x * size, y * size, sizePiece, sizePiece);
        break;
        case 'blackBootvessel.png':
            ctx.drawImage(bBootvessel, -40, -80, 600, 600, x * size, y * size, sizePiece, sizePiece);
        break;

        case 'blackCrystal.png':
            ctx.drawImage(bCrystal, -40, -40, 600, 600, x * size, y * size, sizePiece, sizePiece);
        break;
        case 'whiteCrystal.png':
            ctx.drawImage(wCrystal, -40, -40, 600, 600, x * size, y * size, sizePiece, sizePiece);
        break;

        case 'blackCrystalEmpowered.png':
            ctx.drawImage(bCrystalEmpowered, -40, -40, 600, 600, x * size, y * size, sizePiece, sizePiece);
        break;
        case 'whiteCrystalEmpowered.png':
            ctx.drawImage(wCrystalEmpowered, -40, -40, 600, 600, x * size, y * size, sizePiece, sizePiece);
        break;

        case 'blackJuggernaut.png':
            ctx.drawImage(bJuggernaut, -70, -50, 600, 600, x * size, y * size, sizePiece, sizePiece);
        break;
        case 'whiteJuggernaut.png':
            ctx.drawImage(wJuggernaut, -70, -80, 600, 600, x * size, y * size, sizePiece, sizePiece);
        break;

        case 'blackExecutor.png':
            ctx.drawImage(bExecutor,-100, -100, 600, 600, x * size, y * size, sizePiece, sizePiece);
        break;
        case 'whiteExecutor.png':
            ctx.drawImage(wExecutor, -100, -100, 600, 600, x * size, y * size, sizePiece, sizePiece);
        break;


    
    case 'blackBlindCat.png':
        ctx.drawImage(bBlindCat, 0, 0, 1500, 1500, x * size, y * size, sizePiece, sizePiece);
    break;
    case 'whiteBlindCat.png':
        ctx.drawImage(wBlindCat, 0, 0, 1500, 1500, x * size, y * size, sizePiece, sizePiece);
    break;

    case 'blackCuteCat.png':
        ctx.drawImage(bCuteCat, 0, 80, 1400, 1400, x * size, y * size, sizePiece, sizePiece);
    break;
    case 'whiteCuteCat.png':
        ctx.drawImage(wCuteCat, 0, 80, 1400, 1400, x * size, y * size, sizePiece, sizePiece);
    break;

    case 'blackElectricCat.png':
        ctx.drawImage(bElectricCat,-100, -100, 1350, 1350, x * size, y * size, sizePiece, sizePiece);
    break;
    case 'whiteElectricCat.png':
        ctx.drawImage(wElectricCat, -100, -100, 1350, 1350, x * size, y * size, sizePiece, sizePiece);
    break;

    case 'blackFatCat.png':
        ctx.drawImage(bFatCat,0, 0, 1600, 1600, x * size, y * size, sizePiece, sizePiece);
    break;
    case 'whiteFatCat.png':
        ctx.drawImage(wFatCat, 0, 0, 1600, 1600, x * size, y * size, sizePiece, sizePiece);
    break;

    case 'blackLongCat.png':
        ctx.drawImage(bLongCat,-27, -10, 120, 120, x * size, y * size, sizePiece, sizePiece);
    break;
    case 'whiteLongCat.png':
        ctx.drawImage(wLongCat, -300, 0, 1250, 1250, x * size, y * size, sizePiece, sizePiece);
    break;

    case 'blackScaryCat.png':
        ctx.drawImage(bScaryCat,-100, -100, 1500, 1500, x * size, y * size, sizePiece, sizePiece);
    break;
    case 'whiteScaryCat.png':
        ctx.drawImage(wScaryCat, -100, -100, 1500, 1500, x * size, y * size, sizePiece, sizePiece);
    break;
    }
}