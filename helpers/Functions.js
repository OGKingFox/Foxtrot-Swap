class Functions {

    /**
     * 
     * @param {Integer} number 
     * @returns number with commans and decimals
     */
     static formatNumber(number, digits) {
        number = parseFloat(number);
        return number.toLocaleString(undefined, { 
            minimumFractionDigits: digits
        });
    }
    
    static shortenAddress = (address) => {
        let start = address.substring(0, 2);
        let end   = address.substring(address.length, address.length - 6);
        return start+"..."+end;
    }

    static fixed = (n, fixed) => `${n}`.match(new RegExp(`^-?\\d+(?:\.\\d{0,${fixed}})?`))[0];

    static toFixed = (x) => {
        if (Math.abs(x) < 1.0) {
            var e = parseInt(x.toString().split('e-')[1]);
            if (e) {
                x *= Math.pow(10,e-1);
                x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
            }
          } else {
            var e = parseInt(x.toString().split('+')[1]);
            if (e > 20) {
                e -= 18;
                x /= Math.pow(10,e);
                x += (new Array(e+1)).join('0');
            }
          }
          return x;
    }

}

module.exports = Functions;