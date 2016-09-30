import { Browser } from './browser';
export declare class Chrome extends Browser {
    constructor(options: any);
    start(options?: any): Promise<string>;
    userDataDir(): any;
    args(opt: string, value: string | boolean): any;
}
