function flatArrayChildren(array) {
    let res = [];
    function h(arr) {
        arr.forEach((item) => {
            res.push(item);
            item.children && h(item.children);
            item.buildInChildren && h(item.buildInChildren)
        });
    }
    h(array);
    return res;
}

export default flatArrayChildren