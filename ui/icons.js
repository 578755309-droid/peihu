/* Original 24px shopping UI icons: rounded 1.75px strokes, no brand assets. */
(function (global) {
  'use strict';
  const paths = {
    home:'M3 10.5 12 3l9 7.5V21h-6v-7H9v7H3z',
    service:'M6 4h12v17H6z M9 2v4m6-4v4M6 9h12m-9 4h6m-6 4h4',
    cart:'M3 4h2l2 12h12l2-9H6m3 13h.01M18 20h.01',
    bag:'M4 7h16l-1 14H5L4 7zm4 1V6a4 4 0 0 1 8 0v2',
    message:'M4 4h16v13h-8l-5 4v-4H4z M8 9h8m-8 4h5',
    user:'M8 7a4 4 0 1 0 8 0 4 4 0 0 0-8 0z M4 21a8 8 0 0 1 16 0',
    location:'M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 0 1 14 0z M9.5 10a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0',
    left:'m15 5-7 7 7 7', right:'m9 5 7 7-7 7', down:'m5 9 7 7 7-7', up:'m5 15 7-7 7 7',
    close:'m6 6 12 12M18 6 6 18', plus:'M12 4v16M4 12h16', minus:'M4 12h16',
    search:'M3 10a7 7 0 1 0 14 0 7 7 0 0 0-14 0zm12 5 6 6',
    calendar:'M4 5h16v16H4z M8 2v6m8-6v6M4 10h16m-12 4h2m4 0h2m-8 4h2',
    clock:'M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0z M12 7v5l4 2',
    phone:'M5 3 3 5c-1 6 10 17 16 16l2-2-5-4-2 2c-3-1-6-4-7-7l2-2-4-5z',
    check:'m5 12 4 4L19 6', success:'M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0z m5 0 3 3 5-6',
    shield:'m12 2 8 3v7c0 5-8 10-8 10S4 17 4 12V5l8-3z m-4 10 3 3 5-6',
    info:'M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0z M12 11v6m0-10h.01',
    warning:'M12 3 2 21h20L12 3z M12 9v5m0 3h.01',
    help:'M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0z M9 9a3 3 0 0 1 6 0c0 2-3 2-3 5m0 3h.01',
    upload:'M12 16V3m-5 5 5-5 5 5M4 15v6h16v-6',
    download:'M12 3v13m-5-5 5 5 5-5M4 17v4h16v-4',
    edit:'m4 15 12-12 5 5L9 20l-6 1 1-6z M13 6l5 5',
    trash:'M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7',
    bell:'M5 17h14l-2-3V9A5 5 0 0 0 7 9v5l-2 3z M10 21h4M12 2v2',
    settings:'m10 2 4 0 1 3 3 1 3 0 2 4-2 3v3l-3 2-1 3h-5l-1-3-3-1-3-3 1-4 2-1 1-3 1-1z M9 12a3 3 0 1 0 6 0 3 3 0 0 0-6 0',
    hospital:'M5 5h14v17H5z M9 5V2h6v3m-3 3v6m-3-3h6m-6 11v-5h6v5',
    bath:'M3 11h18v4a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5v-4z M5 11V5a3 3 0 0 1 6 0M7 20v2m10-2v2',
    heart:'M12 21S2 15 2 8a5 5 0 0 1 10-2 5 5 0 0 1 10 2c0 7-10 13-10 13z',
    star:'m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-6z',
    payment:'M3 5h18v15H3z M3 10h18M7 16h4',
    package:'m3 6 9-4 9 4v13l-9 4-9-4V6zm0 0 9 5 9-5M12 11v12M7 4l9 5v4',
    mail:'M3 5h18v15H3z m0 0 9 8 9-8',
    send:'m3 3 19 9-19 9 4-9-4-9zm4 9h15',
    logout:'M10 3H3v18h7m4-14 5 5-5 5M8 12h13',
    camera:'M3 7h5l2-4h4l2 4h5v14H3z M8 14a4 4 0 1 0 8 0 4 4 0 0 0-8 0',
    filter:'M3 4h18l-7 8v8l-4 2V12L3 4z'
  };
  global.AKBIcons = Object.freeze(paths);
})(window);
