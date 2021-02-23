class Display {

    static update(forceUpdate = false) {
        
        if (game.updateHeader || forceUpdate) {
            Display.updateHeader();
            game.setActiveTab();
            game.updateHeader = false;
        }

        if (game.tabs.order.includes(player.activeTab)) game.tabs.data[player.activeTab].updateHTML();

        if (game.updateFooter || forceUpdate) {
            Display.updateFooter();
            game.updateFooter = false;
        }

    }

    static updateHeader() {
        
        let tab;
        let innerHTML;

        innerHTML = "";
        
        for (tab of game.tabs.order) {
            if (!player[tab].unlocked) continue;
            innerHTML += `
                <button
                    class = 'tabButton'
                    id = '` + tab + `TabButton'
                    onclick = 'game.setActiveTab("` + tab + `");'
                >` + Utils.getTabValue(tab, "name", tab) + `</button>`;
        }

        document.getElementById("tabHeader").innerHTML = innerHTML;

    }

    static updateFooter() {

        let innerHTML;
        let item;

        innerHTML = "";

        for (item of game.footerContent) {
            innerHTML += this.createFooterElement(item);
            innerHTML += "|";
        }
        innerHTML = innerHTML.slice(0, -1);

        document.getElementById("settingsFooter").innerHTML = innerHTML;

    }

    static createFooterElement(data, expand = false) {
        
        let innerHTML;
        let item;

        switch(data.type) {

            case "expand": 
                innerHTML = `
                    <span
                        class = '` + (expand ? "footerExpand" : "footerContent") + `'
                    >
                        <span
                            id = '` + data.name + `'
                        >` + Utils.getValue(data.text) + `
                        </span>
                `;

                for (item of data.components) {
                    innerHTML += this.createFooterElement(item, true);
                }

                return innerHTML + "</span>";

            case "button":

                return `
                    <button
                        class = '` + (expand ? "footerExpand" : "footerContent") + ` footerButton'
                        id = '` + data.name + `'
                        onclick = '` + data.func + `()'
                    >` + Utils.getValue(data.text) + `
                    </button>
                `;
                
            case "link":

                return `
                    <a
                        class = '` + (expand ? "footerExpand" : "footerContent") + `'
                        id = '` + data.name + `'
                        href=` + data.link + `
                        target="_blank"
                    >` + Utils.getValue(data.text) + `
                    </a>
                `;

            case "slider":

                return `
                    <input
                        class = '` + (expand ? "footerExpand" : "footerContent") + `'
                        type = 'range'
                        min = '` + data.range[0] + `'
                        max = '` + data.range[1] + `'
                        value = '` + data.value() + `'
                        oninput = '` + data.func + `(this.value)'
                    ></input>
                `;

        }

    }

}