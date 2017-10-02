var pcsc = require('pcsclite');
var fs = require('fs');
var Encoding = require('encoding');
var pcsc = pcsc();

pcsc.on('reader', function(reader) {
 
    console.log('New reader detected', reader.name);
 
    reader.on('error', function(err) {
        console.log('Error(', this.name, '):', err.message);
    });

    reader.on('status', function(status) {
        var bigBuf = Buffer.allocUnsafe(256*6);
        var photoBuf = Buffer.allocUnsafe(14239).fill('!');
        console.log('Status(', this.name, '):', status);
        /* check what has changed */

        //Comment the one you're not using
        //var appletoffset = 0x00;  //gemsafe
        var appletoffset = 0x01; //teste

        //var selectCard = 0x08; //gemsafe
        var selectCard = 0x09; //teste



        var changes = this.state ^ status.state;
        if (changes) {
            if ((changes & this.SCARD_STATE_EMPTY) && (status.state & this.SCARD_STATE_EMPTY)) {
                console.log("card removed");/* card removed */
                reader.disconnect(reader.SCARD_LEAVE_CARD, function(err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('Disconnected');
                    }
                });
            } else if ((changes & this.SCARD_STATE_PRESENT) && (status.state & this.SCARD_STATE_PRESENT)) {
                console.log("card inserted");/* card inserted */
                reader.connect({ share_mode : this.SCARD_SHARE_SHARED }, function(err, protocol) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('Protocol(', reader.name, '):', protocol);

                    function selectAppPromise(){
                        return new Promise(function(resolve, reject) {
                            SelectAppletApdu = new
                            Buffer( [0x00,  0xA4,  0x04, 0x00, 0x07, 0x60, 0x46, 0x32, 0xff, 0x00, appletoffset, 0x02] );
                            reader.transmit(SelectAppletApdu, 40, protocol, function (err, data) {
                                if(err){
                                    console.log(err);
                                    reject(err);
                                } else {
                                    console.log('Select Applet:',  data[data.length-2].toString(16), data[data.length-1].toString(16));
                                    resolve(data);
                                }
                            })
                        })
                    }

                    function selectIdPromise(){
                        return new Promise(function(resolve, reject) {
                            SelectFileApdu = new 
                            Buffer( [0x00,  0xA4,  0x00, 0x0C, 0x02, 0x2F, 0x00] );
                            reader.transmit(SelectFileApdu, 40, protocol, function (err, data) {
                                if(err){
                                    console.log(err);
                                    reject(err);
                                } else {
                                    console.log('Select ID:', data[data.length-2].toString(16), data[data.length-1].toString(16));                                    
                                    resolve(data);
                                }
                            })
                        })
                    }

                    function selectBinFilePromise(){
                        return new Promise(function(resolve, reject) {
                            SelectBinApdu = new 
                            Buffer([ 0x00,  0xA4,  selectCard,  0x0C,  0x04 , 0x5F,  0x00,  0xEF,  0x02])
                            //Buffer([ 0x00,  0xA4,  0x08,  0x0C,  0x04 , 0x5F,  0x00,  0xEF,  0x02])//gemsafe
                            //Buffer([ 0x00,  0xA4,  0x09,  0x0C,  0x04 , 0x5F,  0x00,  0xEF,  0x02])//teste
                            reader.transmit(SelectBinApdu, 2, protocol, function (err, data) {
                                if(err){
                                    console.log(err);
                                    reject(err);
                                } else {
                                    console.log('Select Bin File:', data[data.length-2].toString(16), data[data.length-1].toString(16));
                                    getBinPromise();
                                    resolve(data);
                                }
                            })
                        })
                    }

                    function getPhotoPromise() {
                        var foffset = 0x06;
                        var promises = [];
                        for(var i = 0; i < 70; i++) { //70 é um valor arbitrário superior ao necessário
                            promises.push(getPhotoChunkPromise);
                        }
                        promises.reduce((prevTask, current) => {
                            return prevTask.then(current);
                        }, Promise.resolve(foffset)).then(() => {
                            console.log(foffset);
                        }, Promise.reject(foffset)).catch(() => {
                            console.log("Photo obtained.");
                            fs.unlinkSync('data');
                        })
                    }

                    function getPhotoChunkPromise(offset) {
                        return new Promise(function (resolve, reject) {
                            GetBinApdu = new Buffer([
                                0x00,
                                0xB0,
                                offset,
                                0x00,
                                0x00
                            ]);
                            reader.transmit(GetBinApdu, 258, protocol, function (err, data) {
                                if (err) {
                                    console.log(err);
                                    reject(err);
                                } else {
                                    
                                    if(offset == 6){
                                        var PTEID_MAX_CBEFF_LEN = 34
                                        var PTEID_MAX_FACRECH_LEN = 14
                                        /*
                                        var cbeff = Buffer.allocUnsafe(34);
                                        data.copy(cbeff, 0, 0, 34);
                                        var facialrechdr = Buffer.allocUnsafe(14);
                                        data.copy(facialrechdr, 0, 34, 48);
                                        var facialinfo = Buffer.allocUnsafe(20);
                                        data.copy(facialinfo, 0, 48, 68);
                                        var imageinfo = Buffer.allocUnsafe(12);
                                        data.copy(imageinfo, 0, 68, 80);
                                        */
                                        var picturebuf = Buffer.allocUnsafe(209).fill(0);
                                        data.copy(picturebuf, 1, (PTEID_MAX_CBEFF_LEN + PTEID_MAX_FACRECH_LEN), data.length-1);
                                        picturebuf.copy(photoBuf, 0, 0, picturebuf.length);
                                        resolve(offset + 0x01);

                                    }
                                    
                                    else if(data[data.length-2]==144){
                                        fs.open('photo.jp2', "w+", function(err, fd){
                                            var stopParam = Buffer.from([255, 217])
                                            if(data.includes(stopParam)){
                                                data.copy(photoBuf, (209+(offset-7)*256), 0, data.indexOf(stopParam)+2);

                                                var bufferPhoto = Buffer.alloc(photoBuf.indexOf(stopParam)+2);
                                                photoBuf.copy(bufferPhoto, 0, 0, bufferPhoto.length);

                                                fs.writeFile(fd, bufferPhoto, function(err) {
                                                    if (err) throw 'Error writing photo file: ' + err;
                                                    fs.close(fd, function(err) {
                                                        if(err)
                                                            console.log(err);
                                                    })
                                                });
                                                reject();
                                            }

                                            else{
                                                data.copy(photoBuf, (209+(offset-7)*256), 0, data.length-1);
                                                resolve(offset + 0x01);
                                            }
                                             
                                        })

                                    }
                                    else if(data[data.length-2]==108){

                                        reader.transmit(GetBinApdu, (data[data.length-1]), protocol, function (err, data) {
                                            if (err) {
                                                console.log(err);
                                                reject(err);
                                            } else {
                                                fs.open('photo.jp2', "w+", function(err, fd){
                                                    data.copy(photoBuf, (209+(offset-7)*256), 0, data.length-1);
                                                    fs.writeFile(fd, photoBuf, function(err) {
                                                        if (err) throw 'Error writing photo file: ' + err;
                                                        fs.close(fd, function(err) {
                                                            if(err)
                                                                console.log(err);
                                                        })
                                                    });  
                                                })
                                            }
                                        })
                                        reject();
                                    }
                                    else{
                                        console.log("Something failed!");
                                        reject();
                                    }
                                }
                            })
                        })
                    }


                    function getBinPromise() {
                        var foffset = 0x00;
                        var promises = [];
                        for (var i = 0; i < 6; i++) {
                            promises.push(getBinChunkPromise);
                        }
                        promises.reduce((prevTask, current) => {
                            return prevTask.then(current);
                        }, Promise.resolve(foffset)).then(() => {
                            console.log('Personal info obtained.');
                            readUTF8().then(getPhotoPromise());
                        }, Promise.reject().catch(() => {
                            console.log('Obtaining personal info...')
                        }));
                    }

                    function getBinChunkPromise(offset) {
                        return new Promise(function (resolve, reject) {
                            GetBinApdu = new Buffer([
                                0x00,
                                0xB0,
                                offset,
                                0x00,
                                0x00
                            ]);
                            reader.transmit(GetBinApdu, 258, protocol, function (err, data) {
                                if (err) {
                                    console.log(err);
                                    reject(err);
                                } else {
                                    data.copy(bigBuf, (offset*256), 0, data.length-2);
                                    fs.open('data', "w+", function(err, fd){
                                        fs.write(fd, bigBuf, 0, bigBuf.length, 'binary', function(err) {
                                            if (err) throw 'error writing file: ' + err;
                                            fs.close(fd, function(err) {
                                                if(err)
                                                    console.log(err);
                                            })
                                        });  
                                    })                                 
                                    resolve(offset + 0x01);
                                }
                            })
                        })
                    }


                    function readUTF8(){
                        return new Promise(function (resolve, reject) {
                            fs.open('data', "r+", function(err, fd){
                                var buffer = Buffer.allocUnsafe(256*6); 
                                fs.read(fd, buffer, 0, buffer.length, 'binary', function(err, bytesRead, dataNative){
                                    if(err){
                                        console.log(err);
                                        reject(err);
                                    }

                                    var data = JSON.parse(JSON.stringify(dataNative.toString('binary',0,dataNative.length)));

                                    var entidadeEmissora = stringFromCard(data, 0);
                                    var pais = stringFromCard(data, 40);
                                    var tipoDocumento = stringFromCard(data, 120);
                                    var numeroDocumento = stringFromCard(data, 154);
                                    var PAN = stringFromCard(data, 182);
                                    var versaoCartao = stringFromCard(data, 214);
                                    var dataEmissao = stringFromCard(data, 230);
                                    var localPedido = stringFromCard(data, 250);
                                    var dataValidade = stringFromCard(data, 310);
                                    var apelido = stringFromCard(data, 330);
                                    var nome = stringFromCard(data, 449);
                                    var sexo = stringFromCard(data, 570);
                                    var nacionalidade = stringFromCard(data, 572);
                                    var dataNascimento = stringFromCard(data, 578);
                                    var altura = stringFromCard(data, 598);
                                    var nBI = stringFromCard(data, 606);
                                    var apelidoMae = stringFromCard(data, 624);
                                    var nomeMae = stringFromCard(data, 744);
                                    var apelidoPai = stringFromCard(data, 864);
                                    var nomePai = stringFromCard(data, 984);
                                    var nFiscal = stringFromCard(data, 1104);
                                    var nSegSocial = stringFromCard(data, 1122);
                                    var nSaude = stringFromCard(data, 1144);
                                    var indicacoesEventuais = stringFromCard(data, 1162);
                                    console.log("Entidade Emissora: " + entidadeEmissora);
                                    console.log("País: " + pais);
                                    console.log("Tipo de Documento: " + tipoDocumento);
                                    console.log("Número de Documento: " + numeroDocumento);
                                    console.log("PAN: " + PAN);
                                    console.log("Versão do Cartão: " + versaoCartao);
                                    console.log("Data de Emissão: " + dataEmissao);
                                    console.log("Local Pedido: " + localPedido);
                                    console.log("Data de Validade: " + dataValidade);
                                    console.log("Apelido: " + apelido);
                                    console.log("Nome: " + nome);
                                    console.log("Sexo: " + sexo);
                                    console.log("Nacionalidade: " + nacionalidade);
                                    console.log("Data de Nascimento: " + dataNascimento);
                                    console.log("Altura: " + altura);
                                    console.log("Número BI: " + nBI);
                                    console.log("Apelido Mãe: " + apelidoMae);
                                    console.log("Nome Mãe: " + nomeMae);
                                    console.log("Apelido Pai: " + apelidoPai);
                                    console.log("Nome Pai: " + nomePai);
                                    console.log("Número Fiscal: " + nFiscal); 
                                    console.log("Número Segurança Social: " + nSegSocial);  
                                    console.log("Número Saúde: " + nSaude);
                                    console.log("Indicações Eventuais: " + indicacoesEventuais.slice(0,120)); //apenas para confirmar que não apanhou mais do que devia
                                    resolve();
                                })
                            })
                        })
                    }

                    function stringFromCard(data, offset){
                        var str="";
                        var i = 0;

                        while(data.charAt(i+offset)=='\0' && (i+offset+1)<data.length)
                            i++;
                        
                        while(data.charAt(i+offset)!='\0' && (i+offset+1)<data.length){
                                str+=data.charAt(i+offset);
                                i++;
                        }

                        return Encoding.convert(str, 'binary', 'binary');
                    }



                    selectAppPromise().then(
                        selectIdPromise().then(
                            selectBinFilePromise().then(
                                console.log("Starting:")
                            )
                        )
                    );


                    }
                });
            }
        }
    });
 
    reader.on('end', function() {
        console.log('Reader',  this.name, 'removed');
    });
});
 
pcsc.on('error', function(err) {
    console.log('PCSC error', err.message);
});