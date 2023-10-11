let showBlocks = 0;
const searchInstance = new URLSearchParams(window.location.search);
const params = new Proxy(searchInstance, {
    get: (searchParams, prop) => searchParams.get(prop),
});

const attrs = {};

if (params.blk) {
    showBlocks = Number(params.blk);
}

// https://codepen.io/chiragbhansali/pen/EWppvy
let verbs, nouns, adjectives, adverbs, preposition;
nouns = ["bird", "clock", "boy", "plastic", "duck", "teacher", "old lady", "professor", "hamster", "dog"];
verbs = ["kicked", "ran", "flew", "dodged", "sliced", "rolled", "died", "breathed", "slept", "killed"];
adjectives = ["beautiful", "lazy", "professional", "lovely", "dumb", "rough", "soft", "hot", "vibrating", "slimy"];
adverbs = ["slowly", "elegantly", "precisely", "quickly", "sadly", "humbly", "proudly", "shockingly", "calmly", "passionately"];
preposition = ["down", "into", "up", "on", "upon", "below", "above", "through", "across", "towards"];

const sentence = () => {
    var rand1 = Math.floor(Math.random() * 10);
    var rand2 = Math.floor(Math.random() * 10);
    var rand3 = Math.floor(Math.random() * 10);
    var rand4 = Math.floor(Math.random() * 10);
    var rand5 = Math.floor(Math.random() * 10);
    var rand6 = Math.floor(Math.random() * 10);
    //                var randCol = [rand1,rand2,rand3,rand4,rand5];
    //                var i = randGen();
    return "The " + adjectives[rand1] + " " + nouns[rand2] + " " + adverbs[rand3] + " " + verbs[rand4] + " because some " + nouns[rand1] + " " + adverbs[rand1] + " " + verbs[rand1] + " " + preposition[rand1] + " a " + adjectives[rand2] + " " + nouns[rand5] + " which, became a " + adjectives[rand3] + ", " + adjectives[rand4] + " " + nouns[rand6] + ".";
    /// document.getElementById('sentence').innerHTML = "&quot;" + content + "&quot;";
    // return content
};

const generateParagraphs = (element, number) => {
    number = number | 1;
    if (!element) console.log("Please provide an element to append the paragraphs to");
    for (var i = 0; i < number; i++) {
        let para = document.createElement("p");
        let node = document.createTextNode(sentence());
        para.appendChild(node);
        element.appendChild(para);
    }
}

export { attrs, showBlocks, generateParagraphs };
