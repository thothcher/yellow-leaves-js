'use strict';

/* =========================================================
   SEASONS — each one has its own song, forest photo and leaf colours.
   Autumn with Kancheli's "Yellow Leaves" is the default.
   songs:  YouTube videos, all checked to play when embedded; the next one
           is a fallback if one is removed. The first one is the season's song.
   dim:    brightness of the photo, so bright snow doesn't drown the text.
   leaves: colours a leaf sprouts with, turns into, and dries to.
   ========================================================= */

const KANCHELI = { artist: 'გია ყანჩელი', track: 'ყვითელი ფოთლები' };
const LOFI_GIRL = 'Lofi Girl';

const SEASONS = [
    {
        id: 'autumn',
        name: 'შემოდგომა',
        icon: 'leaf',
        songs: ['XVAHq7fzDZk', 'SJ_9Oa8tx2c', 'JPhrc757gog', 'mpTPbaVyXIk'].map(id => ({ id, ...KANCHELI })),
        image: 'assets/seasons/autumn.jpg',
        thumb: 'assets/seasons/autumn-small.jpg',
        dim: 0.85,
        leaves: {
            young: [[92, 170, 96]],
            turn: [[238, 198, 74], [238, 198, 74], [238, 198, 74], [232, 134, 56], [232, 134, 56], [204, 82, 54]],
            dry: [146, 98, 54],
        },
    },
    {
        id: 'winter',
        name: 'ზამთარი',
        icon: 'snowflake',
        songs: [
            { id: 'lTRiuFIWV54', artist: LOFI_GIRL, track: '1 A.M Study Session' },
            { id: 'S_MOd40zlYU', artist: LOFI_GIRL, track: 'dark ambient radio' },
        ],
        image: 'assets/seasons/winter.jpg',
        thumb: 'assets/seasons/winter-small.jpg',
        dim: 0.62,
        leaves: {
            young: [[128, 158, 124]],
            turn: [[226, 214, 180], [196, 160, 112], [236, 236, 228]],
            dry: [128, 100, 76],
        },
    },
    {
        id: 'spring',
        name: 'გაზაფხული',
        icon: 'sprout',
        songs: [
            { id: '1fueZCTYkpA', artist: LOFI_GIRL, track: 'Morning Coffee' },
            { id: '7NOSDKb0HlU', artist: 'Chillhop Music', track: 'lofi hip hop radio' },
        ],
        image: 'assets/seasons/spring.jpg',
        thumb: 'assets/seasons/spring-small.jpg',
        dim: 1,
        leaves: {
            young: [[126, 204, 104]],
            turn: [[170, 222, 110], [246, 186, 206], [252, 222, 230]],
            dry: [214, 160, 176],
        },
    },
    {
        id: 'summer',
        name: 'ზაფხული',
        icon: 'sun',
        songs: [
            { id: '4xDzrJKXOOY', artist: LOFI_GIRL, track: 'synthwave radio' },
            { id: '5yx6BWlEVcY', artist: 'Chillhop Music', track: 'Chillhop Radio' },
        ],
        image: 'assets/seasons/summer.jpg',
        thumb: 'assets/seasons/summer-small.jpg',
        dim: 0.8,
        leaves: {
            young: [[60, 150, 76]],
            turn: [[40, 120, 60], [110, 170, 64], [196, 200, 72]],
            dry: [150, 140, 64],
        },
    },
];
