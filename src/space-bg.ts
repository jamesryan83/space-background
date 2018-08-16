
// Options
interface SBOptions {
    backgroundEl?: string,
    nebulaEl?: string,
    nebulaData?: SBCloud[],
    numClouds?: number,
    starsEl?: string,
    starsData?: SBStar[],
    numStars?: number,
    color1?: string,
    color2?: string,
    color3?: string,
    starColor?: string,
    backgroundColor?: string,
    maxCloudTransparency?: number,
    maxStarSize?: number,
    debug?: boolean
}

// A single cloud
interface SBCloud {
    xPos: number;
    yPos: number;
    transparency: number;
    color: string;
}

// A single star
interface SBStar {
    xPos: number;
    yPos: number;
    size: number;
    opacity: number;
}

// Space Background
class SpaceBackground {


    constructor(public options: SBOptions) {
        if (options === null) return;
        if (!options) options = {};

        // set default values
        options = {
            backgroundEl: options.backgroundEl || "sbg",
            nebulaEl: "sbg-" + (options.backgroundEl || "nebula"),
            nebulaData: options.nebulaData || [] as SBCloud[],
            starsEl: "sbg-" + (options.backgroundEl || "stars"),
            starsData: options.starsData || [] as SBStar[],
            color1: options.color1 || "rgba(0, 0, 175, 0.2)",   // Blue
            color2: options.color2 || "rgba(100, 0, 175, 0.2)", // Purple
            color3: options.color3 || "rgba(77, 0, 0, 0.2)",    // Orange
            backgroundColor: options.backgroundColor || "linear-gradient(to top, #01020e, #040920, #020413)",
            starColor: options.starColor || "white",
            maxCloudTransparency: options.maxCloudTransparency || 20,
            maxStarSize: options.maxStarSize || 10,
            numClouds: options.numClouds,
            numStars: options.numStars,
            debug: options.debug || false
        }

        if (!options.numClouds && options.numClouds != 0) options.numClouds = 25;
        if (!options.numStars && options.numStars != 0) options.numStars = 25;

        this.options = options;

        // Get background element
        let bgEl = document.getElementsByClassName(options.backgroundEl)[0];
        if (!bgEl) { console.error("background element not found"); return; }


        // remove old children
        while(bgEl.firstChild) { bgEl.removeChild(bgEl.firstChild); }


        // add new elements
        this.addDiv(options.nebulaEl, options.backgroundEl);
        this.addDiv(options.starsEl, options.backgroundEl);


        // add default css
        this.addCss(this.getCss());


        // create data and add items to dom
        if (options.nebulaData.length === 0) options.nebulaData = this.createRandomClouds();
        this.createNebula(this.createNebulaGradients());

        if (options.starsData.length === 0) options.starsData = this.createRandomStars();
        this.createStars();

        if (options.debug) console.log(options);
    }


    // adds a div to a container
    addDiv(classname: string, container: any) {
        let div = document.createElement("div");
        div.classList.add(classname);
        document.getElementsByClassName(container)[0].appendChild(div);
    }


    // Returns the default css
    getCss(): string {
        return "." + this.options.backgroundEl + ", .sbg-nebula, .sbg-stars { position: absolute; top: 0; left: 0; height: 100%; width: 100%; z-index: -1 } " +
            "." + this.options.backgroundEl + " { background: " + (this.options.backgroundColor || "transparent") + "; } " +
            ".nebula-star { position: absolute; border-radius: 50%; } ";
    }


    // For adding the default css to the document
    // https://stackoverflow.com/q/3922139
    addCss(css: string) {
        if (!css) return;

        var head = document.getElementsByTagName('head')[0];
        var s = document.createElement('style');
        s.setAttribute('type', 'text/css');
        if (s["styleSheet"]) { // IE
            s["styleSheet"].cssText = css;
        } else {
            s.appendChild(document.createTextNode(css));
        }
        head.appendChild(s);
    }


    // Returns an array of random nebula clouds
    createRandomClouds(): SBCloud[] {
        let clouds = [] as SBCloud[];

        for (let i = 0; i < this.options.numClouds; i++) {
            let color = i < 2 ?
                this.options.color3 : // first few are color3
                (Math.ceil(Math.random() * 2) < 2 ? this.options.color1 : this.options.color2);

            clouds.push({
                xPos: Math.round(Math.random() * 100),
                yPos: Math.round(Math.random() * 100),
                transparency: Math.round(Math.random() * this.options.maxCloudTransparency),
                color: color
            });
        }

        return clouds;
    }


    // Returns an arrar of random stars
    createRandomStars(): SBStar[] {
        let stars = [] as SBStar[];

        for (let i = 0; i < this.options.numStars; i++) {
            stars.push({
                xPos: Math.round(Math.random() * 98),
                yPos: Math.round(Math.random() * 98),
                size: Math.round(Math.random() * this.options.maxStarSize),
                opacity: Math.round(Math.random() * 100)
            });
        }

        return stars;
    }


    // Create nebula gradient strings
    createNebulaGradients(): string {
        if (!this.options.nebulaData || this.options.nebulaData.length === 0) return "";

        let gradients = this.options.nebulaData.map(x => {
            return "radial-gradient(circle at " + x.xPos + "% " + x.yPos + "%, " +
                x.color + " 0%, transparent " + x.transparency + "%)";
        }).join(", ") || "";

        return gradients;
    }


    // Create Nebula
    createNebula(nebulaGradients: string) {
        if (!nebulaGradients) return;

        let el = document.getElementsByClassName(this.options.nebulaEl)[0];
        el.setAttribute("style", "position:absolute;left:0;top:0;height:100%;width:100%;background-image:" + nebulaGradients);
    }


    // Create stars
    createStars() {
        if (!this.options.starsData || this.options.starsData.length === 0) return;

        let frag = document.createDocumentFragment();
        this.options.starsData.forEach(x => {
            let star = document.createElement("div");
            star.classList.add("nebula-star");
            star.style.left = `${x.xPos}%`;
            star.style.top = `${x.yPos}%`;
            star.style.width = `${x.size}px`;
            star.style.height = `${x.size}px`;
            star.style.opacity = `${x.opacity}`;
            star.style.backgroundImage = "radial-gradient(circle at 50% 50%, " + this.options.starColor + " 0%, transparent 85%)"
            frag.appendChild(star);
        });

        document.getElementsByClassName(this.options.starsEl)[0].appendChild(frag);
    }

}
