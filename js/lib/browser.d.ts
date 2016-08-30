import Webdriver from 'webdriver-wire-protocol';
import { Element } from './element';
export declare class Browser {
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
    pause: any;
    $_: Element;
    $$_: Element[];
    constructor(options: any);
    sleep(ms: any, ms2?: any): Promise<{}>;
    start(options?: any): Promise<string>;
    getStatus(): Promise<any>;
    quit(): Promise<void>;
    setDefaultTimeouts(options: Timeouts): void;
    setTimeouts(options?: Timeouts | 'script' | 'implicit' | 'page load', ms?: number): Promise<void>;
    setScriptTimeout(ms: number): Promise<void>;
    setImplicitWait(ms: number): Promise<void>;
    setPageLoad(ms: number): Promise<void>;
    getTab(): Promise<string>;
    getTabs(): Promise<string[]>;
    switchTab(name: string): Promise<void>;
    newTab(switchto?: boolean): Promise<string>;
    newWindow(switchto?: boolean): Promise<string>;
    setPosition(windowHandle: any, x: number, y?: number): Promise<void>;
    getPosition(windowHandle?: string): Promise<TabPosition>;
    setSize(windowHandle: any, width: number, height?: number): Promise<void>;
    getSize(windowHandle?: string): Promise<TabSize>;
    getViewSize(): Promise<TabSize>;
    maximize(windowHandle?: string): Promise<void>;
    close(name?: string): Promise<void>;
    url(url?: string): Promise<string>;
    get(url: string): Promise<void>;
    refresh(): Promise<void>;
    back(): Promise<void>;
    forward(): Promise<void>;
    html(): Promise<string>;
    title(): Promise<string>;
    setCookie(cookie: Cookie): Promise<void>;
    getCookies(): Promise<Cookie>;
    deleteCookie(name?: string): Promise<void>;
    deleteAllCookies(): Promise<void>;
    setPrompt(text: string): Promise<void>;
    getDialog(): Promise<string>;
    acceptDialog(): Promise<void>;
    dismissDialog(): Promise<void>;
    dialog(accept?: boolean, text?: string): Promise<string>;
    switchFrame(id?: any): Promise<void>;
    switchParentFrame(): Promise<void>;
    keys(keys: string | string[], ...more: string[]): Promise<void>;
    capture(path: string, crop?: any, offset?: any): Promise<any>;
    captcha(selector: string | Element, crop: string | Element, options?: any): Promise<any>;
    execute(script: string | Function, ...args: any[]): Promise<any>;
    executeAsync(script: string | Function, ...args: any[]): Promise<any>;
    mouseDoubleClick(): Promise<void>;
    mouseClick(button?: number): Promise<void>;
    mouseUp(button?: number): Promise<void>;
    mouseDown(button?: number): Promise<void>;
    mouseMove(element: any, xoffset: number, yoffset?: number): Promise<void>;
    click(selector: string | Element, target?: string, bg?: boolean): Promise<void>;
    scroll(selector: string | Element, align?: any, y?: number, x?: number): Promise<any>;
    isExists(selector: string, from?: string | Element): Promise<boolean>;
    hasText(text: string | RegExp): Promise<boolean>;
    form(selector: string | Element, data: any, submit?: boolean, options?: FormOptions): Promise<void>;
    element(selector?: string | Element, from?: string | Element): Element;
    $(selector?: string | Element, from?: string | Element): Element;
    elements(selector: string, from?: string | Element): Promise<Element[]>;
    $$(selector: string, from?: string | Element): Promise<Element[]>;
}
export interface ElementBuilder {
    (selector: string): Element;
    (selector: Element): Element;
    (selector: string, from: string): Element;
    (selector: string, from: Element): Element;
    (selector: Element, from: string): Element;
    (selector: Element, from: Element): Element;
    (): Element;
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
    NULL(): Promise<any>;
    Cancel(): Promise<any>;
    Help(): Promise<any>;
    Back_space(): Promise<any>;
    Tab(): Promise<any>;
    Clear(): Promise<any>;
    Return(): Promise<any>;
    Enter(): Promise<any>;
    Shift(): Promise<any>;
    Control(): Promise<any>;
    Alt(): Promise<any>;
    Meta(): Promise<any>;
    Pause(): Promise<any>;
    Escape(): Promise<any>;
    Semicolon(): Promise<any>;
    Equals(): Promise<any>;
    Insert(): Promise<any>;
    Delete(): Promise<any>;
    Space(): Promise<any>;
    Pageup(): Promise<any>;
    Pagedown(): Promise<any>;
    End(): Promise<any>;
    Home(): Promise<any>;
    Left_arrow(): Promise<any>;
    Up_arrow(): Promise<any>;
    Right_arrow(): Promise<any>;
    Down_arrow(): Promise<any>;
    Numpad_0(): Promise<any>;
    Numpad_1(): Promise<any>;
    Numpad_2(): Promise<any>;
    Numpad_3(): Promise<any>;
    Numpad_4(): Promise<any>;
    Numpad_5(): Promise<any>;
    Numpad_6(): Promise<any>;
    Numpad_7(): Promise<any>;
    Numpad_8(): Promise<any>;
    Numpad_9(): Promise<any>;
    Multiply(): Promise<any>;
    Add(): Promise<any>;
    Separator(): Promise<any>;
    Subtract(): Promise<any>;
    Decimal(): Promise<any>;
    Divide(): Promise<any>;
    F1(): Promise<any>;
    F2(): Promise<any>;
    F3(): Promise<any>;
    F4(): Promise<any>;
    F5(): Promise<any>;
    F6(): Promise<any>;
    F7(): Promise<any>;
    F8(): Promise<any>;
    F9(): Promise<any>;
    F10(): Promise<any>;
    F11(): Promise<any>;
    F12(): Promise<any>;
}
