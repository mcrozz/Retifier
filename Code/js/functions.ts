// Generates random key, e.g.
//AbCDeFGh-1234-IjKLmNop
const generateGuid = ():string => {
    // 48-90 and 97-122
    const i = Math.floor((Math.random() * 122) + 48);
    const j = Math.floor((Math.random() * 122) + 48);
    const k = Math.floor((Math.random() * 122) + 48);
    const normalize = (val: number, isSingleChar: boolean = false):number => {
        if (val >= 91 && val <= 96) {
            const t = Math.random() * 50 - 50;
            if (t < 0)
                val = 90 + t;
            else
                val = 97 + t;
        }
        else if (val > 122)
            val = 122 - (Math.random() * 74);
        else if (val < 48)
            val = 48 + (Math.random() * 74);

        if (isSingleChar) {
            const tmp = Math.round(val);
            return Number((tmp + '')[(tmp + '').length - 1]);
        } else
            return Math.round(val);
    };
    const toChar = (code:number):string => {
        return String.fromCharCode(code);
    }

    return toChar(normalize(i + j - 48)) +
        toChar(normalize(j / i)) +
        toChar(normalize((i % j) * 100)) +
        toChar(normalize(i / 2)) +
        toChar(normalize(i * 5)) +
        toChar(normalize(j + 15)) +
        toChar(normalize(j - 4)) +
        toChar(normalize(i - j + 100)) +
        '-' +
        normalize(i / 5, true) +
        normalize(i + j, true) +
        normalize(k - 4, true) +
        normalize(j / k, true) +
        '-' +
        toChar(normalize(k * j - 14884)) +
        toChar(normalize(122 - k)) +
        toChar(normalize(122 - j)) +
        toChar(normalize(k % 2)) +
        toChar(normalize(j % 10)) +
        toChar(normalize(k >> 1)) +
        toChar(normalize(j >> 4)) +
        toChar(normalize(k ^ 2 - 14884));
}