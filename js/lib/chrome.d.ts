import { Browser } from './browser';
export declare class BrowserSync extends Browser {
    constructor(options: any);
    start(options?: any): Promise<string>;
}
