interface IStreamerPreviews {
    stream: WindowBase64;
    game: WindowBase64;
    logo: WindowBase64;
    profile: WindowBase64;
}

interface IStreamerData {
    title: string;
    game: string;
    started: Date;
    viewers: number;
    previews: IStreamerPreviews;
}

class Streamer {
    id: string;
    name: string;
    data: IStreamerData;
    online: boolean;
    lastUpdate: Date;
    followingFrom: Date;

    constructor(id: string, name: string, followingFrom?: Date) {
        this.id = id;
        this.name = name;
        this.followingFrom = followingFrom;
    }

    update = (): boolean => {
        this.lastUpdate = new Date();
        return true;
    }
}

class HostingTarget extends Streamer {
    parent: Streamer;

    constructor(id: string, name: string, parent: Streamer) {
        super(id, name);
        this.parent = parent;
    }
}

class Twitch {
    private streams = 'https://api.twitch.tv/kraken/streams/$0';
    private followed = 'https://api.twitch.tv/kraken/streams/followed?limit=100&offset=0';
    private preview = 'http://static-cdn.jtvnw.net/ttv-boxart/$0-272x380.jpg';
    private hosting = 'http://api.twitch.tv/api/users/$0/followed/hosting?limit=50&offset=0';

    getStatus = (user: string): JQueryXHR => {
        user = encodeURIComponent(user);
        const url = this.streams.replace('\$0', user);
        return $.ajax(url, {
            dataType: 'JSON',
            headers: {
                'Accept': 'application/vnd.twitchtv.v3+json',
                'Authorization': 'OAuth '+settings.data.user.token
            },
            method: 'GET'
            });
    }

    getFollowing = (user: string): JQueryXHR => {
        user = encodeURIComponent(user);
        const url = this.followed.replace('\$0', user);
        return $.ajax(url, {
            dataType: 'JSON',
            headers: {
                'Accept': 'application/vnd.twitchtv.v3+json',
                'Authorization': 'OAuth ' + settings.data.user.token
            },
            method: 'GET'
        });
    }

    getGamePreview = (user: string): JQueryXHR => {
        user = encodeURIComponent(user);
        const url = this.preview.replace('\$0', user);
        return $.get(url);
    }

    getHosting = (user: string): JQueryXHR => {
        user = encodeURIComponent(user);
        const url = this.hosting.replace('\$0', user);
        return $.ajax(url, {
            dataType: 'JSON',
            headers: {
                'Accept': 'application/vnd.twitchtv.v3+json',
                'Authorization': 'OAuth ' + settings.data.user.token
            },
            method: 'GET'
        });
    }
}

const twitch = new Twitch();

abstract class BackgroundAbstract {
    protected following: Holder<Streamer>;
    protected hosting: Holder<HostingTarget>;

    constructor() {
        this.following = new Holder<Streamer>(null,
            {
                isLocal: true,
                onAdd: (item: Streamer) => {
                    //TODO on view
                },
                onRemove: (item: Streamer) => {
                    //TODO on view
                },
                onChange: (item: Streamer) => {
                    //TODO on view
                }
            });

        this.hosting = new Holder<HostingTarget>(null,
            {
                isLocal: true,
                onAdd: (item: HostingTarget) => {
                    //TODO on view
                },
                onRemove: (item: HostingTarget) => {
                    //TODO on view
                },
                onChange: (item: HostingTarget) => {
                    //TODO on view
                }
            });
    }

    abstract getFollowingList(): void;
    abstract getStatus(): void;
    abstract updatePreviews(): void;
    abstract updateHostingList(): void;

    protected config = {
        following: {
            lastRun: 0,
            interval: 300000,
            call: this.getFollowingList
        },
        status: {
            lastRun: 0,
            interval: 2000,
            call: this.getStatus
        },
        cache: {
            lastRun: 0,
            interval: 10000,
            call: this.updatePreviews
        },
        hosting: {
            lastRun: 0,
            interval: 300000,
            call: this.updateHostingList
        }
    };

    abstract run(): void;
}

class Background extends BackgroundAbstract {
    getFollowingList(): void {
        //TODO after implementation of settings
    };
    getStatus(): void {
        //TODO after implementation of settings
    };
    updatePreviews(): void {
        //TODO after implementation of settings
    };
    updateHostingList(): void {
        //TODO after implementation of settings
    };

    constructor() {
        super();
    }

    run(): void {
        const now = new Date().getTime();

        for (let item in this.config) {
            if (!this.config.hasOwnProperty(item))
                continue;

            if (now - this.config[item].lastRun >= this.config[item].interval) {
                this.config[item].lastRun = now;
                setTimeout(this.config[item].call, 0);
            }
        }

        setTimeout(this.run, 2000);
    }
}

const background = new Background();