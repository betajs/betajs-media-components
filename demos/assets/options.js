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
    adchoiceslink: Number(params.ac) === 1 ? 'https://ziggeo.com/privacy/' : null,
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
        case 6: case '6': case 'companion': case 'cmp': // with Companion Ads
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

// ads positions
if (params.adp) {
    attrs.adsposition = params.adp;
}

// sticky/floating sidebar
if (params.sbr) {
    attrs.floatingoptions.sidebar = Number(params.sbr) === 1;
}

if (attrs.adtagurl && params.acl) {
    attrs.adchoiceslink = 'https://betajs.com/builds.html';
}

// floating only
if (params.flt) {
    attrs.floatingoptions.floatingonly = Number(params.flt) === 1;
}

// Show Companion Ad
if (params.cmp) {
    attrs.companionad = Number(params.flt) === 1 ? true : '[300,]|bottom';
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

if (params.nextwidget || params.glr) {
    attrs.nextwidget = Number(params.nextwidget) >= 1;
    attrs.showsidebargallery = Number(params.glr) >= 1;
    if (attrs.showsidebargallery) {
        attrs.sidebaroptions = {
            "headerlogourl": "https://betajs.com/assets/img/logo_home.png",
            // "presetwidth": "185px",
            // "headerlogoname": "betajs",
        }
    }
    let withPlaylist = attrs.nextwidget || attrs.showsidebargallery;
    if (withPlaylist) {
        attrs.playlist = playlist;
        if (attrs.nextwidget) {
            // Below part will be overwritten if it will be provided in the URL
            attrs.shownext = 2;
            attrs.noengagenext = 3;
        }
    }
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

attrs = {...attrs, ...{
        // autoplaywhenvisible: true,
        // hidebeforeadstarts: false, // Will help hide player poster before ads start
        // showplayercontentafter: 1500, // we can set any seconds to show player content in any case if ads not intialized
        // hideoninactivity: false,
        // ** SOURCES
        // width: 640,
        minadintervals: 0,
        muted: true,
        unmuteonclick: true,
        // sidebarpresetwidth: "300px" // 24,
        // hidecontrolbar: true,
        // hideadscontrolbar: true,
        imasettings: {
            // ** IMA
            locale: 'fr',
            uiElements: [], // ['adAttribution', 'countdown']
            // uiElements: ['adAttribution'],
            // uiElements: ['countdown'],
            // uiElements: ['adAttribution', 'countdown'],
        },
        // presetedtooltips: {
        //     "onclicktroughexistence": {
        //         "closeable": true,
        //         // "position": "top-right", // default: "top-right", other options: top-center, top-left, bottom-right, bottom-center, bottom-left
        //         "pauseonhover": true, //  default: false
        //         "showprogressbar": true, // default: false, will show progressbar on tooltip completion
        //         // "showonhover": false, // TODO: will be shown on hover only
        //         // "queryselector": null // TODO: will be shown on hover only on this element
        //         "tooltiptext": "Click again to learn more",
        //         "disappearafterseconds": 5 // -1 will set it as showing always, default: 2 seconds
        //     }
        // },

        // source: '/static/demos/assets/portrait.mp4',
        // poster: '/static/demos/assets/portrait-poster.png',
        // poster: '/static/demos/assets/portrait-poster-270x480.jpeg',
        // source: 'https://storage.googleapis.com/cpe-sample-media/content/big_buck_bunny/prog/big_buck_bunny_prog.mp4', // << Chromecast
        // poster: 'https://storage.googleapis.com/cpe-sample-media/content/big_buck_bunny/images/screenshot1.png', // << Chromecast
        // source: '/static/demos/assets/huge_video.mp4',
        // sources: [
        //     {
        //         // src:'/static/demos/assets/portrait.mp4'
        //         src:'/static/demos/sample-video.mp4'
        //         // , poster: '/static/demos/assets/portrait-poster.png'
        //         , hd: true
        //         // , poster: '/static/demos/sample-cover.png'
        //     },
        //     {
        //         // src:'/static/demos/assets/portrait.mp4'
        //         // , poster:'/static/demos/assets/portrait-poster.png', hd: false
        //         src:'/static/demos/sample-video2.mp4'
        //         // , hd: false
        //         , poster: '/static/demos/sample-cover.png'
        //     }
        // ],
        // streams: [{label:'HD', filter:{hd:true} }, {label:'SD', filter:{hd: false} }],
        // 'ba-playlist': [
        //     {poster: 'sample-cover2.png', source: 'sample-video2.mp4'},
        //     {poster: 'sample-cover.png', source: 'sample-video.mp4'},
        //     {poster: 'sample-cover.png', source: 'sample-video3.mp4'}
        // ],

        // **ADS
        // adsposition: "mid[12*], post",
        // 'companionad': '[300,250]|left',
        // 'companionad': '[300,]|top',
        // 'companionad': '[]|bottom',
        // 'companionad': '[300,]|bottom',
        // 'companionad': 'companion-selector[300,200]',
        // 'companionad': 'companion-fluid[fluid]',
        // adsposition: "post",
        outstreamoptions: {
            recurrenceperiod: 5000, // Period when a new request will be sent if ads is not showing, default: 30 seconds
            // maxadstoshow: -1 // Maximum number of ads to show; default: -1 (unlimited)
            // maxadstoshow: 0 // Maximum number of ads to show; default: -1 (unlimited)
            // moreURL: "https://ziggeo.com",
            // moreText: "Read more about Ziggeo",
            // hideOnCompletion: true,
            // corner: false
            // corner: "30px",
            // allowRepeat: false,
            // repeatText: "repeatText"
        },
        sidebaroptions: {
            "headerlogourl": "https://betajs.com/assets/img/logo_home.png",
            "headerlogoname": "Beta JS",
        },
        availablepresetoptions: {
            'xs': {
                width: 365,
                height: 180,
                showsidebargallery: false
            }, 's': {
                width: 523.64,
                height: 225,
                showsidebargallery: true,
                playlist
            },
            'm': {
                width: 640,
                height: 275,
                showsidebargallery: true
            }, 'l': {
                width: 670.25,
                height: 288,
                showsidebargallery: true
            }, 'xl': {
                width: 838,
                height: 360,
                showsidebargallery: true
            }
        },
        // fitonwidth: true,
        floatingoptions: {...attrs.floatingoptions, ...{
            showcompanionad: true,
            // hideplayeronclose: false,
            mobile: {
                height: 120,
                companionad: false,
                // position: 'bottom'
                // companionad: "[,250]",
                // top: 40,
                positioning: {
                    // applyProperty: 'margin-top', // default: 'margin-top'
                    // applySelector: `div.ba-player-floating`, // default: div.ba-player-floating
                    relativeSelector: `div#header`,
                    // relativeSelector: null,
                },
                sidebar: true,
                size: "l",
                availablesizes: {
                    'xs': 50, 's': 75, 'm': 80, 'l': 120, 'xl': 150
                }
            },
            desktop: {
                height: 150,
                bottom: 20,
                companionad: true, //"[]|bottom", //"[]|top", // true
                sidebar: true,

                size: "xs",
                availablesizes: {
                    'xs': 169, 's': 183, 'm': 197, 'l': 211, 'xl': 225
                }
            }
        }},
        // adsposition: "pre, mid, post",
        // adsposition: "mid[5*]",
        // minadintervals: 8,

        // **FLOATING - STICKY
        // visibilityfraction: 0.01,
        // 'sticky-threshold': 0.1,
        // 'sticky-position': 'bottom-right',

        // **THEMES
        // theme: "modern",
        // theme: "cube",
        // theme: "elevate",
        // theme: "minimalist",
        // theme: "modern",
        // theme: "space",
        // theme: "theatre",

        // **SETTINGS
        // height: 120,
        // width: 400,
        // width: '640px',
        // width: '80%',
        // videofitstrategy: "pad",// "crop", "pad", "original"

        // popup: true,
        // showduration: true ,
        // preload: true,
        // fitonwidth: true,
        // fitonheight: true,
        // chromecast: true, // Will work only with valid URL, use ngrock for testing
        // fullscreenmandatory: true,
        // showsettingsmenu: false,
        // showchaptertext: true,
        // preload: true,
        // tracktagsstyled: false,
        // loop: true,
        // tracktags: [
        //     {
        //         lang: 'en',
        //         kind: 'subtitles',
        //         label: 'English',
        //         //enabled: true,
        //         src: '../assets/bunny-en.vtt'
        //     },
        //     {
        //         lang: 'de',
        //         kind: 'subtitles',
        //         label: 'Deutsch',
        //         //enabled: true,
        //         src: '../assets/bunny-de.vtt'
        //     },
        //     {
        //         kind: 'thumbnails',
        //         // src: '/static/demos/assets/example-3rdp.vtt'
        //         src: '/static/demos/assets/video-bgbb.vtt'
        //     },
        //     {
        //         kind: 'chapters',
        //         // src: '/static/demos/assets/example-3rdp.vtt'
        //         src: '/static/demos/assets/video-bgbb-chapters.vtt'
        //     }
        // ],
    }
};

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

export { attrs, showBlocks, playlist, generateParagraphs };
