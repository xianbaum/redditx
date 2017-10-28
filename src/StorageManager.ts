export class Settings {
    constructor() {
        this.hasAcccess = false;
    }
    hasAcccess: boolean;
}

export class UserAccess {
    constructor() {
        this.accessToken = null;
    }
    accessToken: string | null;
}

export class StorageManager {
    private static _lsSettings?: Settings;
    static getSettings(): Settings {
        if(StorageManager._lsSettings === undefined) {
            let storage = localStorage.getItem("redditxsettings");
            if(storage == null) {
                StorageManager._lsSettings = new Settings();
            } else {
                StorageManager._lsSettings = JSON.parse(storage);
            }
        }
        return <Settings>StorageManager._lsSettings;
    }
    static saveSettings(value: Settings) {
        StorageManager._lsSettings = value;
        localStorage.setItem("redditxsettings",
            JSON.stringify(StorageManager._lsSettings));
    }
    private static _lsUser?: UserAccess;
    static getUserAccess(): UserAccess {
        if(StorageManager._lsSettings === undefined) {
            let storage = localStorage.getItem("redditxuseraccess");
            if(storage == null) {
                StorageManager._lsSettings = new Settings();
            } else {
                StorageManager._lsSettings = JSON.parse(storage);
            }
        }
        return <UserAccess>StorageManager._lsUser;
    }
    static saveUserAccess(value: UserAccess) {
        StorageManager._lsUser = value;
        localStorage.setItem("redditxuseraccess",
            JSON.stringify(StorageManager._lsSettings));
    }
}