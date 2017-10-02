var pteidl = require('./pteidlib.js');

pteidl.initPTEID(); // Initiates
pteidl.setSODChecking(false); // Disables verifications of the card 
pteidl.getCardType(); // Gets the card type
pteidl.getID(); // Gets the owner informations
pteidl.getPicture(); // Gets the owner picture
pteidl.getCertificates(); // Gets the card certificates