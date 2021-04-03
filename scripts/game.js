var game;

class Game {
    // Represents an instance of the game.
    // Replaced whenever a new save is loaded.

    static tabs = [];

    display;

    lastTick = Date.now();
    time = [];

    tickIntervalID;
    saveIntervalID;

    constructor() {

        this.display = new Display();
        
    }

    load() {

        this.setLoops();

        for (let tab of Game.tabs) {
            Game[tab].load();
        }

        this.display.update();

    }

    static addTab(id, data) {

        this.tabs.push(id);
        data.id = id;
        this[id] = new Tab(data);

    }

    changeActiveTab(tab) {

        player.activeTab = tab;
        this.display.update();

    }

    time() {

        let time = player.timeElapsed + 480000;
        
        return [
            Math.ceil(time / 720000),
            time % 720000,
        ];

    }
    
    setTickInterval(value) {

        player.tickInterval = 1000 / value;
        this.setLoops("tick");
        this.display.update();

    }

    setSaveInterval(value) {

        player.saveInterval = value * 1000;
        this.setLoops("save");
        this.display.update();

    }

    setLoops(loop) {

        switch (loop) {

            default:
            case "tick":
                if (this.tickIntervalID) clearInterval(this.tickIntervalID);
                game.lastTick = Date.now();
                if (player.tickInterval != Infinity) game.tickIntervalID = setInterval(game.loop, player.tickInterval);
                if (loop) break;
            case "save":
                if (this.saveIntervalID) clearInterval(this.saveIntervalID);
                if (player.saveInterval) game.saveIntervalID = setInterval(Save.save, player.saveInterval);
                if (loop) break;

        }

    }

    loop(diff = Date.now() - game.lastTick) {

        game.display.update(diff);

        for (let tab of Game.tabs) {
            Game[tab].update(diff);
        }

        player.timeElapsed += diff;
        game.lastTick = Date.now();

        let time = player.timeElapsed + 480000;
        game.time = [
            Math.ceil(time / 720000),
            time % 720000,
        ];

    }

    close() {

        if (this.tickIntervalID) clearInterval(this.tickIntervalID);
        if (this.saveIntervalID) clearInterval(this.saveIntervalID);

    }

}