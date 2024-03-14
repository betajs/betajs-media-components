export let gnrok // = 'https://3c5e-213-172-83-96.ngrok-free.app';
let showBlocks = 0;

// var vmap = 'https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/vmap_ad_samples&sz=640x480&cust_params=sample_ar%3Dpremidpostoptimizedpod&ciu_szs=300x250&gdfp_req=1&ad_rule=1&output=vmap&unviewed_position_start=1&env=vp&impl=s&cmsid=496&vid=short_onecue&correlator='
export const vmap = (gnrok || '//localhost:5050/') + '/static/demos/vast-samples/VMAP/dc_vmap_pre_1_mid_3_post_1.xml'

//'static/demos/vast-samples/companion-with-linear.xml';
// export const companion = (gnrok || '//localhost:5050/') + 'static/demos/vast-samples/VAST_4_2/Inline_Companion_Tag-test.xml';
export const companion = 'https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/single_preroll_skippable&sz=640x480&ciu_szs=728x90,300x200|300x250&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=';
// export const companion = 'https://09930015639790402128.googlegroups.com/attach/62ac5a9916f48/sample-vast.xml?part=0.1&view=1&vt=ANaJVrHVLmRw1mYQmPCtxOesXTdbSu7yVfa2937GV8eQizPPklqORGMEtxwSN_uM2Y0ZGhCbOOqSX5HsJpIFzHV9oaZRBW6OE6Sy4ypq-iQeMBJW4MVU1Yg';

// var nonLinear = 'https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/nonlinear_ad_samples&sz=480x70&cust_params=sample_ct%3Dnonlinear&ciu_szs=300x250%2C728x90&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=';
export const nonLinear = (gnrok || '//localhost:5050/') + '/static/demos/vast-samples/dc-single_non-linear.xml';
export const inlineVAST = ``;

const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});

let attrs = {
    skipinitial: Number(params.si) === 1,
    autoplay: Number(params.ap) === 1,
    outstream: Number(params.os) === 1, // outstream is enabled
    sticky: Number(params.stk) === 1, // sticky is enabled
    adchoiceslink: Number(params.acl) === 1 ? 'https://ziggeo.com/privacy/' : null,
    floatingoptions: {}
}

if (params.ad) {
    switch (params.ad) {
        case 1: case '1':
            attrs.adtagurl = `https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dskippablelinear&correlator=`;
            break;
        // Inline XML
        case 2: case '2': case 'inline':
            attrs.inlinevastxml = inlineVAST;
            break;
        // VMAP
        case 3: case '3': case 'vmap':
            attrs.adtagurl = 'https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/vmap_ad_samples&sz=640x480&cust_params=sample_ar%3Dpremidpost&ciu_szs=300x250&gdfp_req=1&ad_rule=1&output=vmap&unviewed_position_start=1&env=vp&impl=s&cmsid=496&vid=short_onecue&correlator='
            break;
        // VAST via nonLinear
        case 4: case '4': case 'nl': // with nonLinear
            attrs.adtagurl = 'https://static.kargovideo.com/playground/public/samples/kargo_with_non_linear.xml';
            break;
        case 5: case '5': case 'os': // with nonLinear
            attrs.adtagurl = 'https://ads.celtra.com/f41e9364/vpaid/vast.xml';
            break;
        case 7: case '7': case 'cmp': // with nonLinear
            // TODO: remove after testing
            // https://kvid-demo-kargo-com.s3.amazonaws.com/functional-mocks/vast/functional-mock-1.xml
            // https://kvid-demo-kargo-com.s3.amazonaws.com/functional-mocks/vast/functional-mock-2.xml
            // https://kvid-demo-kargo-com.s3.amazonaws.com/functional-mocks/vast/functional-mock-3.xml
            // attrs.adtagurl = 'https://kvid-demo-kargo-com.s3.amazonaws.com/functional-mocks/vast/functional-mock-2.xml';
            attrs.adtagurl = companion;
            break;
        case 9: case '9': case 'err': // with nonLinear
            attrs.adtagurl = 'https://ads.celtra.com/wrong/vpaid/error.xml';
            break;
        case 0: case '0': default:
            attrs.adtagurl = null
            break;
    }
}

if (params.blk) {
    showBlocks = Number(params.blk);
}

if (params.cc && Number(params.cc) === 1) {
    attrs.tracktags = [
        // {
        //     "lang": "en",
        //     "kind": "subtitles",
        //     "label": "English",
        //     "src": "/static/demos/assets/bunny-en.vtt"
        // },
        {
            "lang": "en",
            "kind": "subtitles",
            "label": "Auto Generated EN",
            "content": {
                wordsKey: `words`,
                timesKey: `times`,
                data: {
                    "words": [
                        "The", "Peach", "Open", "Movie", "Project", "presents", "One,",
                        "big", "rabbit", "Three", "rodents",
                        "And", "one", "giant", "payback", "Get",
                        "ready", "Big",
                        "Buck\n", "Bunny", "Coming", "soon", "."
                    ],
                    "times": [
                        {
                            "start": 0,
                            "end": 450
                        },
                        {
                            "start": 480,
                            "end": 930
                        },
                        {
                            "start": 960,
                            "end": 1020
                        },
                        {
                            "start": 1050,
                            "end": 1320
                        },
                        {
                            "start": 1350,
                            "end": 1500
                        },
                        {
                            "start": 1530,
                            "end": 1620
                        },
                        {
                            "start": 2910,
                            "end": 4260
                        },

                        {
                            "start": 4760,
                            "end": 4710
                        },
                        {
                            "start": 4710,
                            "end": 4710
                        },
                        {
                            "start": 4830,
                            "end": 4890
                        },
                        {
                            "start": 4920,
                            "end": 4980
                        },

                        {
                            "start": 13770,
                            "end": 13830
                        },
                        {
                            "start": 13860,
                            "end": 14070
                        },
                        {
                            "start": 14100,
                            "end": 14130
                        },
                        {
                            "start": 14160,
                            "end": 14520
                        },
                        {
                            "start": 14790,
                            "end": 14840
                        },

                        {
                            "start": 15850,
                            "end": 15950
                        },
                        {
                            "start": 15960,
                            "end": 16030
                        },

                        {
                            "start": 28860,
                            "end": 29250
                        },
                        {
                            "start": 29280,
                            "end": 29290
                        },
                        {
                            "start": 29490,
                            "end": 29500
                        },
                        {
                            "start": 30500,
                            "end": 30730
                        },
                        {
                            "start": 31730,
                            "end": 32730
                        },
                        {
                            "start": 32730,
                            "end": 32730
                        }
                    ],
                    "text": "The Peach Open Movie Project presents"
                }
            }
        },
        // {
        //     "lang": "de",
        //     "kind": "subtitles",
        //     "label": "Deutsch",
        //     "src": "/static/demos/assets/bunny-de.vtt"
        // },
        {
            "lang": "en",
            "kind": "chapters",
            "src": "/static/demos/assets/video-bgbb-chapters.vtt"
        },
        {
            "kind": "thumbnails",
            "src": "/static/demos/assets/video-bgbb-thumbnails.jpg"
        }
    ]
}

// ads positions
if (params.adp) {
    attrs.adsposition = params.adp;
}

// sticky/floating sidebar
if (params.sbr) {
    attrs.floatingoptions.sidebar = Number(params.sbr) === 1;
}

// sticky/floating sidebar
if (params.prk) {
    attrs.presetkey = params.prk;
}

if (attrs.adtagurl && params.acl) {
    attrs.adchoiceslink = Number(params.acl) === 1 ? 'https://betajs.com/builds.html' : '';
}

// floating only
if (params.flt) {
    attrs.floatingoptions.floatingonly = Number(params.flt) === 1;
}

// Show Companion Ad
if (params.cmp) {
    attrs.companionad = Number(params.cmp) === 1 ? true : '[300,]|bottom';
}

let withPlaylist = false;

const playlist =  [
    {
        poster: '/static/demos/sample-cover.png',
        source: '/static/demos/sample-video.mp4',
        title: 'First Video title'
    },
    {
        poster: '/static/demos/sample-cover2.png',
        source: '/static/demos/sample-video2.mp4',
        title: 'Second Video title'
    },
    {
        poster: '//non-existing.png',
        source: '//non-existing.mp4',
        title: 'WRONG Video title'
    },
    {
        poster: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg',
        source: '//commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        title: 'he first Blender Open Movie from 2006'
    },
    {
        poster: '//commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg',
        source: '//commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        title: 'HBO GO now works with Chromecast '
    },
    {
        poster: '//commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerEscapes.jpg',
        source: '//commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        title: 'Introducing Chromecast. The easiest way to enjoy'
    },
    {
        poster: '//commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerFun.jpg',
        source: '//commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        title: 'The easiest way to enjoy online video'
    },
    {
        poster: '//commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/SubaruOutbackOnStreetAndDirt.jpg',
        source: '//commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
        title: 'Smoking Tire takes the all-new Subaru Outback'
    },
];

const availablepresetoptions = {
    xs: {
        width: 365,
        height: 180,
        showsidebargallery: false,
        mobile: false
    }, s: {
        width: 523.64,
        height: 225,
        showsidebargallery: true,
        mobile: {
            width: 120
        }
    }, m: {
        width: 640,
        height: 275,
        showsidebargallery: true
    }, l: {
        width: 670.25,
        height: 288,
        showsidebargallery: true,
        videofitstrategy: 'crop',
        // 'sidebaroptions.presetwidth': 33,
        'sidebaroptions.presetwidth': null,
        'sidebaroptions.preferredratio': "16:9", //0.5,
        mobile: {
            showsidebargallery: true
        }
    }, xl: {
        width: 838,
        height: 360,
        showsidebargallery: true
    }, resp: {
        width: '100%',
        showsidebargallery: true,
        'sidebaroptions.aspectratio': '838/360',
        'sidebaroptions.presetwidth': 23.63
    }
};

if (params.nextwidget || params.glr) {
    attrs.nextwidget = Number(params.nextwidget) >= 1;
    attrs.showsidebargallery = Number(params.glr) >= 1;
    if (attrs.showsidebargallery) {
        attrs.sidebaroptions = {
            "headerlogourl": "https://betajs.com/assets/img/logo_home.png",
            "headerlogoimgurl": "https://betajs.com",
            // "presetwidth": "185px",
            // "headerlogoname": "betajs",
        }
    }
    let withPlaylist = attrs.nextwidget || attrs.showsidebargallery;
    if (withPlaylist) {
        attrs.playlist = playlist;
        if (attrs.nextwidget) {
            // Below part will be overwritten if it will be provided in the URL
            attrs.shownext = params.shownext || 2;
            attrs.noengagenext = params.noengagenext || 3;
        }
    }
}

if (params.prk && availablepresetoptions[params.prk]) {
    withPlaylist = true;
    attrs.playlist = playlist;
    attrs.availablepresetoptions = availablepresetoptions;
}

// If not defined nextwidget, we will use default source and poster
if (!withPlaylist) {
    attrs.source = '/static/demos/sample-video.mp4';
    attrs.poster = '/static/demos/assets/sample-cover.png';
}

if (params.shownext) {
    // Seems shownext has to be float number
    attrs.shownext = Number(params.shownext);
}

if (params.noengagenext) {
    // Has to be float number
    attrs.noengagenext = Number(params.noengagenext);
}

const { showsidebargallery, nextwidget } = attrs;
if ((showsidebargallery || nextwidget) && !attrs.playlist) {
    attrs.playlist = playlist;
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

if (showBlocks > 0) {
    const afterPlayerElement = document.createElement('div');
    const afterPlayerContent = document.createElement('div');
    afterPlayerElement.style.minHeight = '150vh';
    afterPlayerElement.style.marginTop = '50px';
    afterPlayerElement.classList.add('row');
    document.body.append(afterPlayerElement);
    generateParagraphs(afterPlayerContent, 10);
    afterPlayerElement.append(afterPlayerContent);
    if (showBlocks > 1) {
        const beforePlayerElement = document.createElement('div');
        const beforePlayerContent = document.createElement('div');
        beforePlayerElement.style.minHeight = '110vh';
        beforePlayerElement.style.marginBottom = '50px';
        beforePlayerElement.classList.add('row');
        document.body.prepend(beforePlayerElement);
        generateParagraphs(beforePlayerContent, 50);
        beforePlayerElement.append(beforePlayerContent);
    }
}

export { attrs, showBlocks, playlist, generateParagraphs, availablepresetoptions };
