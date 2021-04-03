var player;

class Save {

    static save() {
        // Saves the game.

        localStorage.setItem("FD101/TheBeacon", btoa(JSON.stringify(player)));

    }

    static load(data = localStorage.getItem("FD101/TheBeacon")) {
        // Loads the game.
        // data -> The data to be loaded.
        //      -> If falsey, resets the save.

        if (data) {
            player = JSON.parse(atob(data));
            if (player.tickInterval == null) player.tickInterval = Infinity;
            player = Utils.mergeObjects(player, Save.default());
        } else {
            player = Save.default();
        }

        if (game) game.close();
        game = new Game();
        game.load();

    }

    static import() {
        // Imports the game.

        let data = prompt("Paste in an exported game file.");
        if (data) {
            load(data);
        }

    }

    static export() {
        // Exports the game.

        prompt("Here is your exported game file:", btoa(JSON.stringify(player)));

    }

    static reset() {
        // Resets the game.

        if (confirm("Are you sure you want to reset your save?\nThis cannot be undone.")) {
            Save.load(null);
        }

    }

    static default() {
        // Returns the default save.

        let save = {

            startTick: Date.now(),
            timeElapsed: 0,

            activeTab: "light",

            skipSmallWarning: false,
            
            tickInterval: 1000/30,
            saveInterval: 10000,
            
            highQuality: true,
            offlineProgress: true,
            analogueTime: true,
            
        };

        for (let tab of Game.tabs) {
            save[tab] = Game[tab].startData();
        }

        return save;

    }

}