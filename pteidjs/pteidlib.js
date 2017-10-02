var ref = require('ref');
var ffi = require('ffi');
var fs = require('fs');
var Enum = require('enum');
var StructType = require('ref-struct');
var ArrayType = require('ref-array');

//------- DEFINES -------

// PICTURE 
var PTEID_MAX_PICTURE_LEN = 14128
var PTEID_MAX_PICTURE_LEN_HEADER = 111
var PTEID_MAX_PICTUREH_LEN = (PTEID_MAX_PICTURE_LEN + PTEID_MAX_PICTURE_LEN_HEADER)
var PTEID_MAX_CBEFF_LEN = 34
var PTEID_MAX_FACRECH_LEN = 14
var PTEID_MAX_FACINFO_LEN = 20
var PTEID_MAX_IMAGEINFO_LEN = 12
var PTEID_MAX_IMAGEHEADER_LEN = (PTEID_MAX_CBEFF_LEN + PTEID_MAX_FACRECH_LEN + PTEID_MAX_FACINFO_LEN + PTEID_MAX_IMAGEINFO_LEN)

// ID
var PTEID_DELIVERY_ENTITY_LEN = 40
var PTEID_COUNTRY_LEN = 80
var PTEID_DOCUMENT_TYPE_LEN = 34
var PTEID_CARDNUMBER_LEN = 28
var PTEID_CARDNUMBER_PAN_LEN = 32
var PTEID_CARDVERSION_LEN = 16
var PTEID_DATE_LEN = 20
var PTEID_LOCALE_LEN = 60
var PTEID_NAME_LEN = 120
var PTEID_SEX_LEN = 2
var PTEID_NATIONALITY_LEN = 6
var PTEID_HEIGHT_LEN = 8
var PTEID_NUMBI_LEN = 18
var PTEID_NUMNIF_LEN = 18
var PTEID_NUMSS_LEN = 22
var PTEID_NUMSNS_LEN = 18
var PTEID_INDICATIONEV_LEN = 120
var PTEID_MRZ_LEN = 30

var PTEID_MAX_DELIVERY_ENTITY_LEN = PTEID_DELIVERY_ENTITY_LEN + 2
var PTEID_MAX_COUNTRY_LEN = PTEID_COUNTRY_LEN + 2
var PTEID_MAX_DOCUMENT_TYPE_LEN = PTEID_DOCUMENT_TYPE_LEN + 2
var PTEID_MAX_CARDNUMBER_LEN = PTEID_CARDNUMBER_LEN + 2
var PTEID_MAX_CARDNUMBER_PAN_LEN = PTEID_CARDNUMBER_PAN_LEN + 2
var PTEID_MAX_CARDVERSION_LEN = PTEID_CARDVERSION_LEN + 2
var PTEID_MAX_DATE_LEN = PTEID_DATE_LEN + 2
var PTEID_MAX_LOCALE_LEN = PTEID_LOCALE_LEN + 2
var PTEID_MAX_NAME_LEN = PTEID_NAME_LEN + 2
var PTEID_MAX_SEX_LEN = PTEID_SEX_LEN + 2
var PTEID_MAX_NATIONALITY_LEN = PTEID_NATIONALITY_LEN + 2
var PTEID_MAX_HEIGHT_LEN = PTEID_HEIGHT_LEN + 2
var PTEID_MAX_NUMBI_LEN = PTEID_NUMBI_LEN + 2
var PTEID_MAX_NUMNIF_LEN = PTEID_NUMNIF_LEN + 2 
var PTEID_MAX_NUMSS_LEN = PTEID_NUMSS_LEN + 2
var PTEID_MAX_NUMSNS_LEN = PTEID_NUMSNS_LEN + 2
var PTEID_MAX_INDICATIONEV_LEN = PTEID_INDICATIONEV_LEN + 2
var PTEID_MAX_MRZ_LEN = PTEID_MRZ_LEN + 2

// CERTIF
var PTEID_MAX_CERT_LEN = 2500;
var PTEID_MAX_CERT_LABEL_LEN = 256;
var PTEID_MAX_CERT_NUMBER = 10;


var PTEID_ADDR = ref.types.void
var PTEID_TokenInfo = ref.types.void
var PTEID_ID = ref.types.void
var PTEID_Pins = ref.types.void
var PTEID_RSAPublicKey = ref.types.void
var tAddressChangeState = ref.types.void
var tWebErrorCode = ref.types.void
var uchar = ref.types.uchar
var ulong = ref.types.ulong
var long = ref.types.long
var short = ref.types.short
var uint32 = ref.types.uint32
var typevoid = ref.types.void
var CString = ref.types.CString

var tCardType = ref.types.int

var csProxy = ref.types.CString
var uiPort = ref.types.uint32
var csUserName = ref.types.CString
var csPassword = ref.types.CString

var tProxyInfo = StructType({
	csProxy,
	uiPort,
	csUserName,
	csPassword
});

//------- PICTURE -------

var PTEID_PIC = StructType({
	'version' : short,
	'cbeff' : ArrayType('uchar', PTEID_MAX_CBEFF_LEN),
	'facialrechdr' : ArrayType('uchar' ,PTEID_MAX_FACRECH_LEN),
	'facialinfo' : ArrayType('uchar', PTEID_MAX_FACINFO_LEN),
	'imageinfo' : ArrayType('uchar', PTEID_MAX_IMAGEINFO_LEN),
	'picture' : ArrayType('uchar', PTEID_MAX_PICTUREH_LEN),
	'piclength' : ulong
});

var PTEID_PICPtr = ref.refType(PTEID_PIC);

//------- ID -------

var PTEID_ID = StructType({
	'deliveryEntity' : ArrayType('char', PTEID_MAX_DELIVERY_ENTITY_LEN),
	'country' : ArrayType('char', PTEID_MAX_COUNTRY_LEN),
	'documentType' : ArrayType('char', PTEID_MAX_DOCUMENT_TYPE_LEN),
	'cardNumber' : ArrayType('char', PTEID_MAX_CARDNUMBER_LEN),
	'cardNumberPAN' : ArrayType('char', PTEID_CARDNUMBER_PAN_LEN),
	'cardVersion' : ArrayType('char', PTEID_MAX_CARDVERSION_LEN),
	'deliveryDate' : ArrayType('char', PTEID_MAX_DATE_LEN),
	'locale' : ArrayType('char', PTEID_MAX_LOCALE_LEN),
	'validityDate' : ArrayType('char', PTEID_MAX_DATE_LEN),
	'name' : ArrayType('char', PTEID_MAX_NAME_LEN),
	'firstname' : ArrayType('char', PTEID_MAX_NAME_LEN),
	'sex' : ArrayType('char', PTEID_MAX_SEX_LEN),
	'nationality' : ArrayType('char', PTEID_MAX_NATIONALITY_LEN),
	'birthday' : ArrayType('char', PTEID_MAX_DATE_LEN),
	'height' : ArrayType('char', PTEID_MAX_HEIGHT_LEN),
	'numBI' : ArrayType('char', PTEID_MAX_NUMBI_LEN),
	'nameFather' : ArrayType('char', PTEID_MAX_NAME_LEN),
	'firstnameFather' : ArrayType('char', PTEID_MAX_NAME_LEN),
	'nameMother' : ArrayType('char', PTEID_MAX_NAME_LEN),
	'firstnameMother' : ArrayType('char', PTEID_MAX_NAME_LEN),
	'numNIF' : ArrayType('char', PTEID_MAX_NUMNIF_LEN),
	'numSS' : ArrayType('char', PTEID_MAX_NUMSS_LEN),
	'numSNS' : ArrayType('char', PTEID_MAX_NUMSNS_LEN),
	'notes' : ArrayType('char', PTEID_MAX_INDICATIONEV_LEN),
	'mrz1' : ArrayType('char', PTEID_MAX_MRZ_LEN),
	'mrz2' : ArrayType('char', PTEID_MAX_MRZ_LEN),
	'mrz3' : ArrayType('char', PTEID_MAX_MRZ_LEN)
});

var PTEID_IDPtr = ref.refType(PTEID_ID);

//------- CERTIFICATES -------

var PTEID_Certif = StructType({
	'certif' : ArrayType('uchar', PTEID_MAX_CERT_LEN),
	'certifLength' : long,
	'certifLabel' : ArrayType('char', PTEID_MAX_CERT_LABEL_LEN)
});

var PTEID_Certifs = StructType({
	'certificates' : ArrayType(PTEID_Certif, PTEID_MAX_CERT_NUMBER),
	'certificatesLength' : long
})

var PTEID_CertifsPtr = ref.refType(PTEID_Certifs);

//------- PTEID error codes -------

var returnPTEIDcode = new Enum({
	"PTEID_OK":0,
	"PTEID_E_BAD_PARAM":1,
	"PTEID_E_INTERNAL":2,
	"PTEID_E_INSUFFICIENT_BUFFER":3,
	"PTEID_E_KEYPAD_CANCELLED":4,
	"PTEID_E_KEYPAD_TIMEOUT":5,
	"PTEID_E_KEYPAD_PIN_MISMATCH":6,
	"PTEID_E_KEYPAD_MSG_TOO_LONG":7,
	"PTEID_E_INVALID_PIN_LENGTH":8,
	"PTEID_E_NOT_INITIALIZED":9,
	"PTEID_E_UNKNOWN":10
});

var returnPTEIDcodeMeaning = new Enum({
	"Function succeeded":0,
	"Invalid parameter":1,
	"An internal consistency check failed":2,
	"The data buffer to receive returned data is too small":3,
	"Input on pinpad cancelled":4,
	"Timeout returned from pinpad":5,
	"The two PINs didn't match":6,
	"Message too long on pinpad":7,
	"Invalid PIN length":8,
	"Library not initialized":9,
	"An internal error has been detected, but the source is unknown":10
})

var returnOpenSCcode = new Enum({
	//Reader operations
	"SC_ERROR_READER":-1100,
	"SC_ERROR_NO_READERS_FOUND":-1101,
	"SC_ERROR_SLOT_NOT_FOUND":-1102,
	"SC_ERROR_SLOT_ALREADY_CONNECTED":-1103,
	"SC_ERROR_CARD_NOT_PRESENT":-1104,
	"SC_ERROR_CARD_REMOVED":-1105,
	"SC_ERROR_CARD_RESET":-1106,
	"SC_ERROR_TRANSMIT_FAILED":-1107,
	"SC_ERROR_KEYPAD_TIMEOUT":-1108,
	"SC_ERROR_KEYPAD_CANCELLED":-1109,
	"SC_ERROR_KEYPAD_PIN_MISMATCH":-1110,
	"SC_ERROR_KEYPAD_MSG_TOO_LONG":-1111,
	"SC_ERROR_EVENT_TIMEOUT":-1112,
	"SC_ERROR_CARD_UNRESPONSIVE":-1113,
	"SC_ERROR_READER_DETACHED":-1114,
	"SC_ERROR_READER_REATTACHED":-1115,
	//Card operations or card related
	"SC_ERROR_CARD_CMD_FAILED":-1200,
	"SC_ERROR_FILE_NOT_FOUND":-1201,
	"SC_ERROR_RECORD_NOT_FOUND":-1202,
	"SC_ERROR_CLASS_NOT_SUPPORTED":-1203,
	"SC_ERROR_INS_NOT_SUPPORTED":-1204,
	"SC_ERROR_INCORRECT_PARAMETERS":-1205,
	"SC_ERROR_WRONG_LENGTH":-1206,
	"SC_ERROR_MEMORY_FAILURE":-1207,
	"SC_ERROR_NO_CARD_SUPPORT":-1208,
	"SC_ERROR_NOT_ALLOWED":-1209,
	"SC_ERROR_INVALID_CARD":-1210,
	"SC_ERROR_SECURITY_STATUS_NOT_SATISFIED":-1211,
	"SC_ERROR_AUTH_METHOD_BLOCKED":-1212,
	"SC_ERROR_UNKNOWN_DATA_RECEIVED":-1213,
	"SC_ERROR_PIN_CODE_INCORRECT":-1214,
	"SC_ERROR_FILE_ALREADY_EXISTS":-1215,
	//Invalid Arguments for OpenSC
	"SC_ERROR_INVALID_ARGUMENTS":-1300,
	"SC_ERROR_CMD_TOO_SHORT":-1301,
	"SC_ERROR_CMD_TOO_LONG":-1302,
	"SC_ERROR_BUFFER_TOO_SMALL":-1303,
	"SC_ERROR_INVALID_PIN_LENGTH":-1304,
	//Internal operations from OpenSC lib
	"SC_ERROR_INTERNAL":-1400,
	"SC_ERROR_INVALID_ASN1_OBJECT":-1401,
	"SC_ERROR_ASN1_OBJECT_NOT_FOUND":-1402,
	"SC_ERROR_ASN1_END_OF_CONTENTS":-1403,
	"SC_ERROR_OUT_OF_MEMORY":-1404,
	"SC_ERROR_TOO_MANY_OBJECTS":-1405,
	"SC_ERROR_OBJECT_NOT_VALID":-1406,
	"SC_ERROR_OBJECT_NOT_FOUND":-1407,
	"SC_ERROR_NOT_SUPPORTED":-1408,
	"SC_ERROR_PASSPHRASE_REQUIRED":-1409,
	"SC_ERROR_EXTRACTABLE_KEY":-1410,
	"SC_ERROR_DECRYPT_FAILED":-1411,
	"SC_ERROR_WRONG_PADDING":-1412,
	"SC_ERROR_WRONG_CARD":-1413,
	//Related to PKCS15 init
	"SC_ERROR_PKCS15INIT":-1500,
	"SC_ERROR_SYNTAX_ERROR":-1501,
	"SC_ERROR_INCONSISTENT_PROFILE":-1502,
	"SC_ERROR_INCOMPATIBLE_KEY":-1503,
	"SC_ERROR_NO_DEFAULT_KEY":-1504,
	"SC_ERROR_ID_NOT_UNIQUE":-1505,
	"SC_ERROR_CANNOT_LOAD_KEY":-1506, //Documentation says 1006, probably wrong
	//Other errors
	"SC_ERROR_UNKNOWN":-1900,
	"SC_ERROR_PKCS15_APP_NOT_FOUND":-1901
})


codeCompare = function(code){
	if(returnPTEIDcode.get(code) != undefined)
		if(returnPTEIDcode.get(code) != 0){
			console.log(returnPTEIDcode.get(code).key);
			process.exit(console.log(returnPTEIDcodeMeaning.get(code).key));
		}
	
	if(returnOpenSCcode.get(code) != undefined)
		process.exit(console.log(returnOpenSCcode.get(code).value + " - " + returnOpenSCcode.get(code).key));
	
}




var libpteid = ffi.Library('libLinux/libpteid.so', {
	//Activates the card (= updates a specific file in the card)
	//If it has already been activated it returns SC_ERROR_NOT_ALLOWED
	//(pszPin, pucDate, ulMode)
	//pszPin - Activation Pin value
	//pucDate - current date DD MM YY in BCD format 4bytes
	//ulMode - MODE_ACTIVATE_BLOCK_PIN to block the activation Pin, or 0 for the inverse (should be used for tests only)
	'PTEID_Activate': [long, ['char', uchar, ulong]], //4.5.1

	//Final step of establishing a secure connection with a 0.7v card.
	//Sends to the card the "challenge" signed by the app to be authenticated
	//(pucSignedChallenge, iSignedChallengeLen)
	//pucSignedChallenge - "challenge" signed by the private key of the app CVC
	//iSignedChallengeLen - length of the signature, should be 128
	'PTEID_CVC_Authenticate': [long, [uchar, 'int']], //4.5.2

	//Final step of establishing a secure connection with a 1.0.1v card.
	//The card and the app are authenticated simultaneously using a symmetric key system
	//(ifdChallenge, ifdChallengeLen, ifdSerialNr, ifdSerialNrLen, iccSerialNr, iccSerialNrLen, keyIfd, keyIfdLen, encKey, encKeyLen, macKey, macKeyLen, ifdChallengeResp, ifdChallengeRespLen) 
	//ifdChallenge - "challenge" signed by the app derivated key
	//ifdChallengeLen - size of the signed "challenge", should be 48
	//ifdSerialNr - app serial number
	//ifdSerialNrLen - size of the serial number
	//iccSerialNr - card serial number
	//iccSerialNrLen - size of the serial number
	//keyIfd - secret kIFD key generated by the app
	//keyIfdLen -size of the secret key
	//encKey - derivated key that will be used to cipher
	//encKeyLen - size of the derivated key
	//macKey - derivated key to MAC
	//macKeyLen - size of the derivated key
	//ifdChallengeResp - OUTPUT; the answer of the card to the authentication request
	//ifdChallengeRespLen - size of the answer, should be atleast 48
	'PTEID_CVC_Authenticate_SM101': [long, [uchar, 'int', 'char', 'int', 'char', 'int', uchar, 'int', uchar, uint32, uchar, uint32, uchar, 'int']], //4.5.3

	
	'PTEID_CVC_GetAddr': [long, [PTEID_ADDR]],//4.5.4

	//First step of establishing a secure connection with a 1.0.1v card. Starts CVC authentication
	//(pucCert, iCertLen, pucChallenge, iChallengeLen)
	//pucCert - CVC from application
	//iCertLen - CVC length
	//pucChallenge - "challenge" that the card sends to the app to be signed
	//iChallengeLen - reserved size for the "challenge", atleast 128
	'PTEID_CVC_Init': [long, [uchar, 'int', uchar, 'int']],	//4.5.5
 	'PTEID_CVC_Init_SM101': [long, [uchar, 'int']], //4.5.6
 	'PTEID_CVC_R_DH_Auth': [long, [uchar, ulong, uchar, ulong, uchar, ulong, uchar, ulong]], //4.5.7
 	'PTEID_CVC_R_Init': [long, [uchar, ulong, uchar, ulong, uchar, ulong]], //4.5.8
 	'PTEID_CVC_R_ValidateSignature': [long, [uchar, ulong]], //4.5.9
 	'PTEID_CVC_ReadFile': [long, [uchar, 'int', uchar, ulong]], //4.5.10
 	'PTEID_CVC_WriteAddr': [long, [PTEID_ADDR]], //4.5.11
 	'PTEID_CVC_WriteFile': [long, [uchar, 'int', ulong, uchar, ulong, ulong]], //4.5.12
 	'PTEID_CVC_WriteSOD': [long, [ulong, uchar, ulong, ulong]], //4.5.13
 	'PTEID_CancelChangeAddress': [typevoid, []], //4.5.14
 	'PTEID_ChangeAddress': [long, ['string', 'string', ulong, tProxyInfo, 'string', 'string']], //4.5.15
 	'PTEID_ChangePIN': [long, ['string', 'string', 'string', long]], //4.5.16
 	'PTEID_Exit': [long, [ulong]], //4.5.17
 	'PTEID_GetAddr': [long, [PTEID_ADDR]], //4.5.18
 	'PTEID_GetCVCRoot': [long, [PTEID_RSAPublicKey]], //4.5.19
 	'PTEID_GetCardAuthenticationKey': [long, [PTEID_RSAPublicKey]], //4.5.20
	'PTEID_GetCardType': [tCardType, []], //4.5.21
	'PTEID_GetCertificates': [long, [PTEID_CertifsPtr]], //4.5.22
	'PTEID_SetSODChecking': [long, ['int']],
	'PTEID_GetChangeAddressProgress': [tAddressChangeState, []], //4.5.23
	'PTEID_GetID': [long, [PTEID_IDPtr]], //4.5.24
	'PTEID_GetLastWebErrorCode': [tWebErrorCode, []], //4.5.25
	'PTEID_GetLastWebErrorMessage': [CString, []], //4.5.26, CString?
	'PTEID_GetPINs': [long, [PTEID_Pins]], //4.5.27
	'PTEID_GetPic': [long, [PTEID_PICPtr]], //4.5.28
	'PTEID_GetTokenInfo': [long, [PTEID_TokenInfo]], //4.5.29
	'PTEID_Init': [long, ['string']], //4.5.30
	'PTEID_IsActivated': [long, [ulong]], //4.5.31
//	'PTEID_ReadFile': [,['string', 'int', 'string', ulong, 'string']], //4.5.32 void? not specified in documentation
	'PTEID_ReadSOD': [long, ['string', ulong]], //4.5.33
	'PTEID_SelectADF': [long, ['string', long]], //4.5.34
	'PTEID_SendAPDU': [long, ['string', ulong, 'string', ulong]], //4.5.35
//	'PTEID_SetChangeAddressCallback': [,[]], //4.5.36 to be done
	'PTEID_SetSODCAs': [long, [PTEID_Certifs]], //4.5.37
	'PTEID_SetSODChecking': [long, ['int']], //4.5.38
	'PTEID_UnblockPIN': [long, [uchar, 'string', 'string', long]], //4.5.39
	'PTEID_UnblockPIN_Ext': [long, [uchar, 'string', 'string', long, ulong]], //4.5.40
	'PTEID_VerifyPIN': [long, [uchar, 'string', long]], //4.5.41
	'PTEID_VerifyPIN_No_Alert': [long, [uchar, 'string', long]], //4.5.42
	'PTEID_WriteFile': [long, ['string', 'int', 'string', ulong, uchar]], //4.5.43
	'PTEID_WriteFile_inOffset': [long, ['string', 'int', 'string', ulong, ulong, uchar]] //4.5.44
});

exports.initPTEID = function(){
	codeCompare(libpteid.PTEID_Init("")); // Inicia, obrigatório
};

exports.setSODChecking = function(value){
	codeCompare(libpteid.PTEID_SetSODChecking(value)); // Desativa as verificações
};

exports.getCardType = function(){
	var cardType = libpteid.PTEID_GetCardType(); // Tipo de cartão

	switch(cardType){
		case 0 : console.log("Error with the card type (pteid.CARD_TYPE_ERR)"); break;
		case 1 : console.log("This card is pteid.CARD_TYPE_IAS07"); break;
		case 2 : console.log("This card is pteid.CARD_TYPE_IAS101"); break;
	};
};

exports.getPicture = function(){
	var pictureData = ref.alloc(PTEID_PIC);
	codeCompare(libpteid.PTEID_GetPic(pictureData));
	var picturefinal = pictureData.deref();
	var picFile = "/photos/photo.jp2"
	fs.writeFileSync(picFile,picturefinal.picture.buffer);
};

exports.getID = function(){
	var idData = ref.alloc(PTEID_ID);
	codeCompare(libpteid.PTEID_GetID(idData));
	var idfinal = idData.deref();
	/*
	console.log("Delivery Entity: " + idfinal.deliveryEntity.buffer.toString());
	console.log("Country: " + idfinal.country.buffer.toString())
	console.log("Name: " + idfinal.firstname.buffer.toString())
	*/
};

exports.getCertificates = function(){
	var certData = ref.alloc(PTEID_Certifs);
	codeCompare(libpteid.PTEID_GetCertificates(certData));
	var certfinal = certData.deref();
	//console.log(certfinal.certificates[5].certifLabel.buffer.toString());
};