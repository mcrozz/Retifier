// Generates random key, e.g.
//AbCDeFGh-1234-IjKLmNop
const generateGuid = (): string => {
    // 48-90 and 97-122
    const i = Math.floor((Math.random() * 122) + 48);
    const j = Math.floor((Math.random() * 122) + 48);
    const k = Math.floor((Math.random() * 122) + 48);
    const normalize = (val: number, isSingleChar: boolean = false): number => {
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
    const toChar = (code: number): string => {
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

interface IHolderOptions<T> {
    fallback?: T[];
    isLocal?: boolean;
    beforeAdd?: Function;
    beforeSave?: Function;
    onChange?: Function;
    onRemove?: Function;
    onAdd?: Function;
}

class FindByResult<T> {
    index: string;
    object: T;
    error: boolean;

    constructor(index: string, object?: T, error?: boolean) {
        this.index = index;
        this.object = object;
        this.error = error || false;
    }
}

class Holder<T> {
    private data: T[];
    private id: string;
    private options: IHolderOptions<T>;

    constructor(id: string, options?: IHolderOptions<T>) {
        if (options != null && options.isLocal)
            return;

        try {
            this.data = localStorage[id];
        } catch (ex) {
            if (options != null)
                localStorage[id] = options.fallback;
            this.data = [];
        }
    }

    getData = (): T[] => this.data;
    get = (id: string, item?: string): T => {
        if (item != null)
            return this.data[id][item];
        return this.data[id];
    };
    set = (id: string, value: T): boolean => {
        if (this.data[id] === undefined) {
            let item = this.findBy('id', id);
            if (item.error)
                return false;
            id = String(item.index);
        }

        this.data[id] = value;
        return true;
    };
    del = (id: string): boolean => {
        if (this.data[id] === undefined) {
            let item = this.findBy('id', id);
            if (item.error)
                return false;
            id = String(item.index);
        }

        let temp = this.data[id];
        delete this.data[id];

        if (this.options.onRemove != null)
            this.options.onRemove(temp);

        if (this.options.onChange != null)
            this.options.onChange(temp);

        return true;
    };
    push = (value: T) => {
        if (this.options.beforeAdd != null)
            value = this.options.beforeAdd(value);

        this.data.push(value);

        if (this.options.onAdd != null)
            this.options.onAdd(value);

        if (this.options.onChange != null)
            this.options.onChange(value);
    };
    length = (): number => {
        if (this.data.length !== undefined)
            return this.data.length;

        let length = 0;
        for (let itm in this.data)
            if (this.data.hasOwnProperty(itm))
                length++;

        return length;
    };
    findBy = (property: string, should: string): FindByResult<T> => {
        for (let itm in this.data) {
            if (!this.data.hasOwnProperty(itm))
                continue;

            if (this.data[itm][property] === should)
                return new FindByResult(itm, this.data[itm]);
        }

        return new FindByResult(null, null, true);
    };
    save = (): boolean => {
        let data = this.data;
        if (this.options.beforeSave != null)
            data = this.options.beforeSave(data);

        let stringified = null;
        try {
            stringified = JSON.stringify(data);
        } catch (ex) {
            //TODO: send ex to browser.error
        }

        if (stringified == null)
            return false;

        return (localStorage[this.id] = stringified);
    };
    reset = (): boolean => {
        if (this.options.fallback == null) {
            //TODO: Can not reset storage, fallback value is not presented
            return false;
        }

        this.data = this.options.fallback;
        return true;
    };
}

interface IDateRaw {
    h: number;
    m: number;
    s: number;
    d: number;
    y: number;
}

// Available patterns:
// * {h} - hours
// * {m} - minutes
// * {s} - seconds
// * {d} - days
// * {m} - months
// * {y} - years
// Add question mark if don't want to show value if it's zero
class DatePlus {
    private date: Date;
    private pattern: string[];

    constructor(input: Date, fillPattern?: string[]) {
        this.date = input;
        this.pattern = fillPattern;
    }

    private normalize = (input: number): string =>
        (input < 10) ? '0' + String(input) : String(input);

    private patternUnit = /\{([\?\w|\w])\}/;

    private _fill(data: IDateRaw): string {
        let output = '';

        for (let item of this.pattern) {
            const found: RegExpMatchArray = item.match(this.patternUnit);
            if (found.length < 2) {
                output += item;
                continue;
            }

            let pattern = found[2];
            const isOptional = pattern.length === 2;
            if (isOptional)
                pattern = pattern[1];

            if (data[pattern] == null)
                continue; //TODO throw error, invalid pattern

            if (data[pattern] === 0 && isOptional)
                continue;

            output += item.replace(this.patternUnit, this.normalize(data[pattern]));
        }

        return output;
    }

    get smart(): string {
        let diff = new Date().getTime() - this.date.getTime();
        let inPast = diff < 0;
        if (inPast)
            diff *= -1;

        let prefix;
        let reminder;

        if (diff / 3600000 < 1) { // Less than a hour
            reminder = Math.round(diff / 60000);
            prefix = 'minute';
        } else if (diff / (86400000) < 1) { // Less than a day
            reminder = Math.round(diff / 3600000);
            prefix = 'hour';
        } else if (diff / 31536000000 < 1) { // Less than a year
            reminder = Math.round(diff / 86400000);
            prefix = 'day';
        } else {
            reminder = Math.round(diff / 31536000000);
            prefix = 'year';
        }

        if (reminder > 1)
            prefix += 's';
        if (inPast)
            prefix += ' ago';

        return String(reminder) + ' ' + prefix;
    }

    get raw(): IDateRaw {
        return {
            h: this.date.getHours(),
            m: this.date.getMinutes(),
            s: this.date.getSeconds(),
            d: this.date.getDate(),
            y: this.date.getFullYear()
        };
    }

    get diffRaw(): IDateRaw {
        let diff = new Date().getTime() - this.date.getTime();
        if (diff < 0)
            diff *= -1;

        let output: IDateRaw;

        // Years
        output.y = Math.floor(diff / 31536000000);
        diff -= output.y * 31536000000;
        // Days
        output.d = Math.floor(diff / 86400000);
        diff -= output.d * 86400000;
        // Hours
        output.h = Math.floor(diff / 3600000);
        diff -= output.h * 3600000;
        // Minutes
        output.m = Math.floor(diff / 60000);
        diff -= output.m * 60000;
        // Seconds
        output.s = Math.floor(diff / 1000);

        return output;
    }

    get fill(): string {
        return this._fill(this.raw);
    }

    get diffFill(): string {
        return this._fill(this.diffRaw);
    }
}
