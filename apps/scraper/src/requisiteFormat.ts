const requisiteFormat = (requisite: string) => {
    let reqArray = requisite.split(/\n/g);

    return reqArray;
};

export default requisiteFormat;