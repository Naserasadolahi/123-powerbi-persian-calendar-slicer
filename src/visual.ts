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
