// Versión para integrar con función Serverless de Azure

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const num = req.query.num || (req.body && req.body.num);

    if (!num) {
        context.res = {
            status: 400,
            body: "Por favor, proporciona un número en la query string o en el cuerpo de la solicitud."
        };
        return;
    }

    // Código para convertir el número a letras
    var numeroALetras = (function () {
        function Unidades(num) {
            switch (num) {
                case 1: return 'un';
                case 2: return 'dos';
                case 3: return 'tres';
                case 4: return 'cuatro';
                case 5: return 'cinco';
                case 6: return 'seis';
                case 7: return 'siete';
                case 8: return 'ocho';
                case 9: return 'nueve';
            }
            return '';
        }

        function Decenas(num) {
            let decena = Math.floor(num / 10);
            let unidad = num - (decena * 10);

            switch (decena) {
                case 1:
                    switch (unidad) {
                        case 0: return 'diez';
                        case 1: return 'once';
                        case 2: return 'doce';
                        case 3: return 'trece';
                        case 4: return 'catorce';
                        case 5: return 'quince';
                        default: return 'dieci' + Unidades(unidad);
                    }
                case 2: return 'veint' + Unidades(unidad);
                case 3: return DecenasY('treinta', unidad);
                case 4: return DecenasY('cuarenta', unidad);
                case 5: return DecenasY('cincuenta', unidad);
                case 6: return DecenasY('sesenta', unidad);
                case 7: return DecenasY('setenta', unidad);
                case 8: return DecenasY('ochenta', unidad);
                case 9: return DecenasY('noventa', unidad);
                case 0: return Unidades(unidad);
            }
        }

        function DecenasY(strSin, numUnidades) {
            if (numUnidades > 0)
                return strSin + ' y ' + Unidades(numUnidades);
            return strSin;
        }

        function Centenas(num) {
            let centenas = Math.floor(num / 100);
            let decenas = num - (centenas * 100);

            switch (centenas) {
                case 1:
                    if (decenas > 0)
                        return 'ciento ' + Decenas(decenas);
                    return 'cien';
                case 2: return 'doscientos ' + Decenas(decenas);
                case 3: return 'trescientos ' + Decenas(decenas);
                case 4: return 'cuatrocientos ' + Decenas(decenas);
                case 5: return 'quinientos ' + Decenas(decenas);
                case 6: return 'seiscientos ' + Decenas(decenas);
                case 7: return 'setecientos ' + Decenas(decenas);
                case 8: return 'ochocientos ' + Decenas(decenas);
                case 9: return 'novecientos ' + Decenas(decenas);
            }

            return Decenas(decenas);
        }

        function Seccion(num, divisor, strSingular, strPlural) {
            let cientos = Math.floor(num / divisor);
            let resto = num - (cientos * divisor);

            let letras = '';

            if (cientos > 0)
                if (cientos > 1)
                    letras = Centenas(cientos) + ' ' + strPlural;
                else
                    letras = strSingular;

            if (resto > 0)
                letras += '';

            return letras;
        }

        function Miles(num) {
            let divisor = 1000;
            let cientos = Math.floor(num / divisor);
            let resto = num - (cientos * divisor);

            let strMiles = Seccion(num, divisor, 'mil', 'mil');
            let strCentenas = Centenas(resto);

            if (strMiles == '')
                return strCentenas;

            return strMiles + ' ' + strCentenas;
        }

        function Millones(num) {
            let divisor = 1000000;
            let cientos = Math.floor(num / divisor);
            let resto = num - (cientos * divisor);

            let strMillones = Seccion(num, divisor, 'un millón de', 'millones de');
            let strMiles = Miles(resto);

            if (strMillones == '')
                return strMiles;

            return strMillones + ' ' + strMiles;
        }

        return function NumeroALetras(num) {
            let data = {
                numero: num,
                enteros: Math.floor(num),
                decimales: Math.round((num - Math.floor(num)) * 100),
            };

            let letrasEnteras = Millones(data.enteros);
            let letrasDecimales = data.decimales > 0 ? `con ${data.decimales}/100` : '';

            let resultado = '';

            if (data.enteros === 0)
                resultado = 'cero ' + letrasDecimales;
            else
                resultado = letrasEnteras + ' ' + letrasDecimales;

            // Capitaliza la primera letra
            return resultado.charAt(0).toUpperCase() + resultado.slice(1);
        };
    })();

    // Convertir el número recibido en letras
    const resultado = numeroALetras(parseFloat(num));

    // Responder con el resultado
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: resultado
    };
};
