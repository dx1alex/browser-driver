import { Browser } from './browser';
import { ElementSync } from './element-sync';
export declare class BrowserSync extends Browser {
    $_: ElementSync;
    $$_: ElementSync[];
    constructor(options: any);
    element(selector?: string | ElementSync, from?: string | ElementSync): ElementSync;
    $(selector?: string | ElementSync, from?: string | ElementSync): ElementSync;
    elements(selector: string, from?: string | ElementSync): ElementSync[];
    $$(selector: string, from?: string | ElementSync): ElementSync[];
}
