/*
jQWidgets v3.9.0 (2015-Oct)
Copyright (c) 2011-2015 jQWidgets.
License: http://jqwidgets.com/license/
*/

(function(a) {
    a.extend(a.jqx._jqxGrid.prototype, {
        selectallrows: function() {
            this._trigger = false;
            var d = this.virtualmode ? this.dataview.totalrecords: this.dataview.loadedrecords.length;
            this.selectedrowindexes = new Array();
            var e = this.dataview.loadedrecords;
            for (var c = 0; c < d; c++) {
                var f = e[c];
                if (!f) {
                    this.selectedrowindexes[c] = c;
                    continue
                }
                var b = this.getboundindex(f);
                if (b != undefined) {
                    this.selectedrowindexes[c] = b
                }
            }
            if (this.selectionmode == "checkbox" && !this._checkboxcolumnupdating) {
                if (this._checkboxcolumn) {
                    this._checkboxcolumn.checkboxelement.jqxCheckBox({
                        checked: true
                    })
                }
            }
            this._renderrows(this.virtualsizeinfo);
            this._trigger = true;
            if (this.selectionmode == "checkbox") {
                this._raiseEvent(2, {
                    rowindex: this.selectedrowindexes
                })
            }
        },
        unselectallrows: function() {
            this._trigger = false;
            var c = this.virtualmode ? this.dataview.totalrecords: this.dataview.loadedrecords.length;
            this.selectedrowindexes = new Array();
            var d = this.dataview.loadedrecords;
            for (var b = 0; b < c; b++) {
                var e = d[b];
                if (!e) {
                    this.selectedrowindexes[b] = b;
                    continue
                }
                delete this.selectedrowindexes[b]
            }
            if (this.selectionmode == "checkbox" && !this._checkboxcolumnupdating) {
                if (this._checkboxcolumn) {
                    this._checkboxcolumn.checkboxelement.jqxCheckBox({
                        checked: false
                    })
                }
            }
            this._renderrows(this.virtualsizeinfo);
            this._trigger = true;
            if (this.selectionmode == "checkbox") {
                this._raiseEvent(2, {
                    rowindex: this.selectedrowindexes
                })
            }
        },
        selectrow: function(b, c) {
            this._applyrowselection(b, true, c);
            if (c !== false) {
                this._updatecheckboxselection()
            }
        },
        _updatecheckboxselection: function() {
            if (this.selectionmode == "checkbox") {
                var d = this.getrows();
                if (d && this._checkboxcolumn) {
                    if (d.length === 0) {
                        this._checkboxcolumn.checkboxelement.jqxCheckBox({
                            checked: false
                        });
                        return
                    }
                    var c = d.length;
                    if (this.groupable) {
                        c = this.dataview.loadedrecords.length
                    }
                    if (this.virtualmode) {
                        c = this.source._source.totalrecords
                    }
                    var b = this.selectedrowindexes.length;
                    if (b === c) {
                        this._checkboxcolumn.checkboxelement.jqxCheckBox({
                            checked: true
                        })
                    } else {
                        if (b === 0) {
                            this._checkboxcolumn.checkboxelement.jqxCheckBox({
                                checked: false
                            })
                        } else {
                            this._checkboxcolumn.checkboxelement.jqxCheckBox({
                                checked: null
                            })
                        }
                    }
                }
            }
        },
        unselectrow: function(b, c) {
            this._applyrowselection(b, false, c);
            if (c !== false) {
                this._updatecheckboxselection()
            }
        },
        selectcell: function(c, b) {
            this._applycellselection(c, b, true)
        },
        unselectcell: function(c, b) {
            this._applycellselection(c, b, false)
        },
        clearselection: function(c, d) {
            this._trigger = false;
            this.selectedrowindex = -1;
            this._oldselectedcell = null;
            if (d !== false) {
                for (var b = 0; b < this.selectedrowindexes.length; b++) {
                    this._raiseEvent(3, {
                        rowindex: this.selectedrowindexes[b]
                    })
                }
            }
            this.selectedrowindexes = new Array();
            this.selectedcells = new Array();
            this.selectedcell = null;
            if (this.selectionmode == "checkbox" && !this._checkboxcolumnupdating) {
                this._checkboxcolumn.checkboxelement.jqxCheckBox({
                    checked: false
                })
            }
            if (false === c) {
                this._trigger = true;
                return
            }
            this._renderrows(this.virtualsizeinfo);
            this._trigger = true;
            if (this.selectionmode == "checkbox") {
                this._raiseEvent(3, {
                    rowindex: this.selectedrowindexes
                })
            }
        },
        getselectedrowindex: function() {
            if (this.selectedrowindex == -1 || this.selectedrowindex == undefined) {
                for (var b = 0; b < this.selectedrowindexes.length; b++) {
                    return this.selectedrowindexes[b]
                }
            }
            return this.selectedrowindex
        },
        getselectedrowindexes: function() {
            return this.selectedrowindexes
        },
        getselectedcell: function() {
            if (!this.selectedcell) {
                return null
            }
            var b = this.selectedcell;
            b.row = this.selectedcell.rowindex;
            b.column = this.selectedcell.datafield;
            b.value = this.getcellvalue(b.row, b.column);
            return b
        },
        getselectedcells: function() {
            var b = new Array();
            for (obj in this.selectedcells) {
                b[b.length] = this.selectedcells[obj]
            }
            return b
        },
        _getcellsforcopypaste: function() {
            var e = new Array();
            if (this.selectionmode.indexOf("cell") == -1) {
                var h = this.selectedrowindexes;
                for (var d = 0; d < h.length; d++) {
                    var c = h[d];
                    for (var f = 0; f < this.columns.records.length; f++) {
                        if (this.columns.records[f].datafield === "_checkboxcolumn") {
                            continue
                        }
                        var g = c + "_" + this.columns.records[f].datafield;
                        var b = {
                            rowindex: c,
                            datafield: this.columns.records[f].datafield
                        };
                        e.push(b)
                    }
                }
            }
            return e
        },
        deleteselection: function() {
            var d = this;
            var f = d.getselectedcells();
            if (this.selectionmode.indexOf("cell") == -1) {
                f = this._getcellsforcopypaste()
            }
            if (f != null && f.length > 0) {
                for (var e = 0; e < f.length; e++) {
                    var b = f[e];
                    var g = d.getcolumn(b.datafield);
                    var h = d.getcellvalue(b.rowindex, b.datafield);
                    if (!g) {
                        continue
                    }
                    if (h !== "") {
                        var c = null;
                        if (g.columntype == "checkbox") {
                            if (!g.threestatecheckbox) {
                                c = false
                            }
                        }
                        d._raiseEvent(17, {
                            rowindex: b.rowindex,
                            datafield: b.datafield,
                            value: h
                        });
                        if (e == f.length - 1) {
                            d.setcellvalue(b.rowindex, b.datafield, c, true);
                            if (g.displayfield != g.datafield) {
                                d.setcellvalue(b.rowindex, g.displayfield, c, true)
                            }
                        } else {
                            d.setcellvalue(b.rowindex, b.datafield, c, false);
                            if (g.displayfield != g.datafield) {
                                d.setcellvalue(b.rowindex, g.displayfield, c, true)
                            }
                        }
                        d._raiseEvent(18, {
                            rowindex: b.rowindex,
                            datafield: b.datafield,
                            oldvalue: h,
                            value: c
                        })
                    }
                }
                this.dataview.updateview();
                this._renderrows(this.virtualsizeinfo)
            }
        },
        copyselection: function() {
            var n = "";
            var s = this;
            this.clipboardselection = {};
            this.logicalclipboardselection = {};
            this._clipboardselection = [];
            var r = s.getselectedcells();
            if (this.selectionmode.indexOf("cell") == -1) {
                r = this._getcellsforcopypaste()
            }
            var b = 0;
            var e = new Array();
            if (r != null && r.length > 0) {
                var t = 999999999999999;
                var q = -1;
                for (var j = 0; j < r.length; j++) {
                    var l = r[j];
                    var d = s.getcolumn(l.datafield);
                    if (d != null && d.clipboard && (!d.hidden || this.copytoclipboardhiddencolumns)) {
                        if (e.indexOf(d.text) == -1) {
                            e.push(d.text)
                        }
                        var p = s.getcelltext(l.rowindex, d.displayfield);
                        var h = this.getrowdisplayindex(l.rowindex);
                        if (!this.clipboardselection[h]) {
                            this.clipboardselection[h] = {}
                        }
                        this.clipboardselection[h][d.displayfield] = p;
                        if (!this.logicalclipboardselection[h]) {
                            this.logicalclipboardselection[h] = {}
                        }
                        this.logicalclipboardselection[h][d.displayfield] = p;
                        if (d.displayfield != d.datafield) {
                            this.logicalclipboardselection[h][d.datafield] = s.getcellvalue(l.rowindex, d.datafield)
                        }
                        t = Math.min(t, h);
                        q = Math.max(q, h)
                    }
                }
                var g = new Array();
                for (var f = t; f <= q; f++) {
                    if (!this.logicalclipboardselection[f]) {
                        continue
                    }
                    var o = a.extend({},
                    this.logicalclipboardselection[f]);
                    g.push(o)
                }
                this.logicalclipboardselection = g;
                if (this.copytoclipboardwithheaders) {
                    for (var c = 0; c < e.length; c++) {
                        if (c > 0) {
                            n += "\t"
                        }
                        n += e[c]
                    }
                    n += "\r\n"
                }
                for (var f = t; f <= q; f++) {
                    var k = 0;
                    this._clipboardselection[this._clipboardselection.length] = new Array();
                    if (this.clipboardselection[f] != undefined) {
                        a.each(this.clipboardselection[f],
                        function(i, m) {
                            if (k > 0) {
                                n += "\t"
                            }
                            var u = m;
                            if (m == null) {
                                u = ""
                            }
                            s._clipboardselection[s._clipboardselection.length - 1][k] = u;
                            k++;
                            n += u
                        })
                    } else {
                        continue
                    }
                    if (f < q) {
                        n += "\r\n"
                    }
                }
            }
            this.clipboardselectedtext = n;
            return n
        },
        pasteselection: function() {
            var g = this.getselectedcells();
            this._oldselectedcell = null;
            if (this.selectionmode.indexOf("cell") == -1) {
                g = this._getcellsforcopypaste()
            }
            if (g != null && g.length > 0) {
                var h = g[0].rowindex;
                var w = this.getrowdisplayindex(h);
                var q = g[0].datafield;
                var u = this._getcolumnindex(q);
                var o = 0;
                this.selectedrowindexes = new Array();
                this.selectedcells = new Array();
                var k = g.length;
                var B = 0;
                var d = new Array();
                if (this.copytoclipboardwithheaders) {
                    this._clipboardselection.splice(0, 1)
                }
                for (var z = 0; z < this._clipboardselection.length; z++) {
                    B += this._clipboardselection[z].length;
                    d[z] = new Array();
                    for (var y = 0; y < this._clipboardselection[z].length; y++) {
                        var r = this._clipboardselection[z][y];
                        d[z].push(r)
                    }
                }
                if (B < g.length) {
                    var n = new Array();
                    for (var z = 0; z < g.length; z++) {
                        var e = g[z];
                        if (!n[e.rowindex]) {
                            n[e.rowindex] = new Array()
                        }
                        n[e.rowindex].push(e)
                    }
                    var A = 0;
                    var D = 0;
                    for (var z = 0; z < n.length; z++) {
                        if (!n[z]) {
                            continue
                        }
                        for (var y = 0; y < n[z].length; y++) {
                            var e = n[z][y];
                            var m = e.rowindex;
                            var f = this.getcolumn(e.datafield);
                            if (f.datafield === "_checkboxcolumn") {
                                continue
                            }
                            if (f.hidden) {
                                continue
                            }
                            var r = "";
                            if (!d[A][D]) {
                                D = 0
                            }
                            r = d[A][D];
                            D++;
                            if (f.cellsformat) {
                                if (f.cellsformat.indexOf("p") != -1 || f.cellsformat.indexOf("c") != -1 || f.cellsformat.indexOf("n") != -1 || f.cellsformat.indexOf("f") != -1) {
                                    if (r.indexOf(this.gridlocalization.currencysymbol) > -1) {
                                        r = r.replace(this.gridlocalization.currencysymbol, "")
                                    }
                                    var b = function(x, j, t) {
                                        var c = x;
                                        if (j == t) {
                                            return x
                                        }
                                        var i = c.indexOf(j);
                                        while (i != -1) {
                                            c = c.replace(j, t);
                                            i = c.indexOf(j)
                                        }
                                        return c
                                    };
                                    r = b(r, this.gridlocalization.thousandsseparator, "");
                                    r = r.replace(this.gridlocalization.decimalseparator, ".");
                                    if (r.indexOf(this.gridlocalization.percentsymbol) > -1) {
                                        r = r.replace(this.gridlocalization.percentsymbol, "")
                                    }
                                    var E = "";
                                    for (var s = 0; s < r.length; s++) {
                                        var p = r.substring(s, s + 1);
                                        if (p === "-") {
                                            E += "-"
                                        }
                                        if (p === ".") {
                                            E += "."
                                        }
                                        if (p.match(/^[0-9]+$/) != null) {
                                            E += p
                                        }
                                    }
                                    r = E;
                                    r = r.replace(/ /g, "");
                                    r = new Number(r);
                                    if (isNaN(r)) {
                                        r = ""
                                    }
                                }
                            }
                            this._raiseEvent(17, {
                                rowindex: m,
                                datafield: e.datafield,
                                value: r
                            });
                            this.setcellvalue(m, f.displayfield, r, false);
                            if (f.displayfield != f.datafield && this.logicalclipboardselection) {
                                if (this.logicalclipboardselection[m]) {
                                    var v = this.logicalclipboardselection[m][f.datafield];
                                    if (v != undefined) {
                                        this.setcellvalue(m, f.datafield, v, false)
                                    }
                                }
                            }
                            this._raiseEvent(18, {
                                rowindex: m,
                                datafield: e.datafield,
                                oldvalue: this.getcellvalue(e.rowindex, e.datafield),
                                value: r
                            });
                            this._applycellselection(m, e.datafield, true, false)
                        }
                        A++;
                        if (!d[A]) {
                            A = 0
                        }
                    }
                } else {
                    if (!this._clipboardselection) {
                        return
                    }
                    for (var l = 0; l < this._clipboardselection.length; l++) {
                        for (var C = 0; C < this._clipboardselection[l].length; C++) {
                            var f = this.getcolumnat(u + C);
                            if (!f) {
                                continue
                            }
                            if (f.datafield === "_checkboxcolumn") {
                                continue
                            }
                            if (f.hidden) {
                                continue
                            }
                            var m = this.getrowboundindex(w + l);
                            var e = this.getcell(m, f.datafield);
                            var r = null;
                            r = this._clipboardselection[l][C];
                            if (r != null) {
                                if (f.cellsformat) {
                                    if (f.cellsformat.indexOf("p") != -1 || f.cellsformat.indexOf("c") != -1 || f.cellsformat.indexOf("n") != -1 || f.cellsformat.indexOf("f") != -1) {
                                        if (r.indexOf(this.gridlocalization.currencysymbol) > -1) {
                                            r = r.replace(this.gridlocalization.currencysymbol, "")
                                        }
                                        var b = function(x, j, t) {
                                            var c = x;
                                            if (j == t) {
                                                return x
                                            }
                                            var i = c.indexOf(j);
                                            while (i != -1) {
                                                c = c.replace(j, t);
                                                i = c.indexOf(j)
                                            }
                                            return c
                                        };
                                        r = b(r, this.gridlocalization.thousandsseparator, "");
                                        r = r.replace(this.gridlocalization.decimalseparator, ".");
                                        if (r.indexOf(this.gridlocalization.percentsymbol) > -1) {
                                            r = r.replace(this.gridlocalization.percentsymbol, "")
                                        }
                                        var E = "";
                                        for (var s = 0; s < r.length; s++) {
                                            var p = r.substring(s, s + 1);
                                            if (p === "-") {
                                                E += "-"
                                            }
                                            if (p === ".") {
                                                E += "."
                                            }
                                            if (p.match(/^[0-9]+$/) != null) {
                                                E += p
                                            }
                                        }
                                        r = E;
                                        r = r.replace(/ /g, "");
                                        r = new Number(r);
                                        if (isNaN(r)) {
                                            r = ""
                                        }
                                    }
                                }
                                this._raiseEvent(17, {
                                    rowindex: m,
                                    datafield: e.datafield,
                                    value: r
                                });
                                this.setcellvalue(m, f.displayfield, r, false);
                                if (f.displayfield != f.datafield && this.logicalclipboardselection) {
                                    var v = this.logicalclipboardselection[l][f.datafield];
                                    if (v != undefined) {
                                        this.setcellvalue(m, f.datafield, v, false)
                                    }
                                }
                                this._raiseEvent(18, {
                                    rowindex: m,
                                    datafield: e.datafield,
                                    oldvalue: this.getcellvalue(e.rowindex, e.datafield),
                                    value: r
                                });
                                this._applycellselection(m, e.datafield, true, false)
                            }
                        }
                    }
                }
                if (this.selectionmode == "checkbox") {
                    this._updatecheckboxselection()
                }
                this.dataview.updateview();
                this._renderrows(this.virtualsizeinfo)
            }
            if (this.clipboardend) {
                this.clipboardend("paste")
            }
        },
        _applyrowselection: function(e, i, f, h, b) {
            if (e == null) {
                return false
            }
            var j = this.selectedrowindex;
            if (this.selectionmode == "singlerow") {
                if (i) {
                    this._raiseEvent(2, {
                        rowindex: e,
                        row: this.getrowdata(e)
                    })
                } else {
                    this._raiseEvent(3, {
                        rowindex: e,
                        row: this.getrowdata(e)
                    })
                }
                this._raiseEvent(3, {
                    rowindex: j
                });
                this.selectedrowindexes = new Array();
                this.selectedcells = new Array()
            }
            if (h == true) {
                this.selectedrowindexes = new Array()
            }
            if (this.dataview.filters.length > 0) {
                var c = this.getrowdata(e);
                if (c && c.dataindex !== undefined) {
                    e = c.dataindex
                } else {
                    if (c && c.dataindex === undefined) {
                        if (c.uid != undefined) {
                            e = this.getrowboundindexbyid(c.uid)
                        }
                    }
                }
            }
            var d = this.selectedrowindexes.indexOf(e);
            if (i) {
                this.selectedrowindex = e;
                if (d == -1) {
                    this.selectedrowindexes.push(e);
                    if (this.selectionmode != "singlerow") {
                        this._raiseEvent(2, {
                            rowindex: e,
                            row: this.getrowdata(e)
                        })
                    }
                } else {
                    if (this.selectionmode == "multiplerows") {
                        this.selectedrowindexes.splice(d, 1);
                        this._raiseEvent(3, {
                            rowindex: this.selectedrowindex,
                            row: this.getrowdata(e)
                        });
                        this.selectedrowindex = this.selectedrowindexes.length > 0 ? this.selectedrowindexes[this.selectedrowindexes.length - 1] : -1
                    }
                }
            } else {
                if (d >= 0 || this.selectionmode == "singlerow" || this.selectionmode == "multiplerowsextended" || this.selectionmode == "multiplerowsadvanced") {
                    var g = this.selectedrowindexes[d];
                    this.selectedrowindexes.splice(d, 1);
                    this._raiseEvent(3, {
                        rowindex: g,
                        row: this.getrowdata(e)
                    });
                    this.selectedrowindex = -1
                }
            }
            if (f == undefined || f) {
                this._rendervisualrows()
            }
            return true
        },
        _applycellselection: function(e, b, h, f) {
            if (e == null) {
                return false
            }
            if (b == null) {
                return false
            }
            var j = this.selectedrowindex;
            if (this.selectionmode == "singlecell") {
                var d = this.selectedcell;
                if (d != null) {
                    this._raiseEvent(16, {
                        rowindex: d.rowindex,
                        datafield: d.datafield
                    })
                }
                this.selectedcells = new Array()
            }
            if (this.selectionmode == "multiplecellsextended" || this.selectionmode == "multiplecellsadvanced") {
                var d = this.selectedcell;
                if (d != null) {
                    this._raiseEvent(16, {
                        rowindex: d.rowindex,
                        datafield: d.datafield
                    })
                }
            }
            var g = e + "_" + b;
            if (this.dataview.filters.length > 0) {
                var c = this.getrowdata(e);
                if (c && c.dataindex !== undefined) {
                    e = c.dataindex;
                    var g = e + "_" + b
                } else {
                    if (c && c.dataindex === undefined) {
                        if (c.uid) {
                            e = this.getrowboundindexbyid(c.uid);
                            var g = e + "_" + b
                        }
                    }
                }
            }
            var i = {
                rowindex: e,
                datafield: b
            };
            if (h) {
                this.selectedcell = i;
                if (!this.selectedcells[g]) {
                    this.selectedcells[g] = i;
                    this.selectedcells.length++;
                    this._raiseEvent(15, i)
                } else {
                    if (this.selectionmode == "multiplecells" || this.selectionmode == "multiplecellsextended" || this.selectionmode == "multiplecellsadvanced") {
                        delete this.selectedcells[g];
                        if (this.selectedcells.length > 0) {
                            this.selectedcells.length--
                        }
                        this._raiseEvent(16, i)
                    }
                }
            } else {
                delete this.selectedcells[g];
                if (this.selectedcells.length > 0) {
                    this.selectedcells.length--
                }
                this._raiseEvent(16, i)
            }
            if (f == undefined || f) {
                this._rendervisualrows()
            }
            return true
        },
        _getcellindex: function(b) {
            var c = -1;
            a.each(this.selectedcells,
            function() {
                c++;
                if (this[b]) {
                    return false
                }
            });
            return c
        },
        _clearhoverstyle: function() {
            if (undefined == this.hoveredrow || this.hoveredrow == -1) {
                return
            }
            if (this.vScrollInstance.isScrolling()) {
                return
            }
            if (this.hScrollInstance.isScrolling()) {
                return
            }
            var b = this.table.find(".jqx-grid-cell-hover");
            if (b.length > 0) {
                b.removeClass(this.toTP("jqx-grid-cell-hover"));
                b.removeClass(this.toTP("jqx-fill-state-hover"))
            }
            this.hoveredrow = -1
        },
        _clearselectstyle: function() {
            var k = this.table[0].rows.length;
            var p = this.table[0].rows;
            var l = this.toTP("jqx-grid-cell-selected");
            var c = this.toTP("jqx-fill-state-pressed");
            var m = this.toTP("jqx-grid-cell-hover");
            var h = this.toTP("jqx-fill-state-hover");
            for (var g = 0; g < k; g++) {
                var b = p[g];
                var f = b.cells.length;
                var o = b.cells;
                for (var e = 0; e < f; e++) {
                    var d = o[e];
                    var n = a(d);
                    if (d.className.indexOf("jqx-grid-cell-selected") != -1) {
                        n.removeClass(l);
                        n.removeClass(c)
                    }
                    if (d.className.indexOf("jqx-grid-cell-hover") != -1) {
                        n.removeClass(m);
                        n.removeClass(h)
                    }
                }
            }
        },
        _selectpath: function(n, e) {
            var l = this;
            var i = this._lastClickedCell ? Math.min(this._lastClickedCell.row, n) : 0;
            var k = this._lastClickedCell ? Math.max(this._lastClickedCell.row, n) : 0;
            if (i <= k) {
                var h = this._getcolumnindex(this._lastClickedCell.column);
                var g = this._getcolumnindex(e);
                var f = Math.min(h, g);
                var d = Math.max(h, g);
                this.selectedcells = new Array();
                var m = this.dataview.loadedrecords;
                for (var b = i; b <= k; b++) {
                    for (var j = f; j <= d; j++) {
                        var n = m[b];
                        this._applycellselection(l.getboundindex(n), l._getcolumnat(j).datafield, true, false)
                    }
                }
                this._rendervisualrows()
            }
        },
        _selectrowpath: function(g) {
            if (this.selectionmode == "multiplerowsextended") {
                var c = this;
                var b = this._lastClickedCell ? Math.min(this._lastClickedCell.row, g) : 0;
                var h = this._lastClickedCell ? Math.max(this._lastClickedCell.row, g) : 0;
                var f = this.dataview.loadedrecords;
                if (b <= h) {
                    this.selectedrowindexes = new Array();
                    for (var e = b; e <= h; e++) {
                        var g = f[e];
                        var d = this.getrowboundindex(e);
                        this._applyrowselection(d, true, false)
                    }
                    this._rendervisualrows()
                }
            }
        },
        _selectrowwithmouse: function(p, b, c, f, d, s) {
            var j = b.row;
            if (j == undefined) {
                return
            }
            var k = b.index;
            if (this.hittestinfo[k] == undefined) {
                return
            }
            var t = this.hittestinfo[k].visualrow;
            if (this.hittestinfo[k].details) {
                return
            }
            var m = t.cells[0].className;
            if (j.group) {
                return
            }
            if (this.selectionmode == "multiplerows" || this.selectionmode == "multiplecells" || this.selectionmode == "checkbox" || (this.selectionmode.indexOf("multiple") != -1 && (s == true || d == true))) {
                var l = this.getboundindex(j);
                if (this.dataview.filters.length > 0) {
                    var v = this.getrowdata(l);
                    if (v) {
                        l = v.dataindex;
                        if (l == undefined) {
                            var l = this.getboundindex(j)
                        }
                    }
                }
                var q = c.indexOf(l) != -1;
                var w = this.getboundindex(j) + "_" + f;
                if (this.selectionmode.indexOf("cell") != -1) {
                    var h = this.selectedcells[w] != undefined;
                    if (this.selectedcells[w] != undefined && h) {
                        this._selectcellwithstyle(p, false, k, f, t)
                    } else {
                        this._selectcellwithstyle(p, true, k, f, t)
                    }
                    if (s && this._lastClickedCell == undefined) {
                        var g = this.getselectedcells();
                        if (g && g.length > 0) {
                            this._lastClickedCell = {
                                row: g[0].rowindex,
                                column: g[0].datafield
                            }
                        }
                    }
                    if (s && this._lastClickedCell) {
                        this._selectpath(j.visibleindex, f);
                        this.mousecaptured = false;
                        if (this.selectionarea.css("visibility") == "visible") {
                            this.selectionarea.css("visibility", "hidden")
                        }
                    }
                } else {
                    if (q) {
                        if (d) {
                            this._applyrowselection(this.getboundindex(j), false)
                        } else {
                            this._selectrowwithstyle(p, t, false, f)
                        }
                    } else {
                        this._selectrowwithstyle(p, t, true, f)
                    }
                    if (s && this._lastClickedCell == undefined) {
                        var i = this.getselectedrowindexes();
                        if (i && i.length > 0) {
                            this._lastClickedCell = {
                                row: i[0],
                                column: f
                            }
                        }
                    }
                    if (s && this._lastClickedCell) {
                        this.selectedrowindexes = new Array();
                        var e = this._lastClickedCell ? Math.min(this._lastClickedCell.row, j.visibleindex) : 0;
                        var u = this._lastClickedCell ? Math.max(this._lastClickedCell.row, j.visibleindex) : 0;
                        var n = this.dataview.loadedrecords;
                        for (var o = e; o <= u; o++) {
                            var j = n[o];
                            if (j) {
                                this._applyrowselection(this.getboundindex(j), true, false, false)
                            }
                        }
                        this._rendervisualrows()
                    }
                }
            } else {
                this._clearselectstyle();
                this._selectrowwithstyle(p, t, true, f);
                if (this.selectionmode.indexOf("cell") != -1) {
                    this._selectcellwithstyle(p, true, k, f, t)
                }
            }
            if (!s) {
                this._lastClickedCell = {
                    row: j.visibleindex,
                    column: f
                }
            }
        },
        _selectcellwithstyle: function(d, c, g, f, e) {
            var b = a(e.cells[d._getcolumnindex(f)]);
            b.removeClass(this.toTP("jqx-grid-cell-hover"));
            b.removeClass(this.toTP("jqx-fill-state-hover"));
            if (c) {
                b.addClass(this.toTP("jqx-grid-cell-selected"));
                b.addClass(this.toTP("jqx-fill-state-pressed"))
            } else {
                b.removeClass(this.toTP("jqx-grid-cell-selected"));
                b.removeClass(this.toTP("jqx-fill-state-pressed"))
            }
        },
        _selectrowwithstyle: function(e, h, b, j) {
            var c = h.cells.length;
            var f = 0;
            if (e.rowdetails && e.showrowdetailscolumn) {
                if (!this.rtl) {
                    f = 1 + this.groups.length
                } else {
                    c -= 1;
                    c -= this.groups.length
                }
            } else {
                if (this.groupable) {
                    if (!this.rtl) {
                        f = this.groups.length
                    } else {
                        c -= this.groups.length
                    }
                }
            }
            for (var g = f; g < c; g++) {
                var d = h.cells[g];
                if (b) {
                    a(d).removeClass(this.toTP("jqx-grid-cell-hover"));
                    a(d).removeClass(this.toTP("jqx-fill-state-hover"));
                    if (e.selectionmode.indexOf("cell") == -1) {
                        a(d).addClass(this.toTP("jqx-grid-cell-selected"));
                        a(d).addClass(this.toTP("jqx-fill-state-pressed"))
                    }
                } else {
                    a(d).removeClass(this.toTP("jqx-grid-cell-hover"));
                    a(d).removeClass(this.toTP("jqx-grid-cell-selected"));
                    a(d).removeClass(this.toTP("jqx-fill-state-hover"));
                    a(d).removeClass(this.toTP("jqx-fill-state-pressed"))
                }
            }
        },
        _handlemousemoveselection: function(ab, o) {
            if (o.hScrollInstance.isScrolling() || o.vScrollInstance.isScrolling()) {
                return false
            }
            if ((o.selectionmode == "multiplerowsextended" || o.selectionmode == "multiplecellsextended" || o.selectionmode == "multiplecellsadvanced") && o.mousecaptured) {
                if (o.multipleselectionbegins) {
                    var b = o.multipleselectionbegins(ab);
                    if (b === false) {
                        return true
                    }
                }
                var aa = this.showheader ? this.columnsheader.height() + 2 : 0;
                var I = this._groupsheader() ? this.groupsheader.height() : 0;
                var K = this.showtoolbar ? this.toolbar.height() : 0;
                I += K;
                var Z = this.host.coord();
                if (this.hasTransform) {
                    Z = a.jqx.utilities.getOffset(this.host);
                    var ad = this._getBodyOffset();
                    Z.left -= ad.left;
                    Z.top -= ad.top
                }
                if (this.host.css("border-top-width") === "0px") {
                    I -= 2
                }
                var M = ab.pageX;
                var L = ab.pageY - I;
                if (Math.abs(this.mousecaptureposition.left - M) > 3 || Math.abs(this.mousecaptureposition.top - L) > 3) {
                    var f = parseInt(this.columnsheader.coord().top);
                    if (this.hasTransform) {
                        f = a.jqx.utilities.getOffset(this.columnsheader).top
                    }
                    if (M < Z.left) {
                        M = Z.left
                    }
                    if (M > Z.left + this.host.width()) {
                        M = Z.left + this.host.width()
                    }
                    var X = Z.top + aa;
                    if (L < X) {
                        L = X + 5
                    }
                    var J = parseInt(Math.min(o.mousecaptureposition.left, M));
                    var g = -5 + parseInt(Math.min(o.mousecaptureposition.top, L));
                    var H = parseFloat(Math.abs(o.mousecaptureposition.left - M));
                    var P = parseInt(Math.abs(o.mousecaptureposition.top - L));
                    J -= Z.left;
                    g -= Z.top;
                    this.selectionarea.css("visibility", "visible");
                    if (o.selectionmode == "multiplecellsadvanced") {
                        var M = J;
                        var t = M + H;
                        var G = M;
                        var n = o.hScrollInstance;
                        var v = n.value;
                        if (this.rtl) {
                            if (this.hScrollBar.css("visibility") != "hidden") {
                                v = n.max - n.value
                            }
                            if (this.vScrollBar[0].style.visibility != "hidden") {}
                        }
                        var h = o.table[0].rows[0];
                        var T = 0;
                        var B = o.mousecaptureposition.clickedcell;
                        var A = B;
                        var m = false;
                        var r = 0;
                        var ac = h.cells.length;
                        if (o.mousecaptureposition.left <= ab.pageX) {
                            r = B
                        }
                        for (var W = r; W < ac; W++) {
                            var Y = parseFloat(a(this.columnsrow[0].cells[W]).css("left"));
                            var j = Y - v;
                            if (o.columns.records[W].pinned) {
                                j = Y;
                                continue
                            }
                            var O = this._getcolumnat(W);
                            if (O != null && O.hidden) {
                                continue
                            }
                            if (o.groupable && o.groups.length > 0) {
                                if (W < o.groups.length) {
                                    continue
                                }
                            }
                            var S = j + a(this.columnsrow[0].cells[W]).width();
                            if (o.mousecaptureposition.left > ab.pageX) {
                                if (S >= M && M >= j) {
                                    A = W;
                                    m = true;
                                    break
                                }
                            } else {
                                if (S >= t && t >= j) {
                                    A = W;
                                    m = true;
                                    break
                                }
                            }
                        }
                        if (!m) {
                            if (o.mousecaptureposition.left > ab.pageX) {
                                a.each(this.columns.records,
                                function(i, k) {
                                    if (o.groupable && o.groups.length > 0) {
                                        if (i < o.groups.length) {
                                            return true
                                        }
                                    }
                                    if (!this.pinned && !this.hidden) {
                                        A = i;
                                        return false
                                    }
                                })
                            } else {
                                if (!o.groupable || (o.groupable && !o.groups.length > 0)) {
                                    A = h.cells.length - 1
                                }
                            }
                        }
                        var N = B;
                        B = Math.min(B, A);
                        A = Math.max(N, A);
                        g += 5;
                        g += I;
                        var R = o.table[0].rows.indexOf(o.mousecaptureposition.clickedrow);
                        var w = 0;
                        var e = -1;
                        var u = -1;
                        var d = 0;
                        for (var W = 0; W < o.table[0].rows.length; W++) {
                            var s = a(o.table[0].rows[W]);
                            if (W == 0) {
                                d = s.coord().top
                            }
                            var F = s.height();
                            var z = d - Z.top;
                            if (e == -1 && z + F >= g) {
                                var c = false;
                                for (var Q = 0; Q < o.groups.length; Q++) {
                                    var V = s[0].cells[Q].className;
                                    if (V.indexOf("jqx-grid-group-collapse") != -1 || V.indexOf("jqx-grid-group-expand") != -1) {
                                        c = true;
                                        break
                                    }
                                }
                                if (c) {
                                    continue
                                }
                                e = W
                            }
                            d += F;
                            if (o.groupable && o.groups.length > 0) {
                                var c = false;
                                for (var Q = 0; Q < o.groups.length; Q++) {
                                    var V = s[0].cells[Q].className;
                                    if (V.indexOf("jqx-grid-group-collapse") != -1 || V.indexOf("jqx-grid-group-expand") != -1) {
                                        c = true;
                                        break
                                    }
                                }
                                if (c) {
                                    continue
                                }
                                var T = 0;
                                for (var U = o.groups.length; U < s[0].cells.length; U++) {
                                    var E = s[0].cells[U];
                                    if (a(E).html() == "") {
                                        T++
                                    }
                                }
                                if (T == s[0].cells.length - o.groups.length) {
                                    continue
                                }
                            }
                            if (e != -1) {
                                w += F
                            }
                            if (z + F > g + P) {
                                u = W;
                                break
                            }
                        }
                        if (e != -1) {
                            g = a(o.table[0].rows[e]).coord().top - Z.top - I - 2;
                            var D = 0;
                            if (this.filterable && this.showfilterrow) {
                                D = this.filterrowheight
                            }
                            if (parseFloat(o.table[0].style.top) < 0 && g < this.rowsheight + D) {
                                g -= parseFloat(o.table[0].style.top);
                                w += parseFloat(o.table[0].style.top)
                            }
                            P = w;
                            var l = a(this.columnsrow[0].cells[B]);
                            var C = a(this.columnsrow[0].cells[A]);
                            J = parseFloat(l.css("left"));
                            H = parseFloat(C.css("left")) - parseFloat(J) + C.width() - 2;
                            J -= v;
                            if (o.editcell && o.editable && o.endcelledit && (B != A || e != u)) {
                                if (o.editcell.validated == false) {
                                    return
                                }
                                o.endcelledit(o.editcell.row, o.editcell.column, true, true)
                            }
                        }
                    }
                    this.selectionarea.width(H);
                    this.selectionarea.height(P);
                    this.selectionarea.css("left", J);
                    this.selectionarea.css("top", g)
                }
            }
        },
        _handlemouseupselection: function(u, o) {
            if (!this.selectionarea) {
                return
            }
            if (this.selectionarea[0].style.visibility != "visible") {
                o.mousecaptured = false;
                return true
            }
            if (o.mousecaptured && (o.selectionmode == "multiplerowsextended" || o.selectionmode == "multiplerowsadvanced" || o.selectionmode == "multiplecellsextended" || o.selectionmode == "multiplecellsadvanced")) {
                o.mousecaptured = false;
                if (this.selectionarea.css("visibility") == "visible") {
                    this.selectionarea.css("visibility", "hidden");
                    var w = this.showheader ? this.columnsheader.height() + 2 : 0;
                    var p = this._groupsheader() ? this.groupsheader.height() : 0;
                    if (this.host.css("border-top-width") === "0px") {
                        p -= 2
                    }
                    var B = this.showtoolbar ? this.toolbar.height() : 0;
                    p += B;
                    var C = this.selectionarea.coord();
                    var c = this.host.coord();
                    if (this.hasTransform) {
                        c = a.jqx.utilities.getOffset(this.host);
                        C = a.jqx.utilities.getOffset(this.selectionarea)
                    }
                    if (this.host.css("border-top-width") === "0px") {
                        p -= 2
                    }
                    var n = C.left - c.left;
                    var k = C.top - w - c.top - p;
                    var s = k;
                    var g = n + this.selectionarea.width();
                    var D = n;
                    var l = new Array();
                    var e = new Array();
                    if (o.selectionmode == "multiplerowsextended") {
                        while (k < s + this.selectionarea.height()) {
                            var b = this._hittestrow(n, k);
                            var f = b.row;
                            var h = b.index;
                            if (h != -1) {
                                if (!e[h]) {
                                    e[h] = true;
                                    l[l.length] = b
                                }
                            }
                            k += 20
                        }
                        var s = 0;
                        a.each(l,
                        function() {
                            var i = this;
                            var m = this.row;
                            if (o.selectionmode != "none" && o._selectrowwithmouse) {
                                if (u.ctrlKey || u.metaKey) {
                                    o._applyrowselection(o.getboundindex(m), true, false, false)
                                } else {
                                    if (s == 0) {
                                        o._applyrowselection(o.getboundindex(m), true, false, true)
                                    } else {
                                        o._applyrowselection(o.getboundindex(m), true, false, false)
                                    }
                                }
                                s++
                            }
                        })
                    } else {
                        if (o.selectionmode == "multiplecellsadvanced") {
                            k += 2
                        }
                        var r = o.hScrollInstance;
                        var t = r.value;
                        if (this.rtl) {
                            if (this.hScrollBar.css("visibility") != "hidden") {
                                t = r.max - r.value
                            }
                            if (this.vScrollBar[0].style.visibility != "hidden") {
                                t -= this.scrollbarsize + 4
                            }
                        }
                        var q = o.table[0].rows[0];
                        var j = o.selectionarea.height();
                        if (!u.ctrlKey && !u.metaKey && j > 0) {
                            o.selectedcells = new Array()
                        }
                        var A = j;
                        while (k < s + A) {
                            var b = o._hittestrow(n, k);
                            if (!b) {
                                k += 5;
                                continue
                            }
                            var f = b.row;
                            var h = b.index;
                            if (h != -1) {
                                if (!e[h]) {
                                    e[h] = true;
                                    for (var v = 0; v < q.cells.length; v++) {
                                        var d = parseFloat(a(o.columnsrow[0].cells[v]).css("left")) - t;
                                        var z = d + a(o.columnsrow[0].cells[v]).width();
                                        if ((D >= d && D <= z) || (g >= d && g <= z) || (d >= D && d <= g)) {
                                            o._applycellselection(o.getboundindex(f), o._getcolumnat(v).datafield, true, false)
                                        }
                                    }
                                }
                            }
                            k += 5
                        }
                    }
                    if (o.autosavestate) {
                        if (o.savestate) {
                            o.savestate()
                        }
                    }
                    o._renderrows(o.virtualsizeinfo)
                }
            }
        },
        selectprevcell: function(e, c) {
            var f = this._getcolumnindex(c);
            var b = this.columns.records.length;
            var d = this._getprevvisiblecolumn(f);
            if (d != null) {
                this.clearselection();
                this.selectcell(e, d.datafield)
            }
        },
        selectnextcell: function(e, d) {
            var f = this._getcolumnindex(d);
            var c = this.columns.records.length;
            var b = this._getnextvisiblecolumn(f);
            if (b != null) {
                this.clearselection();
                this.selectcell(e, b.datafield)
            }
        },
        _getfirstvisiblecolumn: function() {
            var b = this;
            var e = this.columns.records.length;
            for (var c = 0; c < e; c++) {
                var d = this.columns.records[c];
                if (!d.hidden && d.datafield != null) {
                    return d
                }
            }
            return null
        },
        _getlastvisiblecolumn: function() {
            var b = this;
            var e = this.columns.records.length;
            for (var c = e - 1; c >= 0; c--) {
                var d = this.columns.records[c];
                if (!d.hidden && d.datafield != null) {
                    return d
                }
            }
            return null
        },
        _handlekeydown: function(A, t) {
            if (t.groupable && t.groups.length > 0) {}
            if (t.disabled) {
                return false
            }
            var H = A.charCode ? A.charCode: A.keyCode ? A.keyCode: 0;
            if (t.editcell && t.selectionmode != "multiplecellsadvanced") {
                return true
            } else {
                if (t.editcell && t.selectionmode == "multiplecellsadvanced") {
                    if (H >= 33 && H <= 40) {
                        if (!A.altKey) {
                            if (t._cancelkeydown == undefined || t._cancelkeydown == false) {
                                if (t.editmode !== "selectedrow") {
                                    t.endcelledit(t.editcell.row, t.editcell.column, false, true);
                                    t._cancelkeydown = false;
                                    if (t.editcell && !t.editcell.validated) {
                                        t._rendervisualrows();
                                        t.endcelledit(t.editcell.row, t.editcell.column, false, true);
                                        return false
                                    }
                                } else {
                                    return true
                                }
                            } else {
                                t._cancelkeydown = false;
                                return true
                            }
                        } else {
                            t._cancelkeydown = false;
                            return true
                        }
                    } else {
                        return true
                    }
                }
            }
            if (t.selectionmode == "none") {
                return true
            }
            if (t.showfilterrow && t.filterable) {
                if (this.filterrow) {
                    if (a(A.target).ischildof(t.filterrow)) {
                        return true
                    }
                }
            }
            if (t.showeverpresentrow) {
                if (t.addnewrowtop) {
                    if (a(A.target).ischildof(t.addnewrowtop)) {
                        return true
                    }
                }
                if (t.addnewrowbottom) {
                    if (a(A.target).ischildof(t.addnewrowbottom)) {
                        return true
                    }
                }
            }
            if (t.pageable) {
                if (a(A.target).ischildof(this.pager)) {
                    return true
                }
            }
            if (this.showtoolbar) {
                if (a(A.target).ischildof(this.toolbar)) {
                    return true
                }
            }
            if (this.showstatusbar) {
                if (a(A.target).ischildof(this.statusbar)) {
                    return true
                }
            }
            var r = false;
            if (A.altKey) {
                return true
            }
			/*
            if (A.ctrlKey || A.metaKey) {
                if (this.clipboard) {
                    var b = String.fromCharCode(H).toLowerCase();
                    if (this.clipboardbegin) {
                        var j = null;
                        if (b == "c") {
                            //j = this.clipboardbegin("copy", this.copyselection())
                        } else {
                            if (b == "x") {
                                //j = this.clipboardbegin("cut", this.copyselection())
                            } else {
                                if (b == "v") {
                                    j = this.clipboardbegin("paste")
                                }
                            }
                        }
                        if (j === false) {
                            return false
                        }
                    }
                    if (b == "c" || b == "x") {
                        var q = this.copyselection();
                        if (b == "c" && this.clipboardend) {
                            this.clipboardend("copy")
                        }
                        if (b == "x" && this.clipboardend) {
                            this.clipboardend("cut")
                        }
                        if (window.clipboardData) {
                            window.clipboardData.setData("Text", q)
                        } else {
                            var g = a('<textarea style="position: absolute; left: -1000px; top: -1000px;"/>');
                            g.val(q);
                            a("body").append(g);
                            g.select();
                            setTimeout(function() {
                                document.designMode = "off";
                                g.select();
                                g.remove();
                                t.focus()
                            },
                            100)
                        }
                        if (b == "c" && a.jqx.browser.msie) {
                            return false
                        } else {
                            if (b == "c") {
                                return true
                            }
                        }
                    } else {
                        if (b == "v") {
                            var F = a('<textarea style="position: absolute; left: -1000px; top: -1000px;"/>');
                            a("body").append(F);
                            F.select();
                            var k = this;
                            setTimeout(function() {
                                k._clipboardselection = new Array();
                                var M = F.val();
                                if (M.length == 0 && window.clipboardData) {
                                    F.val(window.clipboardData.getData("Text"));
                                    var M = F.val()
                                }
                                var L = M.split("\n");
                                for (var K = 0; K < L.length; K++) {
                                    if (L[K].split("\t").length > 0) {
                                        var J = L[K].split("\t");
                                        if (J.length == 1 && K == L.length - 1 && J[0] == "") {
                                            continue
                                        }
                                        if (J.length > 0) {
                                            k._clipboardselection.push(J)
                                        }
                                    }
                                }
                                k.pasteselection();
                                F.remove();
                                k.focus()
                            },
                            100);
                            return true
                        }
                    }
                    if (b == "x") {
                        this.deleteselection();
                        this.host.focus();
                        return false
                    }
                }
            }
			*/
            var n = Math.round(t._gettableheight());
            var y = Math.round(n / t.rowsheight);
            var f = t.getdatainformation();
            switch (t.selectionmode) {
            case "singlecell":
            case "multiplecells":
            case "multiplecellsextended":
            case "multiplecellsadvanced":
                var I = t.getselectedcell();
                if (I != null) {
                    var e = this.getrowvisibleindex(I.rowindex);
                    var i = e;
                    var p = I.datafield;
                    var w = t._getcolumnindex(p);
                    var c = t.columns.records.length;
                    var v = function(Q, K, P, O) {
                        var J = function(ab, U) {
                            var W = t.dataview.loadedrecords[ab];
                            if (t.groupable && t.groups.length > 0) {
                                var X = ab;
                                if (O == "up") {
                                    X++
                                }
                                if (O == "down") {
                                    X--
                                }
                                var W = t.getdisplayrows()[X];
                                var R = function(ac) {
                                    if (ac.group) {
                                        if (t.expandedgroups[ac.uniqueid]) {
                                            return t.expandedgroups[ac.uniqueid].expanded
                                        }
                                    } else {
                                        return false
                                    }
                                };
                                var Z = 1;
                                var S = true;
                                while (S && Z < 300) {
                                    S = false;
                                    if (O == "down") {
                                        W = t.getdisplayrows()[X + Z]
                                    } else {
                                        if (O == "up") {
                                            W = t.getdisplayrows()[X - Z]
                                        }
                                    }
                                    if (!W) {
                                        break
                                    }
                                    if (W && W.group) {
                                        S = true
                                    }
                                    var aa = W.parentItem;
                                    while (aa) {
                                        if (aa && !R(aa)) {
                                            S = true
                                        }
                                        aa = aa.parentItem
                                    }
                                    if (!S) {
                                        break
                                    }
                                    Z++
                                }
                                if (Z == 300) {
                                    W = null
                                }
                                if (t.pageable) {
                                    var Y = false;
                                    if (W) {
                                        for (var V = 0; V < t.dataview.rows.length; V++) {
                                            if (t.dataview.rows[V].boundindex == W.boundindex) {
                                                Y = true
                                            }
                                        }
                                        if (!Y) {
                                            W = null
                                        }
                                    }
                                }
                            }
                            if (W != undefined && U != null) {
                                if (P || P == undefined) {
                                    t.clearselection()
                                }
                                var T = t.getboundindex(W);
                                t.selectcell(T, U);
                                t._oldselectedcell = t.selectedcell;
                                r = true;
                                t.ensurecellvisible(ab, U);
                                return true
                            }
                            return false
                        };
                        if (!J(Q, K)) {
                            t.ensurecellvisible(Q, K);
                            J(Q, K);
                            if (t.virtualmode) {
                                t.host.focus()
                            }
                        }
                        var M = t.groupable && t.groups.length > 0;
                        if (!M) {
                            if (A.shiftKey && A.keyCode != 9) {
                                if (t.selectionmode == "multiplecellsextended" || t.selectionmode == "multiplecellsadvanced") {
                                    if (t._lastClickedCell) {
                                        t._selectpath(Q, K);
                                        var N = t.dataview.loadedrecords[Q];
                                        var L = t.getboundindex(N);
                                        t.selectedcell = {
                                            rowindex: L,
                                            datafield: K
                                        };
                                        return
                                    }
                                }
                            } else {
                                if (!A.shiftKey) {
                                    t._lastClickedCell = {
                                        row: Q,
                                        column: K
                                    }
                                }
                            }
                        }
                    };
                    var B = A.shiftKey && t.selectionmode != "singlecell" && t.selectionmode != "multiplecells";
                    var C = function() {
                        v(0, p, !B)
                    };
                    var h = function() {
                        var J = f.rowscount - 1;
                        v(J, p, !B)
                    };
                    var d = H == 9 && !A.shiftKey;
                    var m = H == 9 && A.shiftKey;
                    if (t.rtl) {
                        var s = d;
                        d = m;
                        m = s
                    }
                    if (d || m) {
                        B = false
                    }
                    if (d || m) {
                        if (document.activeElement && document.activeElement.className && document.activeElement.className.indexOf("jqx-grid-cell-add-new-row") >= 0) {
                            return true
                        }
                    }
                    var o = A.ctrlKey || A.metaKey;
                    if (o && H == 37) {
                        var E = t._getfirstvisiblecolumn(w);
                        if (E != null) {
                            v(i, E.datafield)
                        }
                    } else {
                        if (o && H == 39) {
                            var u = t._getlastvisiblecolumn(w);
                            if (u != null) {
                                v(i, u.datafield)
                            }
                        } else {
                            if (H == 39 || d) {
                                var x = t._getnextvisiblecolumn(w);
                                if (x != null) {
                                    v(i, x.datafield, !B)
                                } else {
                                    if (!d) {
                                        r = true
                                    } else {
                                        var G = t._getfirstvisiblecolumn();
                                        H = 40;
                                        p = G.displayfield
                                    }
                                }
                            } else {
                                if (H == 37 || m) {
                                    var E = t._getprevvisiblecolumn(w);
                                    if (E != null) {
                                        v(i, E.datafield, !B)
                                    } else {
                                        if (!m) {
                                            r = true
                                        } else {
                                            var l = t._getlastvisiblecolumn();
                                            H = 38;
                                            p = l.displayfield
                                        }
                                    }
                                } else {
                                    if (H == 36) {
                                        C()
                                    } else {
                                        if (H == 35) {
                                            h()
                                        } else {
                                            if (H == 33) {
                                                if (i - y >= 0) {
                                                    var D = i - y;
                                                    v(D, p, !B)
                                                } else {
                                                    C()
                                                }
                                            } else {
                                                if (H == 34) {
                                                    if (f.rowscount > i + y) {
                                                        var D = i + y;
                                                        v(D, p, !B)
                                                    } else {
                                                        h()
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (H == 38) {
                        if (o) {
                            C()
                        } else {
                            if (i > 0) {
                                v(i - 1, p, !B, "up")
                            } else {
                                r = true
                            }
                        }
                    }
                    if (H == 40) {
                        if (o) {
                            h()
                        } else {
                            if ((f.rowscount > i + 1) || (t.groupable && t.groups.length > 0)) {
                                v(i + 1, p, !B, "down")
                            } else {
                                r = true
                            }
                        }
                    }
                }
                break;
            case "singlerow":
            case "multiplerows":
            case "multiplerowsextended":
            case "multiplerowsadvanced":
                var i = t.getselectedrowindex();
                if (i == null || i == -1) {
                    return true
                }
                i = this.getrowvisibleindex(i);
                var z = function(K, N, M) {
                    var J = function(V) {
                        var U = t.dataview.loadedrecords[V];
                        if (t.groupable && t.groups.length > 0) {
                            if (M == "up") {
                                V++
                            }
                            if (M == "down") {
                                V--
                            }
                            var U = t.getdisplayrows()[V];
                            var O = function(Z) {
                                if (Z.group) {
                                    if (t.expandedgroups[Z.uniqueid]) {
                                        return t.expandedgroups[Z.uniqueid].expanded
                                    }
                                } else {
                                    return false
                                }
                            };
                            var X = 1;
                            var P = true;
                            while (P && X < 300) {
                                P = false;
                                if (M == "down") {
                                    U = t.getdisplayrows()[V + X]
                                } else {
                                    if (M == "up") {
                                        U = t.getdisplayrows()[V - X]
                                    }
                                }
                                if (!U) {
                                    break
                                }
                                if (U && U.group) {
                                    P = true
                                }
                                var Y = U.parentItem;
                                while (Y) {
                                    if (Y && !O(Y)) {
                                        P = true
                                    }
                                    Y = Y.parentItem
                                }
                                if (!P) {
                                    break
                                }
                                X++
                            }
                            if (X == 300) {
                                U = null
                            }
                            if (t.pageable) {
                                var W = false;
                                if (U) {
                                    for (var T = 0; T < t.dataview.rows.length; T++) {
                                        if (t.dataview.rows[T].boundindex == U.boundindex) {
                                            W = true
                                        }
                                    }
                                    if (!W) {
                                        U = null
                                    }
                                }
                            }
                        }
                        if (U != undefined) {
                            var Q = t.getboundindex(U);
                            var S = t.selectedrowindex;
                            if (N || N == undefined) {
                                t.clearselection()
                            }
                            t.selectedrowindex = S;
                            t.selectrow(Q, false);
                            var R = t.ensurerowvisible(V);
                            if (!R || t.autoheight || t.groupable) {
                                t._rendervisualrows()
                            }
                            r = true;
                            return true
                        }
                        return false
                    };
                    if (!J(K)) {
                        t.ensurerowvisible(K);
                        J(K, N);
                        if (t.virtualmode) {
                            setTimeout(function() {
                                J(K, N)
                            },
                            25)
                        }
                        if (t.virtualmode) {
                            t.host.focus()
                        }
                    }
                    var L = t.groupable && t.groups.length > 0;
                    if (!L) {
                        if (A.shiftKey && H != 9) {
                            if (t.selectionmode == "multiplerowsextended") {
                                if (t._lastClickedCell) {
                                    t._selectrowpath(K);
                                    t.selectedrowindex = t.getrowboundindex(K);
                                    return
                                }
                            }
                        } else {
                            if (!A.shiftKey) {
                                t._lastClickedCell = {
                                    row: K
                                };
                                t.selectedrowindex = t.getrowboundindex(K)
                            }
                        }
                    }
                };
                var B = A.shiftKey && t.selectionmode != "singlerow" && t.selectionmode != "multiplerows";
                var C = function() {
                    z(0, !B)
                };
                var h = function() {
                    var J = f.rowscount - 1;
                    z(J, !B)
                };
                var o = A.ctrlKey || A.metaKey;
                if (H == 36 || (o && H == 38)) {
                    C()
                } else {
                    if (H == 35 || (o && H == 40)) {
                        h()
                    } else {
                        if (H == 33) {
                            if (i - y >= 0) {
                                var D = i - y;
                                z(D, !B)
                            } else {
                                C()
                            }
                        } else {
                            if (H == 34) {
                                if (f.rowscount > i + y) {
                                    var D = i + y;
                                    z(D, !B)
                                } else {
                                    h()
                                }
                            } else {
                                if (H == 38) {
                                    if (i > 0) {
                                        z(i - 1, !B, "up")
                                    } else {
                                        r = true
                                    }
                                } else {
                                    if (H == 40) {
                                        if ((f.rowscount > i + 1) || (t.groupable && t.groups.length > 0)) {
                                            z(i + 1, !B, "down")
                                        } else {
                                            r = true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                break
            }
            if (r) {
                if (t.autosavestate) {
                    if (t.savestate) {
                        t.savestate()
                    }
                }
                return false
            }
            return true
        },
        _handlemousemove: function(u, p) {
            if (p.vScrollInstance.isScrolling()) {
                return
            }
            if (p.hScrollInstance.isScrolling()) {
                return
            }
            var w;
            var q;
            var f;
            var n;
            var m;
            if (p.enablehover || p.selectionmode == "multiplerows") {
                w = this.showheader ? this.columnsheader.height() + 2 : 0;
                q = this._groupsheader() ? this.groupsheader.height() : 0;
                var A = this.showtoolbar ? this.toolbarheight: 0;
                q += A;
                f = this.host.coord();
                if (this.hasTransform) {
                    f = a.jqx.utilities.getOffset(this.host);
                    var k = this._getBodyOffset();
                    f.left -= k.left;
                    f.top -= k.top
                }
                n = u.pageX - f.left;
                m = u.pageY - w - f.top - q
            }
            if (p.selectionmode == "multiplerowsextended" || p.selectionmode == "multiplecellsextended" || p.selectionmode == "multiplecellsadvanced") {
                if (p.mousecaptured == true) {
                    return
                }
            }
            if (p.enablehover) {
                if (p.disabled) {
                    return
                }
                if (this.vScrollInstance.isScrolling() || this.hScrollInstance.isScrolling()) {
                    return
                }
                var c = this._hittestrow(n, m);
                if (!c) {
                    return
                }
                var h = c.row;
                var j = c.index;
                if (this.hoveredrow != -1 && j != -1 && this.hoveredrow == j && this.selectionmode.indexOf("cell") == -1 && this.selectionmode != "checkbox") {
                    return
                }
                this._clearhoverstyle();
                if (j == -1 || h == undefined) {
                    return
                }
                var r = this.hittestinfo[j].visualrow;
                if (r == null) {
                    return
                }
                if (this.hittestinfo[j].details) {
                    return
                }
                if (u.clientX > a(r).width() + a(r).coord().left) {
                    return
                }
                var B = 0;
                var o = r.cells.length;
                if (p.rowdetails && p.showrowdetailscolumn) {
                    if (!this.rtl) {
                        B = 1 + this.groups.length
                    } else {
                        o -= 1;
                        o -= this.groups.length
                    }
                } else {
                    if (this.groupable) {
                        if (!this.rtl) {
                            B = this.groups.length
                        } else {
                            o -= this.groups.length
                        }
                    }
                }
                if (r.cells.length == 0) {
                    return
                }
                var l = r.cells[B].className;
                if (h.group || (this.selectionmode.indexOf("row") >= 0 && l.indexOf("jqx-grid-cell-selected") != -1)) {
                    return
                }
                this.hoveredrow = j;
                if (this.selectionmode.indexOf("cell") != -1 || this.selectionmode == "checkbox") {
                    var e = -1;
                    var s = this.hScrollInstance;
                    var t = s.value;
                    if (this.rtl) {
                        if (this.hScrollBar.css("visibility") != "hidden") {
                            t = s.max - s.value
                        }
                    }
                    for (var v = B; v < o; v++) {
                        var g = parseInt(a(this.columnsrow[0].cells[v]).css("left")) - t;
                        var z = g + a(this.columnsrow[0].cells[v]).width();
                        if (z >= n && n >= g) {
                            e = v;
                            break
                        }
                    }
                    if (e != -1) {
                        var b = r.cells[e];
                        if (this.cellhover) {
                            this.cellhover(b, u.pageX, u.pageY)
                        }
                        if (b.className.indexOf("jqx-grid-cell-selected") == -1) {
                            if (this.editcell) {
                                var d = this._getcolumnat(e);
                                if (d) {
                                    if (this.editcell.row == j && this.editcell.column == d.datafield) {
                                        return
                                    }
                                }
                            }
                            a(b).addClass(this.toTP("jqx-grid-cell-hover"));
                            a(b).addClass(this.toTP("jqx-fill-state-hover"))
                        }
                    }
                    return
                }
                for (var v = B; v < o; v++) {
                    var b = r.cells[v];
                    a(b).addClass(this.toTP("jqx-grid-cell-hover"));
                    a(b).addClass(this.toTP("jqx-fill-state-hover"));
                    if (this.cellhover) {
                        this.cellhover(b, u.pageX, u.pageY)
                    }
                }
            } else {
                return true
            }
        }
    })
})(jqxBaseFramework);