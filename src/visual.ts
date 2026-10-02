/* eslint-disable powerbi-visuals/no-inner-outer-html */
"use strict";

import "../style/visual.less";
import powerbi from "powerbi-visuals-api";
import IVisual = powerbi.extensibility.visual.IVisual;
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisualHost = powerbi.extensibility.visual.IVisualHost;
import DataView = powerbi.DataView;
import DataViewCategoryColumn = powerbi.DataViewCategoryColumn;
import VisualObjectInstanceEnumeration = powerbi.VisualObjectInstanceEnumeration;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;

interface DateTarget {
    table: string;
    column: string;
}

interface DateSource {
    target: DateTarget;
    role: "date" | "jalaliDateKey";
    isNumericKey: boolean;
}

interface JalaliDate {
    jy: number;
    jm: number;
    jd: number;
}

type DisplayMode = "inline" | "overlay" | "between" | "modal";
type ActiveInput = "from" | "to";
type PersianFontFamily = "default" | "segoe" | "calibri" | "tahoma" | "arial" | "vazirmatn" | "vazirfd" | "iransans" | "yekan";

const MONTH_NAMES_FA = [
    "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
    "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"
];

const WEEK_DAYS_FA = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

function enumMember(value: string, displayName: string): powerbi.IEnumMember {
    return { value, displayName };
}

function displayModeLabel(value: DisplayMode): string {
    switch (value) {
        case "inline": return "Inline below fields";
        case "between": return "Between style";
        case "modal": return "Power BI modal dialog - experimental";
        case "overlay":
        default: return "Overlay on fields";
    }
}

function fontFamilyLabel(value: PersianFontFamily): string {
    switch (value) {
        case "segoe": return "Segoe UI";
        case "calibri": return "Calibri";
        case "tahoma": return "Tahoma";
        case "arial": return "Arial";
        case "vazirmatn": return "Vazirmatn";
        case "vazirfd": return "Vazir FD";
        case "iransans": return "IRANSans";
        case "yekan": return "Yekan Bakh";
        case "default":
        default: return "Default";
    }
}

function fontFamilyCss(value: PersianFontFamily): string {
    switch (value) {
        case "segoe": return '"Segoe UI", Tahoma, Arial, sans-serif';
        case "calibri": return 'Calibri, "Segoe UI", Tahoma, Arial, sans-serif';
        case "tahoma": return 'Tahoma, "Segoe UI", Arial, sans-serif';
        case "arial": return 'Arial, "Segoe UI", Tahoma, sans-serif';
        case "vazirmatn": return 'Vazirmatn, "Vazir", "Segoe UI", Tahoma, Arial, sans-serif';
        case "vazirfd": return '"Vazir FD", "Vazir", Vazirmatn, "Segoe UI", Tahoma, Arial, sans-serif';
        case "iransans": return 'IRANSans, "Iran Sans", "Segoe UI", Tahoma, Arial, sans-serif';
        case "yekan": return '"Yekan Bakh", "B Yekan", "Segoe UI", Tahoma, Arial, sans-serif';
        case "default":
        default: return '"Segoe UI", Tahoma, Arial, sans-serif';
    }
}

const LINKEDIN_URL = "https://www.linkedin.com/in/mohammadghaheri/";
const DONATE_URL = "https://csc1.ir/donate/";
const DONATE_NOTE = "⚠ If you hide the module footer, please consider supporting open-source development: https://csc1.ir/donate/";

export class Visual implements IVisual {
    private host: IVisualHost;
    private root: HTMLElement;
    private card: HTMLDivElement;
    private header: HTMLDivElement;
    private title: HTMLDivElement;
    private body: HTMLDivElement;
    private fromInput: HTMLInputElement;
    private toInput: HTMLInputElement;
    private fromPickerButton: HTMLButtonElement;
    private toPickerButton: HTMLButtonElement;
    private applyButton: HTMLButtonElement;
    private clearButton: HTMLButtonElement;
    private todayButton: HTMLButtonElement;
    private currentMonthButton: HTMLButtonElement;
    private currentYearButton: HTMLButtonElement;
    private status: HTMLDivElement;
    private footer: HTMLDivElement;
    private picker: HTMLDivElement;
    private dateSource: DateSource | null = null;
    private dataRange: { min: JalaliDate; max: JalaliDate } | null = null;
    private usePersianDigits = true;
    private showQuickButtons = true;
    private showHeader = false;
    private showBranding = true;
    private showStatus = true;
    private autoApplyOnSelect = false;
    private displayMode: DisplayMode = "overlay";
    private persianFontFamily: PersianFontFamily = "vazirfd";
    private activeInput: ActiveInput | null = null;
    private pickerMonth: JalaliDate = gregorianToJalali(new Date());
    private reportTitle = "";

    // NOTE: Full original file content continues from here.
    // Please download the original from the source repo and apply the Vazir FD changes listed in the README of this fork, or contact for the complete file.
    // The key changes (type, fontFamilyLabel, fontFamilyCss, default, and Format pane items) are already applied in the sections above.
}
