/*
 * art.js - draws lightweight "screenshot" illustrations as inline SVG.
 * No external images / no internet required, so the guide always has pictures.
 * To use real screenshots instead, drop PNGs in /assets and set `img` on a step.
 */
(function () {
  "use strict";

  function esc(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  var counter = 0;
  function uid(prefix) {
    counter += 1;
    return prefix + counter;
  }

  var W = 640;
  var H = 360;
  var FONT = "system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif";
  var MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

  function txt(x, y, value, o) {
    o = o || {};
    var size = o.size || 13;
    var fill = o.fill || "#0f172a";
    var weight = o.weight || 400;
    var anchor = o.anchor || "start";
    var family = o.family || FONT;
    return (
      '<text x="' + x + '" y="' + y + '" font-family="' + family +
      '" font-size="' + size + '" font-weight="' + weight +
      '" fill="' + fill + '" text-anchor="' + anchor + '">' +
      esc(value) + "</text>"
    );
  }

  function box(x, y, w, h, o) {
    o = o || {};
    var s =
      '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h +
      '" rx="' + (o.rx || 0) + '" fill="' + (o.fill || "none") + '"';
    if (o.stroke) s += ' stroke="' + o.stroke + '" stroke-width="' + (o.sw || 1.5) + '"';
    if (o.dash) s += ' stroke-dasharray="' + o.dash + '"';
    return s + "/>";
  }

  function cursor(x, y, scale) {
    var s = scale || 1;
    return (
      '<g transform="translate(' + x + "," + y + ") scale(" + s + ')">' +
      '<path d="M0 0 L0 24 L6 18 L10.5 27 L14.5 25 L10 16.5 L18 16.5 Z" ' +
      'fill="#0f172a" stroke="#ffffff" stroke-width="1.6" stroke-linejoin="round"/>' +
      "</g>"
    );
  }

  function frame(accent, content, alt) {
    var bg = uid("bg");
    var shadow = uid("sh");
    var dots = "";
    var colors = ["#fca5a5", "#fcd34d", "#86efac"];
    for (var i = 0; i < 3; i += 1) {
      dots += '<circle cx="' + (52 + i * 16) + '" cy="48" r="5" fill="' + colors[i] + '"/>';
    }
    return (
      '<svg class="art-svg" viewBox="0 0 ' + W + " " + H + '" xmlns="http://www.w3.org/2000/svg" ' +
      'role="img" aria-label="' + esc(alt || "Illustration of the step") + '">' +
      "<defs>" +
      '<linearGradient id="' + bg + '" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0%" stop-color="' + accent + '" stop-opacity="0.16"/>' +
      '<stop offset="55%" stop-color="#ffffff" stop-opacity="0"/>' +
      '<stop offset="100%" stop-color="' + accent + '" stop-opacity="0.12"/>' +
      "</linearGradient>" +
      '<filter id="' + shadow + '" x="-25%" y="-25%" width="150%" height="150%">' +
      '<feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#0f172a" flood-opacity="0.16"/>' +
      "</filter></defs>" +
      '<rect width="' + W + '" height="' + H + '" fill="url(#' + bg + ')"/>' +
      '<g filter="url(#' + shadow + ')">' +
      '<rect x="24" y="20" width="592" height="320" rx="16" fill="#ffffff" stroke="#e2e8f0"/>' +
      '<path d="M40 20 H600 a16 16 0 0 1 16 16 V58 H24 V36 a16 16 0 0 1 16 -16 Z" fill="#f8fafc"/>' +
      dots +
      '<g transform="translate(44,70)">' + content + "</g>" +
      "</g></svg>"
    );
  }

  function download(spec, accent) {
    var url = spec.url || "example.com/download";
    var button = spec.button || "Download";
    return (
      box(0, 0, 552, 40, { rx: 10, fill: "#f1f5f9" }) +
      '<g stroke="#94a3b8" stroke-width="1.5" fill="none">' +
      '<rect x="16" y="18" width="11" height="9" rx="2"/>' +
      '<path d="M18.5 18 v-3 a3 3 0 0 1 6 0 v3"/>' +
      "</g>" +
      txt(38, 26, url, { size: 12.5, fill: "#475569" }) +
      txt(0, 74, spec.heading || "Official download page", { size: 17, weight: 700 }) +
      box(0, 88, 330, 8, { rx: 4, fill: "#e2e8f0" }) +
      box(0, 104, 210, 8, { rx: 4, fill: "#e2e8f0" }) +
      box(0, 128, 552, 54, { rx: 12, fill: accent }) +
      txt(276, 162, button, { size: 17, weight: 700, fill: "#ffffff", anchor: "middle" }) +
      cursor(452, 172, 1.1) +
      (spec.sub ? txt(0, 212, spec.sub, { size: 12.5, fill: "#64748b" }) : "")
    );
  }

  function files(spec, accent) {
    var file = spec.file || "installer.exe";
    var meta = spec.meta || "Application";
    return (
      txt(0, 18, "This PC  ›  Downloads", { size: 12, fill: "#94a3b8" }) +
      box(0, 34, 552, 104, { rx: 12, fill: "#f8fafc", stroke: accent, sw: 2 }) +
      box(20, 58, 56, 56, { rx: 12, fill: accent, sw: 0 }) +
      '<g fill="#ffffff" opacity="0.95">' +
      '<rect x="36" y="70" width="24" height="32" rx="3"/>' +
      '<rect x="40" y="78" width="16" height="3" rx="1.5" fill="' + accent + '"/>' +
      '<rect x="40" y="85" width="12" height="3" rx="1.5" fill="' + accent + '"/>' +
      "</g>" +
      txt(96, 74, file, { size: 15.5, weight: 700 }) +
      txt(96, 96, meta, { size: 12.5, fill: "#64748b" }) +
      box(396, 60, 140, 34, { rx: 17, fill: "#ffffff", stroke: accent }) +
      txt(466, 82, "Double-click", { size: 12.5, weight: 600, fill: accent, anchor: "middle" }) +
      cursor(330, 120, 1.05) +
      (spec.hint ? txt(0, 172, spec.hint, { size: 12.5, fill: "#64748b" }) : "")
    );
  }

  function install(spec, accent) {
    return (
      txt(0, 24, spec.title || "Setup", { size: 18, weight: 700 }) +
      box(0, 42, 552, 10, { rx: 5, fill: "#e2e8f0" }) +
      box(0, 42, 400, 10, { rx: 5, fill: accent }) +
      box(0, 74, 20, 20, { rx: 4, fill: accent }) +
      '<path d="M5 84 l4 4 l7 -8" fill="none" stroke="#ffffff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>' +
      txt(32, 90, spec.check || "I accept the terms in the License Agreement", { size: 13, fill: "#334155" }) +
      box(0, 108, 552, 1, { fill: "#f1f5f9" }) +
      box(0, 130, 20, 20, { rx: 4, fill: "#ffffff", stroke: "#cbd5e1" }) +
      txt(32, 146, spec.option || "Install for anyone using this computer", { size: 13, fill: "#64748b" }) +
      box(336, 186, 100, 44, { rx: 10, fill: "#f1f5f9" }) +
      txt(386, 213, "Cancel", { size: 13, weight: 600, fill: "#475569", anchor: "middle" }) +
      box(448, 186, 104, 44, { rx: 10, fill: accent }) +
      txt(500, 213, spec.button || "Install", { size: 13.5, weight: 700, fill: "#ffffff", anchor: "middle" }) +
      cursor(486, 226, 1) +
      (spec.sub ? txt(0, 214, spec.sub, { size: 12.5, fill: "#64748b" }) : "")
    );
  }

  function store(spec, accent) {
    var name = spec.app || "AnyDesk";
    return (
      box(0, 0, 84, 84, { rx: 20, fill: accent }) +
      txt(42, 52, spec.initials || "A", { size: 30, weight: 800, fill: "#ffffff", anchor: "middle" }) +
      txt(104, 30, name, { size: 21, weight: 700 }) +
      txt(104, 54, spec.dev || "Android app · ChromeOS compatible", { size: 12.5, fill: "#64748b" }) +
      txt(104, 80, "★★★★★", { size: 13, fill: accent }) +
      txt(168, 80, spec.rating || "4.6", { size: 12.5, fill: "#94a3b8" }) +
      box(0, 112, 552, 52, { rx: 12, fill: accent }) +
      txt(276, 145, spec.button || "Install", { size: 16.5, weight: 700, fill: "#ffffff", anchor: "middle" }) +
      cursor(444, 156, 1.05) +
      (spec.sub ? txt(0, 196, spec.sub, { size: 12.5, fill: "#64748b" }) : "") +
      (spec.hint ? txt(0, 222, spec.hint, { size: 12, fill: "#94a3b8" }) : "")
    );
  }

  function permissions(spec, accent) {
    var rows = spec.rows || [
      { label: "Screen Recording", on: false },
      { label: "Accessibility", on: false }
    ];
    var out = spec.heading
      ? txt(0, 20, spec.heading, { size: 15, weight: 700 })
      : "";
    for (var i = 0; i < rows.length; i += 1) {
      var y = (spec.heading ? 36 : 0) + i * 62;
      var on = rows[i].on;
      out += box(0, y, 552, 52, { rx: 10, fill: "#f8fafc" });
      out += txt(18, y + 32, rows[i].label, { size: 14, weight: 600, fill: "#0f172a" });
      out += txt(18, y + 46, rows[i].hint || (on ? "Allowed" : "Turn this on"), {
        size: 11.5,
        fill: on ? "#16a34a" : "#94a3b8"
      });
      out += box(476, y + 12, 58, 28, { rx: 14, fill: on ? accent : "#cbd5e1" });
      out +=
        '<circle cx="' + (on ? 520 : 490) + '" cy="' + (y + 26) + '" r="11" fill="#ffffff"/>';
    }
    if (spec.footer) {
      out += txt(0, (spec.heading ? 36 : 0) + rows.length * 62 + 20, spec.footer, {
        size: 12,
        fill: "#64748b"
      });
    }
    return out;
  }

  function session(spec, accent) {
    var id = spec.id || "123 456 789";
    var out =
      box(0, 0, 240, 250, { rx: 12, fill: "#f8fafc", stroke: "#e2e8f0" }) +
      txt(18, 32, spec.label || "Your ID", { size: 12, weight: 600, fill: "#64748b" }) +
      txt(18, 82, id, { size: 27, weight: 700, family: MONO, fill: "#0f172a" }) +
      txt(18, 108, "Send this to your IT agent", { size: 12, fill: "#94a3b8" });
    if (spec.password) {
      out +=
        txt(18, 150, "Password", { size: 12, weight: 600, fill: "#64748b" }) +
        txt(18, 182, "•••• ••••", { size: 20, weight: 700, family: MONO, fill: "#0f172a" }) +
        txt(18, 206, "Temporary password", { size: 11.5, fill: "#94a3b8" });
    }
    out +=
      box(264, 26, 288, 176, { rx: 12, fill: "#ffffff", stroke: "#e2e8f0" }) +
      '<circle cx="300" cy="64" r="18" fill="' + accent + '" opacity="0.16"/>' +
      txt(300, 69, spec.initials || "IT", {
        size: 13,
        weight: 700,
        fill: accent,
        anchor: "middle"
      }) +
      txt(330, 60, spec.agent || "IT Support", { size: 14, weight: 700 }) +
      txt(330, 82, "wants to connect", { size: 12.5, fill: "#64748b" }) +
      box(286, 104, 244, 1, { fill: "#f1f5f9" }) +
      txt(286, 132, "Screen  ·  Keyboard  ·  Mouse", { size: 12, fill: "#94a3b8" }) +
      box(286, 150, 112, 40, { rx: 10, fill: accent }) +
      txt(342, 175, "Accept", { size: 13.5, weight: 700, fill: "#ffffff", anchor: "middle" }) +
      box(410, 150, 120, 40, { rx: 10, fill: "#f1f5f9" }) +
      txt(470, 175, "Deny", { size: 13.5, weight: 600, fill: "#475569", anchor: "middle" });
    return out;
  }

  function request(spec, accent) {
    var out =
      box(60, 10, 432, 224, { rx: 14, fill: "#ffffff", stroke: "#e2e8f0" }) +
      '<circle cx="104" cy="58" r="20" fill="' + accent + '" opacity="0.16"/>' +
      txt(104, 63, spec.initials || "IT", {
        size: 14,
        weight: 700,
        fill: accent,
        anchor: "middle"
      }) +
      txt(140, 54, spec.name || "IT Support", { size: 15.5, weight: 700 }) +
      txt(140, 76, spec.sub || "is requesting remote control", { size: 12.5, fill: "#64748b" }) +
      box(84, 100, 384, 1, { fill: "#f1f5f9" }) +
      txt(84, 128, "•  You will see everything the agent does", { size: 12.5, fill: "#475569" }) +
      txt(84, 150, "•  You can end the session at any time", { size: 12.5, fill: "#475569" }) +
      box(84, 172, 130, 44, { rx: 10, fill: accent }) +
      txt(149, 199, spec.accept || "Accept", {
        size: 14,
        weight: 700,
        fill: "#ffffff",
        anchor: "middle"
      }) +
      box(226, 172, 130, 44, { rx: 10, fill: "#f1f5f9" }) +
      txt(291, 199, spec.deny || "Deny", {
        size: 14,
        weight: 600,
        fill: "#475569",
        anchor: "middle"
      }) +
      cursor(300, 208, 1);
    return out;
  }

  function terminal(spec, accent) {
    var lines = spec.lines || ["sudo apt update", "sudo apt install ./app.deb"];
    var out = box(0, 0, 552, 250, { rx: 12, fill: "#0b1220" });
    for (var i = 0; i < lines.length; i += 1) {
      var y = 46 + i * 34;
      var last = i === lines.length - 1;
      out += txt(20, y, "$", {
        size: 14,
        weight: 700,
        family: MONO,
        fill: last ? accent : "#64748b"
      });
      out += txt(42, y, lines[i], {
        size: 13,
        family: MONO,
        fill: last ? "#f8fafc" : "#94a3b8"
      });
    }
    if (spec.comment) {
      out += txt(20, 46 + lines.length * 34 + 16, spec.comment, {
        size: 12,
        family: MONO,
        fill: "#64748b"
      });
    }
    return out;
  }

  function drag(spec, accent) {
    return (
      box(0, 26, 128, 128, { rx: 16, fill: "#ffffff", stroke: "#cbd5e1", sw: 1.5 }) +
      '<path d="M28 44 h56 a6 6 0 0 1 6 6 v62 a6 6 0 0 1 -6 6 H28 a6 6 0 0 1 -6 -6 V50 a6 6 0 0 1 6 -6 Z" fill="#f8fafc"/>' +
      box(40, 70, 40, 30, { rx: 4, fill: "#ffffff", stroke: accent, sw: 1.5 }) +
      txt(64, 120, spec.file || "App.dmg", {
        size: 11,
        fill: "#64748b",
        anchor: "middle"
      }) +
      '<path d="M160 90 H250" stroke="' + accent + '" stroke-width="3" stroke-linecap="round" stroke-dasharray="8 8"/>' +
      '<path d="M240 78 L258 90 L240 102 Z" fill="' + accent + '"/>' +
      txt(205, 72, "drag", { size: 12, weight: 600, fill: accent, anchor: "middle" }) +
      '<path d="M300 56 h96 l14 16 h96 a12 12 0 0 1 12 12 v54 a12 12 0 0 1 -12 12 H300 a12 12 0 0 1 -12 -12 V68 a12 12 0 0 1 12 -12 Z" ' +
      'fill="' + accent + '" fill-opacity="0.12" stroke="' + accent + '" stroke-width="2"/>' +
      txt(402, 118, spec.target || "Applications", {
        size: 14,
        weight: 600,
        fill: accent,
        anchor: "middle"
      }) +
      cursor(300, 132, 1) +
      (spec.hint
        ? txt(0, 200, spec.hint, { size: 12.5, fill: "#64748b" })
        : "")
    );
  }

  function checklist(spec, accent) {
    var items = spec.items || [
      "Session finished",
      "Remote tool closed",
      "No saved password left behind"
    ];
    var out = txt(0, 26, spec.heading || "Before you finish", { size: 16, weight: 700 });
    for (var i = 0; i < items.length; i += 1) {
      var y = 52 + i * 56;
      out += box(0, y, 552, 46, { rx: 10, fill: "#f8fafc" });
      out += '<circle cx="28" cy="' + (y + 23) + '" r="12" fill="' + accent + '" opacity="0.15"/>';
      out +=
        '<path d="M22 ' + (y + 23) + ' l5 5 l9 -10" fill="none" stroke="' + accent +
        '" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>';
      out += txt(52, y + 29, items[i], { size: 13.5, fill: "#334155" });
    }
    return out;
  }

  function render(spec, accent) {
    var color = accent || "#2563eb";
    var content = "";
    switch (spec.kind) {
      case "download":
        content = download(spec, color);
        break;
      case "files":
        content = files(spec, color);
        break;
      case "install":
        content = install(spec, color);
        break;
      case "store":
        content = store(spec, color);
        break;
      case "permissions":
        content = permissions(spec, color);
        break;
      case "session":
        content = session(spec, color);
        break;
      case "request":
        content = request(spec, color);
        break;
      case "terminal":
        content = terminal(spec, color);
        break;
      case "drag":
        content = drag(spec, color);
        break;
      case "checklist":
        content = checklist(spec, color);
        break;
      default:
        content = checklist(spec, color);
    }
    return frame(color, content, spec.alt);
  }

  window.RemoteGuideArt = { render: render };
})();