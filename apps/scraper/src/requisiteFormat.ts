const requisiteFormat = (requisite: string) => {
    let reqArray = requisite.split(/\n/g);
    console.log(reqArray);

    return reqArray;
};

export default requisiteFormat;