function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export function testFunctionFactory(search) {
    const queryRegExp = new RegExp(escapeRegExp(search).replace(' ', '.*'), 'i');
    return (query, {url}) => queryRegExp.test(url);
}