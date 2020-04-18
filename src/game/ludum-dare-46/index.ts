"use strict";

import Phaser from "phaser";

export class LudumDare46
{
    private readonly _game: Phaser.Game;

    public constructor(element: HTMLElement)
    {
        this._game = new Phaser.Game(
            {
                title: "Ludum Dare 46",
                version: GAME_VERSION,
                parent: element,
                type: Phaser.AUTO,
                render: {},
                width: 800,
                height: 600,
                scale: {
                    mode: Phaser.Scale.FIT,
                    autoCenter: Phaser.Scale.CENTER_BOTH,
                },
                backgroundColor: "#000000",
                disableContextMenu: true,
                scene: [],
            });
    }
}
