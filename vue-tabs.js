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
  var components = {
    tab: {
      template: '<span style="display:inline-block;">' +
        '<label>{{data.name}}</label><br/>' +
        '<svg xmlns="http://www.w3.org/2000/svg"' +
          ' :width="sWidth" :height="sHeight"' +
          ' :view-box.camel="sViewBox">' +
          '<rect x="0" y="0" :width="this.width" :height="this.height"' +
            ' stroke="none" fill="#000" opacity="0.02"></rect>' +
          '<path :d="\'M0 0L\' +width + \' \' + height" stroke="#0f0" fill="none"></path>' +
          '<path :d="\'M\' +width + \' 0L0 \' + height" stroke="#f00" fill="none"></path>' +
          '<path d="" stroke="#f00" fill="none"></path>' +
          '<rect x="0" y="0" :width="this.width" :height="this.height"' +
            ' stroke="none" fill="#000" opacity="0.1"></rect>' +
          '<path v-for="hLine in hLines" :d="hLine" :style="hLineStyle"></path>' +
          '<path v-for="vLine in vLines" :d="vLine" :style="vLineStyle"></path>' +
          '<circle v-for="note in notes" :cx="note.x"' +
            ' :cy="note.y" :r="noteRadius"' +
            ' :style="note.open? openNoteStyle : noteStyle"></circle>' +
        '</svg></span>',
      props: {
        data: { type: Object, default: function() { return {
          name: 'C',
          notes: [ 0, 0, 0, 3 ]
        }; } }
      },
      computed: {
        sWidth: function() { return this.width + 'px'; },
        sHeight: function() { return this.height + 'px'; },
        sViewBox: function() {
          return '0 0 ' + this.width + ' ' + this.height;
        },
        params: function() {
          return { numFlets: 5 };
        },
        hLines: function() {
          var notes = this.data.notes;
          var h = this.height - this.vGap * 2;
          return notes.map(function(note, i) {
            var y = this.vGap + (h / (notes.length - 1) ) * i;
            return 'M' + this.hGap + ' ' + y +
              'L' + (this.width - this.hGap) + ' ' + y;
          }.bind(this) );
        },
        vLines: function() {
          var numFlets = this.params.numFlets;
          var w = this.width - this.hGap * 2;
          var flets = [];
          for (var i = 0; i < numFlets; i += 1) {
            var x = this.hGap + (w / (numFlets - 1) ) * i;
            flets.push('M' + x + ' ' + this.vGap +
              'L' + x + ' ' + (this.height - this.vGap) );
          }
          return flets;
        },
        notes: function() {
          var numFlets = this.params.numFlets;
          var w = this.width - this.hGap * 2;
          var notes = this.data.notes;
          var h = this.height - this.vGap * 2;
          return notes.map(function(note, i) {
            var n = notes[notes.length - i - 1];
            var open = n == 0;
            var x = this.hGap + (w / (numFlets - 1) ) * (n - 0.5);
            var y = this.vGap + (h / (notes.length - 1) ) * i;
            return { x: x, y: y, open: open };
          }.bind(this) );

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
      },
      data: function() {
        return {
          width: 120,
          height: 100,
          hGap: 20,
          vGap: 30,
          noteRadius: 4
        };
      }
    }
  };

  for (var k in components) {
    Vue.component(k, components[k]);
  }
}();
