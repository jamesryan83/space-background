"use strict";

declare let karmaHTML: any;


describe("SpaceBackground", () => {


    beforeEach(function (done) {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;

        karmaHTML[0].open();
        karmaHTML[0].onstatechange = function (ready) {
          if (ready) done();
        };
    });


    afterEach(function () {
        karmaHTML[0].close();
    });




    it("#getCss returns css", () => {
        let sb = getSB(null);
        sb.options = {};
        let css = sb.getCss();

        // check css exists
        expect(css.length).toBeGreaterThan(50);
        expect(css).toContain("sbg");
    });




    it("#addCss does nothing if css is missing", () => {
        let sb = getSB(null);
        let css = sb.addCss();

        expect(css).toBeUndefined();

        let style = getStyleElement();
        expect(style.length).toBe(0);
    });


    it("#addCss adds css to the <head> element", () => {
        let sb = getSB(null);
        sb.options = {};
        let css = sb.getCss();

        let style = getStyleElement();
        expect(style.length).toBe(0);

        expect(css.length).toBeGreaterThan(50);
        expect(css).toContain("sbg");
        sb.addCss(css);

        style = getStyleElement();
        expect(style[0].innerText).toBe(css);
    });




    it("#createRandomClouds returns empty array if numClouds falsy", () => {
        let sb = getSB(null);
        sb.options = {};
        let clouds = sb.createRandomClouds();
        expect(clouds).toEqual([]);

        sb.options = { numClouds: 0 };
        clouds = sb.createRandomClouds();
        expect(clouds).toEqual([]);
    });


    it("#createRandomClouds returns a single cloud", () => {
        let sb = getSB(null);
        sb.options = {
            numClouds: 1,
            color3: "rgba(1,1,1,1)",
            maxCloudTransparency: 30
        }

        let clouds = sb.createRandomClouds();
        checkCloud(clouds[0]);
    });


    it("#createRandomClouds returns 10000 clouds", () => {
        let sb = getSB(null);
        sb.options = {
            numClouds: 10000,
            color1: "rgba(1,1,1,1)",
            color2: "rgba(1,1,1,1)",
            color3: "rgba(1,1,1,1)",
            maxCloudTransparency: 30
        }

        let clouds = sb.createRandomClouds();
        clouds.forEach(x => checkCloud(x));
    });




    it("#createRandomStars returns empty array if numStars falsy", () => {
        let sb = getSB(null);
        sb.options = { maxStarSize: 10 };
        let stars = sb.createRandomStars();
        expect(stars).toEqual([]);

        sb.options = { numStars: 0 };
        stars = sb.createRandomStars();
        expect(stars).toEqual([]);
    });


    it("#createRandomStars returns a single star", () => {
        let sb = getSB(null);
        sb.options = { numStars: 1, maxStarSize: 10 }

        let stars = sb.createRandomStars();
        checkStar(stars[0]);
    });


    it("#createRandomStars returns 10000 stars", () => {
        let sb = getSB(null);
        sb.options = { numStars: 10000, maxStarSize: 10 }

        let stars = sb.createRandomStars();
        stars.forEach(x => checkStar(x));
    });




    it("#createNebulaGradients with no data does nothing", () => {
        let sb = getSB(null);
        sb.options = {};
        let gradients = sb.createNebulaGradients();
        expect(gradients).toBe("");

        sb.options = { nebulaData: [] };
        gradients = sb.createNebulaGradients();
        expect(gradients).toBe("");
    });


    it("#createNebulaGradients generates gradients from generated nebula", () => {
        let sb = getSB(null);
        sb.options = {
            numClouds: 1,
            color3: "rgba(1,1,1,1)",
            maxCloudTransparency: 30
        }

        sb.options.nebulaData = sb.createRandomClouds();
        let n = sb.options.nebulaData[0];
        let gradients = sb.createNebulaGradients();
        expect(gradients).toBe("radial-gradient(circle at " + n.xPos + "% " + n.yPos + "%, " + n.color + " 0%, transparent " + n.transparency + "%)");
    });


    it("#createNebulaGradients generates gradients from user defined nebula", () => {
        let sb = getSB(null);
        sb.options = {
            color3: "rgba(1,1,1,1)",
            maxCloudTransparency: 30,
            nebulaData: [
                { xPos: 1, yPos: 2, transparency: 3, color: "rgba(1,1,2,1)" }
            ]
        }

        let n = sb.options.nebulaData[0];
        let gradients = sb.createNebulaGradients();
        expect(gradients).toBe("radial-gradient(circle at " + n.xPos + "% " + n.yPos + "%, " + n.color + " 0%, transparent " + n.transparency + "%)");

        sb.options = {
            nebulaData: [
                { xPos: 1, yPos: 2, transparency: 3, color: "rgba(1,1,2,1)" },
                { xPos: 2, yPos: 3, transparency: 4, color: "rgba(1,1,3,1)" },
                { xPos: 3, yPos: 4, transparency: 5, color: "rgba(1,1,4,1)" },
                { xPos: 4, yPos: 5, transparency: 6, color: "rgba(1,1,5,1)" },
                { xPos: 5, yPos: 6, transparency: 7, color: "rgba(1,1,6,1)" }
            ]
        }

        n = sb.options.nebulaData[0];
        gradients = sb.createNebulaGradients();
        expect(gradients.match(/(radial-gradient)/g).length).toBe(5);
    });




    it("#createNebula does nothing if there's no nebulaGradients", () => {
        let sb = getSB(null);
        sb.options = {};

        sb.addDiv("sbg-nebula", "sbg");

        sb.createNebula();
        expect(karmaHTML[0].document.getElementsByClassName("sbg-nebula")[0].style.backgroundImage).toBe("");
    });


    it("#createNebula creates a nebula 1", () => {
        let sb = getSB(null);
        sb.options = {
            nebulaEl: "sbg-nebula",
            color3: "rgba(1, 1, 1, 0.9)",
            maxCloudTransparency: 30,
            nebulaData: [
                { xPos: 1, yPos: 2, transparency: 3, color: "rgba(1, 1, 2, 0.5)" }
            ]
        }

        sb.addDiv("sbg-nebula", "sbg");

        let gradients = sb.createNebulaGradients();
        sb.createNebula(gradients);

        expect(karmaHTML[0].document.getElementsByClassName("sbg-nebula")[0].style.backgroundImage).toBe(gradients);
    });


    it("#createNebula creates a nebula 2", () => {
        let sb = getSB(null);
        sb.options = {
            nebulaEl: "sbg-nebula",
            color3: "rgba(1, 1, 1, 0.9)",
            maxCloudTransparency: 30,
            nebulaData: [
                { xPos: 1, yPos: 2, transparency: 3, color: "rgba(1, 1, 2, 0.5)" },
                { xPos: 2, yPos: 3, transparency: 4, color: "rgba(1, 1, 3, 0.5)" },
                { xPos: 3, yPos: 4, transparency: 5, color: "rgba(1, 1, 4, 0.5)" },
                { xPos: 4, yPos: 5, transparency: 6, color: "rgba(1, 1, 5, 0.5)" },
                { xPos: 5, yPos: 6, transparency: 7, color: "rgba(1, 1, 6, 0.5)" }
            ]
        }

        sb.addDiv("sbg-nebula", "sbg");

        let gradients = sb.createNebulaGradients();
        sb.createNebula(gradients);
        expect(karmaHTML[0].document.getElementsByClassName("sbg-nebula")[0].style.backgroundImage).toBe(gradients);
    });




    it("#createStars does nothing if there's no default stars", () => {
        let sb = getSB(null);
        sb.options = {};

        sb.addDiv("sbg-stars", "sbg");

        sb.createStars();
        expect(karmaHTML[0].document.getElementsByClassName("sbg-stars")[0].children.length).toBe(0);
    });


    it("#createStars creates stars 1", () => {
        let sb = getSB(null);
        sb.options = {
            starsEl: "sbg-stars",
            starsData: [
                { xPos: 1, yPos: 2, size: 1, opacity: 0.1 }
            ]
        };

        sb.addDiv("sbg-stars", "sbg");

        sb.createStars();
        expect(karmaHTML[0].document.getElementsByClassName("sbg-stars")[0].children.length).toBe(1);
    });


    it("#createStars creates stars 2", () => {
        let sb = getSB(null);
        sb.options = {
            starsEl: "sbg-stars",
            starsData: []
        };

        for (let i = 0; i < 50; i++) {
            sb.options.starsData.push({
                xPos: i + 1, yPos: i + 2, size: i + 3, opacity: 0.1
            });
        }

        sb.addDiv("sbg-stars", "sbg");

        sb.createStars();
        expect(karmaHTML[0].document.getElementsByClassName("sbg-stars")[0].children.length).toBe(50);
    });




    it("new SpaceBackground() with null does nothing", () => {
        spyOn(SpaceBackground.prototype, "addCss").and.callThrough();
        spyOn(SpaceBackground.prototype, "getCss").and.callThrough();
        spyOn(SpaceBackground.prototype, "createRandomClouds").and.callThrough();
        spyOn(SpaceBackground.prototype, "createNebula").and.callThrough();

        let sb = new SpaceBackground(null);

        // check nothing happend and error was returned
        expect(sb.options).toBeNull();
        expect(sb.addCss).toHaveBeenCalledTimes(0);
        expect(sb.getCss).toHaveBeenCalledTimes(0);
        expect(sb.createRandomClouds).toHaveBeenCalledTimes(0);
        expect(sb.createNebula).toHaveBeenCalledTimes(0);
    });


    it("new SpaceBackground() with invalid backgroundEl logs error", () => {
        spyOn(console, "error");
        spyOn(SpaceBackground.prototype, "addCss").and.callThrough();
        spyOn(SpaceBackground.prototype, "getCss").and.callThrough();
        spyOn(SpaceBackground.prototype, "createRandomClouds").and.callThrough();
        spyOn(SpaceBackground.prototype, "createNebula").and.callThrough();

        let sb = new SpaceBackground({ backgroundEl: "bla" });

        // check nothing happend and error was returned
        expect(sb.options.backgroundEl).toBe("bla");
        expect(sb.addCss).toHaveBeenCalledTimes(0);
        expect(sb.getCss).toHaveBeenCalledTimes(0);
        expect(sb.createRandomClouds).toHaveBeenCalledTimes(0);
        expect(sb.createNebula).toHaveBeenCalledTimes(0);
        expect(console.error).toHaveBeenCalledWith("background element not found");
    });


    it("new SpaceBackground() creates default space background with no options provided", (done) => {
        testNewSpaceBackground(undefined, (doc, head, win, sb, op, bgEl, nebulaEl, starsEl, style) => {

            // check cachced values
            expect(op.color1).toBe("rgba(0, 0, 175, 0.2)");
            expect(op.color2).toBe("rgba(100, 0, 175, 0.2)");
            expect(op.color3).toBe("rgba(77, 0, 0, 0.2)");
            expect(op.maxCloudTransparency).toBe(20);
            expect(op.backgroundEl).toBe("sbg");
            expect(op.numClouds).toBe(25);
            expect(op.numStars).toBe(25);
            expect(op.nebulaData.length).toBe(25);
            expect(op.starsData.length).toBe(25);

            // check function calls
            expect(sb.createRandomClouds).toHaveBeenCalledTimes(1);
            expect(sb.createRandomStars).toHaveBeenCalledTimes(1);
            expect(sb.createStars).toHaveBeenCalledTimes(1);
            expect(sb.createNebula).toHaveBeenCalledTimes(1);

            // check ui
            expect(nebulaEl.style.cssText).toBeTruthy();
            expect(starsEl.children.length).toBe(25); // no stars
            expect(style).toContain(".sbg");

            done();
        });
    });


    it("new SpaceBackground() creates 0 nebula clouds and 0 stars", (done) => {
        testNewSpaceBackground({
            numClouds: 0, numStars: 0
        }, (doc, head, win, sb, op, bgEl, nebulaEl, starsEl, style) => {

            // check cachced values
            expect(op.color1).toBe("rgba(0, 0, 175, 0.2)");
            expect(op.color2).toBe("rgba(100, 0, 175, 0.2)");
            expect(op.color3).toBe("rgba(77, 0, 0, 0.2)");
            expect(op.maxCloudTransparency).toBe(20);
            expect(op.backgroundEl).toBe("sbg");
            expect(op.numClouds).toBe(0);
            expect(op.numStars).toBe(0);
            expect(op.nebulaData.length).toBe(0);
            expect(op.starsData.length).toBe(0);

            // check function calls
            expect(sb.createRandomClouds).toHaveBeenCalledTimes(1);
            expect(sb.createRandomStars).toHaveBeenCalledTimes(1);
            expect(sb.createStars).toHaveBeenCalledTimes(1);
            expect(sb.createNebula).toHaveBeenCalledTimes(1);

            // check ui
            expect(nebulaEl.style.cssText).toBe("");
            expect(starsEl.children.length).toBe(0);
            expect(style).toContain(".sbg");

            done();
        });
    });


    it("new SpaceBackground() creates 1 nebula cloud and 1 star", (done) => {
        testNewSpaceBackground({
            numClouds: 1, numStars: 1
        }, (doc, head, win, sb, op, bgEl, nebulaEl, starsEl, style) => {

            // check cachced values
            expect(op.color1).toBe("rgba(0, 0, 175, 0.2)");
            expect(op.color2).toBe("rgba(100, 0, 175, 0.2)");
            expect(op.color3).toBe("rgba(77, 0, 0, 0.2)");
            expect(op.maxCloudTransparency).toBe(20);
            expect(op.backgroundEl).toBe("sbg");
            expect(op.numClouds).toBe(1);
            expect(op.numStars).toBe(1);
            expect(op.nebulaData.length).toBe(1);
            expect(op.starsData.length).toBe(1);

            // check function calls
            expect(sb.createRandomClouds).toHaveBeenCalledTimes(1);
            expect(sb.createRandomStars).toHaveBeenCalledTimes(1);
            expect(sb.createStars).toHaveBeenCalledTimes(1);
            expect(sb.createNebula).toHaveBeenCalledTimes(1);

            // check ui
            expect(nebulaEl.style.cssText).toBeTruthy();
            expect(starsEl.children.length).toBe(1);
            expect(style).toContain(".sbg");

            done();
        });
    });


    it("new SpaceBackground() creates 2 nebulas cloud and 3 stars", (done) => {
        testNewSpaceBackground({
            nebulaData: [
                { xPos: 1, yPos: 2, transparency: 3, color: "rgba(1, 1, 2, 0.3)" },
                { xPos: 2, yPos: 3, transparency: 4, color: "rgba(1, 1, 3, 0.4)" }
            ],
            starsData: [
                { xPos: 10, yPos: 20, size: 10, opacity: 0.1 },
                { xPos: 20, yPos: 30, size: 11, opacity: 0.2 },
                { xPos: 30, yPos: 40, size: 12, opacity: 0.3 }
            ]
        }, (doc, head, win, sb, op, bgEl, nebulaEl, starsEl, style) => {

            // check cachced values
            expect(op.color1).toBe("rgba(0, 0, 175, 0.2)");
            expect(op.color2).toBe("rgba(100, 0, 175, 0.2)");
            expect(op.color3).toBe("rgba(77, 0, 0, 0.2)");
            expect(op.maxCloudTransparency).toBe(20);
            expect(op.backgroundEl).toBe("sbg");
            expect(op.numClouds).toBe(25);
            expect(op.numStars).toBe(25);
            expect(op.nebulaData.length).toBe(2);
            expect(op.starsData.length).toBe(3);

            // check function calls
            expect(sb.createRandomClouds).toHaveBeenCalledTimes(0);
            expect(sb.createRandomStars).toHaveBeenCalledTimes(0);
            expect(sb.createStars).toHaveBeenCalledTimes(1);
            expect(sb.createNebula).toHaveBeenCalledTimes(1);

            // check ui
            expect(nebulaEl.style.cssText).toBeTruthy();
            expect(starsEl.children.length).toBe(3);
            expect(style).toContain(".sbg");

            done();
        });
    });




    // -------------- Other functions --------------


    // #newSpaceBackground
    function testNewSpaceBackground(options, callback) {
        let doc = karmaHTML[0].document;
        let win = doc.defaultView;

        spyOn(console, "error");
        spyOn(win.SpaceBackground.prototype, "addCss").and.callThrough();
        spyOn(win.SpaceBackground.prototype, "getCss").and.callThrough();
        spyOn(win.SpaceBackground.prototype, "createRandomClouds").and.callThrough();
        spyOn(win.SpaceBackground.prototype, "createNebula").and.callThrough();
        spyOn(win.SpaceBackground.prototype, "createRandomStars").and.callThrough();
        spyOn(win.SpaceBackground.prototype, "createStars").and.callThrough();

        let sb = new win.SpaceBackground(options);

        if (sb.nebulaData) {
            for (var i = 0; i < sb.nebulaData.length; i++) {
                checkCloud(sb.options.nebulaData[i]);
            }
        }

        expect(console.error).toHaveBeenCalledTimes(0);

        let head = getHeadElement();
        let style = getStyleElement();
        return callback(doc, head, win, sb, sb.options,
            doc.getElementsByClassName("sbg")[0],
            doc.getElementsByClassName("sbg-nebula")[0],
            doc.getElementsByClassName("sbg-stars")[0],
            style[0].innerText);
    }



    // returns a new SpaceBackground
    function getSB(options) {
        return new karmaHTML[0].document.defaultView.SpaceBackground(options);
    }


    // Returns the head element
    function getHeadElement() {
        return karmaHTML[0].document.getElementsByTagName('head')[0];
    }


    // Returns the head style element
    function getStyleElement() {
        return karmaHTML[0].document.getElementsByTagName('head')[0]
            .getElementsByTagName("style");
    }


    // Check if a Cloud objects properties are ok
    function checkCloud(cloud) {
        expect(cloud.xPos).toBeGreaterThanOrEqual(0);
        expect(cloud.yPos).toBeGreaterThanOrEqual(0);
        expect(cloud.transparency).toBeGreaterThanOrEqual(0);
        expect(cloud.xPos).toBeLessThan(101);
        expect(cloud.yPos).toBeLessThan(101);
        expect(cloud.transparency).toBeLessThan(101);
        expect(cloud.color).toContain("rgba");
    }


    // Check if a Cloud objects properties are ok
    function checkStar(star) {
        expect(star.xPos).toBeGreaterThanOrEqual(0);
        expect(star.yPos).toBeGreaterThanOrEqual(0);
        expect(star.size).toBeGreaterThanOrEqual(0);
        expect(star.opacity).toBeGreaterThanOrEqual(0);
        expect(star.xPos).toBeLessThan(101);
        expect(star.yPos).toBeLessThan(101);
        expect(star.opacity).toBeLessThan(101);
    }

});
