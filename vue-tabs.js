//---------------------------------------------------------------------
//
// vue-tabs.js
//
// Copyright (c) 2020 Kazuhiko Arase
//
// URL: https://github.com/kazuhikoarase/vue-metronome/
//
// Licensed under the MIT license:
//  http://www.opensource.org/licenses/mit-license.php
//

'use strict'

!function() {

  var codes = {

    Z:  { name: '-',  notes: [ 0, 0, 0, 0 ] },

    C:  { name: 'C',  notes: [ 0, 0, 0, 3 ] },
    C7: { name: 'C7', notes: [ 0, 0, 0, 1 ] },

    Dm: { name: 'Dm', notes: [ 2, 2, 1, 0 ] },
    D7: { name: 'D7', notes: [ 2, 0, 2, 0 ] },

    Em: { name: 'Em', notes: [ 0, 4, 3, 2 ] },
    E7: { name: 'E7', notes: [ 1, 2, 0, 2 ] },

    F:  { name: 'F',  notes: [ 2, 0, 1, 0 ] },
    Fm: { name: 'Fm', notes: [ 1, 0, 1, 3 ] },

    G:  { name: 'G',  notes: [ 0, 2, 3, 2 ] },
    G7: { name: 'G7', notes: [ 0, 2, 1, 2 ] },

    Am: { name: 'Am', notes: [ 2, 0, 0, 0 ] },
    A7: { name: 'A7', notes: [ 0, 1, 0, 0 ] }
  };

  var textBBox = null;

  var components = {
    tab: {
      template: '<svg xmlns="http://www.w3.org/2000/svg"' +
          ' x="0px" y="0px" :width="sWidth" :height="sHeight"' +
          ' :view-box.camel="sViewBox">' +
          '<text ref="name" x="0" :fill="color"' +
            ' :y="textBBox? textBBox.height : 0">{{params.name}}</text>' +
          '<path v-for="hLine in params.hLines" :d="hLine" :style="hLineStyle"></path>' +
          '<path v-for="vLine in params.vLines" :d="vLine" :style="vLineStyle"></path>' +
          '<rect v-if="params.rootRect"' +
            ' :x="params.rootRect.x"' +
            ' :y="params.rootRect.y"' +
            ' :width="params.rootRect.width"' +
            ' :height="params.rootRect.height"' +
          ' :style="rootStyle" ></rect>' +
          '<circle v-for="point in params.points"' +
            ' :cx="point.x" :cy="point.y" :r="params.noteRadius"' +
            ' :style="point.open? openNoteStyle : noteStyle"></circle>' +
        '</svg>',
      mounted: function() {
        if (!textBBox) {
          var tx = this.$refs.name.textContent;
          this.$refs.name.textContent = 'M';
          textBBox = this.$refs.name.getBBox();
          this.$refs.name.textContent = tx;
        }
        this.textBBox = textBBox;
      },
      data: function() {
        return {
          textBBox: null
        };
      },
      props: {
        code: { type: String, default: '' },
        data: { type: Object, default: function() { return codes['Z']; } },
        color: { type: String, default: '#000' }
      },
      computed: {
        sWidth: function() { return this.params.width + 'px'; },
        sHeight: function() { return this.params.height + 'px'; },
        sViewBox: function() {
          return '0 0 ' + this.params.width + ' ' + this.params.height;
        },
        params: function() {

          var data = (this.code? codes[this.code] : this.data) || codes['Z'];
          var notes = data.notes;
          var numFlets = 4;
          var hGap = 15;
          var vGap = 6;
          var width = (numFlets + 1) * 10 + hGap * 2;
          var height = notes.length * 10 + vGap * 2;

          var tHeight = 0;
          if (this.textBBox) {
            tHeight = this.textBBox.height;
          }

          var noteRadius = 4;
          var rootOffset = 1.5;
          var rootRect = null;

          var h = height - vGap * 2;
          var w = width - hGap * 2;
          var hOffset = 0;
          var vTop = vGap + tHeight;

          var hLines = notes.map(function(note, i) {
            var y = vTop + (h / (notes.length - 1) ) * i;
            return 'M' + hGap + ' ' + y + 'L' + (width - hGap) + ' ' + y;
          });

          var vLines = [];
          for (var i = 0; i <= numFlets; i += 1) {
            var x = hGap + w / numFlets * i;
            vLines.push('M' + x + ' ' + vTop +
                'L' + x + ' ' + (vTop + height - vGap * 2) );
            if (i == 0 && hOffset == 0) {
              rootRect = { x: x - rootOffset, y: vTop,
                  width: rootOffset, height: height - vGap * 2 };
            }
          }

          var points = notes.map(function(note, i) {
            var n = notes[notes.length - i - 1];
            var open = n == 0;
            var x = hGap + w / numFlets * (n - 0.5);
            var y = vTop + (h / (notes.length - 1) ) * i;
            if (open && hOffset == 0) {
              x -= rootOffset;
            }
            return { x: x, y: y, open: open };
          });

          return {
            name: data.name,
            width: width,
            height: tHeight + height,
            hGap: hGap,
            vGap: vGap,
            noteRadius: noteRadius,
            rootRect: rootRect,
            hLines: hLines,
            vLines: vLines,
            points: points,
            textBBox: this.textBBox
          };
        },
        hLineStyle: function() {
          return 'stroke: ' + this.color + '; fill: none; stroke-linecap: square;'
        },
        vLineStyle: function() {
          return 'stroke: ' + this.color + '; fill: none; stroke-linecap: square;';
        },
        noteStyle: function() {
          return 'stroke: ' + this.color + '; fill: ' + this.color + ';';
        },
        rootStyle: function() {
          return 'stroke: null; fill: ' + this.color + ';';
        },
        openNoteStyle: function() {
          return 'stroke: ' + this.color + '; fill: none;';
        }
      }
    }
  };

  for (var k in components) {
    Vue.component(k, components[k]);
  }
}();
