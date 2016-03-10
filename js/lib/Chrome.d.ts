import { Browser } from './Browser';
export declare class Chrome extends Browser {
    constructor(options: any);
    start(options?: any): Promise<string>;
}
