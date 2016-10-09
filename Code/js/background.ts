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