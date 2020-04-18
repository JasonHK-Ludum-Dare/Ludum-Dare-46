"use strict";

import { LudumDare46 } from "./ludum-dare-46";

declare global
{
    const DEBUG: true | undefined;

    const GAME_VERSION: string;

    interface Window
    {
        game?: LudumDare46;
    }
}

export {};
