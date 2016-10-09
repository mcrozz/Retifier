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

    constructor(id: string, name: string, followingFrom: Date) {
        this.id = id;
        this.name = name;
        this.followingFrom = followingFrom;
    }

    update = (): boolean => {
        this.lastUpdate = new Date();
        return true;
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
        return $.getJSON(url);
    }

    getFollowing = (user: string): JQueryXHR => {
        user = encodeURIComponent(user);
        const url = this.followed.replace('\$0', user);
        return $.getJSON(url);
    }

    getGamePreview = (user: string): JQueryXHR => {
        user = encodeURIComponent(user);
        const url = this.preview.replace('\$0', user);
        return $.get(url);
    }

    getHosting = (user: string): JQueryXHR => {
        user = encodeURIComponent(user);
        const url = this.hosting.replace('\$0', user);
        return $.getJSON(url);
    }
}

const twitch = new Twitch();