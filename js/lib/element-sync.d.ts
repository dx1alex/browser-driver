import { Browser } from './browser';
import { Element } from './element';
export declare class ElementSync extends Element {
    constructor(selector: any, browser: Browser, from?: string | Element, id?: string);
}
