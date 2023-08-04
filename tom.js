function getData() {
  switch (
    (tick1minute++,
    tick1minute > 60 && ((tick1minute = 0), (listData = 0)),
    listData)
  ) {
    case 0:
      getRegistry("1", "4"), listData++;
      break;
    case 1:
      getRegistry("64", "9"), listData++;
      break;
    case 2:
      getRegistry("1005", "41"), (listData = 10);
      break;
    case 10:
      getRegistry("11050", "13"), listData++;
      break;
    case 11:
      getRegistry("10000", "8"), listData++;
      break;
    case 12:
      getRegistry("11000", "50"), listData++;
      break;
    case 13:
      getRegistry("10000", "8"), listData++;
      break;
    case 14:
      getRegistry("10058", "1"), listData++;
      break;
    case 15:
      getRegistry("10000", "8"), (listData = 10);
      break;
    default:
      listData = 0;
  }
  process && setTimeout("getData()", 500);
}
function addZero(a) {
  return a < 10 && (a = "0" + a), a;
}
function hex2sint(a) {
  var b;
  return (a = 32768 & a ? 4294901760 | a : a), (b = a.toString(10));
}
function getRegistry(i, l) {
  var c = new XMLHttpRequest();
  c.open("POST", "status_read", !0),
    c.setRequestHeader("Content-type", "text/plain"),
    (c.onreadystatechange = function () {
      4 == this.readyState &&
        200 == this.status &&
        process &&
        printRegistry(this.responseText, i, l);
    }),
    c.send("t=" + new Date().toString() + "&l=" + l + "&p=1&i=" + i + "&d=0");
}
function printRegistry(response, i, l) {
  var d = registerHexParse(response, i, l);
  if (!d) return 0;
  var g,
    e = "",
    h = new Date();
  for (var i in d)
    switch (((g = d[i].value), d[i].register)) {
      case 1:
        reg2string(d, i, 4, "id-pIDCOV", "");
        break;
      case 64:
        setPrString(1, g);
        break;
      case 69:
        setPrString(2, g);
        break;
      case 70:
        setPrString(3, g);
        break;
      case 71:
        setPrString(4, g);
        break;
      case 72:
        setPrString(5, g);
        break;
      case 1006:
        setSvgLevelMax("svg-aktivace-max", g);
        break;
      case 1009:
        setSvgLevelMax("svg-akumulace-max", g);
        break;
      case 1027:
        if (g <= 3) {
          suggCapMultiplier = 0.001;
          for (var j = 0; j < g; j++)
            suggCapMultiplier = 10 * suggCapMultiplier;
        } else
          (e =
            "<span class='lang data-read-reg'>Reading registry</span>&nbsp;" +
            String(d[i].register) +
            ":"),
            (e +=
              "<span class='lang data-value'>Value</span>&nbsp;" +
              g +
              "<span class='lang data-out-range'> out of range</span>"),
            document.getElementById("id-errSYS").classList.add("show"),
            (document.getElementById("id-errSYS").innerHTML = e);
        break;
      case 1040:
        for (
          var k = document.getElementsByClassName("chemie-hide"), j = 0;
          j < k.length;
          j++
        )
          0 == g
            ? k[j].classList.add("hidden")
            : k[j].classList.remove("hidden");
        break;
      case 1044:
        0 == (2 & g) || modeSand
          ? 0 == (2 & g) && modeSand && svgRemoveSand()
          : svgCreateSand();
        break;
      case 1e4:
        8 & g && getRegistry("10112", "2");
        break;
      case 10003:
        h.setHours((g >> 8) & 255, 255 & g);
        break;
      case 10004:
        h.setSeconds(g),
          (document.getElementById("id-time").innerHTML =
            h.toLocaleTimeString(CurrentLang));
        break;
      case 10005:
        var l, m, n;
        (l = 31 & g),
          (m = (g >> 5) & 15),
          (n = 2e3 + ((g >> 9) & 127)),
          h.setFullYear(n, m - 1, l),
          (document.getElementById("id-date").innerHTML =
            h.toLocaleDateString(CurrentLang));
        break;
      case 10006:
        break;
      case 10007:
        toggleRele("dm", 1 & g),
          (modeDM = 0 == (1 & g) ? !1 : !0),
          toggleRele("pr1", 2 & g),
          toggleRele("v1o", 4 & g),
          toggleRele("v1c", (4 & g) ^ 4),
          toggleRele("v2o", 8 & g),
          toggleRele("v2c", (8 & g) ^ 8),
          toggleRele("v3o", 16 & g),
          toggleRele("v3c", (16 & g) ^ 16),
          toggleRele("v4o", 32 & g),
          toggleRele("v4c", (32 & g) ^ 32),
          toggleRele("pr2", 64 & g),
          toggleRele("pr3", 128 & g),
          toggleRele("pr4", 256 & g),
          toggleRele("pr5", 512 & g),
          toggleDIn("box-DIn1", 1024 & g),
          toggleDIn("box-DIn2", 2048 & g),
          toggleDIn("box-DIn3", 4096 & g),
          toggleDIn("box-DIn4", 8192 & g);
        break;
      case 10058:
        w = document.getElementById("id-iGsmSignal");
        var o = "unit percent signal ";
        0 == g
          ? (w.className = "unit percent")
          : (256 == (65280 & g)
              ? (w.className = o + "offline")
              : 512 == (65280 & g)
              ? (w.className = o + "online")
              : 768 == (65280 & g)
              ? (w.className = o + "reset")
              : 1024 == (65280 & g) && (w.className = o + "recovery"),
            (g = 255 & g),
            (w.style.color = g < 10 ? "#c30" : "inherit"),
            (g = (g / 30) * 100),
            (g = g > 100 ? 100 : g.toFixed()),
            (w.innerHTML = g));
        break;
      case 10112:
        e = g;
        break;
      case 10113:
        if ((g = e + 65536 * g))
          for (var j = 1; j < 11; j++) {
            var p;
            if ((p = 3 & g)) {
              var q = 1 == p ? "varovani" : 2 == p ? "porucha" : "havarie";
              if (document.getElementById("id-errFCE" + j)) {
                var w = document.getElementById("id-errFCE" + j);
                w.classList.contains(q) ||
                  (w.classList = "box-chyba-text " + q + " show");
              } else {
                var r = document.createElement("LI");
                r.setAttribute("id", "id-errFCE" + j),
                  (r.classList = "box-chyba-text " + q + " show");
                var s = document.createElement("span"),
                  t = document.createTextNode("S" + j + ": ");
                s.appendChild(t), r.appendChild(s);
                var u = document.createElement("span");
                (u.classList = "lang signfce" + j),
                  u.appendChild(document.createTextNode("Signaling " + j)),
                  r.appendChild(u);
                var v = document.getElementById("id-box-chyba");
                v.insertBefore(r, v.childNodes[v.childNodes.length - 1]);
              }
            } else {
              var w = document.getElementById("id-errFCE" + j);
              w && w.parentNode.removeChild(w);
            }
            g >>= 2;
          }
        break;
      case 11e3:
        (document.getElementById("box-aktivace").textContent = isValueValid(g)),
          setSvgAktivace(g);
        break;
      case 11001:
        (document.getElementById("box-akumulace").textContent =
          isValueValid(g)),
          setSvgAkumulace(g);
        break;
      case 11002:
        document.getElementById("id-iVykonDM").innerHTML = g / 10;
        break;
      case 11003:
        PrintPhase(g);
        break;
      case 11004:
        minutes2days("id-tAktualniFaze", g),
          minutes2days("id-tAktualniFaze-tech", g);
        break;
      case 11005:
        minutes2days("id-tFazePlneni", g);
        break;
      case 11006:
        minutes2days("id-tFazeSedimentace", g);
        break;
      case 11007:
        minutes2days("id-tFazePlneniDekanteru", g);
        break;
      case 11008:
        minutes2days("id-tFazeOdkaleni", g);
        break;
      case 11009:
        minutes2days("id-tFazePrazdneni", g);
        break;
      case 11010:
        minutes2days("id-tDenitPlneni", g);
        break;
      case 11011:
        minutes2days("id-tDenitSedimentace", g);
        break;
      case 11012:
        minutes2days("id-tDenitRecirkulace", g);
        break;
      case 11024:
        e = g;
        break;
      case 11025:
        setClearWatterHistory("id-iCistaVoda", e, g);
        break;
      case 11026:
        createClearWatterHistory(g);
        break;
      case 11027:
        e = g;
        break;
      case 11028:
        setClearWatterHistory("id-iCistaVoda-D1", e, g);
        break;
      case 11029:
        e = g;
        break;
      case 11030:
        setClearWatterHistory("id-iCistaVoda-D2", e, g);
        break;
      case 11031:
        e = g;
        break;
      case 11032:
        setClearWatterHistory("id-iCistaVoda-D3", e, g);
        break;
      case 11033:
        e = g;
        break;
      case 11034:
        setClearWatterHistory("id-iCistaVoda-D4", e, g);
        break;
      case 11035:
        e = g;
        break;
      case 11036:
        setClearWatterHistory("id-iCistaVoda-D5", e, g);
        break;
      case 11037:
        e = g;
        break;
      case 11038:
        setClearWatterHistory("id-iCistaVoda-D6", e, g);
        break;
      case 11039:
        e = g;
        break;
      case 11040:
        setClearWatterHistory("id-iCistaVoda-D7", e, g);
        break;
      case 11041:
        e = g;
        break;
      case 11042:
        setClearWatterHistory("id-iCistaVoda-D8", e, g);
        break;
      case 11043:
        e = g;
        break;
      case 11044:
        setClearWatterHistory("id-iCistaVoda-D9", e, g);
        break;
      case 11045:
        e = g;
        break;
      case 11046:
        setClearWatterHistory("id-iCistaVoda-D10", e, g);
        break;
      case 11047:
        showError("errE107", 1 & g),
          showError("errE108", 2 & g),
          showError("errE131", 4 & g),
          showError("errE133", 8 & g);
        break;
      case 11048:
        showError("errE104", 1 & g),
          showError("errE105", 2 & g),
          showError("errE106", 4 & g),
          showError("errE130", 8 & g),
          showError("errE132", 16 & g),
          showError("errE110", 64 & g),
          showError("errE111", 128 & g),
          showError("errE150", 256 & g);
        break;
      case 11049:
        showError("errE101", 1 & g),
          showError("errE102", 2 & g),
          showError("errE103", 4 & g),
          showError("errE003", 8192 & g),
          showError("errE002", 16384 & g),
          showError("errE001", 32768 & g);
        break;
      case 11051:
        PrintMode(g);
        break;
      case 11053:
        var l, x;
        (x = 127 & g),
          (l = (g >> 7) & 511),
          setBoxValue("pStavChemP", String(x)),
          setBoxValue("pStavChemD", String(l));
        break;
      case 11054:
        (g /= 100), setBoxValue("iAv1", String(g));
        break;
      case 11055:
        setBoxValue("iAi1", String(g / 100));
        var y = "--";
        0 != g && (y = "< 0"),
          g >= 400 &&
            ((g -= 400),
            (g /= 16),
            (g = parseFloat(g.toFixed(1))),
            (y = String(g))),
          setBoxValue("iATemp1", y);
        break;
      case 11056:
        (g /= 100), setBoxValue("iAv2", String(g));
        break;
      case 11057:
        (g /= 100), setBoxValue("iAi2", String(g));
        break;
      case 11058:
        (g = g * suggCapMultiplier * 1e3),
          (g = parseFloat(g.toFixed(3))),
          setBoxValue("iCistaVodaCelkem", g);
        break;
      case 11059:
        (g *= suggCapMultiplier),
          (g = parseFloat(g.toFixed(3))),
          setBoxValue("iPrumPritok", g);
        break;
      case 11060:
        (g *= suggCapMultiplier),
          (g = parseFloat(g.toFixed(3))),
          setBoxValue("iPrumPritokZaRegInterval", g);
        break;
      case 11062:
        (g *= suggCapMultiplier),
          (g = parseFloat(g.toFixed(3))),
          setBoxValue("iMaxPritok", g);
    }
}
function reg2string(a, b, c, d, e) {
  arr = [];
  var g,
    h,
    f = document.getElementById(d);
  parseInt(b) + c > a.length && (c = a.length - parseInt(b));
  for (var i = 0; i < c; i++) (g = a[parseInt(b) + i].value), g && arr.push(g);
  if ((h = arr2string(arr))) {
    var j = document.getElementById(d + "-section");
    j && j.classList.remove("hidden"), (f.innerHTML = e + h);
  }
}
function minutes2days(a, b) {
  var c = document.getElementById(a),
    d = "",
    e = "";
  if (b < 60) (e = "minutes"), (d = String(b));
  else if (b < 1440) {
    e = "hours";
    var f = b % 60,
      g = (b - f) / 60;
    (f = f < 10 ? "0" + f : f), (d = g + ":" + f);
  } else {
    e = "days";
    var h = b / 1440;
    d = h.toFixed(1);
  }
  65535 != b ||
    ("id-tAktualniFaze" != a && "id-tAktualniFaze-tech" != a) ||
    ((d = ""), (e = "signal offline")),
    (c.classList = "unit " + e),
    (document.getElementById(a).innerHTML = d);
}
function isValueValid(a) {
  return 65535 == a && (a = "--"), a;
}
function createClearWatterHistory(a) {
  document.getElementById("id-iCistaVoda-N").innerHTML = a ? a : "";
  for (
    var b = document.getElementById("id-box-iCistaVoda"),
      c = "",
      d = b.childNodes.length - 1,
      e = d;
    e <= a;
    e++
  ) {
    var f = document.createElement("td"),
      g = document.createElement("span");
    (f.classList = "one"),
      g.appendChild(document.createTextNode("---")),
      (c = 0 == e ? "" : "-D" + e),
      g.setAttribute("id", "id-iCistaVoda" + c),
      (g.classList = "unit meter3"),
      f.appendChild(g);
    var h = document.createElement("td"),
      i = document.createElement("span");
    if (
      ((h.classList = "two"),
      (c = "lang "),
      (c += 0 == e ? "current-clean-water" : "nDay-clean-water"),
      (i.classList = c),
      (c =
        0 == e
          ? "Current amount of clean water today"
          : "Amount of clean water day "),
      i.appendChild(document.createTextNode(c)),
      h.appendChild(i),
      0 != e)
    ) {
      var j = document.createElement("span");
      (c = e + "."),
        j.appendChild(document.createTextNode(c)),
        h.appendChild(j);
    }
    var k = document.createElement("tr");
    k.appendChild(f), k.appendChild(h), b.appendChild(k);
  }
  if (((d = b.childNodes.length - 1), a++, a < d))
    for (var e = d; e > a; e--) b.removeChild(b.childNodes[e]);
}
function setClearWatterHistory(a, b, c) {
  document.getElementById(a) &&
    ((b = (65535 & b) + ((c << 16) & 4294901760)),
    (b = parseInt(b / 10)),
    (b = b >= 1e4 ? parseInt(b / 100) : b / 100),
    (document.getElementById(a).textContent = b));
}
function setBoxValue(a, b) {
  var c = document.getElementById("id-" + a);
  process &&
    (65535 == b
      ? ((b = "> " + String(b)), (c.style.opacity = "0.4"))
      : (c.style.opacity = "1"),
    (c.innerHTML = b));
}
function setPrString(a, b) {
  var d,
    c = "id-Pr" + String(a),
    e = "",
    f = document.getElementById(c);
  switch (b) {
    case 1:
      (d = "out-manual"), (e = "Manually");
      break;
    case 2:
      (d = "UV-lamp"), (e = "UV lamp");
      break;
    case 3:
      (d = "chemicals"), (e = "Chemicals");
      break;
    case 4:
      (d = "backup-blower"), (e = "Back-up blower");
      break;
    case 5:
      (d = "error-E101"), (e = "Emergency accumulation level");
      break;
    case 6:
      (d = "prog-timer-number-short"), (e = "1");
      break;
    case 7:
      (d = "prog-timer-number-short"), (e = "2");
      break;
    case 8:
      (d = "prog-timer-number-short"), (e = "3");
      break;
    case 9:
      (d = "interval-timer-number-short"), (e = "1");
      break;
    case 10:
      (d = "interval-timer-number-short"), (e = "2");
  }
  if ("prog-timer-number-short" == d || "interval-timer-number-short" == d) {
    if (f.hasChildNodes()) f.parentElement.lastChild.innerHTML = e;
    else {
      var g = document.createElement("span");
      g.appendChild(document.createTextNode(e)), f.parentElement.appendChild(g);
    }
    e =
      "prog-timer-number-short" == d ? "Programmable timer" : "Interval timer";
  }
  (f.classList = "lang " + d), (f.textContent = e);
}
function PrintMode(a) {
  modeWWTP = a;
  var b,
    c = "";
  switch (a) {
    case 0:
      (b = "off"), (c = "Off");
      break;
    case 1:
      (b = "auto"), (c = "Automatic");
      break;
    case 2:
      (b = "manual"), (c = "Manual");
      break;
    case 3:
      (b = "service"), (c = "Service");
  }
  if (c) {
    var d = document.getElementById("id-pModCOV");
    (d.classList = "lang mode-" + b), (d.textContent = c);
  }
}
function PrintPhase(a) {
  var b,
    c = "",
    d = [],
    e = [],
    f = [];
  switch (a) {
    case 0:
      (b = "activation"),
        (c = "Performing Activation"),
        (d = modeSand ? ["in", "akumDenit", "sandOut"] : ["in", "akumDenit"]),
        (e = ["aktivace", "kal"]),
        (f = ["akumulace0", "aktivace1", "pisek0"]);
      break;
    case 1:
      (b = "sediment"),
        (c = "Sedimentation"),
        (d = ["in"]),
        (e = ["akumulace"]),
        (f = ["akumulace1"]);
      break;
    case 2:
      (b = "decanter"),
        (c = "Filling the decanter"),
        (d = modeSand
          ? ["in", "decantInRev", "sandDecant"]
          : ["in", "decantInRev"]),
        (e = []),
        (f = ["akumulace1", "pisek0"]);
      break;
    case 3:
      (b = "desalination"),
        (c = "Desalination"),
        (d = ["in", "drain"]),
        (e = ["akumulace"]),
        (f = ["akumulace1", "aktivace0"]);
      break;
    case 4:
      (b = "draining"),
        (c = "Draining"),
        (d = modeSand
          ? ["in", "decantIn", "decantSand", "sandOut"]
          : ["in", "decantIn", "decantOut"]),
        (e = ["akumulace"]),
        (f = ["akumulace1", "aktivace0", "pisek1"]);
      break;
    case 5:
      (b = "denitri-fill"),
        (c = "Denitri. fulfillment"),
        (d = modeSand ? ["in", "akumDenit", "sandOut"] : ["in", "akumDenit"]),
        (e = ["aktivace"]),
        (f = ["akumulace0", "aktivace1", "pisek0"]);
      break;
    case 6:
      (b = "denitri-sediment"),
        (c = "Denitri. sedimentation"),
        (d = ["in"]),
        (e = []),
        (f = ["akumulace1"]);
      break;
    case 7:
      (b = "denitri-recirc"),
        (c = "Denitri. recirculation"),
        (d = ["in", "drain"]),
        (e = ["aktivace"]),
        (f = ["akumulace1", "aktivace1", "pisek0"]);
      break;
    case 8:
      (b = "triggering"), (c = "Triggering");
  }
  c &&
    (setPhase("id-pFazeCOV", b, c),
    setPhase("id-pFazeCOV-tech", b, c),
    setPipes(d),
    setBubbles(e),
    setArrows(f));
}
function setPhase(a, b, c) {
  var d = document.getElementById(a);
  (d.classList = "lang phase-" + b), (d.textContent = c);
}
function inArray(a, b) {
  for (var c = b.length, d = 0; d < c; d++) if (b[d] == a) return d;
  return -1;
}
function setPipes(a) {
  for (
    var b = [
        "in",
        "akumDenit",
        "drain",
        "decantIn",
        "decantInRev",
        "decantOut",
        "decantSand",
        "sandDecant",
        "sandOut",
      ],
      c = 0;
    c < b.length;
    c++
  ) {
    var d = -1;
    modeDM && (d = inArray(b[c], a));
    var e = "svg-pipe-" + b[c],
      f = document.getElementById(e).classList;
    d < 0 ? f.add("hidden") : f.remove("hidden");
  }
}
function setBubbles(a) {
  for (
    var b = ["akumulace", "aktivace", "pisek", "kal"], c = 0;
    c < b.length;
    c++
  ) {
    var d = -1;
    modeDM && (d = inArray(b[c], a));
    var e = "svg-" + b[c];
    d < 0 ? svgRemove(e + "-bubbles") : bubblesSvg(e);
  }
}
function setArrows(a) {
  for (
    var b = [
        "akumulace0",
        "akumulace1",
        "aktivace0",
        "aktivace1",
        "pisek0",
        "pisek1",
      ],
      c = modeSand ? b.length : b.length - 2,
      d = 0;
    d < c;
    d++
  ) {
    var e = inArray(b[d], a);
    modeDM ||
      (d < 2
        ? 0 == d && (svgCreateArrow("svg-akumulace1"), (e = -1))
        : (e = -1));
    var f = "svg-" + b[d];
    e < 0 ? svgRemove(f) : svgCreateArrow(f);
  }
}
function toggleRele(a, b) {
  var c = !1;
  (c = b > 0 ? !0 : !1),
    document.getElementById("rele-" + a).classList.toggle("rele-on", c);
}
function toggleDIn(a, b) {
  var c = !1;
  (c = b > 0 ? !0 : !1),
    document.getElementById(a).classList.toggle("rele-on", c);
}
function showError(a, b) {
  var c = !1;
  c = b > 0 ? !0 : !1;
  var d = document.getElementById("id-" + a).classList;
  d && (c ? d.add("show") : d.remove("show"));
}
function validateHex(a, b, c, d) {
  if (((d = d ? " " + String(d) + " " : ""), 241 == a[3])) return !0;
  var h,
    f = "data-n-v",
    g = "Data is not valid",
    i = "";
  if (255 == a[3]) {
    switch (
      (c &&
        ((c = parseInt(b) + parseInt(c) - 1),
        (c = c.toString()),
        (c = "&nbsp;<span class='lang to'>to</span>&nbsp;" + c)),
      a[5])
    ) {
      case 0:
        (f = "data-unknown-err"), (g = "Unknown error");
        break;
      case 1:
        (f = "data-comm-err"), (g = "Communication error");
        break;
      case 2:
        (f = "data-permissions"),
          (g =
            "Insufficient permissions or permissions from another interface");
        break;
      case 3:
        (f = ""),
          (g =
            "<span class='lang data-value'>Value</span>&nbsp;" +
            d +
            "<span class='lang data-out-range'> out of range</span>");
        break;
      case 4:
        (f = "data-comm-processed"),
          (g = "The previous command is being processed");
        break;
      default:
        (f = "data-another-err"), (g = "Another error!!!");
    }
    switch (a[4]) {
      case 0:
        (h = ""), (i = "");
        break;
      case 1:
        (h = "data-permission-settings"), (i = "Permission settings:");
        break;
      case 2:
        (h = "data-wifi-inf"), (i = "Wifi information (version):");
        break;
      case 3:
        (h = ""),
          (i =
            "<span class='lang data-read-reg'>Reading registry</span>&nbsp;" +
            b +
            c +
            ":");
        break;
      case 4:
        (h = ""),
          (i =
            "<span class='lang data-write-reg'>Write to registry</span>&nbsp;" +
            b +
            c +
            ":");
        break;
      case 5:
        (h = "data-wd-stat"), (i = "WD/status (resetting WDT for WiFi):");
        break;
      case 165:
        (h = "data-wifi-start"), (i = "FW Wifi start signaling:");
        break;
      default:
        (h = "data-another-command"), (i = "Another command!!!");
    }
    (f = "" != f ? ' class="lang ' + f + '"' : ""),
      (h = "" != h ? ' class="lang ' + h + '"' : "");
  }
  return (
    document.getElementById("id-errSYS").classList.add("show"),
    (document.getElementById("id-errSYS").innerHTML =
      "<span" + h + ">" + i + "</span> <span" + f + ">" + g + "</span>"),
    !1
  );
}
function arr2hex(a) {
  var b = "",
    c = "";
  for (var d in a) (c = a[d].toString(16)), (b += c.length < 2 ? "0" + c : c);
  return b;
}
function arr2string(a) {
  var b = "";
  for (var c in a) b += String.fromCharCode(255 & a[c], (a[c] >> 8) & 255);
  return b;
}
function registerHexParse(a, b, c) {
  a = a.replace(/ /g, "");
  for (var d = [], e = [], f = 0, g = 0; g < a.length; g++)
    d.push(parseInt(a[g] + a[g + 1], 16)), g++;
  if (!validateHex(d, b, c)) return 0;
  for (var g = 0; g < d.length - 5; g++)
    if ((5 == g && (f = (255 & d[g]) + ((d[g + 1] << 8) & 65280)), g > 6)) {
      var h = { register: 0, value: 0 };
      (h.register = f),
        f++,
        (h.value = (255 & d[g]) + ((d[g + 1] << 8) & 65280)),
        g++,
        e.push(h);
    }
  return e;
}
function selectExpand(a) {
  var b = document.getElementsByClassName("expand"),
    c = a.classList.contains("expand");
  if (b.length > 0)
    for (var d = 0; d < b.length; d++) b[d].classList.remove("expand");
  c || a.classList.add("expand");
}
function select(a) {
  a.parentElement.previousElementSibling.innerHTML = a.innerHTML;
}
function getCurrentLangSettings() {
  var a = new XMLHttpRequest();
  a.open("POST", "system_settings", !0),
    a.setRequestHeader("Content-type", "text/json"),
    (a.onreadystatechange = function () {
      if (4 == this.readyState && 200 == this.status) {
        var a = JSON.parse(this.responseText);
        CurrentLang = a.language;
      }
    }),
    a.send();
}
function addZero(a) {
  return a < 10 && (a = "0" + a), a;
}
function findKeyframesRule(a) {
  for (
    var b = document.getElementById("idStyleBubbles"),
      c = b.sheet ? b.sheet : b.styleSheet,
      d = 0;
    d < c.cssRules.length;
    ++d
  )
    if (
      c.cssRules[d].type == window.CSSRule.KEYFRAMES_RULE &&
      c.cssRules[d].name == a
    )
      return c.cssRules[d];
  return null;
}
function findStyleRule(a) {
  for (
    var b = document.getElementById("idStyleBubbles"),
      c = b.sheet ? b.sheet : b.styleSheet,
      d = 0;
    d < c.cssRules.length;
    ++d
  )
    if (
      c.cssRules[d].type == window.CSSRule.STYLE_RULE &&
      c.cssRules[d].selectorText == "." + a
    )
      return !0;
  return !1;
}
function svgCreateSand() {
  modeSand = !0;
  var f,
    g,
    a = 2200,
    b = 855,
    c = 1135,
    d = 350,
    e = 175,
    h = "";
  (h +=
    "<rect id='svg-pisek' class='fil5' x='" +
    a +
    "' y='" +
    b +
    "' width='" +
    d +
    "' height='595'/>"),
    (h +=
      "<rect class='fil4' x='" +
      a +
      "' y='" +
      c +
      "' width='" +
      d +
      "' height='" +
      e +
      "'/>");
  for (var i = 0; i < 300; i++)
    (f = Math.floor(Math.random() * d + a)),
      (g = Math.floor(Math.random() * e + c)),
      (h += '<circle class="fil3" cx=' + f + " cy=" + g + ' r="3"/>');
  (h +=
    "<line class='fil6 str0' x1='" +
    a +
    "' y1='" +
    parseInt(c + e) +
    "' x2='" +
    parseInt(d + a) +
    "' y2='" +
    parseInt(c + e) +
    "' />"),
    (h +=
      "<line class='fil6 str2' x1='" +
      a +
      "' y1='170' x2='" +
      a +
      "' y2= '1450' />"),
    (document.getElementById("svg-pisek-group").innerHTML = h),
    document.getElementById("svg-aktivace").setAttribute("width", 850),
    document.getElementById("svg-aktivace-max").setAttribute("width", 1e3),
    document.getElementById("svg-text-aktiv").setAttribute("x", 1763),
    svgRemove("svg-aktivace-bubbles");
}
function svgRemoveSand() {
  (modeSand = !1),
    (document.getElementById("svg-pisek-group").innerHTML = ""),
    document.getElementById("svg-aktivace").setAttribute("width", 1200),
    document.getElementById("svg-aktivace-max").setAttribute("width", 1350),
    document.getElementById("svg-text-aktiv").setAttribute("x", 2263),
    svgRemove("svg-pisek0"),
    svgRemove("svg-pisek1"),
    svgRemove("svg-aktivace-bubbles");
}
function svgCreateArrow(a) {
  if (!document.getElementById(a)) {
    var b,
      c,
      d = parseInt(a[a.length - 1]),
      e = a.slice(0, a.length - 1),
      f = document.getElementById(e),
      g = parseInt(f.getAttribute("width")),
      h = parseInt(f.getAttribute("height"));
    modeSand || "svg-aktivace" != e || (g -= 350),
      (b = parseInt(f.getAttribute("x")) + g / 2),
      (c = parseInt(f.getAttribute("y")) + h / 2),
      c > 1300 && (c = 1300),
      "svg-pisek" == e && (c -= 150);
    var i = "",
      j = c + 20,
      k = c - 20,
      l = "";
    0 == d && ((j = c - 20), (k = c + 20), (l = " down")),
      (i +=
        "<polyline id='" +
        a +
        "' class='arrow" +
        l +
        "' points='" +
        (b - 100) +
        "," +
        j +
        " " +
        b +
        "," +
        k +
        " " +
        (b + 100) +
        "," +
        j +
        "'/>"),
      (document.getElementById("svg-bubblesBox").innerHTML += i);
  }
}
function svgCreatePipe(a, b, c, d, e) {
  var f = "";
  f = "<g id='" + a + "' class='hidden'>";
  var g = "";
  1 == e && (g = " dirty"),
    0 != e && (f += "  <path class='pipe" + g + "' d='" + b + "'/>"),
    (f += "  <path class='pipe-path' id='" + a + "-flow' d='" + b + "'/>");
  for (var h = 0; h < 3; h++) {
    var i = 0;
    (i = -(d / 3) * h),
      (f +=
        "  <polyline id='" +
        a +
        "-arr" +
        h +
        "' class='pipe-arrow' points='0,-15 15,0 0,15'/>"),
      (f +=
        "  <animateMotion xlink:href='#" +
        a +
        "-arr" +
        h +
        "' begin='" +
        i +
        "' dur='" +
        d +
        "s' repeatCount='indefinite'  rotate='auto'>"),
      (f += "    <mpath xlink:href='#" + a + "-flow' />"),
      (f += "  </animateMotion>");
  }
  (f += "</g>"),
    (a += "-flow"),
    document.write(f),
    (document.getElementById(a).style.animationDuration = c + "s");
}
function addKeyFrames(a, b) {
  var c = document.getElementById("idStyleBubbles").sheet,
    d = c.length;
  if (CSS && CSS.supports && CSS.supports("animation: name"))
    c.insertRule("@keyframes " + a + "{" + b + "}", d);
  else {
    var e = a + "{" + b + "}";
    e.replace("transform", "-webkit-transform"),
      c.insertRule("@-webkit-keyframes " + e, d),
      (e = a + "{" + b + "}"),
      c.insertRule("@keyframes " + e, d + 1);
  }
}
function bubblesSvg(a) {
  var b = a + "-bubbles",
    c = a + "-cssBubbles";
  if (!document.getElementById(b)) {
    var d = document.getElementById("idStyleBubbles");
    d = d.sheet;
    var e = "",
      f = d.length,
      g = 40,
      h = 5,
      i = 10,
      j = 0.1;
    "svg-kal" == a && ((g = 5), (j = 0.4)), "svg-aktivace" == a && (j = 0);
    var k,
      l,
      m,
      n,
      o,
      p,
      q,
      r,
      s,
      t = document.getElementById(a),
      u = parseInt(t.getAttribute("width"));
    (m = h + (i + 1)),
      (q = (1 - 2 * j) * u - 2 * m),
      (r = parseInt(t.getAttribute("x")) + j * u + m),
      (p = parseInt(t.getAttribute("height"))),
      (s = parseInt(t.getAttribute("y"))),
      findStyleRule(c) ||
        ((e =
          "." +
          c +
          " {animation: " +
          c +
          "-bubbleUp 4s infinite ease-in-out;fill:white;stroke:lightblue;}"),
        d.insertRule(e, f),
        (e =
          "0% {transform: translate(0px,0px);transform: translate(0px,0px);stroke-width: 0;}"),
        (e +=
          "10% {transform: translate(0px,0px);transform: translate(0px,0px);stroke-width: 5;fill-opacity:0.5;stroke-opacity:0.4;}"),
        (e +=
          "15% {transform: translate(0px,0px);transform: translate(0px,0px);stroke-width: 10;}"),
        (e +=
          "95% {transform: translate(0px,-" +
          (p - 35) +
          "px);stroke-width: 10;}"),
        (e +=
          "99% {transform: translate(0px,-" +
          (p - 30) +
          "px);stroke-width: 0;fill-opacity:0.5;stroke-opacity:0.3;}"),
        (e +=
          "100% {transform: translate(0px,-" +
          (p - 30) +
          "px);stroke-width: 20;fill-opacity:0;stroke-opacity:0;}"),
        addKeyFrames(c + "-bubbleUp", e));
    for (var v = '<g id="' + b + '">', w = 0; w < g; w++)
      (k = Math.floor(Math.random() * q + r)),
        (k < 2030 || k > 2120) &&
          ((l = h + Math.floor(Math.random() * (i + 1))),
          (n = Math.floor(5 * Math.random())),
          (o = 1 + 2 * Math.random()),
          (v +=
            '<circle class="' +
            c +
            '" cx=' +
            k +
            " cy=" +
            parseInt(p + s - 30) +
            " r=" +
            l +
            ' style="fill-opacity:0;stroke-opacity:0;animation-duration:' +
            o +
            "s;animation-delay:" +
            n +
            's;"/>'));
    (v += "</g>"), (document.getElementById("svg-bubblesBox").innerHTML += v);
  }
}
function svgRemove(a) {
  var b = document.getElementById(a);
  if (b) {
    var c = b.parentNode;
    c.removeChild(b);
  }
}
function setSvgAkumulace(a) {
  setSvgLevel("svg-akumulace", a),
    setSvgLevelText("svg-text-akum", a),
    setSvgBubbleLevel("svg-akumulace", a);
}
function setSvgAktivace(a) {
  setSvgLevel("svg-aktivace", a),
    setSvgLevel("svg-denitri", a),
    setSvgLevel("svg-decanter", a),
    setSvgLevelText("svg-text-aktiv", a),
    setSvgBubbleLevel("svg-aktivace", a);
  var b = parseInt((1130 * a) / svgMaxLevel);
  b < 310 && (b = 310), (b = 1130 - b);
  var c = "translate(0, " + b + ")";
  document.querySelector("#svg-group-decanter").setAttribute("transform", c);
}
function setSvgLevelMax(a, b) {
  svgMaxLevel = b > svgMaxLevel ? b : svgMaxLevel;
  var c = document.getElementById(a),
    d = parseInt(1130 - (1130 * b) / svgMaxLevel);
  c.getAttribute("y") != 319 + d &&
    (c.setAttribute("y", 319 + d),
    (c = document.getElementById(a + "-text")),
    c.setAttribute("y", 319 + d));
}
function setSvgLevel(a, b) {
  var c = document.getElementById(a),
    d = parseInt((1130 * b) / svgMaxLevel);
  c.setAttribute("height", d), c.setAttribute("y", 1450 - d);
}
function setSvgLevelText(a, b) {
  var c = document.getElementById(a),
    d = parseInt((1130 * b) / svgMaxLevel);
  c.setAttribute("y", 1440 - d), (c.textContent = b + "cm");
}
function setSvgBubbleLevel(a, b) {
  if (findStyleRule(a + "-cssBubbles")) {
    var c = parseInt((1130 * b) / svgMaxLevel) - 30,
      d = findKeyframesRule(a + "-cssBubbles-bubbleUp");
    d.deleteRule("95%"),
      d.deleteRule("99%"),
      d.deleteRule("100%"),
      d.appendRule(
        "95% {transform: translate(0px,-" + (c - 5) + "px);stroke-width: 10;}"
      ),
      d.appendRule(
        "99% {transform: translate(0px,-" +
          c +
          "px);stroke-width: 0;fill-opacity:0.5;stroke-opacity:0.3;}"
      ),
      d.appendRule(
        "100% {transform: translate(0px,-" +
          c +
          "px);stroke-width: 20;fill-opacity:0;stroke-opacity:0;}"
      );
  }
}
function start() {
  (document.getElementById("id-box-chyba").style.top = "auto"),
    getCurrentLangSettings(),
    (process = 1),
    getData();
}
var process = 0,
  tick1minute = 0,
  listData = 0,
  modeWWTP = 1,
  CurrentLang = "en",
  suggCapMultiplier = 0.001,
  svgMaxLevel = 0,
  modeDM = !1,
  modeSand = !1;
(window.onresize = function () {
  var a = document.getElementById("id-box-chyba"),
    b = document.getElementById("id-main").clientWidth;
  a.style.width = b + "px";
}),
  (window.onscroll = function () {
    var a = document.getElementById("id-box-chyba"),
      b = a.clientHeight,
      c = document.getElementById("id-nav").clientHeight;
    if (window.pageYOffset > c) {
      (a.style.position = "fixed"),
        (b += 16),
        (document.getElementById("id-main").style.paddingTop = b + "px"),
        (a.style.top = "0px");
      var d = document.getElementById("id-main").clientWidth;
      a.style.width = d + "px";
    } else
      (a.style.position = "relative"),
        (a.style.top = "auto"),
        (document.getElementById("id-main").style.paddingTop = "1em");
  });
