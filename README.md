
## Space Background

A small javascript library that generates a random background image that's supposed to look like space with stars and nebula clouds.

[DEMO](https://jamesryan83.github.io/space-bg/)


### Configuration

Add this script from the dist folder to your page

`<script src"space-bg.min.js"></script>`

Then add the following element to a page.  The parent element needs to be position: relative

`<div class="sbg"></div>`

Then in javascript after the page has loaded

`new SpaceBackground();`

There's more examples in the index.html file


### Options

| Option               | Type   | Action                                 |
| -------------------- | ------ | -------------------------------------- |
| backgroundEl         | string | nebula and stars container class       |
| nebulaEl             | string | nebula element class                   |
| numClouds            | number | number of nebula clouds (>= 0)         |
| starsEl              | string | stars element class                    |
| numStars             | number | number of stars (>= 0)                 |
| color1               | string | cloud color 1                          |
| color2               | string | cloud color 2                          |
| color3               | string | cloud color 3                          |
| backgroundColor      | string | backgroundEl color                     |
| maxCloudTransparency | number | maximum clound transparency (0 to 100) |
| nebulaData           | array  | an array of clouds                     |
| starsData            | array  | an array of stars                      |


### Notes

colors can be like this #123456 or rgba(1,1,1,0.5) or css named colors

nebulaData and starsData arrays can be provided instead of having them generated.  Alternatively, numClouds and numStars can be used to control the number of clouds and stars.

A single nebulaData array object

`{ xPos: 1, yPos: 2, transparency: 3, color: "rgba(1,1,2,1)" }`

A single starsData arary object

`{ xPos: 1, yPos: 2, size: 1, opacity: 0.1 }`


### Development

Build js only

`npm run start`

Builds js and minified js

`npm run dist`

Run tests

First run `npm run dist` then run `npm run test`


### Other

Idea was originally from here
https://codepen.io/beejaymorgan/pen/rjPwmL
