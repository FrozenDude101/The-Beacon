class Display {

    static update() {
        
        if (game.updateHeader) {
            Display.updateHeader();
            this.setActiveTab();
            game.updateHeader = false;
        }

        if (game.updateFooter) {
            Display.updateFooter();
            game.updateFooter = false;
        }

    }

    static updateHeader() {
        
        let tab;
        let innerHTML;

        innerHTML = "";
        
        for (tab in game.tabs) {
            if (!player[tab].unlocked) continue;
            innerHTML += `
                <button
                    class = 'tabButton'
                    id = '` + tab + `Tab'
                    onclick = 'game.setActiveTab("` + tab + `");'
                >` + tab + `</button>`;
        }

        document.getElementById("tabHeader").innerHTML = innerHTML;

    }

    static updateFooter() {

        let foot;
        let innerHTML;

        innerHTML = "";

        for (foot of game.footerContent) {
            switch(foot.type) {
                case "button":
                    innerHTML += `
                        <button
                            class = 'footerContent'
                            id = '` + foot.name + `'
                            onclick = '` + foot.func + `()'
                        >` + (typeof foot.text == "function" ? foot.text() : foot.text) + `
                        </button>
                    `;
                    break;
                case "link":
                    innerHTML += `
                        <a
                            class = 'footerContent'
                            id = '` + foot.name + `'
                            href=` + foot.link + `
                            target="_blank"
                        >` + (typeof foot.text == "function" ? foot.text() : foot.text) + `
                        </a>
                    `;
                    break;
                case "slider":
                    innerHTML += `
                        <span
                            class = 'footerContent'
                        >` + `
                            <span
                                id = '` + foot.name + `'
                            >` + (typeof foot.text == "function" ? foot.text() : foot.text) + `
                            </span>
                            <input
                                class = 'footerSlider'
                                type = 'range'
                                min = '` + foot.range[0] + `'
                                max = '` + foot.range[1] + `'
                                oninput = '` + foot.func + `(this.value)'
                            ></input>
                        ` + `
                        </span>
                    `;
                    break;
            }
        }

        document.getElementById("settingsFooter").innerHTML = innerHTML;

    }


}