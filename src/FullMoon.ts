/* istanbul ignore file */

import { SearchIndex } from "./SearchIndex";

export class FullMoon {
    //Dummy module to expose to window
}

declare global {
    interface Window { fullmoon: any; }
}

window.fullmoon = window.fullmoon || SearchIndex;