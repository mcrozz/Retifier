// Generates random key, e.g.
//AbCDeFGh-1234-IjKLmNop
const generateGuid = ():string => {
    // 48-90 and 97-122
    const i = Math.floor((Math.random() * 122) + 48);
    const j = Math.floor((Math.random() * 122) + 48);
    const k = Math.floor((Math.random() * 122) + 48);
    const c = (val: number, just: boolean = false):number => {
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

        if (just) {
            const tmp = Math.round(val);
            return Number((tmp + '')[(tmp + '').length - 1]);
        } else
            return Math.round(val);
    };
    const s = (code:number):string => {
        return String.fromCharCode(code);
    }

    return s(c(i + j - 48)) +
        s(c(j / i)) +
        s(c((i % j) * 100)) +
        s(c(i / 2)) +
        s(c(i * 5)) +
        s(c(j + 15)) +
        s(c(j - 4)) +
        s(c(i - j + 100)) +
        '-' +
        c(i / 5, true) +
        c(i + j, true) +
        c(k - 4, true) +
        c(j / k, true) +
        '-' +
        s(c(k * j - 14884)) +
        s(c(122 - k)) +
        s(c(122 - j)) +
        s(c(k % 2)) +
        s(c(j % 10)) +
        s(c(k >> 1)) +
        s(c(j >> 4)) +
        s(c(k ^ 2 - 14884));
}