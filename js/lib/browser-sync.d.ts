import { ElementSync } from './element-sync';
import Webdriver from 'webdriver-wire-protocol';
export declare class BrowserSync {
    options: any;
    gm: any;
    anticaptcha: any;
    key: BrowserKeys;
    sessionId: string;
    capabilities: any;
    webdriver: Webdriver;
    defaults: {
        timeouts: {
            script: number;
            implicit: number;
            page_load: number;
        };
    };
    $_: ElementSync;
    $$_: ElementSync[];
    constructor(options: any);
    start(options?: any): string;
    getStatus(): any;
    quit(): void;
    setDefaultTimeouts(options: Timeouts): void;
    setTimeouts(options?: Timeouts | 'script' | 'implicit' | 'page load', ms?: number): void;
    setScriptTimeout(ms: number): void;
    setImplicitWait(ms: number): void;
    setPageLoad(ms: number): void;
    getTab(): string;
    getTabs(): string[];
    switchTab(name: string): void;
    setPosition(windowHandle: any, x: number, y?: number): void;
    getPosition(windowHandle?: string): TabPosition;
    setSize(windowHandle: any, width: number, height?: number): void;
    getSize(windowHandle?: string): TabSize;
    getViewSize(): TabSize;
    maximize(windowHandle?: string): void;
    close(name?: string): void;
    url(url?: string): string;
    get(url: string): void;
    refresh(): void;
    back(): void;
    forward(): void;
    html(): string;
    title(): string;
    setCookie(cookie: Cookie): void;
    getCookies(): Cookie;
    deleteCookie(name?: string): void;
    deleteAllCookies(): void;
    setPrompt(text: string): void;
    getDialog(): string;
    acceptDialog(): void;
    dismissDialog(): void;
    dialog(accept?: boolean, text?: string): string;
    switchFrame(id?: any): void;
    switchParentFrame(): void;
    keys(keys: string | string[], ...more: string[]): void;
    capture(path: string, crop?: any, offset?: any): any;
    captcha(selector: string | ElementSync, crop: string | ElementSync, options?: any): any;
    execute(script: string | Function, ...args: any[]): any;
    executeAsync(script: string | Function, ...args: any[]): any;
    mouseDoubleClick(): void;
    mouseClick(button?: number): void;
    mouseUp(button?: number): void;
    mouseDown(button?: number): void;
    mouseMove(element: any, xoffset: number, yoffset?: number): void;
    click(selector: string | ElementSync, target?: string, bg?: boolean): void;
    scroll(selector: string | ElementSync, align?: any, y?: number, x?: number): any;
    isExists(selector: string, parent?: string | ElementSync): boolean;
    hasText(text: string | RegExp): boolean;
    form(selector: string | ElementSync, data: any, submit?: boolean, options?: FormOptions): void;
    element(selector?: string | ElementSync, parent?: string | ElementSync): ElementSync;
    $(selector?: string | ElementSync, parent?: string | ElementSync): ElementSync;
    elements(selector: string, parent?: string | ElementSync): ElementSync[];
    $$(selector: string, parent?: string | ElementSync): ElementSync[];
}
export interface ElementBuilder {
    (selector: string): ElementSync;
    (selector: ElementSync): ElementSync;
    (selector: string, parent: string): ElementSync;
    (selector: string, parent: ElementSync): ElementSync;
    (selector: ElementSync, parent: string): ElementSync;
    (selector: ElementSync, parent: ElementSync): ElementSync;
    (): ElementSync;
}
export interface TabPosition {
    x: number;
    y: number;
}
export interface TabSize {
    width: number;
    height: number;
}
export interface Cookie {
    name: string;
    value: string;
    path?: string;
    domain?: string;
    secure?: boolean;
    httpOnly?: boolean;
    expiry?: number;
}
export interface FormOptions {
    addFild?: boolean;
    setDisabled?: boolean;
    setInvisible?: boolean;
    pause?: number;
}
export interface Timeouts {
    script?: number;
    implicit?: number;
    page_load?: number;
}
export interface BrowserKeys {
    NULL(): any;
    Cancel(): any;
    Help(): any;
    Back_space(): any;
    Tab(): any;
    Clear(): any;
    Return(): any;
    Enter(): any;
    Shift(): any;
    Control(): any;
    Alt(): any;
    Meta(): any;
    Pause(): any;
    Escape(): any;
    Semicolon(): any;
    Equals(): any;
    Insert(): any;
    Delete(): any;
    Space(): any;
    Pageup(): any;
    Pagedown(): any;
    End(): any;
    Home(): any;
    Left_arrow(): any;
    Up_arrow(): any;
    Right_arrow(): any;
    Down_arrow(): any;
    Numpad_0(): any;
    Numpad_1(): any;
    Numpad_2(): any;
    Numpad_3(): any;
    Numpad_4(): any;
    Numpad_5(): any;
    Numpad_6(): any;
    Numpad_7(): any;
    Numpad_8(): any;
    Numpad_9(): any;
    Multiply(): any;
    Add(): any;
    Separator(): any;
    Subtract(): any;
    Decimal(): any;
    Divide(): any;
    F1(): any;
    F2(): any;
    F3(): any;
    F4(): any;
    F5(): any;
    F6(): any;
    F7(): any;
    F8(): any;
    F9(): any;
    F10(): any;
    F11(): any;
    F12(): any;
}
