const requisiteScrape = (requisite: string) => {
    let reqArray = requisite.split(/\n/g);

    return reqArray;
};

const requisiteData = (requisite: string) => {
    console.log(requisite)

}

export {requisiteScrape, requisiteData};