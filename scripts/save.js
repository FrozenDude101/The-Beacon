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

        player = Save.getStartPlayer();
        game.load();

    }

    // Gets the initial value of player.
    static getStartPlayer() {

        let player;
        let tab;

        player = {
            id: "FD101/IGJ2021",

            activeTab: "Test",

            theme: 0,

            tickInterval: 50,
            saveInterval: 10000,
        };

        for (tab in game.tabs) {
            player[tab] = game.tabs[tab].startData();
        }

        return player;

    }

}