enum NotificationFlags {
    WentOnline = 0x01,
    ChangedTitle,
    NewHosting,
    WentOffline
}

interface ISettings {
    ui: {
        scale: number;
    };
    checkInterval: number;
    user: {
        name: string;
        id: string;
        token: string;
    };
    notifications: NotificationFlags;
}

class Settings {
    private dataSettings: ISettings;
    private storageName = 'settings';

    constructor() {
        if (localStorage[this.storageName] == null) {
            // It's new user
            this.dataSettings = {
                ui: { scale: .8 },
                checkInterval: 120000,
                user: {
                    name: null,
                    id: null,
                    token: null
                },
                notifications: NotificationFlags.WentOnline && NotificationFlags.NewHosting
            }
            this.save();

            return;
        }

        let parsed;
        try {
            parsed = JSON.parse(localStorage[this.storageName]);
        } catch (ex) {
            //TODO: Could not retrive settings from localStorage
            return;
        }

        this.dataSettings = (parsed as ISettings);
    }

    private save = () => {
        let stringified;
        try {
            stringified = JSON.stringify(this.dataSettings);
        } catch (ex) {
            //TODO: Could not stringify settings
            return;
        }
        if (stringified != null)
            localStorage[this.storageName] = stringified;
    }

    get data(): ISettings {
        return this.dataSettings;
    }

    set(id: string, value: Object): boolean {
        if (this.dataSettings[id] == null) {
            //TODO: Invalid id
            return false;
        }

        this.dataSettings[id] = value;
        this.save();
        return true;
    }
}

const settings = new Settings();