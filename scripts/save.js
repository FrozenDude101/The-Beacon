var player;

class Save {

    // Saves the player object.
    static save() {

        localStorage.setItem("FD101/IGJ2021", JSON.stringify(player));

    }

    // Loads the player object.
    static load(data = JSON.parse(localStorage.getItem("FD101/IGJ2021"))) {

        if (data == null) {
            player = Save.getStartPlayer();
        } else if (data.id == "FD101/IGJ2021" || confirm("This save does not appear to be for this game, are you sure you want to continue?")) {
            player = Utils.mergeObjects(Save.getStartPlayer(), data);
        } else if (player == undefined) {
            player = Save.getStartPlayer();
        }
        game.load();

    }

    // Resets the player object.
    static reset() {

        if (!confirm("Are you sure you want to reset your save? This cannot be undone.")) return;
        clearInterval(game.loops.tick);
        clearInterval(game.loops.save);
        player = Save.getStartPlayer();
        game.load();

    }

    // Gets the initial value of player.
    static getStartPlayer() {

        let player;
        let tab;

        player = {
            id: "FD101/IGJ2021",

            activeTab: "light",

            theme: 0,

            mobile: false,

            firstTick: Date.now(),
            lastTick: Date.now(),
            tickInterval: 34,
            saveInterval: 10000,
        };

        for (tab of game.tabs.order) {
            player[tab] = Utils.getValue(game.tabs.data[tab].startData);
        }

        return Utils.cloneObject(player);

    }

}