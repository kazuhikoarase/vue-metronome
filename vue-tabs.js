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

  var components = {
    tab: {
      template: '<span style="display:inline-block;">' +
        '<label>{{params.name}}</label><br/>' +
        '<svg xmlns="http://www.w3.org/2000/svg"' +
          ' :width="sWidth" :height="sHeight"' +
          ' :view-box.camel="sViewBox">' +
/*
          '<rect x="0" y="0" :width="params.width" :height="params.height"' +
            ' stroke="none" fill="#000" opacity="0.1"></rect>' +
          '<path :d="\'M0 0L\' + params.width + \' \' + params.height" stroke="#00c" fill="none"></path>' +
          '<path :d="\'M\' + params.width + \' 0L0 \' + params.height" stroke="#00c" fill="none"></path>' +
*/
          '<path v-for="hLine in params.hLines" :d="hLine" :style="hLineStyle"></path>' +
          '<path v-for="vLine in params.vLines" :d="vLine" :style="vLineStyle"></path>' +
          '<circle v-for="point in params.points"' +
            ' :cx="point.x" :cy="point.y" :r="params.noteRadius"' +
            ' :style="point.open? openNoteStyle : noteStyle"></circle>' +
        '</svg></span>',
      props: {
        code: { type: String, default: '' },
        data: { type: Object, default: function() { return codes['Z']; } }
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
          var noteRadius = 4;

          var h = height - vGap * 2;
          var w = width - hGap * 2;

          var hLines = notes.map(function(note, i) {
            var y = vGap + (h / (notes.length - 1) ) * i;
            return 'M' + hGap + ' ' + y + 'L' + (width - hGap) + ' ' + y;
          });

          var vLines = [];
          for (var i = 0; i <= numFlets; i += 1) {
            var x = hGap + w / numFlets * i;
            vLines.push('M' + x + ' ' + vGap + 'L' + x + ' ' + (height - vGap) );
          }

          var points = notes.map(function(note, i) {
            var n = notes[notes.length - i - 1];
            var open = n == 0;
            var x = hGap + w / numFlets * (n - 0.5);
            var y = vGap + (h / (notes.length - 1) ) * i;
            return { x: x, y: y, open: open };
          });

          return {
            name: data.name,
            width: width,
            height: height,
            hGap: hGap,
            vGap: vGap,
            noteRadius: noteRadius,
            hLines: hLines,
            vLines: vLines,
            points: points
          };
        },
        hLineStyle: function() {
          return 'stroke: #000; fill: none;';
        },
        vLineStyle: function() {
          return 'stroke: #000; fill: none;';
        },
        noteStyle: function() {
          return 'stroke: #000; fill: #000;';
        },
        openNoteStyle: function() {
          return 'stroke: #000; fill: none;';
        }
      }
    }
  };

  for (var k in components) {
    Vue.component(k, components[k]);
  }
}();
