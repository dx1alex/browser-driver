import Browser from './Browser';
declare class Chrome extends Browser {
    constructor(options: any);
    start(options?: any): Promise<string>;
}
export default Chrome;
