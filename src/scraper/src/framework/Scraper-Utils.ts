// Utilities that may be of use for later reference
import {ElementHandle} from "@playwright/test";
module.exports = {
    getInnerText: async (element: ElementHandle) => {
        return await (await element.getProperty("innerText")).jsonValue();
    },
    getInnerHTML: async (element: ElementHandle) => {
        return await (await element.getProperty("innerHTML")).jsonValue();
    },
    getAttribute: async (element: ElementHandle, attrName:string) => {
        return await (await element.getProperty(attrName)).jsonValue();
    },
    getElementValue: async (element: ElementHandle) => {
        return await (await element.getProperty("value")).jsonValue();
    },
}