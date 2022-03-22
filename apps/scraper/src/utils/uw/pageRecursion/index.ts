import { Page } from "playwright";
import { chromium, devices } from "playwright";

const baseUrl = "https://ugradcalendar.uwaterloo.ca";



//TODO: Finish this function so it can read in table elements recursivlely
const pageRecursion =  async (page: Page, desiredString: string, startUrl: string): Promise<string> => {
    
    const browser = await chromium.launch();

    const context = await browser.newContext({
        ...devices["Desktop Chrome"],
    });

    page = await context.newPage();
    await page.goto(baseUrl + startUrl);
    console.log("Scraping from: " + baseUrl + startUrl);

    const elementList = await page.$$("td span ul li a");
    //console.log(degreeList);
    for (const element of elementList) {
        const elementText = await element.innerText();
        //console.log(degreeCodeText);
        if(elementText.toLowerCase().includes(desiredString)){
            //console.log(degreeCodeText);
            if (element === null) continue;
            const linkHref = await element.getAttribute("href");
            if(linkHref != null){
                return linkHref;
            }   
        }
    }
    return "";
};
export default pageRecursion;