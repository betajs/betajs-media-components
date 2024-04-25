const Types = BetaJS.Types;
const Objs = BetaJS.Objs;
const Comparators = BetaJS.Comparators;

import deepCheck from '../utils/deepCheck.js';

const attrs = {
    width: 200,
    height: '100px',
    autoplay: true,
    outstream: true,
    imasettings: {
        vpaidMode: '1'
    },
    imaadsrenderingsetting: {
        enablePreloading: false, // should be changed, based on initial options
        uiElements: ['adlabel', 'countdown', 'skip']
    },
    outstreamoptions: {
        allowRepeat: false, // << this one was changed
        noEndCard: false, // << this one as per initial options
        something: 13, // << this one if not defined at all
    },
    presetkey: 'prKey',
    showsidebargallery: false,
};

const presetAttrs = {
    availablepresetoptions: {
        prKey: {
            width: 120,
            theme: 'modern',
            themecolor: 'red',
        }
    }
};

const player = new BetaJS.MediaComponents.VideoPlayer.Dynamics.Player({
    element: $("#visible-fixture").get(0),
    attrs: {
        ...attrs,
        ...presetAttrs,
        // source: testasset('movie.mp4'),
        // poster: testasset('movie.png')
    }
});

// setTimeout(() => {
//     console.log("Real height of kkk", player.get("width"));
// }, 1000);

// Will test the initial state of the player // asyncTest
QUnit.test("test user set attributes correctness", assert => {
    // create a clone
    const initialValues = Object.assign({}, player.get("initialoptions"));
    player.__mergeWithInitialOptions();
    // assert.timeout(300); // Not supported on QUnit v2.20.0
    Objs.iter(attrs, (v, k) => {
        if (player.get("presetkey") && presetAttrs.availablepresetoptions[attrs.presetkey] && presetAttrs.availablepresetoptions[attrs.presetkey][k]) {
            assert.equal(true, true, `for ${k} it will run in separate test related presetKeys`);
        } else {
            if (v !== null && Types.is_defined(v)) {
                if (Types.is_defined(player.get("initialoptions")[k]))
                    if (initialValues[k] === null) {
                        assert.equal(player.get(k), player.get(`initialoptions.${k}`), `${k} was ${initialValues[k]} now it's ${player.get(`initialoptions.${k}`)} in initialoptions`);
                    } else {
                        if (Types.is_object(player.get(`initialoptions.${k}`))) {
                            Objs.iter(player.get(`initialoptions.${k}`), (_v, _k) => {
                                if (Types.is_object(_v)) {
                                    if (attrs[k] && attrs[k][_k] !== null && Types.is_defined(attrs[k][_k])) {
                                        if (Comparators.deepEqual(player.get(`${k}.${_k}`), attrs[k][_k])) {
                                            assert.equal(true, true, `${k}.${_k}: is equal ${attrs[k][_k]}`);
                                        }
                                    }
                                } else {
                                    if (attrs[k] && attrs[k][_k] !== null && Types.is_defined(attrs[k][_k])) {
                                        assert.equal(player.get(`${k}.${_k}`), attrs[k][_k], `${k}.${_k}: is equal ${attrs[k][_k]}`);
                                    } else {
                                        assert.equal(player.get(`${k}.${_k}`), _v, `${k}.${_k}: is equal ${_v}`);
                                    }
                                }
                            }, player);
                        } else {
                            deepCheck(assert, player, k, v, player.get(`initialoptions`));
                        }
                    }
                else
                    assert.equal(player.get(k), v, `${k} is ${JSON.stringify(v)}`);
            }
        }
    });
});

// Will test the initial state of the player // asyncTest
QUnit.test("test preset attributes correctness", assert => {
    if (presetAttrs.availablepresetoptions && attrs.presetkey) {
        Objs.iter(presetAttrs.availablepresetoptions[attrs.presetkey], (v, k) => {
            assert.equal(true, Comparators.deepEqual(player.get(k), v), `${k} is ${v}`);
        });
    } else {
        assert.ok(false, "Preset attributes are not defined");
    }
});


QUnit.test("test device related settings applied", assert => {
  let isMobile = true;
  const currentAttrs = player.cloneAttrs();
  let settings = {
    sidebaroptions: {
      foo: `bar`,
      mobile: {
        foo: `baz`,
      },
      desktop: {
        foo: `baz-baz`,
      }
    },
    floatingoptions: {
      floatingonly: false,
      sidebar: true,
      mobile: {
        sidebar: false,
      },
      desktop: {
        floatingonly: true,
      }
    }
  };

  player.setAll({
    sidebaroptions: {
      ...currentAttrs[`sidebaroptions`],
      ...settings.sidebaroptions,
      mobile: {
        ...currentAttrs.sidebaroptions?.mobile,
        ...settings[`sidebaroptions`][`mobile`],
      },
      desktop: {
        ...currentAttrs.sidebaroptions?.desktop,
        ...settings[`sidebaroptions`][`desktop`],
      }
    },
    floatingoptions: {
      ...currentAttrs[`floatingoptions`],
      ...settings.floatingoptions,
      mobile: {
        ...currentAttrs.floatingoptions?.mobile,
        ...settings[`floatingoptions`][`mobile`],
      },
      desktop: {
        ...currentAttrs.floatingoptions?.desktop,
        ...settings[`floatingoptions`][`desktop`],
      }
    },
  });

  player.applyPresets(isMobile);
  assert.equal(player.get(`sidebaroptions.foo`), settings.sidebaroptions[`mobile`].foo);
  assert.equal(player.get(`floatingoptions.sidebar`), settings.floatingoptions[`mobile`].sidebar);
  assert.equal(player.get(`floatingoptions.position`), currentAttrs.floatingoptions.mobile.position);
  assert.notEqual(player.get(`floatingoptions.position`), currentAttrs.floatingoptions.desktop.position);

  // Apply as desktop view
  player.applyPresets(!isMobile);
  assert.equal(player.get(`sidebaroptions.foo`), settings.sidebaroptions[`desktop`].foo);
  assert.equal(player.get(`floatingoptions.floatingonly`), settings.floatingoptions[`desktop`].floatingonly);
  assert.equal(player.get(`floatingoptions.position`), currentAttrs.floatingoptions.desktop.position);
  assert.notEqual(player.get(`floatingoptions.position`), currentAttrs.floatingoptions.mobile.position);
});
