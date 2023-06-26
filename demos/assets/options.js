export let gnrok; // = 'https://613d-213-172-83-96.in.ngrok.io/';
let showBlocks = 0;
export const errroAd = '//localhost:5050/static/demos/vast-samples/---error-url---';
export const v3_clickThroughtLocalAd = '//localhost:5050/static/demos/vast-samples/VAST_3_0/Video_Clicks_and_click_tracking-Inline-test.xml';
export const v3_skipable = '//localhost:5050/static/demos/vast-samples/ads-linear-skipable.xml';
export const v3_doubleclick = 'https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/single_preroll_skippable&sz=640x480&ciu_szs=300x250%2C728x90&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=';
// export const v3_doubleclickVMAP = 'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dskippablelinear&correlator=&ad_rule=1';
// export const v3_doubleclickbased = '//localhost:5050/static/demos/vast-samples/based-doubleclick.xml';
export const v4_2_wrapper = '//localhost:5050/static/demos/vast-samples/VAST_4_2/Wrapper_Tag-test.xml';
// export const v4_2_non_linear = '//localhost:5050/static/demos/vast-samples/VAST_4_2/Inline_Non-Linear_Tag-test.xml';
export const v3_non_linear = '//localhost:5050/static/demos/vast-samples/VAST_3_0/Inline_Non-Linear_Tag-test.xml';
// export const v4_2_skipable = (gnrok || '//localhost:5050/') + 'static/demos/vast-samples/VAST_4_2/Inline_Skipable.xml';
export const v4_2_non_skipable = '//localhost:5050/static/demos/vast-samples/VAST_4_2/Inline_NON_Skipable.xml';

// VMAP - Pre-roll Single Ad, Mid-roll Optimized Pod with 3 Ads, Post-roll Single Ad
// var vmap = 'https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/vmap_ad_samples&sz=640x480&cust_params=sample_ar%3Dpremidpostoptimizedpod&ciu_szs=300x250&gdfp_req=1&ad_rule=1&output=vmap&unviewed_position_start=1&env=vp&impl=s&cmsid=496&vid=short_onecue&correlator='
export const vmap = '//localhost:5050/static/demos/vast-samples/VMAP/dc_vmap_pre_1_mid_3_post_1.xml'
export const v4_2_companion = (gnrok || '//localhost:5050/') + 'static/demos/vast-samples/VAST_4_2/Inline_Companion_Tag-test.xml';

// var nonLinear = 'https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/nonlinear_ad_samples&sz=480x70&cust_params=sample_ct%3Dnonlinear&ciu_szs=300x250%2C728x90&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=';
export const nonLinear = '//localhost:5050/static/demos/vast-samples/dc-single_non-linear.xml';
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
        case 0: case '0':
            attrs.adtagurl = null
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
        case 1: case '1': default:
            attrs.adtagurl = v3_doubleclick;
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

// floating only
if (params.flt) {
    attrs.floatingoptions.floatingonly = Number(params.flt) === 1;
}

attrs = {...attrs, ...{
        hideoninactivity: false,
        // ** SOURCES
        source: '/static/demos/sample-video.mp4',
        poster: '/static/demos/assets/sample-cover.png',
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
            // moreURL: "https://ziggeo.com",
            // moreText: "Read more about Ziggeo",
            // hideOnCompletion: true,
            // corner: false
            // corner: "30px",
            // allowRepeat: false,
            // repeatText: "repeatText"
        },
        floatingoptions: {...attrs.floatingoptions, ...{
            // hideplayeronclose: false,
            mobile: {
                height: 75,
                // position: 'bottom'
            },
            desktop: {
                height: 140,
                bottom: 20
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
        // height: 320,
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

export { attrs, showBlocks, generateParagraphs };
