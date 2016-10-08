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

interface IHolderOptions {
    fallback?: Object[];
    isLocal?: boolean;
    beforeAdd?: Function;
    beforeSave?: Function;
    onChange?: Function;
    onRemove?: Function;
    onAdd?: Function;
}

class FindByResult {
    index: string;
    object: Object;
    error: boolean;

    constructor(index: string, object?: Object, error?: boolean) {
        this.index = index;
        this.object = object;
        this.error = error || false;
    }
}

class Holder {
    private data: Object[];
    private id: string;
    private options: IHolderOptions;

    constructor(id: string, options?: IHolderOptions) {
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

    getData = (): Object[] => this.data;
    get = (id: string, item?: string): Object => {
        if (item != null)
            return this.data[id][item];
        return this.data[id];
    };
    set = (id: string, value: Object): boolean => {
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
    push = (value: Object) => {
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
    findBy = (property: string, should: string): FindByResult => {
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

        return (this.data = this.options.fallback);
    };
}
