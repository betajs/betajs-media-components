/* This probably requires some Selenium-type interaction */
// Will test the initial state of the player // asyncTest
const Objs = BetaJS.Objs;
const Dom = BetaJS.Browser.Dom;

const playerElementContainer = $("#visible-fixture").get(0);
const player = new BetaJS.MediaComponents.VideoPlayer.Dynamics.Player({
	element: playerElementContainer,
});

QUnit.test("preset fixed width and height", assert => {
  let playerSizes, updatedStyles, playerContinerSize, containerWidthNum, containerHeightNum;
  let presetAspectRatio = player.get(`aspectratio`) || player.get(`fallback-aspect-ratio`);

  updatedStyles = Object.assign({}, player.get(`computedstyles`));
  assert.equal(Objs.count(updatedStyles), 0, `initially no computed styles`);

  playerSizes = {
    width: 400,
    height: 320
  }

  player.setAll(playerSizes);

  // Later on resize this function will be called automatically
  player.__computeContainersStyleStates(playerSizes);
  playerContinerSize = Dom.elementDimensions(playerElementContainer);
  updatedStyles = Object.assign({}, player.get(`computedstyles`));
  assert.notEqual(Objs.count(updatedStyles), 0, `after we've computed styles`);

  assert.equal(
    player.__convertCSSUnitToNumber(updatedStyles.activeElement.width),
    playerContinerSize.width,
    `activeElement: width is ${playerContinerSize.width}`
  );
  assert.equal(
    player.__convertCSSUnitToNumber(updatedStyles.activeElement.height),
    playerContinerSize.height,
    `activeElement: width is ${playerContinerSize.height}`
  );

  assert.equal(
    player.__convertCSSUnitToNumber(updatedStyles.container.width),
    playerContinerSize.width, `container: width is ${updatedStyles.activeElement.width}`
  );
  assert.equal(
    player.__convertCSSUnitToNumber(updatedStyles.container.height),
    playerContinerSize.height, `container: width is ${updatedStyles.activeElement.height}`
  );

  // New container size
  // playerSizes = {
  //   width: 400,
  //   height: null
  // }
  // player.setAll(playerSizes);
  // updatedStyles = Object.assign({}, player.get(`computedstyles`));
  // console.log(`updtedStyles: `);

  // player.__computeContainersStyleStates();
  // playerContinerSize = Dom.elementDimensions(playerElementContainer);
  // updatedStyles = Object.assign({}, player.get(`computedstyles`));
  // console.log(`updtedStyles after: `, updatedStyles);

  // console.log(`playerContainerSized: `, playerContinerSize);

  // assert.equal(
  //   updatedStyles.container.width / updatedStyles.container.height, presetAspectRatio,
  //   `aspect ratio is ${presetAspectRatio}`
  // );
  // assert.equal(
  //   updatedStyles.activeElement.aspectratio, null, `activeElement: AR is null`
  // );
  // assert.equal(Objs.count(updatedStyles.sidebar), 0, `as no sidebar it has no any presets`);
  // assert.equal(
  //   updatedStyles.activeElement.aspectRatio,
  //   player.get(`aspectratio`), `activeElement: width is: ${updatedStyles.activeElement.aspectRatio}`
  // );
  // console.log(`asp `, aspectRatio);
});
