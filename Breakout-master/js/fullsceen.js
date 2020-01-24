const canvas = document.getElementById('breakout');
const ctx = canvas.getContext("2d");
/*
Detect Fullscren
and hide footer and header
*/ 
(function(w, s, d) {
    var timer;
  
    function detect_full_screen() {
      // This clearInterval is for IE.
      clearInterval(timer);
      // rozměry dokumentu
      var d_width = d.documentElement.clientWidth || 0;
      var d_height = d.documentElement.clientHeight || 0;
      // rozměry okna
      var w_width = w.innerWidth || 0; /* Inner, instead of outer, for IE9 */
      var w_height = w.outerHeight || 0;
      var s_width = s.width || 0;
      var s_height = s.height || 0;
      // pokud se rozměry okna rovnají rozměry obrazovky
      if ((w_width === s_width && w_height === s_height) || (d_width === s_width && d_height === s_height)) {
        console.log('Game is on FullScreen')
        // hide footer and header
        // skryje se pomocí css footer a header
        document.getElementById('footer').style.display = 'none';
        document.getElementById('header').style.display = 'none';
        ctx.canvas.width  = window.innerWidth;
        ctx.canvas.height = window.innerHeight;
        canvas.style.height = '99.5%';

      }
      else {
        console.log('Game is not on FullScreen')
        document.getElementById('footer').style.display = 'block';
        document.getElementById('header').style.display = 'block';
        ctx.canvas.width  = window.innerWidth;
        ctx.canvas.height = window.innerHeight;
        canvas.style.height = '90%';
      }
  
    }
  
    detect_full_screen();
    // aby se funkce na zjištění celé obrazovky pořád opakovala
    function bridge() {
      // Clear as window resize fires.
      clearInterval(timer);
      timer = setInterval(detect_full_screen, 100);
    }
    // pří roztáhnutí se interval znovu obnoví 
    if (w.addEventListener) {
      w.addEventListener('resize', bridge, false);
    }
    else if (w.attachEvent) {
      w.attachEvent('onresize', bridge);
    }
    else {
      w.onresize = bridge;
    }
  })(this, this.screen, this.document);