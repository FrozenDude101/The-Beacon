game.addTheme({
    name: "Dark",

    "--background-color": "#222",
    "--accent-1": "#111",
    "--accent-2": "#444",

    "--text-color": "#FFF"
});

game.addTheme({
    name: "Light",

    "--background-color": "#FFF",
    "--accent-1": "#BBB",
    "--accent-2": "#666",

    "--text-color": "#000"
});

game.addTab("light", {

    name() {
        return "The Bonfire";
    },

    startData: {
        unlocked: true,
        story: [],
        state: -1,
        stateTimer: 0,
    },

    update(diff) {

        if (player.light.stateTimer >= 0 && player.lastTick > player.light.stateTimer) {
            this.setState();
        }

    },

    generateHTML() {

        let story;
        let actions;
        let inventory;
        let line;

        story = "";
        for (line = 0; line < player.light.story.length; line ++) {
            story = "<span class = 'storyLine' style = 'order: -" + line + "'>" + player.light.story[line] + "</span>" + story;
        }

        return `
            <div class = "column" id = "story">` + story + `</div>
            <div id = "lightCanvas"></div>
            <div class = "column" id = "invAct">
                <div id = "inventory">` + inventory + `</div>
                <div id = "actions">` + actions + `</div>
            </div>
        `;

    },

    addStory(line) {

        player.light.story.push(line);
        document.getElementById("story").innerHTML = "<span class = 'storyLine' style = 'order: -" + (player.light.story.length-1) + "'>" + line + "</span>" + document.getElementById("story").innerHTML;

    },

    setState() {

        switch (player.light.state) {
            case 0:
                player.light.stateTimer = player.lastTick + 2000;
                break;
            case 1:
                this.addStory("Oh God, where am I? Why is it so cold?")
                player.light.stateTimer = player.lastTick + 2000;
                break;
            case 2:
                this.addStory("I'm going to freeze to death unless I light a fire quick.")
                player.light.stateTimer = -1;
                break;
            case 3:
                this.addStory("I hope this wood isn't too damp.")
                player.light.stateTimer = -1;
                break;
        }
        player.light.state += 1;

    }

});