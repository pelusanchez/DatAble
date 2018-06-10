#!/bin/sh
sass sass/main.scss css/main.css
tsc ts/grafika.ts --out js/grafika.js
tsc ts/window.ts --out js/window.js