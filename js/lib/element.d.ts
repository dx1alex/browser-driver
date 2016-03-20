import { Browser } from './browser';
export declare class Element {
    browser: Browser;
    id: string;
    query: Locator;
    selector: string;
    sessionId: string;
    private _promiseELEMENT;
    private webdriver;
    constructor(selector: any, browser: Browser, from?: string | Element, id?: string);
    readonly ELEMENT: Promise<string>;
    click(): Promise<void>;
    clear(): Promise<void>;
    submit(): Promise<void>;
    keys(keys: string | string[], submit?: boolean): Promise<void>;
    text(): Promise<string>;
    hasText(text: string | RegExp): Promise<boolean>;
    name(): Promise<string>;
    attr(name: string, value?: any): Promise<any>;
    css(propertyName: string): Promise<parsedCss>;
    size(): Promise<ElementSize>;
    location(): Promise<ElementLocation>;
    locationInView(): Promise<ElementLocation>;
    isSelected(): Promise<boolean>;
    isEnabled(): Promise<boolean>;
    isReadonly(): Promise<boolean>;
    isVisible(): Promise<boolean>;
    isEqual(em: string | Element): Promise<boolean>;
    is(): Promise<boolean>;
    prop(name: string, value?: any): Promise<any>;
    val(value?: any): Promise<string>;
    type(keys: any, submit?: boolean): Promise<void>;
    select(options: any): Promise<void>;
    check(): Promise<boolean>;
    uncheck(): Promise<boolean>;
    event(type: string, options?: any): Promise<any>;
    on(type: string): Promise<any>;
}
export interface Locator {
    using: 'name' | 'id' | 'xpath' | 'class name' | 'css selector' | 'tag name' | 'link text' | 'partial link text';
    value: string;
}
export interface parsedCss {
    property: string;
    value: any;
    parsed: any;
}
export interface ElementSize {
    width: number;
    height: number;
}
export interface ElementLocation {
    x: number;
    y: number;
}
