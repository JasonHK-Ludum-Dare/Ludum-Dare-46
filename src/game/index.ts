"use strict";

import { LudumDare46 } from "./ludum-dare-46";

const element = document.getElementById("game")!;
const game = new LudumDare46(element);

if (DEBUG) { window.game = game; }
