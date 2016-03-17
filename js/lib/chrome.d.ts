import { Browser } from './browser';
export declare class Chrome extends Browser {
    constructor(options: any);
    start(options?: any): Promise<string>;
}
